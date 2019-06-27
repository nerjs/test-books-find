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
        d = new Date(from)
        if (d.getTime() > 0) {
            where.push(`?? >= ?? `)
            insert.push('date')
            insert.push(d)
        }
    }

    if (to) {
        d = new Date(to)
        if (d.getTime() > 0) {
            where.push(`?? <= ??`)
            insert.push('date')
            insert.push(d)
        }
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


    const res = {
       result: await asyncQuery(sql, insert),
       all: await getCount()
    } 

    res.count = res.result.length

    return res
}