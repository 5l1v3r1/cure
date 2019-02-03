import api from './api.js';

class AuthenticationUtility {

    constructor() {
        this.currentSession = null;
        this.currentSessionType = null;
        this.authenticated = false;
        restoreUsingToken();
    }

    restoreUsingToken() {
        if (window.localStorage.getItem("token") === null) {
            return;
        }
        this.currentSessionType = "token";
        this.currentSession = window.localStorage.getItem("token")
    }

    restoreWithSession(sessionId) {
        this.currentSessionType = "session";
        this.currentSession = sessionId;
    }

    storeInLocalStorage() {
        if (this.currentSessionType === "token") {
            window.localStorage.setItem("token", this.currentSession);
        }
    }

    checkCurrentSession(callback) {
        if (!this.currentSession || !this.currentSessionType) {
            this.authenticated = false;
            return;
        }
        api.get(api.endpoints.USERS_ME, {
            "Authorization": this.getAuthorizationHeaderString
        }, (data) => {
            this.authenticated = !data.error;
            callback(!data.error);
        })
    }

    getAuthorizationHeaderString() {
        return `${this.currentSessionType} ${this.currentSession}`;
    }

    getWithAuthentication(endpoint, headers, callback) {
        headers["Authorization"] = this.getAuthorizationHeaderString()
        api.get(endpoint, headers, callback);
    }

    postWithAuthentication(endpoint, data, headers, callback) {
        headers["Authorization"] = this.getAuthorizationHeaderString()
        api.post(endpoint, data, headers, callback);
    }

    patchWithAuthentication(endpoint, data, headers, callback) {
        headers["Authorization"] = this.getAuthorizationHeaderString()
        api.patch(endpoint, data, headers, callback);
    }

    deleteWithAuthentication(endpoint, data, headers, callback) {
        headers["Authorization"] = this.getAuthorizationHeaderString()
        api.delete(endpoint, data, headers, callback);
    }
    
    login(username, password, rememberMe, callback) {
        api.post(api.endpoints.AUTH_LOGIN, {
            "username": username,
            "password": password
        }, {}, (data) => {
            if (!data.error) {
                this.restoreWithSession(data["session_id"]);
                callback({
                    success: true,
                    mfaRequired: !data["mfa_authenticated"]
                })
                return;
            }
        })
    }

}

export default new AuthenticationUtility();