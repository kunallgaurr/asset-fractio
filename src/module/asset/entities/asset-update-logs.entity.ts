import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

export enum AssetUpdateActionEnum {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    STATUS_CHANGED = 'STATUS_CHANGED',
    DOCUMENT_ADDED = 'DOCUMENT_ADDED',
    DOCUMENT_UPDATED = 'DOCUMENT_UPDATED',
    OTHER = 'OTHER'
}

@Entity('asset_update_logs')
export class AssetUpdateLogsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'asset_id', type: 'int', nullable: false })
    assetId: number;

    @Column({
        type: 'enum',
        enum: AssetUpdateActionEnum,
        default: AssetUpdateActionEnum.OTHER
    })
    action: AssetUpdateActionEnum;

    @Column({ name: 'updated_by', type: 'int', nullable: false })
    updatedBy: number;

    @Column({ name: 'previous_value', type: 'jsonb', nullable: true })
    previousValue?: Record<string, any>;

    @Column({ name: 'new_value', type: 'jsonb', nullable: true })
    newValue?: Record<string, any>;

    @Column({ type: 'text', nullable: true })
    remarks?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
