import { Injectable } from "@nestjs/common";
import { UserRepository } from "../repositories";
import { TSignin, TSignup } from "../user.dto";
import { RedisService } from "src/connection";
import { constants, HttpResponse } from "src/utils";
import { UserMasterEntity, UserRole } from "../entities";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { createHash } from "crypto";
import { email } from "zod";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        private readonly user: UserRepository,
        private readonly redisService: RedisService,
        private readonly eventEmitter: EventEmitter2,
        private readonly jwtService: JwtService
    ) { }

    async signup({payload, header}: {payload: TSignup, header}) {
        try {
            const { name, username, email, countryCode, phoneNumber, password, type } = payload;

            const [usernameLookup, emailLookup] = await Promise.all([
                this.redisService.sIsMember(constants.REDIS_KEYS.USERNAME_SET, username),
                this.redisService.sIsMember(constants.REDIS_KEYS.EMAIL_SET, email),
            ]);

            if (usernameLookup) return HttpResponse.badRequest('Username is already taken.');
            if (emailLookup) return HttpResponse.badRequest('Email is already registered.')

            const user = new UserMasterEntity();
            user.name = name;
            user.username = username;
            user.email = email;
            user.phoneNumber = countryCode + phoneNumber;
            user.password = this.hashPassword(password);
            user.type = type;
            user.role = UserRole.USER;

            const savedUser = await this.user.save(user);

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
                    image: savedUser.image ? savedUser.image : '',
                    createdAt: savedUser.createdAt.toString(),
                    updatedAt: savedUser.updatedAt.toString()
                }, 60 * 60)
            ]);

            this.eventEmitter.emit(constants.EVENT_NAMES.USER_SIGNUP, {user, header}); // Logs
            this.eventEmitter.emit(constants.EVENT_NAMES.USER_WELCOME, user); // welcome email
            this.eventEmitter.emit(constants.EVENT_NAMES.SETTINGS_CREATE, user); // create default settings
            this.eventEmitter.emit(constants.EVENT_NAMES.PREFERENCES_CREATE, user); // create default preferences

            const token = this.jwtService.sign({ id: savedUser.id });
            return HttpResponse.success(token);
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    async signin(payload: TSignin) {
        try {
            const { uid, password } = payload;

            const user = await this.user.findOne({
                where: {
                    username: uid,
                    email: uid,
                    phoneNumber: uid
                }
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
                image: user.image ? user.image : null,
                createdAt: user.createdAt.toString(),
                updatedAt: user.updatedAt.toString()
            }, 60 * 60);

            const token = this.jwtService.sign({ id: user.id });
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
                        image: user.image ? user.image : null,
                        createdAt: user.createdAt.toString(),
                        updatedAt: user.updatedAt.toString()
                    }, 60 * 60);
                } else {
                    return HttpResponse.notFound('User not found.');
                }
            }

            return HttpResponse.success(user)
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    async updateUser(payload) {
        try {
            const { userId, email, username, phoneNumber, image, type, role, password, newPassword, confirmNewPassword } = payload;

            let user = await this.user.findOne({ where: { id: userId } });
            if (!user) return HttpResponse.notFound('User not found.');

            const [emailLookup, usernameLookup] = await Promise.all([
                email ? this.redisService.sIsMember(constants.REDIS_KEYS.EMAIL_SET, email) : null,
                username ? this.redisService.sIsMember(constants.REDIS_KEYS.USERNAME_SET, username) : null
            ]);

            if (emailLookup) return HttpResponse.badRequest('Email is already taken.');
            if (usernameLookup) return HttpResponse.badRequest('Username is already taken.');

            const data: Record<string, string> = {
                email: email ?? user.email,
                username: username ?? user.username,
                phoneNumber: phoneNumber ?? user.phoneNumber,
                image: image ?? user.image,
                type: type ?? user.type,
                role: role ?? user.role
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

                data.password = this.hashPassword(newPassword);
            }

            Promise.all([
                this.user.save(data),
                this.redisService.hSetAll(constants.REDIS_KEYS.USER_DATA + user.id, data, 60 * 60)
            ]);

            return HttpResponse.success();
        } catch (error) {
            return HttpResponse.internalServerError();
        }
    }

    async deleteUser() { };

    private hashPassword(password: string) {
        return createHash('sha256').update(password).digest('hex');
    }
}