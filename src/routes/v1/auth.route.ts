import { Router } from 'express'
import validate from '../../middlewares/validate'
import { register, login, logout, refreshTokens, forgotPassword, resetPassword, verifyEmail } from '../../validations/auth.validation'
import { authController } from '../../controllers'
import auth from '../../middlewares/auth'

const router = Router()

router.post('/register', validate(register), authController.register)
router.post('/login', validate(login), authController.login)
router.post('/logout', validate(logout), authController.logout)
router.post('/refresh-tokens', validate(refreshTokens), authController.refreshTokens)
router.post('/forgot-password', validate(forgotPassword), authController.forgotPassword)
router.post('/reset-password', validate(resetPassword), authController.resetPassword)
router.post('/send-verification-email', auth(), authController.sendVerificationEmail)
router.post('/verify-email', validate(verifyEmail), authController.verifyEmail)

export default router