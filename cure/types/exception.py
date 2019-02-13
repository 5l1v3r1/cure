
class UserError(Exception):
    """
    Special type of exception for when a user has provided invalid input.

    You can catch all user errors like this:
    ```python
    try:
        # code
    catch UserError as ue:
        return json.dumps(ue.as_dict())
    ```
    """

    friendly_name = "An unknown user error has occurred."
    identifier = "unknown_error"
    code = 0

    def as_dict(self):
        return {
            "friendly_name": self.friendly_name,
            "identifier": self.identifier,
            "code": self.code
        }


class UsernameTakenError(UserError):
    """
    Raised when a user attempts to register with an already taken username
    """
    friendly_name = "Username already taken"
    identifier = "username_taken_error"
    code = 1

    def __init__(self, username):
        self.username = username

    def get_username(self):
        return self.username


class InvalidPasswordError(UserError):
    """
    Raised when a user attempts to login with the incorrect password
    """
    friendly_name = "Incorrect password. Please try again."
    identifier = "invalid_password_error"
    code = 2


class UsernameNotFoundError(UserError):
    """
    Raised when a user-provided username can't be found.
    """
    friendly_name = "Couldn't find user."
    identifier = "username_not_found_error"
    code = 3


class InvalidAuthError(UserError):
    """
    Raised when a user should be logged in to perform that action, but isn't.
    """
    friendly_name = "This action requires that you are logged in."
    identifier = "invalid_auth_error"
    code = 4


class InvalidMfaCodeError(UserError):
    """
    Raised when a user provides an invalid time-based code.
    """
    friendly_name = "Invalid 2FA code. Please try again."
    identifier = "invalid_mfa_error"
    code = 5


class AlreadyAuthenticatedError(UserError):
    """
    Raised when a user has already authenticated with MFA
    """
    friendly_name = "You've already entered your 2FA code correctly. No need to do it again."
    identifier = "already_authenticated_error"
    code = 6


class AlreadySetupMfaError(UserError):
    """
    Raised when a user already setup MFA
    """
    friendly_name = "An MFA code has been setup already."
    identifier = "already_setup_mfa_error"
    code = 7


class BadMfaRequestError(UserError):
    """
    Raised when a bad mfa activation request has been sent.
    """
    friendly_name = "A bad MFA activation request was sent. Please restart the MFA process."
    identifier = "bad_mfa_activation_error"
    code = 8


class InvalidJsonError(UserError):
    """
    Raised when the json sent can't be decoded.
    """
    friendly_name = "An error occurred while parsing JSON."
    identifier = "bad_json_error"
    code = 9


# I use this when I don't feel like making an error for something stupid a user
# would hopefully never do, and would be caught by the frontend client.
class DumbUserError(UserError):
    """
    Raised when the user is clearly attempting to irritate me with something stupid. (e.g. not providing a password
    field when setting up an account)
    """
    friendly_name = "You did something wrong. Please fix it."
    identifier = "dumb_user_error"
    code = 10


class InvalidUsernameError(UserError):
    """
    Raised when a user has an invalid username
    """
    friendly_name = "Invalid username. Username length must be between 2 and 32. The only special symbols allowed in a username are dashes, underscores, and periods."
    identifier = "invalid_username_error"
    code = 11

class InvalidPermissionError(UserError):
    """
    Raised when a user doesn't have permission to do something.
    """
    friendly_name = "You don't have permission to do that."
    identifier = "invalid_permission_error"
    code = 12
