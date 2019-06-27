require('dotenv').config()
const Koa = require('koa');
const koaBody = require('koa-body');
const json = require('koa-json')
const routes = require('./routes')
const errorMdw = require('./utils/error_mdw')
const app = new Koa();

// response


app.use(errorMdw)



// app.use(json())
app.use(koaBody());

app
  .use(routes.routes())
  .use(routes.allowedMethods({
      throw: true
  })); 


// app.use(async ctx => {
//     ctx.status = 404;
// })

app.listen(process.env.HTTP_PORT, err => {
    if (err) return console.error(err)
    console.log(`Started http://localhost:${process.env.HTTP_PORT}`)
});