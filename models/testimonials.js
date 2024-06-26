let pool = require("../database/connection").getMysqlPool();
module.exports = {
    /**
            * @param {Object} data
            * @return {Promise<{success:boolean,message:string,message_id:number}>}
            */
    saveSchoolTestimonials: async function (data) {
        return new Promise(async (resolve, reject) => {
            pool.query("INSERT INTO testimonials (" + Object.keys(data).join(",") + ") VALUES (?)", [Object.values(data)])
                .then(async result => {
                    resolve({ success: true, message: "Testimonials added successfully", schoolId: result.insertId }
                    );
                })
                .catch(err => {
                    console.log(err.message);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    getTestimonialsById: async function (id) {
        return new Promise(async (resolve) => {
            pool.query(`select * from testimonials where id =? `, [id])
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
    getTestimonialRecordsById: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from testimonials where school_id=? and status in("1","2","3") ORDER BY id DESC`, [schoolId])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    getTestimonialData: async function (schoolId) {
        return new Promise(async (resolve) => {
            pool.query(`select * from testimonials where school_id=? and status =1 ORDER BY id DESC`, [schoolId])
                .then(async result => {
                    resolve(result);
                })
                .catch(err => {
                    console.log(err);
                    resolve([]);
                });
        })
    },
    updateTestimonials: async function (data, testimonialId) {
        return new Promise(async (resolve, reject) => {
            pool.query("UPDATE testimonials SET ? where id = ?", [data, testimonialId])
                .then(result => {
                    resolve({ success: true, message: "Testimonials updated" });
                })
                .catch(err => {
                    console.log(err);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
    deleteTestimonial: async function (testimonialId) {
        return new Promise(async (resolve, reject) => {
            pool.query(`UPDATE  testimonials SET status=0 where id = ?`, [testimonialId])
                .then(result => {
                    // console.log(result);
                    resolve({ success: true, message: "Testimonial deleted succesfully" });
                })
                .catch(err => {
                    console.log(err);
                    reject({ success: false, message: "Something went wrong try again" });
                });
        })
    },
}  