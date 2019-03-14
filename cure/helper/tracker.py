from cure.api.base import database
from cure.types.user import User
from cure.types.tracker import Tracker, TrackerRole, TrackerMember, TrackerCache

import cure.constants as const
import bson

tracker_cache = TrackerCache()

def create_tracker(name, invite_only, owner=User()):
    """
    Creates a tracker
    ---
    name - the name to use for the tracker
    invite_only - bool to determine board privacy
    owner - a User of the person creating it.

    returns a tracker id
    """

    (acknowledged, tracker_id) = database.insert_one(const.DATABASE_TRACKER_NAME, {
        "name": name,
        "invite_only": invite_only,
        "members": [{
            "user_id": str(owner.mongodb_id),
            "permissions": 0x88888888,
            "is_owner": False
        }]
    })

    tracker = Tracker.from_dict(database.find_one(const.DATABASE_TRACKER_NAME, {"_id": tracker_id}))

    return tracker

def get_tracker(tracker_id):
    """
    Get a tracker by a `tracker_id` 

    **May return None if no tracker exists**
    """
    cached_tracker = tracker_cache.get_tracker(tracker_id)
    if cached_tracker is not None:
        return cached_tracker
    try:
        tracker_database_object = database.find_one(const.DATABASE_TRACKER_NAME, {"_id": bson.ObjectId(tracker_id) if type(tracker_id) == str else tracker_id})
    except bson.errors.InvalidId:
        return None
    tracker = Tracker.from_dict(tracker_database_object)

    return tracker