require('dotenv').config()
const mysql = require('mysql')
const redis = require('redis')


const {
    REDIS_HOST,
    REDIS_PORT, 
    REDIS_CACHE_TIME
} = process.env

const client = redis.createClient({
    host: REDIS_HOST,
    port: Number(REDIS_PORT)
})





exports.readyCache = () => new Promise((resolve, reject) => {
    if (client.connected) return resolve(client)
    let ready, error;

    ready = () => {
        client.removeListener('error', error)
        resolve()
    }

    error = err => {
        client.removeListener('ready', ready)
        reject(err)
    }

    client.once('ready', ready)

    client.once('error', error)
})


exports.getCache = (sql, insert) => new Promise((resolve, reject) => {
    if (!client.connected) return reject(new Error('Redis was not connected'))
    client.get(mysql.format(sql, insert), (err, res) => {
        if (err) return reject(err)
        resolve(res)
    })
})

exports.setCache = (sql, insert, value) => new Promise((resolve, reject) => {
    if (!client.connected) return reject(new Error('Redis was not connected'))
    client.set(mysql.format(sql, insert), value, 'EX', Number(REDIS_CACHE_TIME), (err, res) => {
        if (err) return reject(err)
        resolve(res)
    })
})

exports.clearCache = () => new Promise((resolve, reject) => {
    if (!client.connected) return reject(new Error('Redis was not connected'))
    client.flushall((err, res) => {
        if (err) return reject(err)
        resolve(res)
    })
})