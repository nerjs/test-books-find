const RestError = require('../utils/errors')
const asyncQuery = require('./async_query')
const getCount = require('./get_count') 



module.exports = async ({
    id,
    title, 
    description, 
    author, 
    image
}) => {

    const [ book ] = await asyncQuery('SELECT * FROM books WHERE ??=? LIMIT 1', ['id', id])

    if (!book) throw new RestError(404, {}, 'Book not found')

    console.log(book)

    const { changedRows } = await asyncQuery('UPDATE books SET ? WHERE ?? = ?;', [{
        title, 
        description,
        author, 
        image
    }, 'id', id])


    
    
    return {
        result: { ...book, title, description, author, image}, 
        success: changedRows > 0,
        all: await getCount(),
        count: 1
    }
}