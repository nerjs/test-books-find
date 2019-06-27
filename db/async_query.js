const pool = require('./pool')


module.exports = (sql, insert) => {
    return new Promise((resolve, reject) => {
        try {
            pool.query(sql, insert, (err, res) => {
                if (err) return reject(err)
                resolve(res)
            })
        } catch(e) {
            reject(e)
        }

    })
}