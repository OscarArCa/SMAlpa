// src/services/profile.service.ts
import { AppDataSource } from "../config/database";
import { Country } from "../entities/Country";
import { District } from "../entities/District";
import { Photo } from "../entities/Photo";
import { Province } from "../entities/Province";
import { Region } from "../entities/Region";
import { User } from "../entities/User";
import { Location } from "../entities/Location";

export class ProfileService {
    
    static async setPhoto (MyId: string, BufferPhoto: Buffer, Formato: string){

        const RepoUser = AppDataSource.getRepository(User);
        const RepoPhoto = AppDataSource.getRepository(Photo);

        const userConfirm = await RepoUser.findOne({
            where:{
                id: Number(MyId),
            },
            relations:{
                fotos:true
            }
        });

        if (!userConfirm) {
        throw new Error("Usuario no encontrado");
    }

        const format = Formato as any;

        if(userConfirm?.fotos.id === 1){
            const newPhoto = RepoPhoto.create({
                nombre: 'Nueva Photo',
                tipo: 'privado',
                tipoFormato: format,
                foto: BufferPhoto
            });

            const savePhoto = await RepoPhoto.save(newPhoto);

            userConfirm.fotos = savePhoto;
            //userConfirm.fotos.id = savePhoto.id;

        await RepoUser.save(userConfirm);

         return {
            message: "Foto personalizada creada y asignada correctamente"
        };

        }else{
            userConfirm.fotos.nombre = 'Foto de perfil';
            userConfirm.fotos.tipoFormato = format;
            userConfirm.fotos.foto = BufferPhoto;

            await RepoPhoto.save(userConfirm.fotos);

            return {
            message: "Foto actualizada correctamente"
            };
        }
    }

    static async editData(MyId: string, email: string, celular: string, fechNac: Date){

    const RepoUser = AppDataSource.getRepository(User);

    const editUser = await RepoUser.findOne({
        where:{
            id: Number(MyId)
        }
    });

    if(!editUser){
        return {
            status: "error",
            message: "Usuario no encontrado"
        };
    }

    // Normalizar fechas de forma segura
    const fechaBD = editUser.fechaNacimiento
        ? new Date(editUser.fechaNacimiento).toISOString().split("T")[0]
        : "";

    const fechaNueva = fechNac
        ? new Date(fechNac).toISOString().split("T")[0]
        : "";

    // Si no hay cambios
    if(
        editUser.email === email &&
        editUser.celular === celular &&
        fechaBD === fechaNueva
    ){
        return {
            status: "success",
            message: "No hubo cambio alguno"
        };
    }

    // Actualizar datos
    editUser.email = email;
    editUser.celular = celular;
    editUser.fechaNacimiento = fechNac;

    await RepoUser.save(editUser);

    return {
        status: "success",
        message: "Datos del usuario actualizados correctamente"
    };
}

static async editLocation(
  userId: number,
  direccion: string,
  distritoId: number
) {

  const locationRepo = AppDataSource.getRepository(Location);
  const districtRepo = AppDataSource.getRepository(District);
  const userRepo = AppDataSource.getRepository(User);

  const district = await districtRepo.findOne({
    where: { id: distritoId }
  });

  if (!district) {
    throw new Error("Distrito no encontrado");
  }

  const user = await userRepo.findOne({
    where: { id: Number(userId) },
    relations: { ubicacion: true }
  });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // SI EL USUARIO NO TIENE LOCATION → CREAR
  if (!user.ubicacion) {

    const newLocation = locationRepo.create({
      direccion,
      distrito: district
    });

    const savedLocation = await locationRepo.save(newLocation);

    user.ubicacion = savedLocation;

    await userRepo.save(user);

    return savedLocation;
  }

  // SI YA TIENE → EDITAR
  user.ubicacion.direccion = direccion;
  user.ubicacion.distrito = district;

  return await locationRepo.save(user.ubicacion);
}
    
}