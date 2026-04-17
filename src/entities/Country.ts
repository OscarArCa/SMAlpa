import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Region } from "./Region";

@Entity('country')
export class Country{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @OneToMany(() => Region, (region) => region.pais)
    region!: Region[];

}