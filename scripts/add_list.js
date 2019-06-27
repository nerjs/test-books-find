require('dotenv').config()
const mysql = require('mysql')
const moment = require('moment')
const faker = require('faker');

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
} = process.env 


const pool = mysql.createPool({
    connectionLimit : 10,
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
})

const query = function() {
    const args = Array.from(arguments)

    return new Promise((resolve, reject) => {
        args.push((err, res) => {
            if (err) return reject(err)
            resolve(res)
        })
        pool.query.apply(pool, args)
    })
}



const getFake = () => ({
        title: faker.lorem.words(3),
        author: faker.name.findName(),
        description: faker.lorem.sentences(20),
        date: faker.date.between(0, new Date()),
        image: faker.image.abstract(500, 500)
    })

const createItem = () => {
    const { date, ...obj} = getFake()

    const sql = `
        INSERT INTO books SET ?;
    `
    return query(sql, { ...obj, date: moment(date).format('YYYY-MM-DD hh:mm:ss')})
}

const createItems = c => new Promise((resolve) => {
    let count = 0


    for (let i = 0; i < c; i++) {
        createItem().finally(() => {
            count++;
            if (count == c) resolve()
        })
    }

})

const count = Number(process.argv[2])
if (!isNaN(count)) {
    pool.query('show databases', async err => {
        if (err) return console.error(err)


        try {
            await createItems(count) 
        } catch(e) {
            console.log(e)
        }

        pool.end()

    })
}
