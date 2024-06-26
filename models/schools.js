let pool = require("../database/connection").getMysqlPool();
module.exports = {
    /**
         * @param {Object} data
         * @return {Promise<{success:boolean,message:string,message_id:number}>}
         */
    saveSchoolRegistration: async function (data) {
        return new Promise(async (resolve, reject) => {
            pool.query("INSERT INTO schools (" + Object.keys(data).join(",") + ") VALUES (?)", [Object.values(data)])
                .then(async result => {
                    resolve({ success: true, message: "School register Sucessfully", schoolId: result.insertId }
                    );
                })
                .catch(err => {
                    console.log(err.message);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    getSchoolRecords: async function () {
        return new Promise(async (resolve) => {
            pool.query(`select * from schools where status in ("1","2","3")  order by school_id desc`)
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getSchoolById: async function (school_id) {
        return new Promise(async (resolve) => {
            pool.query(`select * from schools where school_id =? and status in ("1","2","3")`, [school_id])
                .then(async result => {
                    resolve(result[0]);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    checkEmailExists: async function (email) {
        return new Promise(async (resolve) => {
            pool.query('SELECT * FROM schools WHERE email = ?', [email])
                .then(async result => {
                    resolve(result.length > 0);
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    },
    checkSchoolIdExists: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query('SELECT * FROM schools WHERE school_id = ? and status in ("1","2","3")', [schoolId])
                .then(async result => {
                    resolve(result.length > 0);
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    },
    checkSchoolExists: async function (school_name) {
        return new Promise(async (resolve) => {
            pool.query('SELECT * FROM schools WHERE school_name = ?', [school_name])
                .then(async result => {
                    resolve(result.length > 0);
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    },
    updateStatusForSchool: async function (schoolId, status) {
        return new Promise(async (resolve) => {
            pool.query(`UPDATE schools SET status =? WHERE school_id = ?`, [status, schoolId])
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
    deleteSchool: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`UPDATE  schools SET status=0 where school_id = ?`, [schoolId])
                .then(async result => {
                    console.log(result)
                    resolve({ success: true, message: "School deleted succesfully" })
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    }
}