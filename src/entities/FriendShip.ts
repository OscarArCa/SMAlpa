import { CreateDateColumn, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity('friendship')
export class FriendShip{

    @PrimaryGeneratedColumn()
    id!: number;
    
    @Column({ type: 'enum', enum: ['pendiente','activo', 'bloqueado', 'denegado'], default: 'pendiente' })
    estado!: 'pendiente' | 'activo' | 'bloqueado' | 'denegado';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
    createdAt!: Date;
    
    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
    updatedAt!: Date;

    @ManyToOne(() => User, (user) => user.amigoEmisor)
    emisor!: User;

    @ManyToOne(() => User, (user) => user.amigoReceptor)
    receptor!: User;

}