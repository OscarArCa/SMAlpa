import { Request, Response } from 'express';
import {AppDataSource} from "../config/database";
import { Report } from '../entities/Report';
import { In, Like } from "typeorm";

export const getAll = async (_req: Request, res: Response) => {
    try {
        const report = await AppDataSource.getRepository(Report).find({

            relations:{
                denunciado:true,
                denunciante:true,
                servicio:true
            }
        });
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo reportes' });
    }
};

export const getReportList = async (req: Request, res: Response) => {
    try {
        // 1. Extraemos el parámetro de búsqueda (ajusta el nombre según tu ruta)
        const { nameUser } = req.params;

        // 2. Condición base: Solo los que están en estado 'pendiente'
        let whereCondition: any = {
            estado: 'pendiente'
        };

        // 3. Si hay búsqueda, aplicamos el OR para nombres y apellidos del DENUNCIADO
        if (nameUser && nameUser.trim() !== "" && nameUser !== 'undefined') {
            const search = `%${nameUser.trim()}%`;
            
            whereCondition = [
                { 
                    estado: 'pendiente', 
                    denunciado: { nombres: Like(search) } 
                },
                { 
                    estado: 'pendiente', 
                    denunciado: { apellidos: Like(search) } 
                }
            ];
        }

        const reports = await AppDataSource.getRepository(Report).find({
            relations: {
                denunciado: true,
                denunciante: true
            },
            select: {
                id: true,
                denunciante: {
                    id: true,
                    nombres: true,
                    apellidos: true
                },
                denunciado: {
                    id: true,
                    nombres: true,
                    apellidos: true
                },
                createdAt: true,
                estado: true // Es buena práctica incluirlo si filtras por él
            },
            where: whereCondition,
            order: {
                createdAt: 'DESC' // Los más recientes primero
            }
        });

        res.json(reports);

    } catch (error: any) {
        console.error("❌ Error en getReportList:", error.message);
        res.status(500).json({ message: 'Error obteniendo reportes' });
    }
};

export const getReportById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const report = await AppDataSource.getRepository(Report).findOne({

            relations:{
                denunciado:{
                    fotos:true
                },
                denunciante:true,
                servicio:true
            },
            select:{
                id:true,
                denunciante:{
                    id:true,
                    nombres:true,
                    apellidos:true
                },
                denunciado:{
                    id:true,
                    nombres:true,
                    apellidos:true,
                    fotos:{
                        id:true,
                        tipoFormato:true,
                        foto:true
                    }
                },
                tipo:true,
                motivo:true,
                createdAt:true,
                servicio:{
                    id:true,
                    nombre:true
                }
            },
            where:{
                id:Number(id)
            },
        });

        if (report?.denunciado.fotos && report.denunciado.fotos.foto) {
            // Convertimos el Buffer del único usuario a string Base64
            (report.denunciado.fotos as any).foto = report.denunciado.fotos.foto.toString('base64');
        }
        
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo reportes' });
    }
};

export const getNumReportsByUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // id del usuario denunciado

        const numReports = await AppDataSource.getRepository(Report).count({
            where: {
                denunciado: { id: Number(id) },
                estado: In(['pendiente','aprobado'])
            }
        });

        res.json({ numReports });

    } catch (error) {
        res.status(500).json({ message: 'Error contando reportes' });
    }
};

export const setReportUser = async(req: Request, res:Response) => {
    const {emisor, receptor} = req.params;
    const {motivo} = req.body;
    
    const repo = AppDataSource.getRepository(Report);

    const newReport = repo.create({
        tipo:'usuario',
        estado:'pendiente',
        motivo,
        denunciante:{id:Number(emisor)},
        denunciado:{id:Number(receptor)}
    });

    const setReport = await repo.save(newReport);

    res.json(setReport);
}

export const setReportService = async(req: Request, res:Response) => {
    const {emisor, receptor,servicio} = req.params;
    const {motivo} = req.body;
    
    const repo = AppDataSource.getRepository(Report);

    const newReport = repo.create({
        tipo:'usuario',
        estado:'pendiente',
        motivo,
        denunciante:{id:Number(emisor)},
        denunciado:{id:Number(receptor)},
        servicio:{id:Number(servicio)}
    });

    const setReport = await repo.save(newReport);

    res.json(setReport);
}

export const resuelto = async(req:Request,res:Response) =>{
    const {id} = req.params;
    const rRepo = AppDataSource.getRepository(Report);

    const edit = rRepo.update({id:Number(id)},{estado:'aprobado'});

    return res.json({message: 'actualizado'})
}