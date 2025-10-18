import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SPV = 'SPV'
};

export enum UserType {
    INDIVIDUAL = 'INDIVIDUAL',
    NON_INDIVIDUAL = 'NON INDIVIDUAL'
};

@Entity('user_master')
export class UserMasterEntity {
    @PrimaryGeneratedColumn({ 
        name: 'id', 
        type: 'int', 
        unsigned: true 
    })
    id: number;

    @Column({ 
        name: 'name', 
        type: 'varchar', 
        nullable: false 
    })
    name: string;

    @Column({ 
        name: 'username', 
        type: 'varchar', 
        nullable: false, 
        unique: true 
    })
    username: string;

    @Column({ 
        name: 'email', 
        type: 'varchar', 
        nullable: false, 
        unique: true 
    })
    email: string;

    @Column({ 
        name: 'phone_number ', 
        type: 'varchar', 
        nullable: false 
    })
    phoneNumber: string;

    @Column({ 
        name: 'password', 
        type: 'varchar', 
        nullable: false 
    })
    password: string;

    @Column({ 
        name: 'image', 
        type: 'varchar', 
        nullable: true 
    })
    image: string;

    @Column({ 
        name: 'type', 
        type: 'enum', 
        enum: UserType, 
        default: UserType.INDIVIDUAL, 
        nullable: false 
    })
    type: UserType;

    @Column({ 
        name: 'role', 
        type: 'enum', 
        enum: UserRole,
        default: UserRole.USER, 
        nullable: false, 
    })
    role: UserRole;

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