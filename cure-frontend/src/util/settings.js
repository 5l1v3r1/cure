
class SettingsUtility {
    
    constructor() {
        var settings = localStorage.getItem("settings");

        if (!settings) {
            settings = "{}"
            localStorage.setItem("settings", settings);
        }
        try {
            this.settings = JSON.parse(settings);
        } catch (SyntaxError) {
            console.warn("[util/settings] invalid settings json syntax - using default settings.");
            this.settings = {};
        }
    }

    getSetting(key, d) {
        if (this.settings[key]) {
            return this.settings[key];
        }
        return d;
    }

    setSetting(key, value) {
        this.settings[key] = value;
    }

    resetSettings() {
        this.settings = {};
        this.saveSettings();
    }

    saveSettings() {
        localStorage.setItem("settings", JSON.stringify(this.settings));
    }

}

export default new SettingsUtility();