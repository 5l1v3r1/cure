
class ApiUtility {
    constructor() {
        this.endpoints =  {
            AUTH_LOGIN: "/auth/login",
            AUTH_LOGOUT: "/auth/logout",
            AUTH_REGISTER: "/auth/register",
            AUTH_TOKEN_GET: "/auth/token",
            AUTH_TOKEN_GET_SESSION: "/auth/token/generate-session",
            AUTH_TOKEN_LOGOUT: "/auth/token/refresh",
            BOARD_GET: "/board",
            USERS_ME: "/user",
            USERS_GET: function (data) {
                return `/users/${data.userId}`
            },
            TRACKERS_GET_ALL: "/trackers"
        };
        // Anti-directory traversal on endpoints
        // ---- CONTACT ME BEFORE YOU CHANGE THIS ----
        for (var endpoint in this.endpoints) {
            if (typeof this.endpoints[endpoint] === "function") {
                var originalFunction = this.endpoints[endpoint]
                this.endpoints[endpoint] = function (data) {
                    for (var key in data) {
                        data[key] = encodeURIComponent(data[key])
                    }
                    originalFunction(data);
                }
            }
        }
        // ---- CONTACT ME BEFORE YOU CHANGE THIS ----
        this.apiLocation = window.location.origin + "/api";
    }

    get(endpoint, headers, callback) {
        fetch(window.location.origin + "/api" + endpoint, {
            method: "GET",
            cache: "no-cache",
            headers: headers
        })
            .then(response => response.json())
            .then(callback)
            .catch((e)=>{
                console.error("api error: " + JSON.stringify(e))
                callback({
                    error: {
                        code: -1,
                        identifier: "invalid_reponse_error",
                        friendly_name: "An invalid JSON response occurred"
                    }
                })
            });
    }

    post(endpoint, data, headers, callback) {
        headers["Content-Type"] = "application/json";
        fetch(window.location.origin + "/api" + endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(callback)
            .catch((e)=>{
                console.error("api error: " + JSON.stringify(e))
                callback({
                    error: {
                        code: -1,
                        identifier: "invalid_reponse_error",
                        friendly_name: "An invalid JSON response occurred"
                    }
                })
            });
    }

    patch(endpoint, data, headers, callback) {
        headers["Content-Type"] = "application/json";
        fetch(this.apiLocation + endpoint, {
            method: "PATCH",
            cache: "no-cache",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(callback)
            .catch((e)=>{
                console.error("api error: " + JSON.stringify(e))
                callback({
                    error: {
                        code: -1,
                        identifier: "invalid_reponse_error",
                        friendly_name: "An invalid JSON response occurred"
                    }
                })
            });
    }

    delete(endpoint, headers, callback) {
        fetch(this.apiLocation + endpoint, {
            method: "DELETE",
            cache: "no-cache",
            headers: headers
        })
            .then(response => response.json())
            .then(callback)
            .catch((e)=>{
                console.error("api error: " + JSON.stringify(e))
                callback({
                    error: {
                        code: -1,
                        identifier: "invalid_reponse_error",
                        friendly_name: "An invalid JSON response occurred"
                    }
                })
            });
    }

}


export default new ApiUtility();