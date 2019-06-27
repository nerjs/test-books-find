require('dotenv').config()
const redis = require('redis')

const client = redis.createClient({
    port: Number(process.env.REDIS_PORT)
})

console.log(client.connected)

module.exports = client