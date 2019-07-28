
/**
 * User object
 */
class User {

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.permissions = 0x00000000;
        this.is_global_admin = false;
    }

    getName() {
        return this.name;
    }

    loadFromData(data) {
        for (var key in data) {
            this[key] = data[key];
        }
    }

    isGlobalAdmin() {
        return this.is_global_admin
    }
}

export default User;