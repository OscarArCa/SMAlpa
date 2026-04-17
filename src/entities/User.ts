// src/entities/User.ts

import {Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, OneToMany, ManyToOne, OneToOne, JoinColumn} from 'typeorm';
import { Service } from './Service';
import { Voucher } from './Voucher';
import { Photo } from './Photo';
import { Message } from './Message';
import { Location } from './Location';
import { Report } from './Report';
import { FriendShip } from './FriendShip';
import { ServiceAffiliate } from './ServiceAffiliate';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombres!: string;

    @Column()
    apellidos!: string;

    @Column({type: 'enum', enum: ['user', 'admin'], default: 'user'})
    roles!: 'admin' | 'user';

    @Column({default:false})
    suspendido!: boolean;

    @Column()
    celular!: string;

    @Column({unique: true})
    dni!: string;

    @Column({unique: true})
    email!: string;

    @Column()
    password!: string;

    @Column({ type: 'date', nullable:true})
    fechaNacimiento!: Date;

    @CreateDateColumn({type:'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    createdAt!: Date;

    @UpdateDateColumn({type:'timestamp', default: () => 'CURRENT_TIMESTAMP(6)'})
    updatedAt!: Date;

    @OneToMany(() => Service, (service) => service.usuario)
    servicios!: Service[];

    @OneToMany(() => Voucher, (vouchers) => vouchers.usuario)
    vouchers!: Voucher[];

    @OneToMany(() => Voucher, (vouchers) => vouchers.usuario)
    receptor_pago!: Voucher[];

    @ManyToOne(() => Photo, (fotos) => fotos.usuario)
    fotos!: Photo;

    @OneToOne(() => Location, (location) => location.usuario)
    @JoinColumn({ name: 'location_id' })
    ubicacion!: Location;

    @OneToMany(() => Report, (report) => report.denunciante)
    creador_reporte!: Report[];

    @OneToMany(() => Report, (report) => report.denunciado)
    receptor_reporte!: Report[];

    @OneToMany(() => FriendShip, (friendShip) => friendShip.emisor)
    amigoEmisor!: FriendShip[];

    @OneToMany(() => FriendShip, (friendShip) => friendShip.receptor)
    amigoReceptor!: FriendShip[];

    @OneToMany(() => Message, (messaje) => messaje.emisor)
    mensajeEmisor!: Message[];

    @OneToMany(() => Message, (messaje) => messaje.receptor)
    mensajeReceptor!: Message[];

    @OneToMany(() => ServiceAffiliate, (afiliate) => afiliate.Afiliado)
    servicioAfiliado!: ServiceAffiliate[];
}