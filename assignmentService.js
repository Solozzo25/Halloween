import { topics, participants } from './data.js';

// In-memory storage
// Key: normalized userName (lowercase, trimmed)
// Value: assignment object
const assignments = new Map();
const usedRecipients = new Set();

/**
 * Normalize user name for consistent storage
 */
function normalizeUserName(userName) {
  return userName.trim().toLowerCase();
}

/**
 * Get a random item from an array
 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get an available recipient (not yet assigned)
 */
function getAvailableRecipient() {
  const available = participants.filter(p => !usedRecipients.has(p));

  if (available.length === 0) {
    return null;
  }

  return getRandomItem(available);
}

/**
 * Create a new assignment for a user
 * If user already has an assignment, returns the existing one
 */
export function createAssignment(userName) {
  if (!userName || userName.trim() === '') {
    throw new Error('Nazwa użytkownika jest wymagana');
  }

  const normalizedName = normalizeUserName(userName);
  const displayName = userName.trim();

  // Check if this user already has an assignment
  if (assignments.has(normalizedName)) {
    const existingAssignment = assignments.get(normalizedName);
    return {
      ...existingAssignment,
      isExisting: true,
      message: 'To przypisanie zostało już wcześniej utworzone dla tego imienia.'
    };
  }

  // Check if max capacity reached
  if (usedRecipients.size >= participants.length) {
    throw new Error('Brak dostępnych miejsc. Wszystkie osoby zostały już przypisane.');
  }

  // Get random topic
  const topic = getRandomItem(topics);

  // Get available recipient
  const recipient = getAvailableRecipient();

  if (!recipient) {
    throw new Error('Brak dostępnych odbiorców');
  }

  // Create assignment
  const assignment = {
    userName: displayName,
    topic,
    recipient,
    timestamp: new Date().toISOString()
  };

  // Store assignment with normalized name as key
  assignments.set(normalizedName, assignment);
  usedRecipients.add(recipient);

  return assignment;
}

/**
 * Get all assignments
 */
export function getAllAssignments() {
  return Array.from(assignments.values());
}

/**
 * Get statistics
 */
export function getStats() {
  return {
    totalAssignments: assignments.size,
    availableSlots: participants.length - usedRecipients.size,
    maxCapacity: participants.length
  };
}

/**
 * Reset all assignments
 */
export function resetAssignments() {
  assignments.clear();
  usedRecipients.clear();
  return { message: 'Wszystkie przypisania zostały zresetowane' };
}
