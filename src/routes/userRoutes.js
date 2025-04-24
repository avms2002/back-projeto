const express = require('express')
const router = express.Router()
const auth = require('../middlewares/authMiddleware')
const multer = require('multer')
const { getProfile, updateProfile, updatePassword } = require('../controllers/userController')

const upload = multer({ dest: 'src/uploads/' })

router.get('/profile', auth, getProfile)
router.put('/profile', auth, upload.single('profilePic'), updateProfile)
router.put('/password', auth, updatePassword)

module.exports = router