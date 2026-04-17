import cron from 'node-cron';
import { AppDataSource } from '../config/database';
import { Service } from '../entities/Service';
import { ServiceAffiliate } from '../entities/ServiceAffiliate';

cron.schedule('59 23 * * *', async () => {
    const ahora = new Date();
    const hoy = ahora.getDate();
    
    const mañana = new Date(ahora);
    mañana.setDate(ahora.getDate() + 1);
    const esUltimoDia = mañana.getDate() === 1;

    console.log(`[Cron] Revisión de pagos - Día: ${hoy} | Fin de mes: ${esUltimoDia}`);

    try {
        const serviceRepo = AppDataSource.getRepository(Service);
        const affiliateRepo = AppDataSource.getRepository(ServiceAffiliate);

        let serviciosAfectados: Service[] = [];

        if (esUltimoDia) {
            // Captura el día actual y cualquier día posterior que no exista en este mes
            serviciosAfectados = await serviceRepo.createQueryBuilder("service")
                .where("service.periodoPago >= :hoy", { hoy })
                .getMany();
        } else {
            // Día normal: coincidencia exacta
            serviciosAfectados = await serviceRepo.find({
                where: { periodoPago: hoy }
            });
        }

        if (serviciosAfectados.length > 0) {
            const ids = serviciosAfectados.map(s => s.id);

            await serviceRepo.createQueryBuilder()
            .update(Service)
            .set({pagoRealizado:false})
            .where("id IN (:...ids)", {ids})
            .execute();

            await affiliateRepo.createQueryBuilder()
                .update(ServiceAffiliate)
                .set({ pagoRealizado: false })
                .where("servicioId IN (:...ids)", { ids })
                .execute();
            
            console.log(`✅ Pago reseteado (pagoRealizado = false) para afiliados de ${ids.length} servicios.`);
        } else {
            console.log("ℹ️ No hay servicios para resetear hoy.");
        }

    } catch (error) {
        console.error("❌ Error en el cron de reseteo mensual:", error);
    }
}, {
    timezone: "America/Lima"
});