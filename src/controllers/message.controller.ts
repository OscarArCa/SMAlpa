import { Request, Response } from 'express';
import {AppDataSource} from "../config/database";
import { Message } from '../entities/Message';

export const getChat = async (req: Request, res: Response) => {
  try {
    const { id, fId } = req.params;

    const userId = Number(id);
    const friendId = Number(fId);

    if (isNaN(userId) || isNaN(friendId)) {
      return res.status(400).json({ message: "IDs inválidos" });
    }

    const resp = await AppDataSource.getRepository(Message).find({
      where: [
        {
          emisor: { id: userId },
          receptor: { id: friendId }
        },
        {
          emisor: { id: friendId },
          receptor: { id: userId }
        }
      ],
      relations: {
        emisor: { fotos: true },
        receptor: { fotos: true }
      },
      order: {
        createdAt: "ASC"
      }
    });

    const messages = resp.map(msg => {

      const isFriendSender = msg.emisor.id === friendId;

      const emisor = {
        id: msg.emisor.id,
        nombres: msg.emisor.nombres,
        apellidos: msg.emisor.apellidos,
        fotos: isFriendSender && msg.emisor.fotos?.foto
          ? {
              id: msg.emisor.fotos.id,
              tipoFormato: msg.emisor.fotos.tipoFormato,
              foto: msg.emisor.fotos.foto.toString('base64')
            }
          : null
      };

      const receptor = {
        id: msg.receptor.id,
        nombres: msg.receptor.nombres,
        apellidos: msg.receptor.apellidos,
        fotos: !isFriendSender && msg.receptor.id === friendId && msg.receptor.fotos?.foto
          ? {
              id: msg.receptor.fotos.id,
              tipoFormato: msg.receptor.fotos.tipoFormato,
              foto: msg.receptor.fotos.foto.toString('base64')
            }
          : null
      };

      return {
        id: msg.id,
        mensaje: msg.mensaje,
        createdAt: msg.createdAt,
        emisor,
        receptor
      };
    });

    res.json(messages);

  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo el chat' });
  }
};

export const setMessage = async(req:Request, res: Response) => {
  const {idu, idf} = req.params;
  const {mensaje} = req.body;

  const msgRepo = AppDataSource.getRepository(Message);

  const newMsg = msgRepo.create({
    mensaje,
    emisor: {id: Number(idu)},
    receptor: {id: Number(idf)}
  });

  const sendMsg = await msgRepo.save(newMsg);

  res.json(sendMsg);
}