import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user_update_logs')
export class UserUpdateLogs {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ 
        name: 'user_id', 
        type: 'int', 
        unsigned: true 
    })
    userId: number;

    @Column({ 
        name: 'key', 
        type: 'varchar' 
    })
    key: string;

    @Column({ 
        name: 'value', 
        type: 'varchar' 
    })
    value: string;

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