let pool = require("../database/connection").getMysqlPool();
module.exports = {
    /**
            * @param {Object} data
            * @return {Promise<{success:boolean,message:string,message_id:number}>}
            */
    saveSchoolFacilities: async function (data) {
        return new Promise(async (resolve, reject) => {
            pool.query("INSERT INTO facilities (" + Object.keys(data).join(",") + ") VALUES (?)", [Object.values(data)])
                .then(async result => {
                    resolve({ success: true, message: "Facilities added successfully", schoolId: result.insertId }
                    );
                })
                .catch(err => {
                    console.log(err.message);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    getFacilityRecords: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from facilities where school_id=? and status in ("1","2","3")`, [schoolId])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getFacilityRecordsData: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from facilities where school_id=? and status=1 order by id desc`, [schoolId])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getFacilityById: async function (id) {
        return new Promise(async (resolve) => {
            pool.query(`select * from facilities where id =? and status in("1","2","3") order by id desc `, [id])
                .then(async result => {
                    if (result.length !== 0) {
                        resolve(result[0]);
                    } else {
                        resolve(null)
                    }
                })
                .catch(err => {
                    console.log(err);
                    resolve(null);
                });
        })
    },
    getFacilityRecords: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from facilities where school_id=? and status in("1","2","3") ORDER BY id DESC`, [schoolId])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getFacilityRecordsForListing: async function (id) {
        return new Promise(async (resolve) => {
            pool.query(`select * from facilities where id=? and status in("1","2","3") ORDER BY id DESC`, [id])
                .then(async result => {
                    resolve(result[0]);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    updateFecilities: async function (data, facilityId) {
        return new Promise(async (resolve, reject) => {
            pool.query("UPDATE facilities SET ? where id = ?", [data, facilityId])
                .then(result => {
                    console.log(result);
                    resolve({ success: true, message: "Facilities updated succesfully" });
                })
                .catch(err => {
                    console.log(err);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    deleteFacility: async function (FacilityId) {
        return new Promise(async (resolve, reject) => {
            pool.query(`UPDATE  facilities SET status=0 where id = ?`, [FacilityId])
                .then(result => {
                    resolve({ success: true, message: "Facility deleted succesfully" });
                })
                .catch(err => {
                    console.log(err);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
}