import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

export enum UpiVerifcationStatusEnum {
    PENDING = 'PENDING', 
    VERIFIED = 'VERIFIED', 
    FAILED = 'FAILED'
}

@Entity('upi_verification')
export class UpiVerificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column({ name: 'user_id', type: 'int' })
    userId: number;

    @Column({ name: 'upi_id', type: 'varchar', length: 100 })
    upiId: string; // e.g. user@okicici

    @Column({ name: 'account_holder_name', type: 'varchar', length: 150, nullable: true })
    accountHolderName?: string;

    @Column({ name: 'status', type: 'enum', enum: UpiVerifcationStatusEnum, default: 'PENDING' })
    status: 'PENDING' | 'VERIFIED' | 'FAILED';

    @Column({ type: 'varchar', length: 255, nullable: true })
    remarks?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
