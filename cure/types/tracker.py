from cure.types.base import DatabaseObject
from cure.types.permissions import TrackerPermissions
import bson

class TrackerRole(DatabaseObject):

    name = "unnamed role"
    # Create report, revoke report, view reports
    permissions = 0x00000028
    position = 0
    mongodb_id = None

    def __init__(self, name, permissions, position):
        self.name = name
        self.permissions = permissions
        self.position = position

    def as_dict(self):
        return {
            "name": self.name,
            "permissions": self.permissions,
            "position": self.position,
            "id": self.mongodb_id if self.mongodb_id is not None else 0
        }


class TrackerMember(DatabaseObject):

    permissions = 0x0
    user_id = None
    is_owner = False

    def __init__(self, user_id, permissions=0x0, is_owner=False):
        self.user_id = user_id
        self.permissions = permissions
        self.is_owner = is_owner
    
    def as_dict(self):
        return {
            "user_id": self.user_id,
            "permissions": self.permissions,
            "is_owner": self.is_owner
        }



class Tracker(DatabaseObject):

    name = "unnamed tracker"
    # If set to true, no one can join unless they have permission.
    invite_only = False
    # Members in the server. Not returned in as_dict.
    members = []
    roles = []
    integrations = []
    allow_custom_format = True
    default_format = {
        "Description": "string",
        "Steps to reproduce": "list string",
        "Version": "string",
        "Operating system": "string",
        "Extra information": "optional string"
    }

    mongodb_id = None
    
    # Eventually, we can add these for encryption support
    # encrypted = False
    # encryption_key = ""

    def as_dict(self):
        return {
            "name": self.name,
            "invite_only": self.invite_only,
            "roles": self.roles,
            "allow_custom_format": self.allow_custom_format,
            "default_format": self.default_format,
            "id": str(self.mongodb_id)
        }

class TrackerCache:
    """
    Caches trackers. Allows them to be more efficiently used.

    It is possible that this will be deprecated.
    """

    def __init__(self):
        self.trackers = []
        self.initalized_cache = False
    
    def add_tracker(self, tracker):
        """
        Adds a tracker to the cache
        """
        if type(tracker) == Tracker:
            self.trackers.append(tracker)
        elif type(tracker) == dict:
            self.trackers.append(Tracker.from_dict(tracker))

    def get_tracker(self, tracker_id):
        """
        Returns a `Tracker` based off of `tracker_id`.

        **May return None if tracker_id cannot be found**
        """
        for tracker in self.trackers:
            if tracker.mongodb_id == tracker_id:
                return tracker
        return None
    
    def initalize_cache(self, trackers):
        """
        Initalizes the cache for all trackers.
        """
        for tracker in trackers:
            self.trackers.append(tracker)
        self.initalized_cache = False
