
module.exports = {
    locale: {
        default: {
            BOARD_WELCOME_SIGN_IN_OR_REGISTER: "Welcome to {}! Sign in or register below.",
            BOARD_WELCOME_SIGN_IN: "Welcome to {}! Sign in below.",
            COMMON_USERNAME: "Username",
            COMMON_PASSWORD: "Password",
            LOGIN_BUTTON: "Login",
            REGISTER_BUTTON: "Register",
            LOGIN_FAIL_INVALID_PASSWORD: "Login failed: invalid password"
        },
        "en-US": {}
    },
    getCurrentLocale() {
        var l = "en-US";
        if (window.localStorage.getItem("localeOverride")) {
            l = window.localStorage.getItem("localeOverride");
        }
        return l;
    },
    formatText(localeText, parameters) {
        // wonderfully taken from stack overflow
        // https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function
        var i = 0, args = parameters;
        return localeText.replace(/{}/g, function () {
            return typeof args[i] != 'undefined' ? args[i++] : '';
        });
    }
};
