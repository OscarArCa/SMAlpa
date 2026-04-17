import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToMany, ManyToOne} from 'typeorm';
import { Service } from './Service';
import { User } from './User';

@Entity('voucher')
export class Voucher{

    @PrimaryGeneratedColumn()
    id!:number;

    @Column({type:'enum', enum:['BCP','BBVA','Interbanck'], default:'BCP'})
    banco!: 'BCP'|'BBVA'|'InterBanck';

    @Column({type:'decimal', precision: 10, scale: 2, default: 0.00})
    comision!: number;

    @Column({type:'decimal', precision: 10, scale: 2, default: 0.00})
    monto!: number;

    @Column({type:'enum', enum: ['exitoso', 'fallido'], default: 'exitoso'})
    estado!: 'exitoso' | 'fallido'

    @Column()
    numTarjeta!: string;

    @Column({type: 'enum', enum: ['credito', 'debito'], default: 'debito'})
    tipoTarjeta!: 'credito' | 'debito';

    @Column()
    nombreTitular!: string;

    @CreateDateColumn({type:'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    createdAt!: Date;

    @UpdateDateColumn({type:'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    updatedAt!: Date;

    @ManyToOne(() => Service, (service) => service.vouchers)
    service!: Service;

    @ManyToOne(() => User, (user) => user.vouchers)
    usuario!: User;

    @ManyToOne(() => User, (user) => user.receptor_pago)
    receptor!: User;
}