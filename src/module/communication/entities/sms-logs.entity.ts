import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sms_logs')
export class SmsLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string; 

  @Column({ type: 'text' })
  content: string; 

  @Column({ type: 'jsonb', nullable: true })
  variables?: Record<string, any>; 

  @Column({ nullable: true })
  templateName?: string; 

  @Column({ nullable: true })
  status?: 'SUCCESS' | 'FAILED';

  @Column({ type: 'text', nullable: true })
  error?: string;

  @CreateDateColumn()
  createdAt: Date;
}
