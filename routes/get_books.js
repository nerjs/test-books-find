const { parseGetData } = require('../utils/parse_args')
const RestError = require('../utils/errors')
const { getBooksSchema, toThrow } = require('../utils/validate')
const { getBooks } = require('../db')

const defaultProps = {
    offset: 0,
    count: 20,
    // from : timestamp
    // to : timestamp
    q: '',
    q_fields: '',
    order_by: 'id',
    order: 'asc'
}

module.exports = async ctx => {
    const props = parseGetData( defaultProps, ctx.query, ['offset', 'count', 'from', 'to'])
    
    if (props.from && 
        props.to && 
        props.from >= props.to) throw new RestError(400, {
            type: 'validation_error', 
            fields: {
                from: 'field from must be less than to',
                to: 'field to must be greater than from'
            }
        }, 'Validation error')

    await toThrow(getBooksSchema, props) 


    try {
       ctx.body = await getBooks(props) 
    } catch(e) {
        if (e instanceof RestError) throw e
        throw new RestError(500, {}, e.message)
    }
    
}