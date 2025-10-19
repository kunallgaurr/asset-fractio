import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "src/connection";
import { UserController, UserLoginHistoryController } from "./controller";
import { UserMasterEntity , UserLoginHistoryEntity, UserUpdateLogs} from "./entities";
import { UserLoginHistoryRepository, UserRepository, UserUpdateLogsRepository } from "./repositories";
import { UserLoginHistoryService, UserService } from "./services";
import { UserUpdateLogsService } from "./services/user-update-logs.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMasterEntity,
            UserLoginHistoryEntity,
            UserUpdateLogs
        ]),
        RedisModule
    ],
    exports: [],
    providers: [
        UserService, 
        UserRepository,
        UserLoginHistoryRepository,
        UserLoginHistoryService,
        UserUpdateLogsRepository,
        UserUpdateLogsService
    ],
    controllers: [
        UserController, 
        UserLoginHistoryController
    ]
})
export class UserModule { };