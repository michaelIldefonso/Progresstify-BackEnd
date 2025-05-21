const pool = require("../../config/db");

const createCard = async (columnId, text, checked, position, dueDate = null) => {
  const result = await pool.query(
    "INSERT INTO cards (column_id, text, checked, position, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [columnId, text, checked, position, dueDate]
  );
  return result.rows[0];
};

// Update a card's due date
const updateCardDueDate = async (id, dueDate) => {
  try {
    const result = await pool.query(
      "UPDATE cards SET due_date = $1 WHERE id = $2 RETURNING *",
      [dueDate, id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Database Error:", error); // Keep this for error logging
    throw error;
  }
};

// Fetch tasks with upcoming deadlines
const getUpcomingTasks = async (userId, days = 7) => {
  // Get today's date in UTC at midnight
  const today = new Date();

  // Calculate end date
  const end = new Date(today);
  end.setDate(end.getDate() + Number(days));

  const todayStr = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  const endStr = end.toISOString().slice(0, 10);     // 'YYYY-MM-DD'

  const result = await pool.query(
    `SELECT 
      workspaces.name AS workspace_name,
      boards.name AS board_name,
      columns.title,
      cards.text, 
      cards.due_date
      FROM cards
      JOIN columns ON cards.column_id = columns.id
      JOIN boards ON columns.board_id = boards.id
      JOIN workspaces ON boards.workspace_id = workspaces.id
      JOIN users ON workspaces.owner_id = users.id
      WHERE users.id = $1 AND due_date::date >= $2::date AND due_date::date < $3::date ORDER BY due_date ASC`,
    [userId, todayStr, endStr]
  );
  return result.rows;
};

const deleteCardById = async (id) => {
  const result = await pool.query("DELETE FROM cards WHERE id = $1 RETURNING *", [id]);
  return result;
};

const updateCard = async (id, title, text, checked, position, dueDate) => {
  const result = await pool.query(
    "UPDATE cards SET title = $1, text = $2, checked = $3, position = $4, due_date = $5 WHERE id = $6 RETURNING *",
    [title, text, checked, position, dueDate, id]
  );
  return result.rows[0];
};

const toggleCardChecked = async (id, checked) => {
  const result = await pool.query(
    "UPDATE cards SET checked = $1 WHERE id = $2 RETURNING *",
    [checked, id]
  );
  return result.rows[0];
};

const moveCard = async (id, columnId, position) => {
  const result = await pool.query(
    "UPDATE cards SET column_id = $1, position = $2 WHERE id = $3 RETURNING *",
    [columnId, position, id]
  );
  return result.rows[0];
};

const updateCardText = async (id, text) => {
  const result = await pool.query(
    "UPDATE cards SET text = $1 WHERE id = $2 RETURNING *",
    [text, id]
  );
  return result.rows[0];
};

module.exports = {
  createCard,
  deleteCardById,
  updateCard,
  toggleCardChecked,
  moveCard,
  updateCardDueDate,
  getUpcomingTasks,
  updateCardText,
};
