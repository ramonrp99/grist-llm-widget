const config = require('../config/env')
const AppError = require('../core/AppError')

const validateTurnstile = async (req, res, next) => {
    const token = req.headers['cf-turnstile-token']

    if (!token) {
        return next(new AppError(400, 'Token de seguridad requerido.'))
    }

    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                secret: config.cfTurnstileSecretKey,
                response: token,
                remoteip: req.ip
            })
        })

        const result = await response.json()

        if (!result.success || result.error) {
            return next(new AppError(401, 'Token de seguridad inválido o expirado.'))
        }

        next()
    } catch (err) {
        console.error('Error al validar el token de seguridad de CloudFlare Turnstile:', err)
        next(new AppError(500, 'Error al validar el token de seguridad de CloudFlare Turnstile'))
    }

}

module.exports = { validateTurnstile }