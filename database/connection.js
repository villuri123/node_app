const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
let pool;
module.exports = {
    getMysqlPool: function () {
        if (pool) return pool;
        pool = mysql.createPool({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            multipleStatements: true,
            supportBigNumbers: true,
            //connectionLimit:100,
            acquireTimeout: 60 * 60 * 1000,
            connectTimeout: 60 * 60 * 1000,
            timeout: 60 * 60 * 1000,
            dateStrings: true
        });
        pool.query = util.promisify(pool.query).bind(pool);
        return pool;
    }
};