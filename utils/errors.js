const { STATUS_CODES } = require('http')

class RestError extends Error {
    constructor(code, data, mess) {
        super(mess || STATUS_CODES[(code || 500)] || 'Something went wrong') 
        this.status = code || 500 
        this.data = data 

        this.name = 'RestError'
    }
}

module.exports = RestError
