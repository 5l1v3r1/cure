from cure.server import app
from flask import jsonify, request
from cure.util.input import parse_json
from cure.api.base import require_authentication
import cure.constants as constants
import cure.auth.authentication as auth
import cure.types.exception as errors
import flask
import json


def get_route(route):
    return constants.ROUTES.get_route(route)


@app.route(get_route(constants.ROUTES.ROUTE_AUTH_REGISTER), methods=["POST"])
def register():
    parsed_data = parse_json(request.get_data())

    if parsed_data.get("password") is None or parsed_data.get("username") is None:
        raise errors.DumbUserError()

    user = auth.register(parsed_data.get("username", "username"), parsed_data.get("password", "password"))

    user_dict = user.as_dict()
    user_dict.pop("password_hash")
    return jsonify({
        "user": user_dict,
        "success": True
    })


@app.route(get_route(constants.ROUTES.ROUTE_AUTH_LOGIN), methods=["POST"])
def login():
    parsed_data = parse_json(request.get_data())

    username = parsed_data.get("username")
    password = parsed_data.get("password")

    if username is None or password is None:
        raise errors.InvalidPasswordError

    new_session = auth.login(username, password)
    return jsonify({
        "session": {
            "user_id": str(new_session.user_id),
            "mfa_authenticated": new_session.mfa_authenticated,
            "logged_in": new_session.logged_in,
            "expires": new_session.expires,
            "session_id": new_session.session_id
        },
        "success": True
    })

@app.route(get_route(constants.ROUTES.ROUTE_AUTH_LOGOUT), methods=["POST"])
@require_authentication
def logout():
    user_session = auth.get_session_from_header(flask.request.headers)
    if user_session is None:
        raise errors.InvalidAuthError()

    success = auth.logout(user_session.session_id)
    return jsonify({
        "success": success
    })
