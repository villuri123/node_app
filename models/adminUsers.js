let pool = require("../database/connection").getMysqlPool();
module.exports = {
    /**
    * @param {Object} data
    * @return {Promise<{success:boolean,message:string,message_id:number}>}
    */
    saveData: async function (data) {
        return new Promise(async (resolve, reject) => {
            pool.query("INSERT INTO admin_users (" + Object.keys(data).join(",") + ") VALUES (?)", [Object.values(data)])
                .then(async result => {
                    resolve({ success: true, message: "admin added Sucessfully", user_id: result.insertId, });
                })
                .catch(err => {
                    console.log(err.message);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    /**
  * @param {Object} data
  * * @param {string} user_id
  * @return {Promise<{success:boolean,message:string}>}
  */
    getUserByEmail: async function (email) {
        return new Promise(async (resolve) => {
            pool.query("select schools.school_name,admin_users.school_id,admin_users.user_id,admin_users.email,admin_users.password,admin_users.user_role from admin_users LEFT JOIN schools ON admin_users.school_id = schools.school_id  where admin_users.email =? and admin_users.status=?", [email, 1])
                .then(async result => {
                    if (result.length !== 0) {
                        resolve(result[0]);
                    } else {
                        resolve("")
                    }
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getUserBySchoolName: async function (schoolName) {
        return new Promise(async (resolve) => {
            pool.query("select user_id,,school_id,email,password,user_role from schools where school_id =? and status=?", [schoolName, 1])
                .then(async result => {
                    if (result.length !== 0) {
                        resolve(result[0]);
                    } else {
                        resolve("")
                    }
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    updateTokenForAdminUser: async function (email, otp) {
        return new Promise(async (resolve) => {
            pool.query(`UPDATE admin_users SET token =? WHERE email = ?`, [otp, email])
                .then(async result => {
                    resolve({ success: true, message: "Token updated successfully", result: result });
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    },
    verifyTokenForAdminUser: async function (schoolId,token, userId) {
        return new Promise(async (resolve) => {
            pool.query("SELECT * FROM admin_users WHERE school_id = ? AND user_id = ? AND token = ?", [schoolId,userId, token])
                .then(async result => {
                    if (result.length !== 0) {
                        resolve(result[0]);
                    } else {
                        resolve("")
                    }
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getUserByOTP: async function (otp) {
        return new Promise(async (resolve) => {
            pool.query("select user_id,email,password,user_role from admin_users where otp =? and status=?", [otp, 1])
                .then(async result => {
                    if (result.length !== 0) {
                        resolve(result[0]);
                    } else {
                        resolve("")
                    }
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getAdminRecords: async function () {
        return new Promise(async (resolve) => {
            pool.query("select * from admin_users order by school_id desc")
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getAdminRole: async function (email) {
        return new Promise(async (resolve) => {
            pool.query("select user_role from admin_users order by school_id desc", [email])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    updateStatusForAdminUser: async function (schoolId, status) {
        return new Promise(async (resolve) => {
            pool.query(`UPDATE admin_users SET status =? WHERE school_id = ?`, [status, schoolId])
                .then(async result => {
                    console.log(result)
                    resolve({ success: true, message: "Status updated" });
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    },
    deleteSchoolAdmin: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`UPDATE  admin_users SET status=0 where school_id = ?`, [schoolId])
                .then(async result => {
                    console.log(result)
                    resolve({ success: true, message: "School deleted succesfully" })
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    },
    updateOTPForAdminUser: async function (email, otp) {
        return new Promise(async (resolve) => {
            pool.query(`UPDATE admin_users SET otp =? WHERE email = ?`, [otp, email])
                .then(async result => {
                    resolve({ success: true, message: "OTP updated successfully", result: result });
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    },
    verifyOTPForAdminUser: async function (otp, userId) {
        return new Promise(async (resolve) => {
            pool.query(`SELECT otp FROM admin_users WHERE user_id = ? AND otp =?`, [userId, otp])
                .then(async result => {
                    if (result.length !== 0) {
                        resolve(result[0]);
                    } else {
                        resolve("")
                    }
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    resetPasswordForAdminUser: async function (userId, password) {
        return new Promise(async (resolve) => {
            pool.query(`UPDATE admin_users SET password =? WHERE user_id = ?`, [password, userId])
                .then(async result => {
                    console.log(result)
                    resolve({ success: true, message: "Password changed succesfully" });
                })
                .catch(err => {
                    console.log(err);
                    resolve("")
                })
        })
    },
}