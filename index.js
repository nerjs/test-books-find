require('dotenv').config()
const Koa = require('koa');
const koaBody = require('koa-body');
const routes = require('./routes')
const errorMdw = require('./utils/error_mdw')
const { readyCache } = require('./db/cache')
const { readyPool } = require('./db/pool')
const app = new Koa();




app.use(errorMdw)


app.use(koaBody());

app
  .use(routes.routes())
  .use(routes.allowedMethods({
      throw: true
  })); 



(async() => {

  await Promise.all([
    readyCache(),
    readyPool()
  ])

  console.log('DB/Cache ready')

  app.listen(process.env.HTTP_PORT, err => {
      if (err) return console.error(err)
      console.log(`Started http://localhost:${process.env.HTTP_PORT}`)
  });
})()

