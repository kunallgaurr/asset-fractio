import { Body, Controller, Get, Header, Headers, Param, ParseIntPipe, Post, Put, Query, UsePipes } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { signinSchema, signupSchema, type TSignin, type TSignup } from "../user.dto";
import { ZodValidationPipe } from "src/helpers/pipes";

/**
 * User Controller - Handles all user-related HTTP endpoints
 * Base route: /user
 */
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    /**
     * User Registration Endpoint
     * POST /user/signup
     * 
     * Creates a new user account with validation and automatic setup
     * 
     * @param body - User registration data (TSignup type)
     *   - name: string - User's full name
     *   - username: string - Unique username
     *   - email: string - Valid email address
     *   - countryCode: string - Country code for phone
     *   - phoneNumber: string - Phone number
     *   - password: string - User password
     *   - type: string - User type
     * 
     * @param header - HTTP headers containing client information
     *   - x-client-type: Client platform (web/mobile/desktop)
     *   - x-ip-address: User's IP address
     *   - x-latitude: User's latitude (optional)
     *   - x-longitude: User's longitude (optional)
     *   - x-browser: Browser information (optional)
     *   - x-operating-system: OS information (optional)
     *   - x-device-info: Device information (optional)
     *   - x-device-model: Device model (optional)
     * 
     * @returns Promise<HttpResponse> - Success response with JWT token or error response
     *   - Success: { code: 'AF_OK_200', message: string, result: string } (JWT token)
     *   - Error: { code: 'AF_BR_400', message: string, result: null } (validation/duplicate errors)
     * 
     * @throws Validation errors for invalid input data
     * @throws Duplicate username/email errors
     * @throws Internal server errors for system failures
     * 
     * Side effects:
     * - Creates user record in database
     * - Adds username/email to Redis sets for uniqueness checks
     * - Caches user data in Redis
     * - Emits USER_SIGNUP event for logging
     * - Emits USER_WELCOME event for welcome email
     * - Emits SETTINGS_CREATE event for default settings
     * - Emits PREFERENCES_CREATE event for default preferences
     */
    @Post('signup')
    @UsePipes(new ZodValidationPipe(signupSchema))
    async signup(
        @Body() body: TSignup,
        @Headers() header
    ) {
        return await this.userService.signup({ payload: body, header });
    }

    /**
     * User Authentication Endpoint
     * POST /user/signin
     * 
     * Authenticates a user and returns a JWT token for session management
     * 
     * @param body - User login credentials (TSignin type)
     *   - uid: string - Username, email, or phone number
     *   - password: string - User password
     * 
     * @returns Promise<HttpResponse> - Success response with JWT token or error response
     *   - Success: { code: 'AF_OK_200', message: string, result: string } (JWT token)
     *   - Error: { code: 'AF_NF_404', message: 'User not found.', result: null }
     *   - Error: { code: 'AF_BR_400', message: 'Incorrect password.', result: null }
     * 
     * @throws User not found errors for invalid credentials
     * @throws Password mismatch errors
     * @throws Internal server errors for system failures
     * 
     * Side effects:
     * - Caches user data in Redis for faster subsequent requests
     * - Updates user session information
     */
    @Post('signin')
    @UsePipes(new ZodValidationPipe(signinSchema))
    async signin(@Body() body: TSignin, @Headers() header) {
        return await this.userService.signin({ payload: body, header });
    }

    /**
     * Get User Profile Endpoint
     * GET /user/:id
     * 
     * Retrieves user profile information by user ID
     * 
     * @param id - User ID (parsed as integer)
     * 
     * @returns Promise<HttpResponse> - Success response with user data or error response
     *   - Success: { code: 'AF_OK_200', message: string, result: UserMasterEntity | Record<string, string> }
     *   - Error: { code: 'AF_NF_404', message: 'User not found.', result: null }
     * 
     * @throws User not found errors for invalid user ID
     * @throws Internal server errors for system failures
     * 
     * Data retrieval strategy:
     * - First checks Redis cache for user data
     * - Falls back to database if cache miss
     * - Updates Redis cache after database fetch
     * - Returns cached data for subsequent requests
     */
    @Get('/fetch-user')
    async getUser(@Query() query) {
        return await this.userService.getUser(query)
    }

    @Put('/update-user')
    async updateUser(@Body() body) {
        return await this.userService.updateUser(body)
    }
}