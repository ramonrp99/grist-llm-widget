const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let ok = err.ok || false
    let message = err.message || 'Internal Server Error'
    let details = err.details || null

    res.status(statusCode).json({
        ok: ok,
        message: message,
        ...(details && { details: details })
    })
}

module.exports = { errorHandler }