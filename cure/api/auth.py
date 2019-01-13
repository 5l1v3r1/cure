from cure.cure import app
import cure.constants as constants
import cure.util.decorators as decorators
import cure.auth.authentication as auth
import cure.types.exception as errors
import flask
import json


def get_route(route):
    return constants.ROUTES.get_route(route)


@app.route(get_route(constants.ROUTES.ROUTE_AUTH_REGISTER), methods=["POST"])
@decorators.parse_json
@decorators.catch_user_error
def register(data):
    parsed_data = None

    try:
        parsed_data = json.loads(data)
    except json.JSONDecodeError:
        # This is caught by the decorator, which will return a 400
        raise errors.InvalidJsonError()

    if parsed_data is None:
        # they have done the impossible
        raise errors.InvalidJsonError()

    if parsed_data.get("password") is None or parsed_data.get("username") is None:
        raise errors.DumbUserError()

    user = auth.register(parsed_data.get("username", "username"), parsed_data.get("password", "password"))

    user_dict = user.as_dict()
    user_dict.pop("password_hash")
    return {
        "user": user_dict,
        "success": True
    }


@app.route(get_route(constants.ROUTES.ROUTE_AUTH_LOGIN), methods=["POST"])
@decorators.parse_json
@decorators.catch_user_error
def login(data):
    parsed_data = None

    try:
        parsed_data = json.loads(data)
    except json.JSONDecodeError:
        raise errors.InvalidJsonError()

    username = parsed_data.get("username")
    password = parsed_data.get("password")

    if username is None or password is None:
        raise errors.InvalidPasswordError

    new_session = auth.login(username, password)
    return {
        "session": {
            "user_id": new_session.user_id,
            "mfa_authenticated": new_session.mfa_authenticated,
            "logged_in": new_session.logged_in,
            "expires": new_session.expires
        },
        "success": True
    }
