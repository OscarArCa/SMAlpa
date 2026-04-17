// src/config/database.ts

import { DataSource } from 'typeorm';
import 'reflect-metadata';
import * as path from 'path';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: '123456',
    database: 'smalpa',

    entities: [
        path.join(__dirname, '..', 'entities', '*.{ts,js}')
    ],

    extra: {
    connectionLimit: 5
    },
    ssl: {
        rejectUnauthorized: false
    },

    migrations: [],
    subscribers: [],

    synchronize: true, // ✅ No tocar estructuras existentes
    logging: true, // Te sirve para ver consultas y errores
});

export const initializeDB = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('✅ Conexión a MySQL establecida con TypeORM.');
        }

        return AppDataSource;
    } catch (error) {
        console.error('❌ Error al iniciar conexión DB:', error);
        throw new Error('No se pudo conectar a la base de datos');
    }
};
