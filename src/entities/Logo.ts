import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import { Service } from "./Service";

@Entity('logo')
export class Logo{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column({type:'enum', enum: ['Servicios del Hogar', 'Streaming', 'Telefonía', 'Otros']})
    categoria!: 'Servicios del Hogar' | 'Streaming' | 'Telefonía' | 'Otros';

    @Column()
    subCategoria!: string;

    @Column({type:'enum', enum: ['image/jpeg','image/png']})
    tipoFormato!: 'image/jpeg' | 'image/png';

    @Column({type:'mediumblob', nullable:true})
    logo!: Buffer;

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

    @OneToMany(() => Service, (service) => service.logo)
    service!: Service[];

}