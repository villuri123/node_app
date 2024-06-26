let pool = require("../database/connection").getMysqlPool();
module.exports = {
    /**
            * @param {Object} data
            * @return {Promise<{success:boolean,message:string,message_id:number}>}
            */
    saveSchoolFeeStructure: async function (data) {
        return new Promise(async (resolve, reject) => {
            pool.query("INSERT INTO fee_structure (" + Object.keys(data).join(",") + ") VALUES (?) where status = '1' ", [Object.values(data)])
                .then(async result => {
                    resolve({ success: true, message: "Fee structure added successfully", schoolId: result.insertId }
                    );
                })
                .catch(err => {
                    console.log(err.message);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    getFeeStructureRecords: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from fee_structure where school_id=?  and status in ("1","2","3")`, [schoolId])
                .then(async result => {
                    resolve(result[0]);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    checkSchoolId: async function (school_id) {
        return new Promise(async (resolve) => {
            pool.query('SELECT * FROM fee_structure WHERE school_id = ? and status= 1', [school_id])
                .then(async result => {
                    resolve(result.length > 0);
                })
                .catch(err => {
                    console.log(err);
                    resolve([])
                })
        })
    },
    updateFeeStructure: async function (data, schoolId) {
        return new Promise(async (resolve, reject) => {
            pool.query("UPDATE fee_structure SET ? where school_id = ? and status='1' ", [data, schoolId])
                .then(result => {
                    console.log(result);
                    resolve({ success: true, message: "Fee structure updated" });
                })
                .catch(err => {
                    console.log(err);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    getFeeStructureData: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from fee_structure where school_id=? and status ="1"`, [schoolId])
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