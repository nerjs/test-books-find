const RestError = require('./errors')




module.exports = async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        console.log(err.message, err.status)
        ctx.status = err.status || 500
        if (err instanceof RestError) {
            const error = {
                message: err.message
            }

            if (err.data && typeof err.data == 'object') {
                Object.keys(err.data).forEach(key => {
                    error[key] = err.data[key]
                })
            }

            ctx.body = { error }
            console.log(ctx)
        } else {
            ctx.body = err.message
        }
    }
}
