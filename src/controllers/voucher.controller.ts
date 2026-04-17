import { Request, Response } from 'express';
import {AppDataSource} from "../config/database";
import { Voucher } from '../entities/Voucher';
import { Like } from 'typeorm';
import { Service } from '../entities/Service';

export const getAll = async (_req: Request, res: Response) => {
    try {
        const voucher = await AppDataSource.getRepository(Voucher).find();
        res.json(voucher);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo voucher' });
    }
};

export const getVoucherList = async (req: Request, res: Response) => {
    try {
        const { nameVoucher } = req.params;

        // 1. Inicializamos la condición vacía (traerá todo si no hay búsqueda)
        let whereCondition: any = {};

        // 2. Filtro exclusivo por nombre del servicio
        if (nameVoucher && nameVoucher.trim() !== "" && nameVoucher !== 'undefined') {
            const search = `%${nameVoucher.trim()}%`;
            
            whereCondition = {
                service: {
                    nombre: Like(search)
                }
            };
        }

        const vouchers = await AppDataSource
            .getRepository(Voucher)
            .find({
                relations: {
                    service: {
                        logo: true
                    },
                    usuario: true
                },
                select: {
                    id: true,
                    monto: true,
                    createdAt: true,
                    service: {
                        id: true,
                        nombre: true,
                        logo: {
                            id: true,
                            tipoFormato: true,
                            logo: true
                        }
                    },
                    usuario: {
                        id: true,
                        nombres: true,
                        apellidos: true
                    }
                },
                where: whereCondition,
                order: {
                    createdAt: 'DESC'
                }
            });

        // 3. Conversión de logos a Base64
        const voucherWithBase64 = vouchers.map(rs => {
            if (rs.service?.logo?.logo) {
                // Usamos spread para no mutar el objeto original de TypeORM
                return {
                    ...rs,
                    service: {
                        ...rs.service,
                        logo: {
                            ...rs.service.logo,
                            logo: rs.service.logo.logo.toString('base64')
                        }
                    }
                };
            }
            return rs;
        });

        res.json(voucherWithBase64);

    } catch (error: any) {
        console.error("❌ Error en getVoucherList:", error.message);
        res.status(500).json({ message: 'Error obteniendo vouchers' });
    }
};


export const getVoucherListByUser = async (req: Request, res: Response) => {
    try {
        const { id, nameVoucher } = req.params;
        const userId = Number(id);

        // 1. Construcción de la condición de búsqueda
        let whereCondition: any = {
            usuario: { id: userId }
        };

        // Si hay un término de búsqueda, filtramos por el nombre del servicio
        if (nameVoucher && nameVoucher.trim() !== "" && nameVoucher !== 'undefined') {
            const search = `%${nameVoucher.trim()}%`;
            whereCondition = {
                usuario: { id: userId },
                service: {
                    nombre: Like(search) // Buscamos dentro de la relación service
                }
            };
        }

        const vouchers = await AppDataSource
            .getRepository(Voucher)
            .find({
                relations: {
                    service: {
                        usuario: true,
                        logo: true
                    },
                    usuario: true
                },
                select: {
                    id: true,
                    monto: true,
                    createdAt: true,
                    service: {
                        id: true,
                        nombre: true,
                        logo: {
                            id: true,
                            tipoFormato: true,
                            logo: true
                        },
                        usuario: {
                            id: true,
                            nombres: true,
                            apellidos: true
                        },
                    },
                },
                where: whereCondition,
                order: {
                    createdAt: 'DESC' // Opcional: mostrar los más recientes primero
                }
            });

        // 2. Mapeo para Base64 (Logo del servicio)
        const voucherWithBase64 = vouchers.map(rs => {
            if (rs.service?.logo?.logo) {
                return {
                    ...rs,
                    service: {
                        ...rs.service,
                        logo: {
                            ...rs.service.logo,
                            logo: rs.service.logo.logo.toString('base64')
                        }
                    }
                };
            }
            return rs;
        });

        res.json(voucherWithBase64);

    } catch (error: any) {
        console.error("Error en getVoucherListByUser:", error);
        res.status(500).json({ 
            message: 'Error obteniendo voucher',
            error: error.message 
        });
    }
}

export const getVoucherById = async (req: Request, res: Response) => {
    try {
        // 1. Extraer el id de los parámetros de la petición
        const { id } = req.params;

        // 2. Buscar un solo registro
        const voucher = await AppDataSource
            .getRepository(Voucher)
            .findOne({
                relations:{
                service:{
                    usuario:true,
                    logo:true
                },
                usuario:true
            },
            select:{
                id:true,
                service:{
                    id:true,
                    nombre:true,
                    logo:{
                        id:true,
                        tipoFormato:true,
                        logo:true
                    },
                    naturalezaPago:true,
                    reparticionPago: true,
                    modalidadPago:true,
                    periodoPago: true,
                    visibilidad:true,
                     usuario:{
                        id: true,
                        nombres:true,
                        apellidos:true
                    },
                },
                comision:true,
                banco:true,
                monto:true,
                createdAt:true
            },
                where: {
                    id: Number(id) // Convertimos a número porque los params llegan como string
                }
            });

        // 3. Validar si  existe
        if (!voucher) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (voucher.service.logo && voucher.service.logo.logo) {
            // Convertimos el Buffer del único usuario a string Base64
            (voucher.service.logo as any).logo = voucher.service.logo.logo.toString('base64');
        }
        res.json(voucher);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo el usuario' });
    }
};

export const getListPay = async (req: Request, res: Response) => {
    try {
        const { id, nameVoucher } = req.params;
        const userId = Number(id);

        // 1. Construcción de la condición de búsqueda
        let whereCondition: any = {
            receptor: { id: userId }
        };

        // Si hay un término de búsqueda, filtramos por el nombre del servicio
        if (nameVoucher && nameVoucher.trim() !== "" && nameVoucher !== 'undefined') {
            const search = `%${nameVoucher.trim()}%`;
            whereCondition = {
                receptor: { id: userId },
                service: {
                    nombre: Like(search) // Buscamos dentro de la relación service
                }
            };
        }

        const vouchers = await AppDataSource
            .getRepository(Voucher)
            .find({
                relations: {
                    service: {
                        usuario: true,
                        logo: true
                    },
                    usuario: true
                },
                select: {
                    id: true,
                    monto: true,
                    createdAt: true,
                    usuario:{
                        id:true,
                        nombres:true,
                        apellidos:true
                    },
                    service: {
                        id: true,
                        nombre: true,
                        logo: {
                            id: true,
                            tipoFormato: true,
                            logo: true
                        },
                        usuario: {
                            id: true,
                            nombres: true,
                            apellidos: true
                        },
                    },
                },
                where: whereCondition,
                order: {
                    createdAt: 'DESC' // Opcional: mostrar los más recientes primero
                }
            });

        // 2. Mapeo para Base64 (Logo del servicio)
        const voucherWithBase64 = vouchers.map(rs => {
            if (rs.service?.logo?.logo) {
                return {
                    ...rs,
                    service: {
                        ...rs.service,
                        logo: {
                            ...rs.service.logo,
                            logo: rs.service.logo.logo.toString('base64')
                        }
                    }
                };
            }
            return rs;
        });

        res.json(voucherWithBase64);

    } catch (error: any) {
        console.error("Error en getVoucherListByUser:", error);
        res.status(500).json({ 
            message: 'Error obteniendo voucher',
            error: error.message 
        });
    }
}