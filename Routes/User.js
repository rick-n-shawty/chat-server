const express = require('express')
const router = express.Router()
const {Login, Register, refreshToken} = require('../Controllers/User')
router.post('/register', Register)
router.post('/login', Login)
router.get('/refresh', refreshToken)
module.exports = router 