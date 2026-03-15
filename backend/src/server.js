const express = require('express')
const cors = require('cors')
const config = require('./config/env')
const { aiLimiter } = require('./middlewares/rateLimit')
const { corsOptions } = require('./middlewares/cors')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/ai', aiLimiter, require('./routes/aiRoutes'))

// Middleware global para manejo de errores
app.use(errorHandler)

app.listen(config.port, () => {
    console.log(`Server escuchado en el puerto ${config.port}`)
})