import express from 'express';
import dotenv from 'dotenv';
import {
  createAssignment,
  getAllAssignments,
  getStats,
  resetAssignments
} from '../assignmentService.js';

dotenv.config();

const app = express();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'halloween2024';

// Middleware
app.use(express.json());

// Admin middleware - check password
function checkAdminPassword(req, res, next) {
  const { password } = req.body || req.query;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Nieprawidłowe hasło administratora' });
  }

  next();
}

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

// Export for Vercel serverless
export default app;
