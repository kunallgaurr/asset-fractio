import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Unique } from "typeorm";

export enum AssetDocumentStatusEnum {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity('asset_documents')
@Unique('unique_asset_document', ['assetId', 'name'])
export class AssetDocumentsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'asset_id', type: 'int', nullable: false })
    assetId: number;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    url: string;

    @Column({
        type: 'enum',
        enum: AssetDocumentStatusEnum,
        default: AssetDocumentStatusEnum.PENDING,
    })
    status: AssetDocumentStatusEnum;

    @Column({ type: 'text', nullable: true })
    remarks?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
