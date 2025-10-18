import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum LoginClient {
    WEB = 'WEB',
    DESKTOP = 'DESKTOP',
    MOBILE = 'MOBILE',
}

export enum LoginType {
    SIGNIN = 'SIGNIN',
    SIGNUP = 'SIGNUP',
}

@Entity('user_login_history')
export class UserLoginHistoryEntity {
    @PrimaryGeneratedColumn({
        name: 'id',
        type: 'int',
        unsigned: true
    })
    id: number;

    @Column({
        name: 'user_id',
        type: 'int',
        unsigned: true
    })
    userId: number;

    @Column({
        name: 'client_type',
        type: 'enum',
        enum: LoginClient,
        nullable: true
    })
    clientType: LoginClient;

    @Column({
        name: 'type',
        type: 'enum',
        enum: LoginType,
        nullable: true
    })
    type: LoginType;

    @Column({
        name: 'ip_address',
        type: 'varchar',
        nullable: true
    })
    ipAddress: string;

    @Column({
        name: 'latitude',
        type: 'decimal',
        nullable: true
    })
    latitude: number;

    @Column({
        name: 'longitude',
        type: 'decimal',
        nullable: true
    })
    longitude: number;

    @Column({
        name: 'browser_info',
        type: 'varchar',
        nullable: true
    })
    browserInfo: string;

    @Column({
        name: 'os_info',
        type: 'varchar',
        nullable: true
    })
    osInfo: string;

    @Column({
        name: 'device_info',
        type: 'varchar',
        nullable: true
    })
    deviceInfo: string;

    @Column({
        name: 'device_type',
        type: 'varchar',
        nullable: true
    })
    deviceType: string;

    @Column({
        name: 'device_name',
        type: 'varchar',
        nullable: true
    })
    deviceName: string;

    @Column({
        name: 'device_model',
        type: 'varchar',
        nullable: true
    })
    deviceModel: string;

    @Column({
        name: 'device_token',
        type: 'varchar',
        nullable: true
    })
    deviceToken: string;

    @CreateDateColumn({
        name: 'created_at',
        default: new Date()
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        default: new Date()
    })
    updatedAt: Date;
}