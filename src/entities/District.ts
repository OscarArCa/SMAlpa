import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "./Location";
import { Province } from "./Province";

@Entity('district')
export class District{

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @OneToMany(()  => Location, (location) => location.distrito)
    ubicacion!: Location[];

    @ManyToOne(() => Province, (province) => province.distrito)
    provincia!: Province;
}