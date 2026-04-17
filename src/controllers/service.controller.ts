import { Request, Response } from 'express';
import {AppDataSource} from "../config/database";
import { Service } from '../entities/Service';
import { ServiceAffiliate } from '../entities/ServiceAffiliate';
import { Report } from '../entities/Report';
import { In, Not, ILike, Like } from "typeorm";
import { FriendShip } from '../entities/FriendShip';
import { Logo } from '../entities/Logo';
import { AddService } from '../services/addservice.service';
import { Voucher } from '../entities/Voucher';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const service = await AppDataSource.getRepository(Service).find();
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo servicios' });
    }
};

export const ServiceList = async (req: Request, res: Response) => {

    try {

      const {nameService} = req.params;

      const whereCondition: any = { 
        };

        // Si nameService existe y no es solo espacios, agregamos el filtro LIKE
        if (nameService && nameService.trim() !== "") {
            whereCondition.nombre = ILike(`%${nameService.trim()}%`);
        }

        const service = await AppDataSource
            .getRepository(Service)
            .find({
                relations:{
                    usuario:true,
                    logo:true
                },
                select:{
                    id:true,
                    nombre:true,
                    
                    usuario:{
                        nombres:true,
                        apellidos:true,
                    },
                    naturalezaPago:true,
                    reparticionPago:true,
                    modalidadPago:true,
                    periodoPago:true,
                    costoServicio:true,
                    visibilidad:true,
                    logo:{
                        id:true,
                        tipoFormato:true,
                        logo:true
                    }
                },
                 where: whereCondition
            });

            const serviceWithBase64 = service.map(srv => {
            if (srv.logo && srv.logo.logo) {
                // Convertimos los bytes a string Base64
                (srv.logo as any).logo = srv.logo.logo.toString('base64');
            }
            return srv;
            });

        res.json(serviceWithBase64);

    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo servicios' });
    }
};

export const getServiceById = async (req: Request, res: Response) => {
    try {
        // 1. Extraer el id de los parámetros de la petición
        const { id } = req.params;

        // 2. Buscar un solo registro
        const service = await AppDataSource
            .getRepository(Service)
            .findOne({
                relations:{
                    usuario: true,
                    logo:true
                },
                select:{
                    id:true,
                    nombre:true,
                    descripcion:true,
                    usuario:{
                        id:true,
                        nombres:true,
                        apellidos:true
                    },
                    pagoRealizado:true,
                    naturalezaPago:true,
                    reparticionPago:true,
                    modalidadPago:true,
                    periodoPago: true,
                    porcentaje:true,
                    costoServicio:true,
                    visibilidad:true,
                    createdAt:true,
                    logo:{
                        id:true,
                        tipoFormato:true,
                        logo:true
                    }
                },
                where: {
                    id: Number(id) // Convertimos a número porque los params llegan como string
                }
            });

        // 3. Validar si el usuario existe
        if (!service) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Procesamos solo el objeto 'user' encontrado
        if (service.logo && service.logo.logo) {
            // Convertimos el Buffer del único usuario a string Base64
            (service.logo as any).logo = service.logo.logo.toString('base64');
        }
        res.json(service);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo el usuario' });
    }
};

export const getServiceByUser = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const service = await AppDataSource
            .getRepository(Service)
            .find({
                relations:{
                    usuario: true,
                    logo:true
                },
                select:{
                    id:true,
                    nombre:true,
                    descripcion:true,
                    usuario:{
                        id:true,
                        nombres:true,
                        apellidos:true
                    },
                    naturalezaPago:true,
                    reparticionPago:true,
                    modalidadPago:true,
                    periodoPago: true,
                    costoServicio:true,
                    visibilidad:true,
                    createdAt:true,
                    logo:{
                        id:true,
                        tipoFormato:true,
                        logo:true
                    }
                },
                where: [
                  {usuario:{id:Number(id)}, suspendido:false, usuarioAfiliado:{estado:'activo'}},
                  {usuarioAfiliado:{Afiliado:{id:Number(id)},estado:'activo'}, suspendido: false}
                ]
            });

        if (!service) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

         const serviceWithBase64 = service.map(srv => {
            if (srv.logo && srv.logo.logo) {
                (srv.logo as any).logo = srv.logo.logo.toString('base64');
            }
            return srv;
            });

        // 4. Responder con el objeto del usuario
        res.json(serviceWithBase64);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo el usuario' });
    }
};


export const getServiceByName = async (req: Request, res: Response) => {
  try {
    const { id, nameService } = req.params;

    const whereCondition: any = {
      usuario: { id: Number(id) }
    };

    // 🔥 filtro dinámico seguro
    if (nameService && nameService.trim() !== "") {
      whereCondition.nombre = Like(`%${nameService.trim()}%`);
    }

    const services = await AppDataSource
      .getRepository(Service)
      .find({
        relations: {
          usuario: true,
          logo: true
        },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          usuario: {
            id: true,
            nombres: true,
            apellidos: true
          },
          naturalezaPago: true,
          reparticionPago: true,
          modalidadPago: true,
          periodoPago: true,
          costoServicio: true,
          visibilidad: true,
          createdAt: true,
          logo: {
            id: true,
            tipoFormato: true,
            logo: true
          }
        },
        where: whereCondition
      });

    // 🔥 siempre devolver array
    if (!services || services.length === 0) {
      return res.status(200).json([]);
    }

    // 🔥 convertir imagen a base64
    const serviceWithBase64 = services.map((srv: any) => {
      if (srv.logo?.logo) {
        srv.logo.logo = srv.logo.logo.toString("base64");
      }
      return srv;
    });

    return res.json(serviceWithBase64);

  } catch (error) {
    console.error("Error getServiceByName:", error);
    return res.status(500).json({ message: "Error obteniendo los servicios" });
  }
};

export const getServicePublicByFriends = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const {nameService} = req.params;

    const friendships = await AppDataSource
      .getRepository(FriendShip)
      .find({
        where: [
          { emisor: { id: userId } },
          { receptor: { id: userId } }
        ],
        relations: { emisor: true, receptor: true }
      });

    
    const friendIds = friendships.map(f =>
      f.emisor.id === userId ? f.receptor.id : f.emisor.id
    );

    if (!friendIds.length) {
      return res.json([]);
    }

    /* 3️⃣ Obtener servicios donde ya está afiliado */
    const afiliaciones = await AppDataSource
      .getRepository(ServiceAffiliate)
      .find({
        where: { Afiliado: { id: userId } },
        relations: { Servicio: true }
      });

    const affiliatedServiceIds = afiliaciones.map(a => a.Servicio.id);

    const whereCondition: any = {
          usuario: { id: In(friendIds) },
          visibilidad: "publico",
          id: affiliatedServiceIds.length
            ? Not(In(affiliatedServiceIds))
            : undefined
          
        };
    
     if (nameService && nameService.trim() !== "") {
            whereCondition.nombre = ILike(`%${nameService.trim()}%`);
        }

    const services = await AppDataSource
      .getRepository(Service)
      .find({
        relations: {
          usuario: true,
          logo: true
        },
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          naturalezaPago: true,
          reparticionPago: true,
          modalidadPago: true,
          periodoPago: true,
          costoServicio: true,
          visibilidad: true,
          createdAt: true,
          usuario: {
            id: true,
            nombres: true,
            apellidos: true
          },
          logo: {
            id: true,
            tipoFormato: true,
            logo: true
          }
        },
        where: whereCondition
      });

    /* 5️⃣ Convertir logo a base64 */
    const serviceWithBase64 = services.map(srv => {
      if (srv.logo?.logo) {
        (srv.logo as any).logo = srv.logo.logo.toString("base64");
      }
      return srv;
    });

    return res.json(serviceWithBase64);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error obteniendo servicios" });
  }
};


export const getAffiliateByService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await AppDataSource
      .getRepository(ServiceAffiliate)
      .find({
        where: {
          Servicio: { id: Number(id) },
          estado:'activo'
        },
        relations: {
          Afiliado: {
            fotos: true
          }
        },
        select: {
          id: true,
          pagoRealizado:true,
          Servicio: {
            id: true
          },
          Afiliado: {
            id: true,
            nombres: true,
            apellidos: true,
            email: true,
            fotos: {
              id: true,
              tipoFormato: true,
              foto: true
            }
          }
        }
      });

    if (!service.length) {
  return res.json([]);
}

    const result = service.map(a => {

  const afiliado = a.Afiliado;

  return {
    id: afiliado.id,
    pagoRealizado: a.pagoRealizado,
    nombres: afiliado.nombres,
    apellidos: afiliado.apellidos,
    email: afiliado.email,
    fotos: afiliado.fotos
      ? {
          id: afiliado.fotos.id,
          tipoFormato: afiliado.fotos.tipoFormato,
          foto: afiliado.fotos.foto
            ? afiliado.fotos.foto.toString('base64')
            : null
        }
      : null
  };
});


    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error obteniendo afiliados' });
  }
};

export const getNumServiceByUser = async(req: Request, res:Response) => {
    try{

        const {id} = req.params;

        const NumberService = await AppDataSource.getRepository(Service).count({
            where:{
                usuario:{id: Number(id)}
            }
        })

        res.json({totalService: NumberService})

    }catch(error){
         console.error(error);
         res.status(500).json({Message: 'Error obteniendo numero de servicios'})
    }
}

export const getNumAffiliateByService = async(req: Request, res:Response) => {
    try{

        const {id} = req.params;

        const NumberAffiliate = await AppDataSource.getRepository(ServiceAffiliate).count({
            where:{
                Servicio:{
                    id: Number(id)
                },
                estado:'activo'
            }
        })


        res.json({totalAfiliate: NumberAffiliate})

    }catch(error){
         console.error(error);
         res.status(500).json({Message: 'Error obteniendo numero de servicios'})
    }
}

export const getNumReportsByService = async(req: Request, res:Response) => {
    try{

        const {id} = req.params;

        const NumberReport = await AppDataSource.getRepository(Report).count({
            where:{
                servicio:{
                    id: Number(id)
                }
            }
        })


        res.json({totalReports: NumberReport})

    }catch(error){
         console.error(error);
         res.status(500).json({Message: 'Error obteniendo numero de servicios'})
    }
}

export const getLogoCategori = async (req: Request, res: Response) => {

  const categori = await AppDataSource
    .getRepository(Logo)
    .createQueryBuilder("logo")
    .select("MIN(logo.id)", "id")
    .addSelect("logo.categoria", "categoria")
    .groupBy("logo.categoria")
    .getRawMany();

  res.json(categori);
}

export const getLogoSubCategori = async (req: Request, res: Response) => {

  const { categoria } = req.params;

  console.log("Categoria recibida:", categoria);

  if (!categoria) {
    return res.json([]);
  }

  const subCategori = await AppDataSource
    .getRepository(Logo)
    .createQueryBuilder("logo")
    .select("MIN(logo.id)", "id")
    .addSelect("logo.subCategoria", "subCategoria")
    .where("logo.categoria = :categoria", { categoria })
    .groupBy("logo.subCategoria")
    .getRawMany();

  console.log("Resultado:", subCategori);

  res.json(subCategori);
}

export const getLogoByCategories = async (req: Request, res: Response) => {

  try {

    const { categoria, subcategoria } = req.params;

    if (!categoria || !subcategoria) {
      return res.status(400).json({
        message: "categoria y subcategoria son requeridas"
      });
    }

    const logos = await AddService.getLogoByCategories(categoria, subcategoria);

    return res.json(logos);

  } catch (error) {

    console.error("Error obteniendo logos:", error);

    return res.status(500).json({
      message: "Error interno del servidor"
    });

  }

};

export const createService = async (req: Request, res: Response) => {
  try {
    const {
      idUser,
      idLogo,
      nombre,
      descripcion,
      costoServicio,
      naturalezaPago,
      modalidadPago,
      periodoPago,
      reparticionPago,
      porcentaje,
      visibilidad
    } = req.body;

    // 🔒 Validación básica (muy recomendable)
    if (!idUser || !idLogo || !nombre) {
      return res.status(400).json({
        status: "error",
        message: "Faltan datos obligatorios"
      });
    }

    const result = await AddService.setService(
      idUser,
      idLogo,
      nombre,
      descripcion,
      Number(costoServicio),
      naturalezaPago,
      modalidadPago,
      Number(periodoPago),
      reparticionPago,
      Number(porcentaje),
      visibilidad
    );

    // 🧠 Manejo de respuesta
    if (result.status === "error") {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);

  } catch (error) {
    console.error("Error creando servicio:", error);

    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor"
    });
  }
};

export const Suspender = async (req: Request, res: Response) => {
  const { id, validar } = req.params;
  const repo = AppDataSource.getRepository(Service);

  const estadoNuevo = validar === 'true';

  try {
    const resultado = await repo.update(id, { suspendido: estadoNuevo });

    if (resultado.affected === 0) {
      return res.status(404).json({ message: "No se encontró el servicio" });
    }

    return res.json({ 
      message: "Estado actualizado", 
      suspendido: estadoNuevo 
    });

  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor", error });
  }
};

export const disaffiliate = async(req: Request,res:Response) => {
  const {idService, idUser} = req.params;

  const repo = AppDataSource.getRepository(ServiceAffiliate);

  const result = await repo.update({Servicio:{id:Number(idService)},Afiliado:{id:Number(idUser)}},{estado:'inactivo'});
  return res.json({
    message:"Estado actualizado",
    estado: 'inactivo'
  });
}

export const setAffiliate = async(req:Request,res:Response) =>{
  const {idService, idUser} = req.params;

  const repo = AppDataSource.getRepository(ServiceAffiliate);

  const newAffiliated = repo.create({
    Afiliado: {id: Number(idUser)},
    Servicio:{id:Number(idService)},
    estado:'pendiente'
  });

  const result = await repo.save(newAffiliated);

  return res.json(result);
}

export const generateVoucher = async (req: Request, res: Response) => {
  const { eId, rId, sId } = req.params;
  const { tipoTarjeta, banco, numTarjeta } = req.body;

  const vRepo = AppDataSource.getRepository(Voucher);

  const sRepo = AppDataSource.getRepository(Service);

  // 1. Buscamos el servicio
  const servicio = await AppDataSource.getRepository(Service).findOne({
    where: { id: Number(sId) },
    relations:{usuario:true}
  });

  if (!servicio) {
    return res.status(404).json({ message: "No se encontró el servicio" });
  }

  const aRepo = AppDataSource.getRepository(ServiceAffiliate);

  if (!aRepo) {
    return res.status(404).json({ message: "No se encontró el servicio" });
  }

  // 2. Contamos afiliados
  const Afiliados = await aRepo.count({
    where: { Servicio: { id: Number(sId) } }
  });

  // 3. Lógica de montos
  let montoCalculado: number = 0;

  if (servicio.reparticionPago === 'equitativa') {
    montoCalculado = Number(servicio.costoServicio) / (Number(Afiliados) + 1);
  } else {
    montoCalculado = (Number(servicio.costoServicio) / 100) * Number(servicio.porcentaje || 0);
  }

  // Redondeo preciso a 2 decimales
  const montoFinal = Math.round((montoCalculado + Number.EPSILON) * 100) / 100;

  // 4. Crear el objeto con el monto ya redondeado
  const newVoucher = vRepo.create({
    usuario: { id: Number(eId) },
    receptor: { id: Number(rId) },
    service: { id: Number(sId) },
    comision: 0,
    monto: montoFinal, // Ya no necesitas toFixed aquí
    estado: 'exitoso',
    tipoTarjeta,
    banco,
    numTarjeta
  });

  if(servicio.usuario.id === Number(eId)){
    const editService = await sRepo.update({id:Number(sId)},{pagoRealizado:true});
  }else{
    const editAffiliated = await aRepo.update({Afiliado:{id:Number(eId)},Servicio:{id:Number(sId)}},{pagoRealizado:true});
  }

  

  // 5. Guardado asíncrono
  try {
    const result = await vRepo.save(newVoucher);
    return res.json(result);
  } catch (error) {
    console.error("Error al guardar el voucher:", error);
    return res.status(500).json({ message: "Error interno al generar el pago" });
  }
};

export const isRealicePay = async(req: Request, res:Response) => {
  const {ids, idu} = req.params;

  const afiliados = await AppDataSource.getRepository(ServiceAffiliate).findOne({
    where:{
      Afiliado: {id:Number(idu)},
      Servicio: {id:Number(ids)}
    },
    select:{
      id:true,
      pagoRealizado:true
    }
  });
  return res.json(afiliados);
}