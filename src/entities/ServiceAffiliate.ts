import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Service } from "./Service";

@Entity('serviceaffiliate')
export class ServiceAffiliate{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'enum', enum: ['pendiente', 'activo', 'inactivo'], default:'pendiente'})
    estado!: 'pendiente' | 'activo' | 'inactivo';

    @Column({default: false})
    pagoRealizado!: boolean;

    @ManyToOne(() => User, (user) => user.servicioAfiliado)
    Afiliado!: User;

    @ManyToOne(() => Service, (service) => service.usuarioAfiliado)
    Servicio!: Service;
}