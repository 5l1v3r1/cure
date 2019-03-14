from cure.util.database import database
from cure.types.user import User
import cure.constants as constants

def get_user_by_id(user_id):
    return User.from_dict(database.find_one(constants.DATABASE_USERS_NAME, {
        "_id": user_id
    }))