require('dotenv').config()
const mysql = require('mysql')
const { exec } = require('child_process')



const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    COUNT_TEST_ROWS
} = process.env 

const ROWS_PER_PROCESS = 10000


const childInserts = count => new Promise((resolve, reject) => {
   
    exec(`node ./scripts/add_list ${count}`, (err, stdout) => {
        if (err) return reject(err)
        resolve(stdout)
    }); 
})

const pool = mysql.createPool({
    connectionLimit : 100,
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


const createTable = async () => {
    const sqlDrop = 'DROP TABLE books;'

    // const sql = `
    //     CREATE TABLE books (
    //         id int(20) NOT NULL AUTO_INCREMENT,
    //         title varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    //         author varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    //         description text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    //         date datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
    //         image varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
    //         PRIMARY KEY (id)
    //     ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    // `
    const sql = `
        CREATE TABLE books (
            id int(20) NOT NULL AUTO_INCREMENT,
            title varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
            author varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
            description text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
            date datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            image varchar(150) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
            PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
    `
    
    try {
        await query(sqlDrop)
    } catch(e) {}

    try {
        await query(sql)
    } catch(e) {
        console.error(e)
    }
}


const createItems = () => {
    const fns = []

    let c, d;

    if (ROWS_PER_PROCESS >= COUNT_TEST_ROWS) {
        d = 0;
        c = +COUNT_TEST_ROWS
    } else {
        c = parseInt(COUNT_TEST_ROWS / ROWS_PER_PROCESS)
        d = COUNT_TEST_ROWS % ROWS_PER_PROCESS
    }

    if (c > 0) {
        for(let i = 0; i < c; i++) {
            fns.push(childInserts(ROWS_PER_PROCESS))
        }
    }

    if (d > 0) {
        fns.push(childInserts(d))
    }

    console.log({ c, d })

    return Promise.all(fns)
}


console.time('add fake books')

pool.query('show databases', async (err, data) => {
    if (err) return console.error(err)

    const db = data.find(o => o.Database == DB_NAME)
    if (!db) return console.error(`db ${DB_NAME} not found`) 

    await createTable()
    try {
       await createItems()
       
       const res = await query('select count(*) from books')
       console.log(`${res[0]['count(*)']}/${COUNT_TEST_ROWS} rows was created!`)
    } catch(e) {
        console.log(e)
    }
    
    pool.end()
    console.timeEnd('add fake books')
})


