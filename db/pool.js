const mysql = require('mysql')




const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME
} = process.env 



const pool = mysql.createPool({
    connectionLimit : 100,
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
})


module.exports = pool 

module.exports.readyPool = () => new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
        if (err) return reject(err)
        resolve()
        conn.release()
    })
})

