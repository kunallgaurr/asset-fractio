import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from 'src/module/address';
import { EmailLogEntity, EmailTemplateEntity, SmsLogEntity, SmsTemplateEntity } from 'src/module/communication/entities';
import { UserPreferencesEntity, UserSettingsEntity } from 'src/module/settings-and-preferences/entities';
import { UserLoginHistoryEntity, UserMasterEntity, UserUpdateLogs } from 'src/module/user/entities';
import { constants } from 'src/utils';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT') as number,
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                entities: [
                    UserMasterEntity,
                    UserLoginHistoryEntity,
                    EmailTemplateEntity,
                    EmailLogEntity,
                    SmsTemplateEntity,
                    SmsLogEntity,
                    UserPreferencesEntity,
                    UserSettingsEntity,
                    UserUpdateLogs,
                    AddressEntity
                ],
                synchronize: constants.SYNC_DB,
                ssl: true
            }),
        }),
    ]
})
export class PostgresModule { }
