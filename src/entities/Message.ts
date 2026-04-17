import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Index } from "typeorm/index";
import { User } from "./User";

@Entity('message')
export class Message{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: false })
    leido!: boolean;

    @Index() 
    @Column({ type: 'varchar', length:255 }) 
    mensaje!: string;

    @Column({default:true})
    visibilidad!:boolean;

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

    @ManyToOne(() => User, (user) => user.mensajeEmisor)
    emisor!: User;

    @ManyToOne(() => User, (user) => user.mensajeReceptor)
    receptor!: User;


}