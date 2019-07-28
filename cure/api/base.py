from cure.server import app
from cure.types.exception import UserError, InvalidAuthError, InvalidJsonError, InvalidPermissionError
from cure.types.user import User
from cure.types.permissions import GlobalPermissions
from functools import wraps
from flask.app import HTTPException
from flask import g, request
from cure.util.database import database
from cure.auth.session import session_manager
import cure.constants as constants
import cure.auth.token as auth_token
import cure.helper.user as user_helper

import flask
import json

@app.errorhandler(UserError)
def handle_user_error(user_error):
    response = flask.Response(json.dumps({
        "error": {
            "identifier": user_error.identifier,
            "code": user_error.code,
            "friendly_name": user_error.friendly_name
        }
    }))
    # respond to it.
    response.status_code = 400
    # determine if it's a special overriden error.
    if type(user_error) == InvalidAuthError:
        # set to 401 unauthorized
        response.status_code = 401
    response.headers["Content-Type"] = "application/json"
    return response

@app.errorhandler(HTTPException)
def error_handler(http_exception):
    response = flask.Response(json.dumps({
        "error": {
            "identifier": "http_error",
            "code": http_exception.code
        }
    }))
    response.status_code = http_exception.code
    response.headers["Content-Type"] = "application/json"
    return response

@app.before_request
def before_request():
    if 'Authorization' not in request.headers:
        g.user = None
        return
    # We raise Invalid Auth Errors when Authorization is invalid
    auth_header = flask.request.headers["Authorization"]
    auth_split = auth_header.split(" ")
    user = None
    if len(auth_split) < 2:
        raise InvalidAuthError
    if auth_split[0] == 'session':
        user = session_manager.get_session(auth_split[1])
        if user is None or \
            user.has_expired() or \
            not user.mfa_authenticated or \
            not user.logged_in:
            raise InvalidAuthError
        user = user_helper.get_user_by_id(user.user_id)
    elif auth_split[0] == 'token':
        user = auth_token.token_manager.get_user_for_token(auth_split[1])
        if user is None:
            raise InvalidAuthError
        user = user_helper.get_user_by_id(user)
    else:
        raise InvalidAuthError
    g.user = user

def get_route(route_constant):
    return constants.ROUTES.get_route(route_constant)

def require_authentication(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        # Ensure they had an authorization token.
        if g.user is None:
            raise InvalidAuthError
        return f(g.user.mongodb_id, *args, **kwargs)
        
    return decorator

def require_json(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        content_type = flask.request.headers["Content-Type"]
        if content_type is None or content_type != "application/json":
            raise InvalidJsonError
        try:
            data = json.loads(flask.request.get_data())
        except json.JSONDecodeError:
            raise InvalidJsonError
        return f(data, *args, **kwargs)
    
    return decorator

def require_global_permissions(permission):
    # TODO test and see if this works
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if g.user is None:
                raise InvalidPermissionError
            if g.user.is_global_admin:
                return f(*args, **kwargs)
            if not GlobalPermissions().has_permission(g.user.get_permissions(), permission):
                raise InvalidPermissionError
            return f(*args, **kwargs)
        return wrapper
    return decorator
