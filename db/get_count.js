const asyncQuery = require('./async_query')

module.exports = async () => {

    const res = await asyncQuery('SELECT count(id) AS count FROM books', [], true)
    return res && res[0] && res[0].count ? res[0].count : 0
}