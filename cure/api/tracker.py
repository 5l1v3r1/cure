from cure.api.base import get_route, require_authentication, require_global_permissions, require_json
from cure.server import app
from cure.util.config import config
from cure.types.tracker import TrackerCache
from flask import jsonify

import cure.constants as constants
import cure.helper.tracker as tracker_helper
import cure.helper.user as user_helper
import cure.types.exception as errors
import bson


@app.route(get_route(constants.ROUTES.ROUTE_ADD_TRACKER), methods=["POST"])
@require_global_permissions(permission=0x00000002)
@require_json
def create_tracker(data, user):

    name = data.get("name", "unnamed tracker")
    invite_only = data.get("invite_only", False)
    if type(name) != str:
        raise errors.InvalidJsonError
    if type(invite_only) != bool:
        raise errors.InvalidJsonError
    if type(data.get("public", False)) != bool:
        raise errors.InvalidJsonError
    owner = user_helper.get_user_by_id(bson.ObjectId(user))
    tracker = tracker_helper.create_tracker(name, invite_only, owner)
    tracker.public = data.get("public", True)
    tracker_helper.tracker_cache.add_tracker(tracker)
    
    return jsonify(tracker.as_dict())


@app.route(get_route(constants.ROUTES.ROUTE_GET_TRACKER), methods=["GET"])
def get_tracker(tracker_id):

    tracker = tracker_helper.get_tracker(tracker_id)

    if tracker is None:
        raise errors.NotFoundError
    
    return jsonify(tracker.as_dict())


@app.route(get_route(constants.ROUTES.ROUTE_JOIN_TRACKER), methods=["POST"])
@require_authentication
def join_tracker(user, tracker_id):

    tracker = tracker_helper.get_tracker(tracker_id)

    if tracker is None:
        raise errors.NotFoundError

    if tracker.invite_only or not tracker.public:
        raise errors.InvalidPermissionError
    
    # TODO when we implement bans, prevent users from joining.
    
    tracker_helper.add_user_to_tracker(tracker_id, user)
    return "", "204"


@app.route(get_route(constants.ROUTES.ROUTE_GET_TRACKERS), methods=["GET"])
def get_public_trackers():
    trackers = tracker_helper.get_all_public_trackers()
    output = []
    for tracker in trackers:
        output.append(tracker.as_dict())
    return jsonify({
        "trackers": output
    }), "200"
