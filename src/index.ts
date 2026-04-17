import "dotenv/config";
import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { initializeDB } from './config/database';

// Rutas
import userRoutes from './routes/user.routes';
import serviceRoutes from './routes/service.routes';
import voucherRoutes from './routes/voucher.routes';
import friendRoutes from './routes/friend.routes';
import messageRoutes from './routes/messaje.routes';
import ReportRoutes from './routes/report.routes';
import authRoutes from './routes/auth.routes';
import DashboardRoutes from './routes/dashboard.routes';
import profileRouter from './routes/profile.routes';

// 🔹 Importar el automatismo de pagos (Cron Job)
import './middleware/scheduler'; 

// ✅ Convertir a número
const PORT = Number(process.env.PORT) || 3000;

const app = express();
console.log("🔥 INICIANDO SERVIDOR...");

// 🔥 CORS abierto (para pruebas con app móvil)
app.use(cors({
    origin: '*', // puedes restringir luego
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Registro de Rutas
app.use("/api/user", userRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/voucher", voucherRoutes);
app.use("/api/friend", friendRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/report", ReportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", DashboardRoutes);
app.use("/api/profile", profileRouter);

const main = async () => {
    try {
        await initializeDB();
        console.log('✅ Base de Datos conectada exitosamente');

        // 🔥 IMPORTANTE: 0.0.0.0 para acceso desde red local
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`📡 Servidor corriendo en http://0.0.0.0:${PORT}`);
            console.log(`🌐 Acceso desde red: http://192.168.18.174:${PORT}`);
            console.log(`⏰ Cron activo`);
        });

    } catch (error) {
        console.error('❌ FATAL ERROR:', error);
        process.exit(1);
    }
};

main();