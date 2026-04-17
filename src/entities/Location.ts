import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne } from "typeorm";
import { User } from "./User";
import { District } from "./District";

@Entity('location')
export class Location{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    direccion!: string;

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

    @OneToOne(() => User, (user) => user.ubicacion)
    usuario!: User;

    @ManyToOne(() => District, (district) => district.ubicacion)
    distrito!: District;
    
}