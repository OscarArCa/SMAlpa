import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";
import { AppDataSource } from "../config/database";
import { Country } from "../entities/Country";
import { Region } from "../entities/Region";
import { Province } from "../entities/Province";
import { District } from "../entities/District";

// profile.controller.ts
export const setPhoto = async (req: Request, res: Response) => {
    try {

        const userId = req.params.id;

        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "No se envió ninguna imagen"
            });
        }

        const bufferPhoto = req.file.buffer;
        const formato = req.file.mimetype;

        const result = await ProfileService.setPhoto(
            userId,
            bufferPhoto,
            formato
        );

        return res.status(200).json({
            status: "success",
            data: result
        });

    } catch (error: any) {
        console.error("DETALLE DEL ERROR EN CONSOLA:", error); // <-- MIRA ESTO EN TU TERMINAL
        return res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }

}

export const editData = async(req: Request, res: Response)=>{

    try{

        const userId = req.params.id;
        
        const {email, celular, fechNac} = req.body;

        const result = await ProfileService.editData( userId, email, celular, fechNac );

        return res.status(200).json({
            status: "success",
            result
        });

    }catch(error: any){
        console.error("DETALLE DEL ERROR EN CONSOLA:", error); // <-- MIRA ESTO EN TU TERMINAL
        return res.status(500).json({ 
            status: "error", 
            message: error.message 
        });
    }

}

export const getCountry = async(req: Request, res:Response) =>{
    try {
        const pais = await AppDataSource.getRepository(Country).find({
            select:{
                id:true,
                nombre:true
            }
        });
        
        res.json(pais);

  } catch (error: any) {

    console.error("DETALLE DEL ERROR EN CONSOLA:", error);

    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
}

export const getRegion = async(req: Request, res:Response) =>{
    try {
        const {id} = req.params;
        const pais = await AppDataSource.getRepository(Region).find({
            where:{
                pais:{id:Number(id)}
            },
            select:{
                id:true,
                nombre:true
            }
        });
        
        res.json(pais);

  } catch (error: any) {

    console.error("DETALLE DEL ERROR EN CONSOLA:", error);

    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
}

export const getProvincia = async(req: Request, res:Response) =>{
    try {
        const {id} = req.params;
        const pais = await AppDataSource.getRepository(Province).find({
            where:{
                region:{id:Number(id)}
            },
            select:{
                id:true,
                nombre:true
            }
        });
        
        res.json(pais);

  } catch (error: any) {

    console.error("DETALLE DEL ERROR EN CONSOLA:", error);

    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
}

export const getDistrito = async(req: Request, res:Response) =>{
    try {
        const {id} = req.params;
        const pais = await AppDataSource.getRepository(District).find({
            where:{
                provincia:{id:Number(id)}
            },
            select:{
                id:true,
                nombre:true
            }
        });
        
        res.json(pais);

  } catch (error: any) {

    console.error("DETALLE DEL ERROR EN CONSOLA:", error);

    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
}

export const editLocation = async (req: Request, res: Response) => {
  try {

    const { userId, direccion, distritoId } = req.body;

    if (!userId || !distritoId) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos requeridos"
      });
    }

    const location = await ProfileService.editLocation(
      Number(userId),
      direccion ?? null,
      Number(distritoId)
    );

    return res.json({
      status: "success",
      message: "Ubicación guardada correctamente",
      data: location
    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({
      status: "error",
      message: error.message || "Error interno del servidor"
    });
  }
};