from cure.api.base import database
from cure.types.user import User
from cure.types.tracker import Tracker, TrackerRole, TrackerMember, TrackerCache

import cure.constants as const
import bson

tracker_cache = TrackerCache()

# TODO add ability to delete trackers, remove members, etc.

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
        "invite_only": invite_only
    })

    member = TrackerMember()
    member.user_id = str(owner.mongodb_id)
    member.is_owner = True
    member.permissions = 0x88888888
    database.insert_one(const.DATABASE_TRACKER_MEMBER_NAME, member.as_database_object())

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

def get_tracker_member(tracker_id, user_id):
    """
    Finds a tracker member using the tracker's id and the user's id

    If the user isn't a member of that tracker or doesn't exist, `None` will be returned.
    """

    if type(tracker_id) == bson.ObjectId:
        tracker_id = str(tracker_id)
    
    if type(user_id) == bson.ObjectId:
        user_id = str(user_id)

    database_member = database.find_one(const.DATABASE_TRACKER_MEMBER_NAME, {
        "tracker_id": tracker_id,
        "user_id": user_id
    })

    if database_member is None:
        return None

    return TrackerMember.from_dict(database_member)


def add_user_to_tracker(tracker_id, user_id):
    """
    Adds a user to a tracker if they aren't already in the tracker.
    """
    member = TrackerMember()
    member.user_id = str(user_id)
    database.insert_one(const.DATABASE_TRACKER_MEMBER_NAME, member.as_database_object())
    return member


def get_all_public_trackers():

    trackers = []
    trackers_from_database = database.find(const.DATABASE_TRACKER_NAME, {
        "public": True
    })
    # convert from iteration into an array
    for tracker in trackers_from_database:
        trackers.append(tracker)
    return trackers
