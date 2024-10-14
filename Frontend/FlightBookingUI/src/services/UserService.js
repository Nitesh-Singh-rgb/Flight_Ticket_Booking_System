import axios from "axios";

export default class UserService {
    constructor() {
        this.url = "http://localhost:8980/";
    }

    async addUser(user) {
        return await axios.post(this.url + "/createuser", user).then((response) => {
            return response;
        });
    }

    // getUsers(){
    //     return this.users
    // }

    async validateUser(username, password) {
        return await axios
            .get(this.url + "/auth/" + username + "/" + password)
            .then((res) => {
                return res;
            });
    }
}
