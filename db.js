

//Include crypto to generate the movie id
var crypto = require('crypto');
module.exports = function () {
    return {
        userList: [],

        save: function(user) {
            user.id = crypto.randomBytes(20).toString('hex');
        }
    }
}

//TAKE FROM GITHUB