import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Province } from "./Province";
import { Country } from "./Country";


@Entity('region')
export class Region{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @OneToMany(() => Province, (province) => province.region)
    provincia!: Province[];

    @ManyToOne(() => Country, (country) => country.region)
    pais!: Country;

}