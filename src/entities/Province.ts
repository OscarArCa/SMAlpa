import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./District";
import { Region } from "./Region";


@Entity('province')
export class Province{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @OneToMany(() => District, (district) => district.provincia)
    distrito!: District[];

    @ManyToOne(() => Region, (region) => region.provincia)
    region!: Region;

}