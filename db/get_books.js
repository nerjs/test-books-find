const moment = require('moment')
const asyncQuery = require('./async_query')
const getCount = require('./get_count')


module.exports = async ({
    offset, 
    count, 
    from, 
    to,
    q,
    q_fields, 
    order,
    order_by
}) => {
    
    let where = [], 
        orderSql = '', 
        d, fields=[]; 
    const insert = [], 
        limit = 'LIMIT ?,?'; 

    if (q) {
        if (q_fields) {
            fields = q_fields.split(',').filter( v => ['title', 'description', 'author'].indexOf(v) >= 0)

        }

        if (fields.length == 0) {
            fields.push('title')
        }

        fields.forEach(f => {
            where.push('?? LIKE ?')
            insert.push(f, `%${q}%`)
        })

    } 

    if (from) {
        console.log('11111111111')
        console.log((new Date(from)))
        console.log(moment(from))
        console.log(moment(from).format('YYYY-MM-DD hh:mm:ss'))
        where.push(`?? >= ? `)
        insert.push('date')
        insert.push(moment(from).format('YYYY-MM-DD hh:mm:ss'))
    }

    if (to) {
        where.push(`?? <= ?`)
        insert.push('date')
        insert.push(moment(to).format('YYYY-MM-DD hh:mm:ss'))
    }

    if (where.length > 0) {
        where = `WHERE ${where.join(' AND ')}`
    } else {
        where = ''
    }

    if (order_by) {
        orderSql = `ORDER by ?? ${order == 'asc' ? 'ASC' : 'DESC'}`
        insert.push(order_by)
    }

    insert.push(offset)
    insert.push(count)



    const sql = `SELECT * FROM books ${where} ${orderSql} ${limit};`

    console.log(require('mysql').format(sql, insert))

    const res = {
       result: await asyncQuery(sql, insert, true),
       all: await getCount()
    } 

    res.count = res.result.length

    return res
}