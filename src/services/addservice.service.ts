import { AppDataSource } from "../config/database";
import { Logo } from "../entities/Logo";
import { Service } from "../entities/Service";
import { User } from "../entities/User";

export class AddService {

  static async getLogoByCategories(categoria: string, subcategoria: string){

    const logoRepo = AppDataSource.getRepository(Logo);

    const formatCat = categoria as any;
    const formatSubCat = subcategoria as any;

    const logos = await logoRepo.find({
      where: {
        categoria: formatCat,
        subCategoria: formatSubCat
      }
    });

    const formattedLogos = logos.map(logo => ({
      ...logo,
      logo: logo.logo
        ? `data:image/png;base64,${logo.logo.toString('base64')}`
        : null
    }));

    return formattedLogos;
  }
  

  static async setService(idUser: string, idLogo: string, nombre: string, descripcion:string,
     costoServicio: number, naturalezaPago: string, modalidadPago:string, periodoPago: number,
      reparticionPago: string, porcentaje: number, visibilidad: string){

        const serviceRepo = AppDataSource.getRepository<Service>(Service);
        const userRepo = AppDataSource.getRepository(User);

        const logoRepo = AppDataSource.getRepository(Logo);

        const myUser = await userRepo.findOne({
          where: {
            id: Number(idUser)
          }
        });

        if(!myUser){
          return {
            status: "error",
            message: "Usuario no encontrado"
        };
        }

        const thisLogo = await logoRepo.findOne({
          where:{
            id:Number(idLogo)
          }
        });

        if(!thisLogo){
          return {
            status: "error",
            message: "Logo no encontrado"
          };
        }

        const formatNat = naturalezaPago as any;
        const formatMod = modalidadPago as any;
        const formatRep = reparticionPago as any;
        const formatVis = visibilidad as any;


        const newService = serviceRepo.create({
  nombre,
  descripcion,
  costoServicio,
  naturalezaPago: formatNat,
  modalidadPago: formatMod,
  periodoPago,
  reparticionPago: formatRep,
  porcentaje,
  visibilidad: formatVis,
  usuario: myUser,
  logo: thisLogo
});

await serviceRepo.save(newService);

return {
  status: "success",
  message: "Servicio creado correctamente"
};
  }
}