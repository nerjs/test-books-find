const merge = require('merge')


exports.parseGetData = (def={}, props={}, toNumber=[]) => {
    const res = merge({}, def, props)

    toNumber.forEach(key => {
        if (!res[key]) return;
        res[key] = Number(res[key])
        
    })


    return res;
}

exports.parsePostData = (args, fields=[]) => {
    const res = args && typeof args == 'object' ? args : {}
    Object.keys(res).forEach(key => {
        if (fields.indexOf(key) < 0) {
            delete res[key]
        }
    })
    return res;
}