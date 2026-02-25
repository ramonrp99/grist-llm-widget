const { success } = require("zod")

class AppResponse {
    constructor(statusCode = 200, data = {}) {
        this.statusCode = statusCode
        this.data = data
    }

    send(res) {
        return res.status(this.statusCode).json({
            success: true,
            data: this.data
        })
    }
}

module.exports = AppResponse