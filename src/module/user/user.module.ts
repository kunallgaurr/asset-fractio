import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/user.repository";
import { UserMasterEntity } from "./entities/user-master.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "src/connection";
import { UserLoginHistoryEntity } from "./entities";
import { UserLoginHistoryRepository } from "./repositories/user-login-history.repository";
import { UserLoginHistoryService } from "./services/user-login-history.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMasterEntity,
            UserLoginHistoryEntity
        ]),
        RedisModule
    ],
    exports: [],
    providers: [
        UserService, 
        UserRepository,
        UserLoginHistoryRepository,
        UserLoginHistoryService
    ],
    controllers: [UserController]
})
export class UserModule { };