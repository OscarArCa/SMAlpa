import { Request, Response } from 'express';
import {User} from "../entities/User";
import {AppDataSource} from "../config/database";
import { Equal, Not, Like } from 'typeorm';
import { Service } from '../entities/Service';
import { ServiceAffiliate } from '../entities/ServiceAffiliate';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const users = await AppDataSource.getRepository(User).find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo usuarios' });
    }
};

export const UsersList = async (req: Request, res: Response) => {
    try {
        const { id, nameUser } = req.params;
        const userId = Number(id);

        // 1. Definimos las condiciones base (excluir al usuario actual)
        let whereCondition: any = {
            id: Not(userId)
        };

        // 2. Si hay un término de búsqueda, usamos un array para aplicar un "OR" 
        // entre nombres y apellidos
        if (nameUser && nameUser.trim() !== "" && nameUser !== 'undefined') {
            const search = `%${nameUser.trim()}%`;
            
            whereCondition = [
                { id: Not(userId), nombres: Like(search) },
                { id: Not(userId), apellidos: Like(search) }
            ];
        }

        const users = await AppDataSource
            .getRepository(User)
            .find({
                relations: {
                    fotos: true
                },
                select: {
                    id: true,
                    nombres: true,
                    apellidos: true,
                    email: true,
                    roles: true,
                    fotos: {
                        id: true,
                        tipo: true,
                        tipoFormato: true,
                        foto: true
                    }
                },
                where: whereCondition
            });

        // 3. Mapeo para convertir la foto a Base64 de forma segura
        const usersWithBase64 = users.map(user => {
            if (user.fotos && user.fotos.foto) {
                return {
                    ...user,
                    fotos: {
                        ...user.fotos,
                        foto: user.fotos.foto.toString('base64')
                    }
                };
            }
            return user;
        });

        res.json(usersWithBase64);
        
    } catch (error: any) {
        console.error("Error en UsersList:", error);
        res.status(500).json({ 
            message: 'Error obteniendo usuarios',
            error: error.message 
        });
    }
};


export const getByIdHeader = async (req: Request, res: Response) => {
    try {
        // 1. Extraer el id de los parámetros de la petición
        const { id } = req.params;

        // 2. Buscar un solo registro
        const user = await AppDataSource
            .getRepository(User)
            .findOne({
                relations:{
                    fotos:true
                },
                select: {
                    id:true,
                    nombres:true,
                    apellidos:true,
                    fotos:{
                        id:true,
                        tipo:true,
                        tipoFormato:true,
                        foto:true
                    }
                },
                where: {
                    id: Number(id) // Convertimos a número porque los params llegan como string
                }
            });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Procesamos solo el objeto 'user' encontrado
        if (user.fotos && user.fotos.foto) {
            // Convertimos el Buffer del único usuario a string Base64
            (user.fotos as any).foto = user.fotos.foto.toString('base64');
        }

        // Respondemos con el objeto procesado
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo el usuario' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        // 1. Extraer el id de los parámetros de la petición
        const { id } = req.params;

        // 2. Buscar un solo registro
        const user = await AppDataSource
            .getRepository(User)
            .findOne({
                relations:{
                    fotos:true,
                    ubicacion:{
                        distrito:{
                            provincia:{
                                region:{
                                    pais:true
                                }
                            }
                        }
                    }
                },
                select: {
                    id:true,
                    nombres:true,
                    apellidos:true,
                    celular:true,
                    dni:true,
                    email:true,
                    fechaNacimiento:true,
                    password:true,
                    fotos:{
                        id:true,
                        tipoFormato:true,
                        foto:true
                    },
                    ubicacion:{
                        id:true,
                        direccion:true,
                        distrito:{
                            id:true,
                            nombre:true,
                            provincia:{
                                id:true,
                                nombre:true,
                                region:{
                                    id:true,
                                    nombre:true,
                                    pais:{
                                        id:true,
                                        nombre:true
                                    }
                                }
                            }
                        }
                    }
                },
                where: {
                    id: Number(id) // Convertimos a número porque los params llegan como string
                }
            });

        // 3. Validar si el usuario existe
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if(user.fotos && user.fotos.foto){
            (user.fotos as any).foto =user.fotos.foto.toString('base64')
        }

        // 4. Responder con el objeto del usuario
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo el usuario' });
    }
};

export const getFriendById = async (req: Request, res: Response) => {
    try {
        // 1. Extraer el id de los parámetros de la petición
        const { id } = req.params;

        // 2. Buscar un solo registro
        const user = await AppDataSource
            .getRepository(User)
            .findOne({
                relations:{
                    fotos:true,
                    ubicacion:{
                        distrito:{
                            provincia:{
                                region:{
                                    pais:true
                                }
                            }
                        }
                    }
                },
                select: {
                    id:true,
                    nombres:true,
                    apellidos:true,
                    celular:true,
                    dni:true,
                    email:true,
                    fotos:{
                        id:true,
                        tipoFormato:true,
                        foto:true
                    },
                    ubicacion:{
                        id:true,
                        direccion:true,
                        distrito:{
                            id:true,
                            nombre:true,
                            provincia:{
                                id:true,
                                nombre:true,
                                region:{
                                    id:true,
                                    nombre:true,
                                    pais:{
                                        id:true,
                                        nombre:true
                                    }
                                }
                            }
                        }
                    }
                },
                where: {
                    id: Number(id) // Convertimos a número porque los params llegan como string
                }
            });

        // 3. Validar si el usuario existe
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if(user.fotos){
            (user.fotos as any).foto = user.fotos.foto.toString('base64');
        }

        // 4. Responder con el objeto del usuario
        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo el usuario' });
    }
};

export const getServiceByUser = async (req: Request, res: Response) => {

  const { id } = req.params;

  const service = await AppDataSource.getRepository(Service).find({
    where: {
      usuario: {
        id: Number(id)
      }
    },
    relations: {
      usuarioAfiliado: true
    },
    select: {
      id: true,
      nombre: true,
      costoServicio: true
    }
  });

  const result = service.map(s => ({
    idServicio: s.id,
    nombreServicio: s.nombre,
    costoServicio: s.costoServicio,
    numAfiliados: s.usuarioAfiliado?.length || 0
  }));

  res.json(result);
};

export const getSharedServices = async (req: Request, res: Response) => {

  const { id } = req.params;
  const { fId} = req.params;

  const service = await AppDataSource.getRepository(Service).find({
    where: [
        {usuario:{id: Number(id)}, usuarioAfiliado:{Afiliado:{id: Number(fId)}}},
        {usuario:{id: Number(fId)}, usuarioAfiliado:{Afiliado:{id: Number(id)}}}
    ],
    relations: {
      usuario:true
    },
    select: {
      id: true,
      nombre: true,
      costoServicio: true,
      usuario:{
        id:true,
        nombres:true,
        apellidos:true
      }
    }
  });

  res.json(service);
};

export const getNumServiceByUserId = async(req:Request,res:Response) => {

    const {id} = req.params;

    const service = await AppDataSource.getRepository(Service).count({

        where:{
            usuario:{
                id: Number(id)
            }
        }
    });

    res.json({numServicios: service});
}

export const getServiceAfiliateByUser = async(req:Request,res:Response) =>{

    const {id} = req.params;

    const services = await AppDataSource.getRepository(ServiceAffiliate).find({
        relations:{
            Servicio:{
                usuario:true
            }
        },
        where:{
            Afiliado:{id: Number(id)}
        },
        select:{
            id:true,
            Servicio:{
                id:true,
                nombre:true,
                costoServicio:true,
                usuario:{
                    id:true,
                    nombres:true,
                    apellidos:true
                }
            }
        }
    });
    res.json(services);
}

export const estatusUser = async (req: Request, res: Response) => {
  const { id, estado } = req.params;

  const userRepo = AppDataSource.getRepository(User);

  // 🔍 Buscar usuario
  const usuario = await userRepo.findOne({
    where: { id: Number(id) }
  });

  if (!usuario) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // ⚠️ Validar estado
  if (estado === undefined) {
    return res.status(400).json({ message: 'Estado vacío o inexistente' });
  }

  let op: boolean;

  // ✅ Convertir a boolean correctamente
  if (estado === '0') {
    op = false;
  } else if (estado === '1') {
    op = true;
  } else {
    return res.status(400).json({ message: 'Estado debe ser 0 o 1' });
  }

  // 🔄 Actualizar (IMPORTANTE: usar await)
  await userRepo.update(
    { id: Number(id) },
    { suspendido: op }
  );

  return res.json({ message: 'Actualizado correctamente' });
};

