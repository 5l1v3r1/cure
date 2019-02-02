import time
from cure.types.base import DatabaseObject


class User(DatabaseObject):

    mongodb_id = None
    username = "cure"
    password_hash = ""
    has_mfa = False
    mfa_key = ""
    joined = time.time()
    is_bot = False
    flags = 0
    global_roles = []

    def as_dict(self):
        return {
            "username": self.username,
            "password_hash": self.password_hash,
            "has_mfa": self.has_mfa,
            "mfa_key": self.mfa_key,
            "joined": int(self.joined),
            "is_bot": self.is_bot,
            "flags": self.flags,
            "global_roles": self.global_roles
        }
    
    def as_public_dict(self):
        public_dict = self.as_dict()

        public_dict.pop("password_hash")
        public_dict.pop("mfa_key")

        return public_dict
