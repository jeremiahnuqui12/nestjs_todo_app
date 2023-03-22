import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 20 })
    username:string;

    @Column({length: 30}) 
    password:string

    @Column({ default:()=>'CURRENT_TIMESTAMP', type: 'datetime'}) 
    date_created:string;
}
