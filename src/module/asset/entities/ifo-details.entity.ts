import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, 
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryColumn
} from "typeorm";

@Entity('ifo_details')
export class IfoDetailsEntity {
  @PrimaryColumn({ name: 'asset_id' })
  assetId: number;

  @Column({ type: 'int' })
  fractions: number;

  @Column({ name: 'initial_value', type: 'decimal', precision: 15, scale: 2 })
  initialValue: number;

  @Column({ name: 'admin_fee', type: 'decimal', precision: 10, scale: 2 })
  adminFee: number;

  @Column({ name: 'available_fractions', type: 'int' })
  availableFractions: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
