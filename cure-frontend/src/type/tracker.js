
/**
 * An object for trackers.
 */
class Tracker {

    /**
     * Creates a tracker by its ID.
     * @param {String} trackerId the tracker's ID
     * @param {String} name the name of the tracker
     * @param {String} inviteOnly whether or not the tracker is invite-only
     * @param {String} isPublic whether or not the tracker is public
     */
    constructor(trackerId, name, inviteOnly, isPublic) {
        this.trackerId = trackerId;
        this.name = name;
        this.inviteOnly = inviteOnly;
        this.isPublic = isPublic;
        this.joined = false;
        this.description = null;
    }

    hasJoined() {
        return this.joined;
    }

    /**
     * Sets the tracker's variables
     * @param {Object} trackerData data to set
     */
    setTrackerData(trackerData) {
        for (var key in trackerData) {
            //console.log(`${key}: ${trackerData[key]}`)
            if (key === "id" || key.startsWith("_")) {
                continue;
            }
            if (key === "public") {
                this["isPublic"] = trackerData[key];
                continue;
            }
            this[key] = trackerData[key];
        }
    }

    /**
     * Returns the name for the Tracker
     * @returns {String} name of tracker
     */
    getName() {
        return this.name;
    }

    /**
     * Returns the ID for the Tracker
     * @returns {String} mongoDB ID of tracker
     */
    getTrackerId() {
        return this.trackerId;
    }

    /**
     * Returns a description of the tracker
     * @returns {String} description
     */
    getDescription() {
        return this.description || "No description.";
    }
}

// I'm just going to use the TrackerManager as cache.
// /**
//  * Caches trackers for the tracker helper.
//  * 
//  * Without this, many more calls would be made to the API to get trackers and it would
//  * be less efficient.
//  */
// class TrackerCache {

//     /**
//      * Creates a tracker cache.
//      */
//     constructor() {
//         this.cachedTrackers = {}
//     }

//     /**
//      * Stores a tracker into the cached tracker database
//      * @param {Tracker} trackerObject the object to store in the database
//      * @returns {Boolean} true on success, false on failure
//      */
//     storeTracker(trackerObject) {
//         if (this.cachedTrackers[trackerObject.getTrackerId()]) {
//             return false;
//         }
//         this.cachedTrackers[trackerObject.getTrackerId()] = trackerObject;
//         return true;
//     }

//     /**
//      * Retrieves a tracker from the cache by its ID
//      * @param {String} trackerId mongoDB ID of the tracker
//      * @returns {Tracker} the Tracker object if it exists. otherwise, undefined is returned.
//      */
//     getTracker(trackerId) {
//         return this.cachedTrackers[trackerId]
//     }

//     /**
//      * Updates a tracker based on its tracker ID
//      * @param {Tracker} trackerObject the object to store in the database
//      */
//     updateTracker(trackerObject) {
//         this.cachedTrackers[trackerObject.getTrackerId()] = trackerObject;
//     }
// }

export default Tracker;