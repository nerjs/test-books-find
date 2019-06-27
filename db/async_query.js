const pool = require('./pool')
const { getCache, setCache, clearCache } = require('./cache')

const query = (sql, insert) => {
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


module.exports = async (sql, insert=[], cached, removeAfterSuccess) => {
    if (cached) {
        const cachedData = await getCache(sql, insert) 
        if (cachedData) {
            try {
                return JSON.parse(cachedData)
            } catch(e) {
                console.error(e)
            }
        }
    }

    const res = await query(sql, insert) 

    if (removeAfterSuccess) {
        await clearCache()
    }

    if (cached) {
        await setCache(sql, insert, JSON.stringify(res))
    }

    return res
}