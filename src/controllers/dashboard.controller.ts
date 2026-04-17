import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { Equal, Not, Between, IsNull } from "typeorm";
import { Service } from "../entities/Service";
import { Report } from "../entities/Report";
import { Voucher } from "../entities/Voucher";
import { FriendShip } from "../entities/FriendShip";
import { ServiceAffiliate } from "../entities/ServiceAffiliate";

export const getDashboardAdmin = async (req: Request, res: Response) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Ejecutamos todas las promesas en paralelo para mayor velocidad
        const [
            users,
            services,
            report_service,
            report_user,
            report,
            total_pay,
            voucher_today
        ] = await Promise.all([
            AppDataSource.getRepository(User).count({ where: { roles: Equal('user') } }),
            AppDataSource.getRepository(Service).count(),
            AppDataSource.getRepository(Report).count({ where: { servicio: Not(IsNull()) } }),
            AppDataSource.getRepository(Report).count({ where: { servicio: IsNull() } }),
            AppDataSource.getRepository(Report).count(),
            AppDataSource.getRepository(Voucher).count(),
            AppDataSource.getRepository(Voucher).count({
                where: { createdAt: Between(startOfDay, endOfDay) }
            })
        ]);

        return res.json({
            numUsers: users,
            numServices: services,
            numRptUsers: report_user,
            numRptServices: report_service,
            numReports: report,
            numVouchersToDay: voucher_today,
            numVouchers: total_pay
        });

    } catch (error) {
        console.error("Error en getDashBoardAdmin:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

export const getDashboardUser = async (req: Request, res: Response) => {
    try {

        const {id} = req.params;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        // Ejecutamos todas las promesas en paralelo para mayor velocidad
        const [friends,ownerservice,privateservice,publicservice,afiliate,voucher,voucher_today
        ] = await Promise.all([
            AppDataSource.getRepository(FriendShip).count({where: [{emisor:{id:Number(id)}},{receptor:{id:Number(id)}}]}),
            AppDataSource.getRepository(Service).count({where: {usuario:{id:Number(id)}}}),
            AppDataSource.getRepository(Service).count({where: {usuario:{id:Number(id)},visibilidad:Equal('privado')}}),
            AppDataSource.getRepository(Service).count({where: {usuario:{id:Number(id)},visibilidad:Equal('publico')}}),
            AppDataSource.getRepository(ServiceAffiliate).count({where: {Afiliado:{id:Number(id)}}}),
            AppDataSource.getRepository(Voucher).count({where:{usuario:{id:Number(id)}}}),
            AppDataSource.getRepository(Voucher).count({
                where: { createdAt: Between(startOfDay, endOfDay),usuario:{id:Number(id)} }
            })
        ]);

        return res.json({
            numFriends: friends,
            numServices: ownerservice + afiliate,
            numPlbService: publicservice,
            numPrvService: privateservice,
            numServiceAffiliate: afiliate,
            numVouchersToDay: voucher_today,
            numVouchers: voucher 
        });

    } catch (error) {
        console.error("Error en getDashBoardAdmin:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}