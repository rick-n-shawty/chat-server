const router = require('express').Router()
const { postMessage, getAllMessages } = require('../Controllers/messages')
router.post('/send', postMessage)
router.get('/:id', getAllMessages)
module.exports = router 