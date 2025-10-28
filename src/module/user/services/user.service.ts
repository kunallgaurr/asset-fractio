import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories";
import { TSignin, TSignup } from "../user.dto";
import { RedisService } from "src/connection/redis";
import { constants, HttpResponse } from "src/utils";
import { UserMasterEntity, UserRole } from "../entities";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { createHash } from "crypto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        private readonly user: UserRepository,
        private readonly redisService: RedisService,
        private readonly eventEmitter: EventEmitter2,
        private readonly jwtService: JwtService
    ) {
        console.log(this.redisService);
    }

    /**
     * User Registration Service
     * Handles complete user registration process including validation, data persistence, and setup
     * 
     * @param payload - User registration data
     * @param header - HTTP headers containing client information for logging
     * @returns Promise<HttpResponse> - Success with JWT token or error response
     */
    async signup({ payload, header }: { payload: TSignup, header }) {
        try {
            const { name, username, email, countryCode, phoneNumber, password, type } = payload;

            // Check for duplicate username and email using Redis sets for fast lookup
            // This prevents duplicate registrations without hitting the database
            const [usernameLookup, emailLookup] = await Promise.all([
                this.redisService.sIsMember(constants.REDIS_KEYS.USERNAME_SET, username),
                this.redisService.sIsMember(constants.REDIS_KEYS.EMAIL_SET, email),
            ]);

            // Return early if username or email already exists
            if (usernameLookup) return HttpResponse.badRequest('Username is already taken.');
            if (emailLookup) return HttpResponse.badRequest('Email is already registered.')

            const user = new UserMasterEntity();
            user.name = name;
            user.username = username;
            user.email = email;
            user.phoneNumber = countryCode + phoneNumber; // Combine country code with phone number
            user.password = this.hashPassword(password); // Hash password for security
            user.type = type;
            user.role = UserRole.USER; // Set default role as regular user

            // Save user to database and get the saved entity with generated ID and timestamps
            const savedUser = await this.user.save(user);

            // Update Redis cache and sets in parallel for optimal performance
            await Promise.all([
                this.redisService.sAdd(constants.REDIS_KEYS.USERNAME_SET, username),
                this.redisService.sAdd(constants.REDIS_KEYS.EMAIL_SET, email),
                this.redisService.hSetAll(constants.REDIS_KEYS.USER_DATA + savedUser.id, {
                    id: savedUser.id,
                    name: savedUser.name,
                    username: savedUser.username,
                    email: savedUser.email,
                    phoneNumber: savedUser.phoneNumber,
                    type: savedUser.type,
                    role: savedUser.role,
                    image: savedUser.image ? savedUser.image : '', // Handle null image
                    createdAt: savedUser.createdAt.toString(),
                    updatedAt: savedUser.updatedAt.toString()
                }, 60 * 60) // Cache expires in 1 hour (3600 seconds)
            ]);

            // Emit events for post-registration processes (handled by event listeners)
            this.eventEmitter.emit(constants.EVENT_NAMES.USER_SIGNUP, { user, header }); // Log user registration for audit trail
            this.eventEmitter.emit(constants.EVENT_NAMES.USER_WELCOME, user); // Send welcome email to new user
            this.eventEmitter.emit(constants.EVENT_NAMES.SETTINGS_CREATE, user); // Create default user settings
            this.eventEmitter.emit(constants.EVENT_NAMES.PREFERENCES_CREATE, user); // Create default user preferences

            // Generate JWT token for immediate authentication
            const token = this.jwtService.sign({ id: savedUser.id, role: user.role });
            return HttpResponse.success(token);
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    async signin({ payload, header }: { payload: TSignin, header }) {
        try {
            const { uid, password } = payload;

            const user = await this.user.findOne({
                where: [
                    { username: uid },
                    { email: uid },
                    { phoneNumber: uid }
                ]
            });

            if (!user) return HttpResponse.notFound('User not found.');

            const hashPassword = this.hashPassword(password);
            if (hashPassword !== user.password) return HttpResponse.badRequest('Incorrect password.')

            this.redisService.hSetAll(constants.REDIS_KEYS.USER_DATA + user.id, {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                type: user.type,
                role: user.role,
                image: user.image ? user.image : '',
                createdAt: user.createdAt.toString(),
                updatedAt: user.updatedAt.toString()
            }, 60 * 60);

            const token = this.jwtService.sign({ id: user.id, role: user.role });

            this.eventEmitter.emit(constants.EVENT_NAMES.USER_SIGNIN, { user, header }); // Log user registration for audit trail
            // this.eventEmitter.emit(constants.EVENT_NAMES.USER_WELCOME, user); // Send welcome email to new user
            this.eventEmitter.emit(constants.EVENT_NAMES.SETTINGS_CREATE, user); // Create default user settings
            this.eventEmitter.emit(constants.EVENT_NAMES.PREFERENCES_CREATE, user);

            return HttpResponse.success(token);
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    async requestOtp() { }

    async verifyOtp() { }

    async forgotPassword() { }

    async resetPassword() { }

    async getUser(payload) {
        try {
            const { userId } = payload;

            const key = constants.REDIS_KEYS.USER_DATA + userId;

            let user: UserMasterEntity | null | Record<string, string> = await this.redisService.hGetAll(key);
            if (!user || Object.keys(user).length === 0) {
                user = await this.user.findOne({ where: { id: userId } });

                if (user) {
                    this.redisService.hSetAll(key, {
                        id: user.id,
                        name: user.name,
                        username: user.username,
                        email: user.email,
                        phoneNumber: user.phoneNumber,
                        type: user.type,
                        role: user.role,
                        image: user.image ? user.image : '',
                        createdAt: user.createdAt.toString(),
                        updatedAt: user.updatedAt.toString()
                    }, 60 * 60);
                } else {
                    return HttpResponse.notFound('User not found.');
                }
            }

            return HttpResponse.success(user);
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    async updateUser(payload) {
        try {
            const { name, userId, email, username, phoneNumber, image, type, password, newPassword, confirmNewPassword } = payload;

            let user = await this.user.findOne({ where: { id: userId } });
            if (!user) return HttpResponse.notFound('User not found.');

            if (email) {
                const emailLookup = await this.redisService.sIsMember(constants.REDIS_KEYS.EMAIL_SET, email);
                if (emailLookup) return HttpResponse.badRequest('Email is already taken.');

                const key = constants.REDIS_KEYS.EMAIL_SET;
                this.redisService.sAdd(key, email);
                this.redisService.sRem(key, user.email);

                user.email = email;

                this.eventEmitter.emit([
                    constants.EVENT_NAMES.USER_EMAIL_UPDATED,
                    constants.EVENT_NAMES.USER_UPDATED
                ], {
                    userId,
                    key: 'email',
                    value: email
                });
            }

            if (username) {
                const usernameLookup = await this.redisService.sIsMember(constants.REDIS_KEYS.USERNAME_SET, username);
                if (usernameLookup) return HttpResponse.badRequest('Username is already taken.');

                const key = constants.REDIS_KEYS.USERNAME_SET;
                this.redisService.sAdd(key, username);
                this.redisService.sRem(key, user.username);

                user.username = username;

                this.eventEmitter.emit([
                    constants.EVENT_NAMES.USER_USERNAME_UPDATED,
                    constants.EVENT_NAMES.USER_UPDATED
                ], {
                    userId,
                    key: 'username',
                    value: username
                });
            }

            if (password) {
                const hashPassword = this.hashPassword(password);
                if (hashPassword !== user.password) return HttpResponse.badRequest('Incorrect password.');

                if (!newPassword || !confirmNewPassword) {
                    return HttpResponse.badRequest('New password and confirm new password are required.');
                }

                if (newPassword !== confirmNewPassword) {
                    return HttpResponse.badRequest('New password and confirm new password do not match.');
                }

                user.password = this.hashPassword(newPassword);

                this.eventEmitter.emit(constants.EVENT_NAMES.USER_UPDATED, {
                    userId,
                    key: 'password',
                    value: this.hashPassword(newPassword)
                });
            }

            if (name) {
                user.name = name;

                this.eventEmitter.emit(constants.EVENT_NAMES.USER_UPDATED, {
                    userId,
                    key: 'name',
                    value: name
                });
            }

            if (phoneNumber) {
                user.phoneNumber = phoneNumber;

                this.eventEmitter.emit(constants.EVENT_NAMES.USER_UPDATED, {
                    userId,
                    key: 'phoneNumber',
                    value: phoneNumber
                });
            }

            if (image) {
                user.image = image;

                this.eventEmitter.emit(constants.EVENT_NAMES.USER_UPDATED, {
                    userId,
                    key: 'phoneNumber',
                    value: phoneNumber
                });
            }

            if (type) {
                user.type = type;

                this.eventEmitter.emit(constants.EVENT_NAMES.USER_UPDATED, {
                    userId,
                    key: 'type',
                    value: type
                });
            }

            Promise.all([
                this.user.save(user),
                this.redisService.hSetAll(constants.REDIS_KEYS.USER_DATA + user.id, user, 60 * 60)
            ]);

            return HttpResponse.success(user);
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    async deleteUser() { };

    private hashPassword(password: string) {
        return createHash('sha256').update(password).digest('hex');
    }
}