const { Router } = require('express')
const aiController = require('../controllers/aiController')
const { validateChatRequest } = require('../middlewares/validateRequests')
const { validateTurnstile } = require('../middlewares/validateTurnstile')

const router = Router()

router.get('/models', aiController.getModels)
router.post('/chat', validateTurnstile, validateChatRequest, aiController.generateCompletion)

module.exports = router