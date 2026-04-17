// src/entities/Service.ts

import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, ManyToOne, OneToMany} from 'typeorm';
import { User } from './User';
import { Voucher } from './Voucher';
import { Logo } from './Logo';
import { Report } from './Report';
import { ServiceAffiliate } from './ServiceAffiliate';

@Entity('services')
export class Service{

    @PrimaryGeneratedColumn()
    id!:number;

    @Column()
    nombre!: string;

    @Column()
    descripcion!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
    costoServicio!: number;

    @Column({type:'enum', enum:['variable', 'estatica'], default:'estatica'})
    naturalezaPago!: 'variable'|'estatica';

    @Column({type:'enum', enum:['equitativa', 'porcentual'], default:'equitativa'})
    reparticionPago!: 'equitativa'|'porcentual';

    @Column()
    porcentaje!: number;

    @Column({type:'enum', enum:['por periodos', 'fecha fija'], default:'por periodos'})
    modalidadPago!: 'por periodos'|'fecha fija';

    @Column()
    periodoPago!: number;

    @Column({default: false})
    pagoRealizado!: boolean;

    @Column({ type:'enum', enum:['publico', 'privado'], default: 'privado'})
    visibilidad!: 'publico'|'privado';

    @Column({ default: false })
    suspendido!: boolean;

    @CreateDateColumn({ 
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP(6)' 
    })
    createdAt!: Date;

    @UpdateDateColumn({ 
        type: 'timestamp', 
        default: () => 'CURRENT_TIMESTAMP(6)', 
        onUpdate: 'CURRENT_TIMESTAMP(6)' 
    })
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.servicios)
    usuario!: User;

    @OneToMany(() => Voucher, (voucher) => voucher.service)
    vouchers!: Voucher[];

    @ManyToOne(() => Logo, (logo) => logo.service)
    logo!: Logo;

    @OneToMany(() => Report, (report) => report.servicio)
    reporte!: Report[];

    @OneToMany(() => ServiceAffiliate, (afiliate) => afiliate.Servicio)
    usuarioAfiliado!: ServiceAffiliate[];
    
}
