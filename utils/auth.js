const { veryfyToken } = require("./jwt");
const basicRequestAuth = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'] || req.signedCookies.access_token;
        if (!bearerHeader) {
            throw new Error("invalid request token missing");
        }
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
       
        if (!bearerToken) {
            throw new Error("invalid request token missing");
        }
        veryfyToken(bearerToken).then(userData => {
            req.token=bearerToken;
            req.user = userData;
            next();
        }).catch(err => {
            res.redirect('/')
        })
    } catch (error) {
        res.redirect('/')
    }
}
const basicApiAuth = (req, res, next) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (!bearerHeader) {
            throw new Error("invalid request token missing");
        }
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        if (!bearerToken) {
            throw new Error("invalid request token missing");
        }
        veryfyToken(bearerToken).then(userData => {
            req.user = userData;
            next();
        }).catch(err => {
            res.status(401).json({ success: false, message: "invalid request" })
        })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
module.exports = {
    basicRequestAuth,
    basicApiAuth
}