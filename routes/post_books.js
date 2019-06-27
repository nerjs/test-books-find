const { parsePostData } = require('../utils/parse_args')
const RestError = require('../utils/errors')
const { postBookSchema, toThrow } = require('../utils/validate')
const { addBook } = require('../db')

module.exports = async ctx => {
    const props = parsePostData(ctx.request.body, ['title', 'author', 'description', 'image'])
    // const props = ctx.request.body && typeof ctx.request.body == 'object' ? ctx.request.body : {}
    
    
    await toThrow(postBookSchema, props) 
    

    try {
        ctx.body = await addBook(props) 
     } catch(e) {
        if (e instanceof RestError) throw e
        throw new RestError(500, {}, e.message)
     }
}