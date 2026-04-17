import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { comparePassword, hashPassword } from "../utils/hash";
import jwt from "jsonwebtoken";

import { JWT_CONFIG } from "../config/jwt";

export class AuthService {

  static async login(email: string, password: string) {

    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { email }
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        roles: user.roles
      }
    };
  }

  static async register(nombres: string, apellidos: string, email: string, celular: string, dni: string, password: string) {
    const userRepo = AppDataSource.getRepository(User);

    // 1. Verificar existencia
    const existingUser = await userRepo.findOne({ where: [{ dni }, { email }] });
    if (existingUser) {
        throw new Error("User already exists (DNI or Email)");
    }

    // 2. Encriptar contraseña
    const hashedPassword = await hashPassword(password);

    // 3. Crear objeto
    const newUser = userRepo.create({
        nombres,
        apellidos,
        email,
        celular,
        dni,
        password: hashedPassword,
        roles: 'user',
        fotos: { id: 1 }
    });

    // 4. Guardar en la base de datos
    const savedUser = await userRepo.save(newUser);
    
    // --- APLICACIÓN DE LA OPCIÓN 2: REFRESCAR DATOS ---
    // Forzamos una búsqueda por email para obtener el ID real generado por la DB
    const userWithId = await userRepo.findOne({ 
        where: { email: email }
    });

    // Verificamos que el usuario realmente exista y tenga ID
    if (!userWithId || !userWithId.id) {
        console.error("❌ Error Crítico: La base de datos no devolvió un ID tras el registro.");
        throw new Error("Internal Server Error: User ID not generated");
    }

    // 5. Generar Token usando los datos confirmados de la DB
    const token = jwt.sign(
        { id: userWithId.id, email: userWithId.email },
        JWT_CONFIG.secret,
        { expiresIn: JWT_CONFIG.expiresIn }
    );

    // 6. Retornar estructura idéntica al Login (con ID garantizado)
    return {
        token,
        user: {
            id: Number(userWithId.id), // Aseguramos que sea un número
            nombres: userWithId.nombres,
            apellidos: userWithId.apellidos,
            email: userWithId.email,
            roles: userWithId.roles
        }
    };
  }

}
