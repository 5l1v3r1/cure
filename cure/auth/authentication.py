from cure.types.user import User
from cure.auth.session import session
from cure.util.database import database
from passlib.hash import sha256_crypt
import cure.constants as const
import cure.types.exception as errors
import pyotp


def register(username, password):
    """
    Register a user
    :param username: Requested username.
    :param password: Password
    :return: A User object on success. Otherwise, it will raise an exception.
    """
    username = username.lower()

    if " " in username or "\n" in username or "\r\n" in username:
        raise errors.InvalidSymbolsInUsernameError()

    if len(username) <= 4:
        raise errors.InvalidUsernameLengthError(True)
    elif len(username) > 30:
        raise errors.InvalidUsernameLengthError(False)

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
    :raises: cure.types.exception.UsernameNotFoundError
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


def mfa_authenticate(user_session, code):
    """
    Used for any session where the user_id isn't null.
    :param user_session: the user's session.
    :param code: the mfa code as a str that they used
    :return:
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
