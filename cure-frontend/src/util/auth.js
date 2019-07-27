import api from './api.js';

class AuthenticationUtility {

    constructor() {
        console.log("yeet");
        this.currentSession = null;
        this.currentSessionType = null;
        this.authenticated = false;
        this.eventStorage = {
            login: [],
            logout: []
        };
        this.restore();
    }

    listenForLogin(callback) {
        this.eventStorage.login.push(callback);
    }

    listenForLogout(callback) {
        this.eventStorage.logout.push(callback);
    }

    restore() {
        if (window.localStorage.getItem("token") === null) {
            if (window.localStorage.getItem("session") !== null) {
                this.currentSessionType = "session";
                this.currentSession = window.localStorage.getItem("session");
            }
            return;
        }
        this.currentSessionType = "token";
        this.currentSession = window.localStorage.getItem("token")
        this.checkCurrentSession((authenticated)=>{
            this.authenticated = authenticated;
        });
    }

    restoreWithSession(sessionId) {
        this.currentSessionType = "session";
        this.currentSession = sessionId;
        this.storeInLocalStorage();
    }

    storeInLocalStorage() {
        if (this.currentSessionType === "token") {
            window.localStorage.setItem("token", this.currentSession);
        } else if (this.currentSessionType === "session") {
            window.localStorage.setItem("session", this.currentSession);
        }
    }

    checkCurrentSession(callback) {
        if (!this.currentSession || !this.currentSessionType) {
            this.authenticated = false;
            callback(this.authenticated);
        }
        api.get(api.endpoints.USERS_ME, {
            "Authorization": this.getAuthorizationHeaderString()
        }, (data) => {
            console.log(JSON.stringify(data));
            this.authenticated = !data.error;
            callback(this.authenticated);
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
                this.restoreWithSession(data.session["session_id"]);
                this.authenticated = true;
                for (var eventCallback of this.eventStorage.login) {
                    eventCallback();
                }
                callback({
                    success: true,
                    mfaRequired: !data["mfa_authenticated"]
                });
                return;
            } else {
                callback({
                    success: false
                })
            }
        })
    }

    logout() {
        this.postWithAuthentication(api.endpoints.AUTH_LOGOUT, {}, {}, ()=>{});
        this.currentSession = "";
        this.currentSessionType = "";
        this.authenticated = false;
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("session");
        for (var eventCallback of this.eventStorage.logout) {
            eventCallback();
        }
    }

}

export default new AuthenticationUtility();