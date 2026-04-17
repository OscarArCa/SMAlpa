import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Service } from "./Service";

@Entity('report')
export class Report{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({type:'enum', enum:['usuario','servicio']})
    tipo!: 'usuario'|'servicio';

    @Column({type: 'enum', enum:['pendiente','aprobado','rechazado'], default: 'pendiente'})
    estado!: 'pendiente'|'aprobado'|'rechazado';

    @Column()
    motivo!: string;

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

    @ManyToOne(() => User, (user) => user.creador_reporte)
    denunciante!: User;

    @ManyToOne(() => User, (user) => user.receptor_reporte)
    denunciado!: User;

    @ManyToOne(() => Service, (service) => service.reporte)
    servicio!: Service;

}