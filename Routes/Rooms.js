const express = require('express')
const router = express.Router()
const {createChatRoom, deleteChatRoom, getAllRooms, getRoom} = require('../Controllers/chatRooms')
router.post('/create', createChatRoom)
router.delete('/:id', deleteChatRoom)
router.get('/', getAllRooms)
router.get('/:id', getRoom)

module.exports = router 