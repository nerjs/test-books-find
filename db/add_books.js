const asyncQuery = require('./async_query')
const getCount = require('./get_count') 



module.exports = async ({
    title, 
    description, 
    author, 
    image
}) => {

    const { insertId } = await asyncQuery('INSERT INTO books SET ?;', {
        title, 
        author, 
        description, 
        image
    })

    const result = await asyncQuery('SELECT * FROM books WHERE ??=? LIMIT 1', ['id', insertId])
    
    return {
        result: result[0],
        all: await getCount(),
        count: 1
    }
}