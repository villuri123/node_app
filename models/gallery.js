let pool = require("../database/connection").getMysqlPool();
module.exports = {
    /**
            * @param {Object} data
            * @return {Promise<{success:boolean,message:string,message_id:number}>}
            */
    saveSchoolGallery: async function (data) {
        return new Promise(async (resolve, reject) => {
            pool.query("INSERT INTO gallery (" + Object.keys(data).join(",") + ") VALUES (?)", [Object.values(data)])
                .then(async result => {
                    resolve({ success: true, message: "gallery added successfully", schoolId: result.insertId }
                    );
                })
                .catch(err => {
                    console.log(err.message);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    getGalleryRecordsById: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from gallery where school_id=? and status in ("1","2","3") ORDER BY id DESC`, [schoolId])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getGalleryRecordsData: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from gallery where school_id=? and status=1 ORDER BY id DESC`, [schoolId])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    deleteGalleryImage: async function (FacilityId) {
        return new Promise(async (resolve, reject) => {
            pool.query(`UPDATE  gallery SET status=0 where id = ?`, [FacilityId])
                .then(result => {
                    resolve({ success: true, message: "Image deleted succesfully" });
                })
                .catch(err => {
                    console.log(err);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
}