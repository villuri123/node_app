var jwt = require('jsonwebtoken');
const secretkey = "109156be-c4fb-41ea-b1b4-efe1671c5836";
module.exports = {
    getJWTToken: async function (userData) {
        let data = { school_id: userData.school_id, user_id: userData.user_id, email: userData.email, role: userData.user_role,school_name:userData.school_name }
        token = jwt.sign(data, secretkey, { expiresIn: "1 days" });
        return token;
    },
    veryfyToken: function (token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secretkey, function (err, tokendata) {
                if (err) {
                    reject({ success: false, message: "invalid token" });
                }
                resolve(tokendata);
            })
        })
    },
}