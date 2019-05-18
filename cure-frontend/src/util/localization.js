
class LocalizationUtility {
    constructor() {
        this.localeStrings = {
            default: {
                BOARD_WELCOME_SIGN_IN_OR_REGISTER: "Welcome to {boardName}! Sign in or register below.",
                BOARD_WELCOME_SIGN_IN: "Welcome to {boardName}! Sign in below.",
                COMMON_USERNAME: "Username",
                COMMON_PASSWORD: "Password",
                LOGIN_BUTTON: "Login",
                REGISTER_BUTTON: "Register",
                LOGIN_FAIL_INVALID_PASSWORD: "Login failed: invalid password",
                LOGIN_FAIL_USERNAME_REQUIRED: "Please enter a username.",
                LOGIN_FAIL_PASSWORD_REQUIRED: "Please enter a password.",
                REMEMBER_ME: "Remember me",
                NAVBAR_DASHBOARD: "Dashboard",
                NAVBAR_LOGOUT: "Logout",
                LOGOUT_LOGGING_OUT: "Logging out...",
                LOGOUT_PLEASE_WAIT: "Please wait.",
                LOGOUT_SUCCESS: "Logged out successfully",
                LOGOUT_CLOSE_TIP: "You may now close this window or tab.",
                REGISTER_DESCRIPTION: "You may register an account with {boardName}.",
                REGISTER_LEGAL_MUMBO_JUMBO_HEADER: "Legal Mumbo Jumbo",
                // TODO allow legal documentation
                REGISTER_LEGAL_MUMBO_JUMBO_DESCRIPTION: "By registering, you agree to follow the terms and conditions set by {boardName}. Please see legal documents on the main website for {boardName} before you agree.",
                REGISTER_FAILED: "An error occurred while registering: {error}",
                NAVBAR_TRACKERS: "Trackers"
            },
            "en-US": { /* don't override anything here. */ },
            "es-ES": {
                // i cant translate spanish stuff pls help
                BOARD_WELCOME_SIGN_IN_OR_REGISTER: "Bienvendio a {boardName}. Acceder o registrar:"
            }
        }
        this.currentLocaleCode = this.getCurrentLocale();
    }

    _applyParametersToText(text, parameters) {
        for (var key in parameters) {
            var value = parameters[key];
            text = text.replace(new RegExp(`{${key}}`, "g"), value);
        }
        return text;
    }

    getCurrentLocaleCode() {
        var l = "default";
        if (window.localStorage.getItem("localeOverride")) {
            l = window.localStorage.getItem("localeOverride");
        }
        return l;
    }

    getCurrentLocale() {
        var localeCode = this.getCurrentLocaleCode();
        if (!this.localeStrings[localeCode]) {
            return this.localeStrings.default;
        }
        return this.localeStrings[localeCode];
    }

    getDefaultLocale() {
        return this.localeStrings.default;
    }

    updateLocale(localeCode) {
        if (!this.localeStrings[localeCode]) {
            console.warn(`Locale ${localeCode} not found`);
            return;   
        }
        this.currentLocaleCode = localeCode;
        window.localStorage.setItem("localeOverride", localeCode)
    }

    getLocaleString(key, parameters={}) {
        if (!this.getCurrentLocale()[key]) {
            if (!this.getDefaultLocale()[key]) {
                console.warn(`Failed to find requested localization key ${key}`)
                return `Localization error: couldn't find key ${key}`;
            } else {
                return this._applyParametersToText(this.getDefaultLocale()[key], parameters);
            }
        }
        return this._applyParametersToText(this.getCurrentLocale()[key], parameters)
    }

}

export default new LocalizationUtility();
