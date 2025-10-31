import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "src/connection/redis";
import { AssetController } from "./controllers";
import { AssetDocumentsRepository, AssetMasterRepository, AssetUpdateLogsRepository } from "./repositories";
import { AssetService } from "./services";
import { AssetDocumentsEntity, AssetMasterEntity, AssetUpdateLogsEntity } from "./entities";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AssetMasterEntity,
            AssetDocumentsEntity,
            AssetUpdateLogsEntity
        ]),
    ],
    providers: [
        AssetMasterRepository,
        AssetDocumentsRepository,
        AssetUpdateLogsRepository,
        AssetService
    ],
    controllers: [
        AssetController
    ]
})
export class AssetModule {}