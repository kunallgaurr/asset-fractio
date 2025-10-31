import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum BankAccountVerifcationStatusEnum {
    PENDING = 'PENDING', 
    VERIFIED = 'VERIFIED', 
    FAILED = 'FAILED'
}


@Entity('bank_account_verification')
export class BankAccountVerificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'account_number', type: 'varchar', length: 30 })
  accountNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  branch: string;

  @Column({ name: 'ifsc_code', type: 'varchar', length: 15 })
  ifscCode: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  status?: BankAccountVerifcationStatusEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  remarks?: string; 

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
