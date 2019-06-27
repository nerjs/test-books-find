const yup = require('yup')
const RestError = require('./errors')


const matchFields = /^[a-z\_\,]{0,50}$/ 
// const matchUrl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g
const matchUrl = /^http(s)?:\/\//


exports.getBooksSchema = yup.object().shape({
    offset: yup.number().min(0).required(),
    count: yup.number().min(1).required(),
    q: yup.string(),
    q_fields: yup.string().matches(matchFields, 'Must consist of fields separated by commas'),
    order: yup.string().oneOf(['asc', 'desc']).required(),
    order_by: yup.string().oneOf(['id', 'title', 'description', 'date', 'author']).required(),
    from: yup.number().min(0),
    to: yup.number().min(0)
})

exports.postBookSchema = yup.object().shape({
    title: yup.string().min(4).max(50).required(),
    description: yup.string().min(10).max(200).required(),
    author: yup.string().min(1).required(),
    image: yup.string().matches(matchUrl)
})

exports.putBookSchema = yup.object().shape({
    id: yup.number().min(1).required(),
    title: yup.string().min(4).max(50),
    description: yup.string().min(10).max(200),
    author: yup.string().min(1),
    image: yup.string().matches(matchUrl, 'Invalid link')
})






exports.toThrow = async (schema, props) => {
    try {
        await schema.validate(props, {
            abortEarly: false
        })
    } catch(e) {
        // console.dir(e, { depth: 4 })
        throw new RestError(400, {
            type: 'validation_error',
            fields: e.inner && Array.isArray(e.inner) ? e.inner.reduce((prev, item) => {
                prev[item.path] = item.message
                return prev
            }, {}) : {}
        }, 'Validation error')
    }
}