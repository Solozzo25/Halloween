import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  createAssignment,
  getAllAssignments,
  getStats,
  resetAssignments
} from './assignmentService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'halloween2024';

// Middleware
app.use(express.json());

// Vite dev server in development
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

// API Routes first (before Vite middleware)
// Create new assignment
app.post('/api/assign', (req, res) => {
  try {
    const { userName } = req.body;

    if (!userName) {
      return res.status(400).json({ error: 'Nazwa użytkownika jest wymagana' });
    }

    const assignment = createAssignment(userName);
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get status (available slots)
app.get('/api/status', (req, res) => {
  try {
    const stats = getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin middleware - check password
function checkAdminPassword(req, res, next) {
  const { password } = req.body || req.query;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Nieprawidłowe hasło administratora' });
  }

  next();
}

// Get all assignments (admin only)
app.post('/api/admin/assignments', checkAdminPassword, (req, res) => {
  try {
    const assignments = getAllAssignments();
    const stats = getStats();
    res.json({ assignments, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset all assignments (admin only)
app.post('/api/admin/reset', checkAdminPassword, (req, res) => {
  try {
    const result = resetAssignments();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Use Vite's middleware to serve the frontend (after API routes)
app.use(vite.middlewares);

// Start server
app.listen(PORT, () => {
  console.log(`🎃 Server running on http://localhost:${PORT}`);
});
