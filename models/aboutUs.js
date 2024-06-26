let pool = require("../database/connection").getMysqlPool();
module.exports = {
    /**
            * @param {Object} data
            * @return {Promise<{success:boolean,message:string,message_id:number}>}
            */
    saveSchoolAboutUs: async function (data) {
        return new Promise(async (resolve, reject) => {
            pool.query("INSERT INTO about_us (" + Object.keys(data).join(",") + ") VALUES (?)", [Object.values(data)])
                .then(async result => {
                    resolve({ success: true, message: "About us added successfully", schoolId: result.insertId }
                    );
                })
                .catch(err => {
                    console.log(err.message);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    checkSchoolId: async function (school_id) {
        return new Promise(async (resolve) => {
            pool.query('SELECT * FROM about_us WHERE school_id = ? and status = 1', [school_id])
                .then(async result => {
                    resolve(result.length > 0);
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    },
    updateAboutUs: async function (data, schoolId) {
        return new Promise(async (resolve, reject) => {
            pool.query("UPDATE about_us SET ? where school_id = ?", [data, schoolId])
                .then(result => {
                    console.log(result);
                    resolve({ success: true, message: "About us updated" });
                })
                .catch(err => {
                    console.log(err);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    getAboutUsRecords: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from about_us where school_id=?  and status in ("1","2","3")`, [schoolId])
                .then(async result => {
                    resolve(result[0]);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getAboutUsData: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query("SELECT * FROM about_us WHERE school_id = ? AND status = '1'", [schoolId])
                .then(async result => {
                    resolve(result[0]);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
}