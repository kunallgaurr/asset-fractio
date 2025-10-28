import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserLoginHistoryEntity, UserMasterEntity, UserUpdateLogs } from "./entities";
import { UserLoginHistoryRepository, UserRepository, UserUpdateLogsRepository } from "./repositories";
import { UserUpdateLogsService } from "./services/user-update-logs.service";
import { UserLoginHistoryService, UserService } from "./services";
import { UserController, UserLoginHistoryController } from "./controller";
import { RedisModule } from "src/connection/redis";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMasterEntity,
            UserLoginHistoryEntity,
            UserUpdateLogs
        ]),
        RedisModule        
    ],
    providers: [
        UserRepository,
        UserLoginHistoryRepository,
        UserUpdateLogsRepository,
        UserUpdateLogsService,
        UserLoginHistoryService,
        UserService
    ],
    controllers: [
        UserController,
        UserLoginHistoryController
    ]
})
export class UserModule {}