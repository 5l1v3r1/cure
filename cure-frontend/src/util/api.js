
module.exports = {
    endpoints: {
        AUTH_LOGIN: "/auth/login",
        AUTH_LOGOUT: "/auth/logout",
        AUTH_TOKEN_GET: "/auth/token",
        AUTH_TOKEN_GET_SESSION: "/auth/token/generate-session",
        AUTH_TOKEN_LOGOUT: "/auth/token/refresh"
    },
    apiLocation: window.location.origin + "/api",
    get: function(endpoint, headers, callback) {
        fetch(window.location.origin + "/api" + endpoint, {
            method: "GET",
            cache: "no-cache",
            headers: headers
        })
            .then(response => response.json())
            .then(callback);
    },
    post: function(endpoint, data, headers, callback) {
        headers["Content-Type"] = "application/json";
        fetch(window.location.origin + "/api" + endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(callback)
    },
    patch: function(endpoint, data, headers, callback) {
        headers["Content-Type"] = "application/json";
        fetch(this.apiLocation + endpoint, {
            method: "PATCH",
            cache: "no-cache",
            headers: headers,
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(callback)
    },
    delete: function(endpoint, headers, callback) {
        fetch(this.apiLocation + endpoint, {
            method: "DELETE",
            cache: "no-cache",
            headers: headers
        })
            .then(response => response.json())
            .then(callback)
    }
}