"""
This is a very strange permissions system but it's effective.

Use permission & permission_code == permission_code to see if a user has a perm
Use permission | permission_code to add permission_code to permission
Use permission & ~permission_code to remove a permission_code

note that administrator permission should override all other permissions except MANAGE_ADMINISTRATORS

(MANAGE_ADMINISTRATORS on global is 0x00000080,
MANAGE_ADMINISTRATORS on tracker is 0x00000002)

If you're confused about something and wondering what I'm thinking, I probably don't know what I was either.
"""


class GlobalPermissions:
    """
    Permissions system.
    """

    VIEW_TRACKERS = 0x00000001
    CREATE_TRACKER = 0x00000002
    DELETE_TRACKER = 0x00000004
    MANAGE_USERS = 0x00000008
    ADMINISTRATOR = 0x00000010
    MANAGE_GLOBAL_SETTINGS = 0x00000020
    VERIFIED = 0x00000040
    MANAGE_ADMINISTRATORS = 0x00000080
    MFA_REQUIRED = 0x00000100
    CHANGE_USERNAME = 0x00000200
    BAN_USER = 0x00000400
    BAN_IP = 0x00000800
    MANAGE_SELF_PROFILE = 0x00001000
    VIEW_BANS = 0x00002000
    REMOVE_BAN_USER = 0x00004000
    REMOVE_BAN_IP = 0x00008000
    # The ACCESS_PRIVATE_BOARD permission allows users to browse normally.
    # If granted on a non-private board, it won't do anything (you shouldn't
    # be able to grant in client)
    ACCESS_PRIVATE_BOARD = 0x00010000
    REQUEST_PRIVATE_BOARD_ACCESS = 0x00020000

    def has_administrator(self, flags):
        return flags & self.ADMINISTRATOR == self.ADMINISTRATOR

    @staticmethod
    def add_permission(flags, permission):
        return flags | permission

    def has_permission(self, flags, permission):
        if self.has_administrator(flags) and permission != self.MANAGE_ADMINISTRATORS:
            return True

        return flags & permission == permission

    @staticmethod
    def remove_permission(flags, permission):
        return flags & ~permission

    def get_permission(self, name=""):
        if name.startswith("_"):
            return None

        if hasattr(self, name):
            return getattr(self, name)


class TrackerPermissions:
    """
    Tracker permissions
    """

    ADMINISTRATOR = 0x00000001
    MANAGE_ADMINISTRATORS = 0x00000002
    VIEW_REPORTS = 0x00000004
    CREATE_REPORT = 0x00000008
    REVOKE_REPORT = 0x00000010
    DELETE_REPORTS = 0x00000020
    # The APPROVE_DENY_REPORT permission doesn't do anything if bugs don't require approval.
    APPROVE_DENY_REPORT = 0x00000040
    FORCE_APPROVE_REPORT = 0x00000080
    FORCE_DENY_REPORT = 0x00000100
    ADD_LABEL_TO_SELF_REPORT = 0x00000200
    ADD_LABEL_TO_REPORTS = 0x00000400

    def has_administrator(self, flags):
        return flags & self.ADMINISTRATOR == self.ADMINISTRATOR

    @staticmethod
    def add_permission(flags, permission):
        return flags | permission

    def has_permission(self, flags, permission):
        if self.has_administrator(flags) and permission != self.MANAGE_ADMINISTRATORS:
            return True

        return flags & permission == permission

    @staticmethod
    def remove_permission(flags, permission):
        return flags & ~permission

    def get_permission(self, name=""):
        if name.startswith("_"):
            return None

        if hasattr(self, name):
            return getattr(self, name)


