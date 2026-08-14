import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import problemRoutes from './routes/problems.js';
import taskRoutes from './routes/tasks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend client
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Service Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sofo ProjectOS Express Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    backends: {
      ems: 'https://erp-backend-1-02lc.onrender.com',
      erp: 'https://pjsofonic-erp-backend.onrender.com'
    }
  });
});

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/tasks', taskRoutes);

// Start Backend Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Sofo ProjectOS Backend API server running on http://localhost:${PORT}`);
  console.log(`🔒 EMS/ERP Team Leader Auth: ACTIVE`);
  console.log(`🔄 ERP Project Sync: ACTIVE`);
});
