from cure.server import app
from cure.types.user import User
from flask import jsonify, request
import cure.constants as constants
import cure.auth.authentication as auth
import cure.types.exception as errors
from cure.util.database import database

def get_route(route):
    return constants.ROUTES.get_route(route)

@app.route(get_route(constants.ROUTES.ROUTE_GET_USER_SELF))
def get_users_me():
    user_session = auth.get_session_from_header(flask.request.headers)

    if session is None:
        raise errors.InvalidAuthError
    
    database_user = database.find_one(constants.DATABASE_USERS_NAME, {
        "user_id": str(user_session.user_id)
    })

    user = User().from_dict(database_user)

    return jsonify(user.as_dict())