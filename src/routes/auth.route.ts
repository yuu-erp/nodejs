import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller'
import { UserRepository } from '../repositories/user.repository'
import { LoggerService } from '../services/logger.service'
import { PrismaService } from '../services/prisma.service'

const router = Router()

const prismaService = new PrismaService()
const logger = new LoggerService()
const userRepository = new UserRepository(prismaService)
const authController = new AuthController(userRepository, logger)

/**
 * @route POST /register
 * @group Auth - User authentication
 * @summary Register a new user
 * @param {object} req.body.required - User registration info (e.g. email, password)
 * @returns {201} User registered successfully
 * @returns {400} Invalid input or user already exists
 */
router.post('/register', authController.register)

/**
 * @route POST /login
 * @group Auth - User authentication
 * @summary Log in a user and issue tokens
 * @param {object} req.body.required - Login credentials (e.g. email, password)
 * @returns {200} Tokens issued successfully
 * @returns {401} Invalid credentials
 */
router.post('/login', authController.login)

/**
 * @route POST /refresh-token
 * @group Auth - Token management
 * @summary Refresh access token using refresh token
 * @param {object} req.body.required - Refresh token
 * @returns {200} New access token issued
 * @returns {401} Invalid or expired refresh token
 */
router.post('/refresh-token', authController.refreshToken)

/**
 * @route POST /logout
 * @group Auth - User authentication
 * @summary Log out user and revoke tokens
 * @param {object} req.body.required - May contain refresh token to revoke
 * @returns {200} Logged out successfully
 * @returns {400} Error while logging out
 */
router.post('/logout', authController.logout)

export default router
