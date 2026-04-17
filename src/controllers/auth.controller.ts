import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export const login = async (req: Request, res: Response) => {
  try {

    console.log("BODY:", req.body);

    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    console.log("LOGIN OK");

    return res.json(result);

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { nombres, apellidos, email, celular, dni, password } = req.body;

    const result = await AuthService.register(
      nombres, apellidos, email, celular, dni, password
    );

    // ✅ QUITA EL MESSAGE. Devuelve 'result' directamente.
    // Esto enviará { token, user: { id, ... } } igual que el login.
    return res.status(201).json(result); 

  } catch (error: any) {
    return res.status(400).json({ 
      message: error.message 
    });
  }
};