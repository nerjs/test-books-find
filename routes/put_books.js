const { parsePostData } = require('../utils/parse_args')
const RestError = require('../utils/errors')
const { putBookSchema, toThrow } = require('../utils/validate')
const { editBook } = require('../db')

module.exports = async ctx => {
    const props = parsePostData(ctx.request.body, ['id', 'title', 'author', 'description', 'image'])
    
    props.id = parseInt(ctx.params.id)
    
    await toThrow(putBookSchema, props) 
    
    
    try {
        ctx.body = await editBook(props) 
     } catch(e) {
        if (e instanceof RestError) throw e
        throw new RestError(500, {}, e.message)
     }
}