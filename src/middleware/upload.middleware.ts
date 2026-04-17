import multer from "multer";

// 1. Configuramos para que el archivo se guarde en la memoria RAM (como Buffer)
// y no en una carpeta del disco.
const storage = multer.memoryStorage();

// 2. Creamos la instancia de multer
const upload = multer({ storage: storage });

// 3. Exportamos el middleware. 
// "fotoPerfil" es el nombre que debe enviar el cliente.
export const uploadFoto = upload.single("fotoPerfil");