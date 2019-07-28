import auth from "./auth";
import api from "./api";
import Tracker from "./../type/tracker";

/**
 * Manages trackers and caches them
 */
class TrackerUtil {

    constructor() {
        this.trackers = {};
    }

    /**
     * Get a tracker by it's ID
     * @param {String} trackerId the tracker's ID as a string
     * @param {Function} callback Callback function once the tracker is recieved. **Can return null if the tracker doesn't exist**
     * @param {Boolean} forceRefresh Forces a refresh instead of pulling from the cache.
     */
    getTracker(trackerId, callback, forceRefresh=false) {
        if (this.trackers[trackerId] && !forceRefresh) {
            return callback(this.trackers[trackerId]);
        }
        auth.getWithAuthentication(api.endpoints.TRACKERS_GET(trackerId), {}, (data) => {
            if (data["error"]) {
                return callback(null);
            }
            return callback(this.parseTracker(data));
        })
    }

    fetchTrackers(callback) {
        // TODO if we add guest mode, allow unauthenticated.
        if (auth.authenticated) {
            auth.getWithAuthentication(api.endpoints.TRACKERS_GET_ALL, {}, (trackers) => {
                this.trackers = {};
                for (var trackerObject of trackers["trackers"]) {
                    var tracker = this.parseTracker(trackerObject);
                    this.trackers[tracker.trackerId] = tracker;
                    //console.log(tracker);
                }
                auth.getWithAuthentication(api.endpoints.TRACKERS_MINE, {}, (t) => {
                    for (var trackerId of t["trackers"]) {
                        if (this.trackers[trackerId]) {
                            this.trackers[trackerId].joined = true;
                        }
                    }
                    callback();
                });
            });
        }
    }

    getAllTrackers() {
        var trackerList = []
        for (var trackerId in this.trackers) {
            trackerList.push(this.trackers[trackerId])
        }
        return trackerList
    }

    parseTracker(tracker) {
        const requiredAttributes = ["id", "name", "invite_only", "public"];
        for (var reqAttr in requiredAttributes) {
            if (tracker[reqAttr] === null) {
                return null;
            }
        }
        var trackerObject = new Tracker(tracker["id"], tracker["name"], tracker["invite_only"], tracker["public"]);
        trackerObject.setTrackerData(tracker);
        return trackerObject;
    }
}

export default new TrackerUtil();