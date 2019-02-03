
class ApiUtility {
    constructor() {
        this.endpoints =  {
            AUTH_LOGIN: "/auth/login",
            AUTH_LOGOUT: "/auth/logout",
            AUTH_TOKEN_GET: "/auth/token",
            AUTH_TOKEN_GET_SESSION: "/auth/token/generate-session",
            AUTH_TOKEN_LOGOUT: "/auth/token/refresh",
            USERS_ME: "/users/me"
        };
        this.apiLocation = window.location.origin + "/api";
    }

    get(endpoint, headers, callback) {
        fetch(window.location.origin + "/api" + endpoint, {
            method: "GET",
            cache: "no-cache",
            headers: headers
        })
            .then(response => response.json())
            .then(callback);
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
    }

    delete(endpoint, headers, callback) {
        fetch(this.apiLocation + endpoint, {
            method: "DELETE",
            cache: "no-cache",
            headers: headers
        })
            .then(response => response.json())
            .then(callback)
    }
}


export default new ApiUtility();