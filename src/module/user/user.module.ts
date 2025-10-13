import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./user.repository";
import { UserMasterEntity } from "./user-master.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserMasterEntity
        ])
    ],
    exports: [],
    providers: [
        UserService, 
        UserRepository, 
        UserMasterEntity
    ],
    controllers: [UserController]
})
export class UserModule { };