from bson.objectid import ObjectId
from cure.types.user import User
from cure.auth.session import session_manager as session
from cure.auth.token import token_manager as token
from cure.util.database import database
from passlib.hash import sha256_crypt
import cure.constants as const
import cure.types.exception as errors
import pyotp
import re


def register(username, password):
    """
    Register a user
    :param username: Requested username.
    :param password: Password
    :return: A User object on success. Otherwise, it will raise an exception.
    """

    if not re.match(const.USERNAME_REGEX, username):
        raise errors.InvalidUsernameError

    user = User()

    if database.find(const.DATABASE_USERS_NAME, {"username": username}).count() != 0 or len(username) <= 1:
        raise errors.UsernameTakenError()
    user.username = username
    user.password_hash = sha256_crypt.hash(password)

    # add user to database
    database_object = database.cure_database.get_collection(const.DATABASE_USERS_NAME).insert_one(user.as_dict())
    user.mongodb_id = database_object.inserted_id
    return user


def login(username, password):
    """
    Login a user.
    :param username: Username to log user in with
    :param password: Password to verify
    :return: The newly created session for the user.
    :raises: cure.types.exception.UsernameNotFoundError, cure.types.exception.InvalidPasswordError
    """
    username = username.lower()
    result = database.find_one(const.DATABASE_USERS_NAME, {
        "username": username
    })

    if result is None:
        raise errors.UsernameNotFoundError()

    password_verified = sha256_crypt.verify(password, result.get("password_hash"))

    if not password_verified:
        raise errors.InvalidPasswordError()

    new_session = session.generate_session()
    user = User.from_dict(result)

    if user.has_mfa:
        new_session.mfa_authenticated = False
        new_session.logged_in = False
    else:
        new_session.logged_in = True

    new_session.user_id = user.mongodb_id

    return new_session

def login_via_token(user_token):
    """
    Generates a session via a token
    :param user_token: The token from the user.
    :return: The newly created session
    """
    
    # TODO In the future, we need to require users to MFA authenticate when redeeming token.
    
    user = token.get_user_for_token(user_token)
    print(user)
    if user is None:
        raise errors.InvalidAuthError
    
    user = database.find_one(const.DATABASE_USERS_NAME, {
        "_id": ObjectId(user) # ObjectId
    })

    new_session = session.generate_session()
    user = User.from_dict(user)
    
    new_session.mfa_authenticated = True
    new_session.logged_in = True

    new_session.user_id = user.mongodb_id

    return new_session


def mfa_authenticate(user_session, code):
    """
    Used for any session where the user_id isn't null.
    :param user_session: the user's session.
    :param code: the mfa code as a str that they used
    :return: bool of whether user authenticated successfully
    """
    if user_session.user_id is None:
        raise errors.InvalidAuthError()

    if user_session.mfa_authenticated:
        raise errors.AlreadyAuthenticatedError()

    db_user = database.find_one(const.DATABASE_USERS_NAME, {
        "_id": user_session.mongodb_id
    })

    if db_user is None:
        print("[Authentication] [ERROR] User has somehow managed to manipulate a server-side session. If you see "
              "this message, a bug could have been caused (user deleted account but session wasn't deleted). Report"
              " this as a bug unless your database has been modified while this program is running.")
        raise errors.UsernameNotFoundError()

    user = User.from_dict(db_user)
    totp = pyotp.TOTP(user.mfa_key)

    if not totp.verify(code):
        raise errors.InvalidMfaCodeError()

    user_session.mfa_authenticated = True
    return user_session.mfa_authenticated


def mfa_create_key(user):
    """
    Create an MFA key for a user (note: users still have to activate it before it is active
    :param user: User object to create the key for
    :return: updated user object.
    """
    if user.has_mfa:
        raise errors.AlreadySetupMfaError()

    user_key = pyotp.random_base32()
    user.mfa_key = user_key

    # Update
    database.cure_database.get_collection(const.DATABASE_USERS_NAME).update_one({
        "_id": user.mongodb_id
    }, user.as_dict())

    return user


def mfa_activate(user, code):
    """
    Activates the mfa
    :param user: the User to update
    :param code: the code the user used
    :return: The updated user object
    """
    if user.mfa_key == "" or user.mfa_key is None:
        raise errors.BadMfaRequestError()

    if user.has_mfa:
        raise errors.AlreadySetupMfaError()

    totp = pyotp.TOTP(user.mfa_key)

    if not totp.verify(code):
        raise errors.InvalidMfaCodeError()

    user.has_mfa = True

    database.cure_database.get_collection(const.DATABASE_USERS_NAME).update_one({
        "_id": user.mongodb_id
    }, user.from_dict())

    return user

def logout(user_session):
    """
    Logout a user by their session id
    :param user_session: The id of the session to logout
    :return: bool if user logged out successfully
    """
    session_obj = session.get_session(user_session)

    if session_obj is None:
        return False

    session_obj.terminate()
    return True

def get_session_from_header(headers):
    """
    Retrieves a session from the header value
    :param headers: a dict of all headers sent with request
    :return: the session used. if no session is used, returns None
    """

    if "Authorization" not in headers.keys():
        return None
    
    auth_header_split = headers["Authorization"].split(' ')

    if len(auth_header_split) != 2:
        return None

    auth_type = auth_header_split[0]
    auth_token = auth_header_split[1]

    if auth_type != 'session':
        return None
    
    return session.get_session(auth_token)

def get_token_for_user(user_id):
    """
    Get a token by a user's ID.
    :param user_id: the ID of the user.
    :return: A token for the user. If a token doesn't exist, it will create one.
    """

    if user_id is None:
        return None

    return token.get_token_for_user(str(user_id))

def delete_token_for_user(user_id):
    """
    Deletes a token by a user's ID.
    :param user_id: the ID of the user
    """

    return token.delete_tokens_for_user(user_id)

def get_user_for_token(user_token):
    """
    Returns the user that owns a token or None if the token is invalid.
    """

    return token.get_user_for_token(str(user_token))