import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPreferencesEntity, UserSettingsEntity } from "./entities";
import { UserPreferencesRepository, UserSettingsRepository } from "./repositories";
import { PreferencesService, SettingsService } from "./services";
import { PreferencesController, SettingsController } from "./controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserPreferencesEntity,
            UserSettingsEntity
        ])
    ],
    providers: [
        UserSettingsRepository,
        UserPreferencesRepository,
        SettingsService,
        PreferencesService
    ],
    controllers: [
        SettingsController, 
        PreferencesController
    ]
})
export class SettingsAndPreferencesModule {}