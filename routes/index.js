const Router = require('koa-router');
const RestError = require('../utils/errors')

const router = new Router();


router.get('/books', require('./get_books'))
    .post('/books', require('./post_books'))
    .put('/books/:id', require('./put_books'))
    .all('*', async (ctx, next) => {
        throw new RestError(404)
    })



module.exports = router
