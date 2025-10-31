import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm";

export enum AssetStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    IFO_APPROVED = 'IFO APPROVED',
    DOCUMENTS_APPPROVED = 'DOCUMENTS APPPROVED'
}

@Entity('asset_master')
export class AssetMasterEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'onboarded_by', type: 'int', nullable: false })
    onboardedBy: number;

    @Column({ type: 'simple-array', nullable: true })
    images?: string[];

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ name: 'builder_name', type: 'varchar', length: 255, nullable: true })
    builderName?: string;

    @Column({ type: 'text', nullable: false })
    location: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    area?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    age?: string;

    @Column({ type: 'text', nullable: true })
    remarks?: string;

    @Column({ name: 'assigned_spv', type: 'varchar', length: 255, nullable: true })
    assignedSpv?: string;

    @Column({
        type: 'enum',
        enum: AssetStatus,
        default: AssetStatus.PENDING
    })
    status: AssetStatus;

    @Column({ type: 'simple-array', nullable: true })
    characteristics?: string[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
