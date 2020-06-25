const jwt = require('jsonwebtoken')
const config = require('../models/config')
const cookieParser = require("cookie-parser");
const User = require('../models/user')
const Task = require('../models/tasks')
const List = require('../models/tasksList');
const user = require('../models/user');

var lastUser;

async function verifyToken(req, res, next) {
    if (req.headers.cookie) {
        const token = get_cookies(req)['x-access-token']
        if(token) {        
            //console.log("verify token: " + token)
            const decoded = jwt.verify(token, config.secret);
            lastUser = await User.findById(decoded.id);
            if (!lastUser) {
                res.clearCookie("x-access-token")
                var message = ""
                return res.render('login', {  message })
            }
        }
        if(!lastUser) res.end();
        else next();
    }
    else
    {
        var message = ""
        return res.render('login', {  message })
    }
}

function getUser()
{
    return lastUser;
}

var get_cookies = function (request) {
    var cookies = {};
    request.headers && request.headers.cookie.split(';').forEach(function (cookie) {
        var parts = cookie.match(/(.*?)=(.*)$/)
        cookies[parts[1].trim()] = (parts[2] || '').trim();
    });
    return cookies;
};

module.exports = verifyToken;
module.exports.getUser = getUser;
