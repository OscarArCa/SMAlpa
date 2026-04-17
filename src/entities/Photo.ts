// src/entities/photo.ts

import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany} from 'typeorm';
import { User } from './User';

@Entity('photo')
export class Photo{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({type: 'enum', enum:['publico','privado'], default:'privado'})
    tipo!: 'publico' | 'privado'

    @Column( {type: 'enum', enum: ['image/jpeg','image/png']})
    tipoFormato!: 'image/jpeg' | 'image/png'

    @Column({type: 'longblob', nullable:true})
    foto!: Buffer;

    @CreateDateColumn({ 
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt!: Date;

    @UpdateDateColumn({ 
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP(6)', 
        onUpdate: 'CURRENT_TIMESTAMP(6)' 
    })
    updatedAt!: Date;

    @OneToMany(() => User , user => user.fotos)
    usuario!: User[];
}