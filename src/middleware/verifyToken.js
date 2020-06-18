<<<<<<< HEAD
const jwt = require('jsonwebtoken')
const config = require('../models/congif')
const cookieParser = require("cookie-parser");
const User = require('../models/user')

async function verifyToken(req, res, next) {
    if (req.headers.cookie) {
        const token = get_cookies(req)['x-access-token']
        if (!token) {
            req.userId = 0;
            console.log("verify token: null")
        }
        else {
        
            console.log("verify token: " + token)
            const decoded = jwt.verify(token, config.secret);
            var user = await User.findById(decoded.id);
            if (!user) {
                req.userId = 0;
            }
            else {
                req.userId = user.id;
            }
        }

        next();
    }
}


var get_cookies = function (request) {
    var cookies = {};
    request.headers && request.headers.cookie.split(';').forEach(function (cookie) {
        var parts = cookie.match(/(.*?)=(.*)$/)
        cookies[parts[1].trim()] = (parts[2] || '').trim();
    });
    return cookies;
};


module.exports = verifyToken;module.exports = verifyToken;
module.exports = verifyToken;
=======
function verifyToken(password){
    
}
>>>>>>> 5e04161... Modelo Usuario agregado
