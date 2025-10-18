import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('email_logs')
export class EmailLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  to: string; // recipient email

  @Column({ nullable: true })
  cc?: string;

  @Column({ nullable: true })
  bcc?: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  html: string; // final rendered HTML content

  @Column({ type: 'jsonb', nullable: true })
  variables?: Record<string, any>; // used to generate the content

  @Column({ nullable: true })
  templateName?: string; // e.g., "otp_email"

  @Column({ nullable: true })
  status?: 'SUCCESS' | 'FAILED';

  @Column({ type: 'text', nullable: true })
  error?: string; // error message if failed

  @CreateDateColumn()
  createdAt: Date;
}
