const express = require('express');

const router = express.Router();


router.post('/signup')
router.post('/login')
router.post('/logout')
router.post('/refresh-token')
router.get('/me')


module.exports = router;