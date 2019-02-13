from bson import ObjectId
from cure.api.base import require_authentication, require_json
from cure.server import app
from cure.types.user import User, UserRole
from cure.util.database import database
from flask import jsonify, request

import cure.constants as constants
import cure.auth.authentication as auth
import cure.types.exception as errors
import flask

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

@app.route(get_route(constants.ROUTES.ROUTE_GET_GLOBAL_ROLES), methods=["GET"])
@require_authentication
def get_roles_global(user):

    roles = database.find(constants.DATABASE_ROLES_NAME, {})
    response = []
    for role_object in roles:
        response.append(UserRole().from_dict(role_object).as_dict())
    return jsonify(response)

@app.route(get_route(constants.ROUTES.ROUTE_ADD_GLOBAL_ROLE), methods=["POST"])
@require_authentication
@require_json
def add_global_role(data, user):

    # check to see if user is admin
    db_user = database.find_one(constants.DATABASE_USERS_NAME, {
        "_id": ObjectId(user)
    })

    user = User.from_dict(db_user)
    if not user.is_global_admin:
        raise errors.InvalidPermissionError

    name = data.get("name", "unnamed role")
    permissions = data.get("permissions", 0x00000000)
    position = date.get("position", 0)

    database.insert_one(constants.DATABASE_ROLES_NAME, {
        "role_name": name,
        "role_permissions": permissions,
        "role_position": position
    })

    return jsonify({})