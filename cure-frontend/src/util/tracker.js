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
        if (auth.authenticated) {
            auth.getWithAuthentication(api.endpoints.TRACKERS_GET_ALL, {}, (trackers) => {
                this.trackers = {};
                for (var trackerObject in trackers["trackers"]) {
                    var tracker = this.parseTracker(trackerObject);
                    this.trackers[tracker.getTrackerId()] = tracker;
                }
                callback();
            });
        }
    }

    parseTracker(tracker) {
        const requiredAttributes = ["id", "name", "invite_only", "public"]
        for (var reqAttr of requiredAttributes) {
            if (tracker[reqAttr] == null) {
                return null;
            }
        }
        var tracker = new Tracker(tracker["id"], tracker["name"], tracker["invite_only"], tracker["public"])
        tracker.setTrackerData(tracker);
        return tracker;
    }
}

export default new TrackerUtil();