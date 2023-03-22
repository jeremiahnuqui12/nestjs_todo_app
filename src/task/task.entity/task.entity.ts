import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('task')
export class TaskEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    title:string;

    @Column({ length: 500 }) 
    description:string

    @Column({nullable:false,default:'1'})
    is_active: number;

    @Column() 
    created_by:number;

    @Column({ default:()=>'CURRENT_TIMESTAMP', type: 'datetime'}) 
    date_created:string;

    @Column({nullable:true})
    updated_by:number;
    
    @Column({ type: 'datetime',  nullable:true, default: null, onUpdate: "CURRENT_TIMESTAMP"})
    date_updated:string;
}
