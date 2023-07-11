const express = require('express')
const router = express.Router()
const {Login, Register, refreshToken, getAllUsers} = require('../Controllers/User')
router.post('/register', Register)
router.get('/', getAllUsers)
router.post('/login', Login)
router.get('/refresh', refreshToken)
module.exports = router 