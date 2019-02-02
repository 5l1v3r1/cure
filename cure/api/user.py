from cure.server import app
from cure.types.user import User
from flask import jsonify, request
import cure.constants as constants
import cure.auth.authentication as auth
import cure.types.exception as errors
from cure.util.database import database
import flask
from cure.api.base import require_authentication
from bson import ObjectId

def get_route(route):
    return constants.ROUTES.get_route(route)

@app.route(get_route(constants.ROUTES.ROUTE_GET_USER_SELF), methods=["GET"])
@require_authentication
def get_users_me(user):

    database_user = database.find_one(constants.DATABASE_USERS_NAME, {
        "_id": ObjectId(user)
    })

    if database_user is None:
        raise errors.InvalidAuthError

    user = User().from_dict(database_user)

    return jsonify(user.as_public_dict())