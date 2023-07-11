const router = require('express').Router()

const { getAllChats, createGroupChat, createDmChat } = require('../Controllers/Chat')

router.post('/create/group', createGroupChat)
router.get('/', getAllChats)
router.post('/create/dm', createDmChat)

module.exports = router