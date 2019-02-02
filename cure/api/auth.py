from cure.server import app
from flask import jsonify, request
from cure.util.input import parse_json
from cure.api.base import require_authentication, require_json
import cure.constants as constants
import cure.auth.authentication as auth
import cure.types.exception as errors
import flask
import json


def get_route(route):
    return constants.ROUTES.get_route(route)


@app.route(get_route(constants.ROUTES.ROUTE_AUTH_REGISTER), methods=["POST"])
@require_json
def register(parsed_data):
    """
    This endpoint (ROUTE_AUTH_REGISTER) is used to register a new user.
    """
    if parsed_data.get("password") is None or parsed_data.get("username") is None:
        raise errors.DumbUserError()

    user = auth.register(parsed_data.get("username", "username"), parsed_data.get("password", "password"))

    user_dict = user.as_public_dict()
    return jsonify({
        "user": user_dict
    })


@app.route(get_route(constants.ROUTES.ROUTE_AUTH_LOGIN), methods=["POST"])
@require_json
def login(parsed_data):
    """
    This endpoint (ROUTE_AUTH_LOGIN) is used to login with username/password.

    The mfa_authenticated value will be True if the user does not have MFA setup.
    Otherwise, it will be false, and the user will have to mfa authenticate to
    set it to True.
    """

    username = parsed_data.get("username")
    password = parsed_data.get("password")

    if username is None or password is None:
        raise errors.InvalidJsonError

    new_session = auth.login(username, password)
    if new_session is None:
        raise errors.InvalidPasswordError
    return jsonify({
        "session": {
            "user_id": str(new_session.user_id),
            "mfa_authenticated": new_session.mfa_authenticated,
            "logged_in": new_session.logged_in,
            "expires": int(new_session.expires),
            "session_id": new_session.session_id
        }
    })

@app.route(get_route(constants.ROUTES.ROUTE_AUTH_LOGOUT), methods=["POST"])
def logout():
    user_session = auth.get_session_from_header(flask.request.headers)
    if user_session is None:
        raise errors.InvalidAuthError()

    success = auth.logout(user_session.session_id)
    return jsonify({
        "success": success
    })

@app.route(get_route(constants.ROUTES.ROUTE_AUTH_TOKEN_GET), methods=["GET"])
@require_authentication
def get_token(user):
    token = auth.get_token_for_user(user)

    return jsonify({
        "token": str(token)
    })

@app.route(get_route(constants.ROUTES.ROUTE_AUTH_TOKEN_REFRESH), methods=["POST"])
@require_authentication
def refresh_token(user):
    auth.delete_token_for_user(user)

    return jsonify({
        "success": True
    })

@app.route(get_route(constants.ROUTES.ROUTE_AUTH_TOKEN_LOGIN), methods=["POST"])
@require_json
def login_via_token(parsed_data):

    new_session = auth.login_via_token(parsed_data.get("token"))
    return jsonify({
        "session": {
            "user_id": str(new_session.user_id),
            "mfa_authenticated": new_session.mfa_authenticated,
            "logged_in": new_session.logged_in,
            "expires": int(new_session.expires),
            "session_id": new_session.session_id
        }
    })