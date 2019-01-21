from cure.server import app
from cure.types.exception import UserError, InvalidAuthError
from functools import wraps
import cure.util.database as database
from cure.auth.session import session_manager
import cure.auth.token as auth_token

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

def require_authentication(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        # Ensure they had an authorization token.
        if flask.request.headers["Authorization"] is None:
            raise InvalidAuthError
        auth_header = flask.request.headers["Authorization"]
        auth_split = auth_header.split(" ")
        if len(auth_split) != 2:
            raise InvalidAuthError
        if auth_split[0] == 'token':
            user = auth_token.token_manager.get_user_for_token(auth_split[1])
            if user is None:
                raise InvalidAuthError
        elif auth_split[0] == 'session':
            user = session_manager.get_session(auth_split[1])
            if user is None or user.has_expired():
                raise InvalidAuthError
        else:
            raise InvalidAuthError
        
        return f(*args, **kwargs)        
        
    return decorator