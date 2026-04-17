import { Request, Response } from 'express';
import {AppDataSource} from "../config/database";
import { FriendShip } from '../entities/FriendShip';
import { ILike, In, Brackets } from 'typeorm';
import { User } from '../entities/User';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const friend = await AppDataSource.getRepository(FriendShip).find(
            {
                relations:{
                    emisor:true,
                    receptor:true
                }
            }
        );
        res.json(friend);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo amigos' });
    }
    
};

export const getMyListFriendship = async (req: Request, res: Response) => {
  try {
    const { id, nameUser } = req.params;
    const userId = Number(id);

    // 1. Construimos el filtro de búsqueda
    const search = (nameUser && nameUser.trim() !== "") ? ILike(`%${nameUser.trim()}%`) : null;

    // 2. Definimos las condiciones. 
    // IMPORTANTE: Si yo soy el RECEPTOR, busco el nombre en el EMISOR (mi amigo) y viceversa.
    let whereConditions: any[];

    if (search) {
      whereConditions = [
        // Caso A: Yo soy Receptor, busco en el nombre/apellido del Emisor
        { receptor: { id: userId }, emisor: { nombres: search }, estado: 'activo' },
        { receptor: { id: userId }, emisor: { apellidos: search }, estado: 'activo' },
        // Caso B: Yo soy Emisor, busco en el nombre/apellido del Receptor
        { emisor: { id: userId }, receptor: { nombres: search }, estado: 'activo' },
        { emisor: { id: userId }, receptor: { apellidos: search }, estado: 'activo' }
      ];
    } else {
      whereConditions = [
        { receptor: { id: userId }, estado: 'activo' },
        { emisor: { id: userId }, estado: 'activo' }
      ];
    }

    const friendships = await AppDataSource
      .getRepository(FriendShip)
      .find({
        where: whereConditions,
        relations: ["emisor", "emisor.fotos", "receptor", "receptor.fotos"],
      });

    // 3. Procesamiento de los datos
    const friendsOnly = friendships.map(f => {
      const friend = f.emisor.id === userId ? f.receptor : f.emisor;

      // Conversión de Buffer a Base64
      if (friend.fotos && (friend.fotos as any).foto) {
        const fotoBuffer = (friend.fotos as any).foto;
        // Creamos una copia para no mutar el objeto original si prefieres, 
        // pero aquí seguimos tu lógica directa:
        (friend.fotos as any).foto = fotoBuffer.toString('base64');
      }

      return friend;
    });

    res.json(friendsOnly);

  } catch (error) {
    console.error("Error en getMyListFriendship:", error);
    res.status(500).json({ message: 'Error obteniendo amigos' });
  }
};

export const getMutualFriends = async (req: Request, res: Response) => {

  const userA = Number(req.params.id);
  const userB = Number(req.params.fId);

  const repo = AppDataSource.getRepository(FriendShip);

  const getFriendIds = async (userId: number) => {
    const friendships = await repo.find({
      where: [
        { emisor: { id: userId } },
        { receptor: { id: userId } }
      ],
      relations: { emisor: true, receptor: true }
    });

    return friendships.map(f =>
      f.emisor.id === userId ? f.receptor.id : f.emisor.id
    );
  };

  const [idsA, idsB] = await Promise.all([
    getFriendIds(userA),
    getFriendIds(userB)
  ]);

  const mutualIds = idsA.filter(id => new Set(idsB).has(id));

  if (!mutualIds.length) return res.json([]);

  const mutualUsers = await AppDataSource.getRepository(User).find({
    where: { id: In(mutualIds) },
    relations: { fotos: true }
  });

  // 🔥 Aquí está el cambio correcto
  const result = mutualUsers.map(user => ({
    id: user.id,
    nombres: user.nombres,
    apellidos: user.apellidos,
    email: user.email,
    fotos: user.fotos
      ? {
          id: user.fotos.id,
          tipoFormato: user.fotos.tipoFormato,
          foto: user.fotos.foto
            ? `data:${user.fotos.tipoFormato};base64,${user.fotos.foto.toString("base64")}`
            : null
        }
      : null
  }));

  res.json(result);
};


export const getMyRequest = async (req: Request, res: Response) => {
  try {
    const { id, nameUser } = req.params;
    const userId = Number(id);

    // 1. Limpieza de parámetro de búsqueda
    const hasSearch = nameUser && nameUser !== 'undefined' && nameUser.trim() !== "";
    
    const query = AppDataSource.getRepository(FriendShip)
      .createQueryBuilder('f')
      .leftJoinAndSelect('f.emisor', 'emisor')
      .leftJoinAndSelect('emisor.fotos', 'emisorFoto')
      .leftJoinAndSelect('f.receptor', 'receptor')
      .leftJoinAndSelect('receptor.fotos', 'receptorFoto')
      // Joins para conteo de reportes (Usar comillas simples para valores de string en ON)
      .leftJoin('report', 'r_emisor', 'r_emisor.denunciadoId = emisor.id AND r_emisor.tipo = :t', { t: 'usuario' })
      .leftJoin('report', 'r_receptor', 'r_receptor.denunciadoId = receptor.id AND r_receptor.tipo = :t', { t: 'usuario' })
      .addSelect('COUNT(DISTINCT r_emisor.id)', 'emisor_reportes')
      .addSelect('COUNT(DISTINCT r_receptor.id)', 'receptor_reportes')
      .where('(emisor.id = :id OR receptor.id = :id)', { id: userId })
      .andWhere('f.estado = :estado', { estado: 'pendiente' });

    // 2. FILTRO DE BÚSQUEDA CORREGIDO (Uso de LIKE para MySQL)
    if (hasSearch) {
      const search = `%${nameUser.trim()}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('emisor.nombres LIKE :search', { search })
            .orWhere('emisor.apellidos LIKE :search', { search })
            .orWhere('receptor.nombres LIKE :search', { search })
            .orWhere('receptor.apellidos LIKE :search', { search });
        })
      );
    }

    // 3. Agrupación y Ejecución
    const resultRaw = await query
      .groupBy('f.id')
      .addGroupBy('emisor.id')
      .addGroupBy('emisorFoto.id')
      .addGroupBy('receptor.id')
      .addGroupBy('receptorFoto.id')
      .getRawAndEntities();

    // 4. Mapeo
    const finalResult = resultRaw.entities.map((f) => {
      // Búsqueda en raw más robusta para MySQL
      const raw = resultRaw.raw.find(r => 
        Number(r.f_emisorId || r.emisor_id) === f.emisor?.id && 
        Number(r.f_receptorId || r.receptor_id) === f.receptor?.id
      );

      const isEmisor = f.emisor.id === userId;
      const friend = isEmisor ? f.receptor : f.emisor;

      let fotoObj = null;
      if (friend.fotos) {
        fotoObj = {
          id: friend.fotos.id,
          tipoFormato: friend.fotos.tipoFormato,
          foto: friend.fotos.foto ? friend.fotos.foto.toString('base64') : null
        };
      }

      const numReportes = isEmisor
        ? Number(raw?.receptor_reportes || 0)
        : Number(raw?.emisor_reportes || 0);

      return {
        id: f.id, // ID de la amistad
        friendId: friend.id,
        nombres: friend.nombres,
        apellidos: friend.apellidos,
        email: friend.email,
        dni: friend.dni,
        celular: friend.celular,
        fotos: fotoObj,
        numReportes: numReportes
      };
    });

    res.json(finalResult);

  } catch (error: any) {
    console.error("❌ Error en getMyRequest:", error);
    res.status(500).json({ 
      message: 'Error obteniendo solicitudes',
      error: error.message 
    });
  }
};


export const updateStatus = async (req: Request, res: Response) => {
  const { idf, idu, estado } = req.params;

  const friendRepo = AppDataSource.getRepository(FriendShip);

  const amigo = await friendRepo.findOne({
    where: [
      { emisor: { id: Number(idf) }, receptor: { id: Number(idu) } },
      { emisor: { id: Number(idu) }, receptor: { id: Number(idf) } }
    ]
  });

  if (!amigo) {
    return res.status(404).json({ message: "Amistad no encontrada" });
  }

  if (!estado) {
    return res.status(400).json({ message: "Estado inválido" });
  }

  const fEstado = estado as any;

  if (amigo.estado === estado) {
    return res.status(400).json({ message: "El estado ya está actualizado" });
  }

  await friendRepo.update(
    { id: amigo.id },
    { estado: fEstado }
  );

  return res.json({ message: "Estado actualizado correctamente" });
};

export const addFriends = async (req: Request, res: Response) => {
  try {
    const { eid } = req.params;
    const { dni } = req.body;

    const userRepo = AppDataSource.getRepository(User);
    const friendRepo = AppDataSource.getRepository(FriendShip);

    const emisorUser = await userRepo.findOneBy({ id: Number(eid) });
    const receptorUser = await userRepo.findOneBy({ dni: dni });

    // 2. Validaciones de existencia (Esto elimina el error de 'null')
    if (!emisorUser) {
      return res.status(404).json({ message: "El emisor no existe" });
    }

    if (!receptorUser) {
      return res.status(404).json({ message: "No se encontró el usuario receptor" });
    }

    const newFriend = friendRepo.create({
      estado: 'pendiente',
      emisor: emisorUser,
      receptor: receptorUser
    });

    const result = await friendRepo.save(newFriend);

    return res.status(201).json(result);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al agregar amigo" });
  }
};