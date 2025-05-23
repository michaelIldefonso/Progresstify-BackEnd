// Model for interacting with the 'columns' table in the database
// Provides CRUD operations and utility functions for columns and their cards
const pool = require("../../config/db");

// Get all columns (with their cards) for a specific board
const getColumnsWithCardsByBoardId = async (boardId) => {
  await deleteEmptyColumnsWithoutCards(boardId); // Ensure empty columns without cards are deleted

  const columnsResult = await pool.query(
    'SELECT * FROM columns WHERE board_id = $1 ORDER BY position',
    [boardId]
  );
  const cardsResult = await pool.query(
    `SELECT cards.id, cards.column_id, cards.text, cards.checked, cards.position, cards.due_date
     FROM cards
     INNER JOIN columns ON cards.column_id = columns.id
     WHERE columns.board_id = $1
     ORDER BY cards.position`,
    [boardId]
  );

  const columns = columnsResult.rows;
  const cards = cardsResult.rows;

  return columns.map((column) => ({
    ...column,
    cards: cards.filter((card) => card.column_id === column.id),
  }));
};

// Create a new column in a board
const createColumn = async (boardId, title, position) => {
  const result = await pool.query(
    'INSERT INTO columns (board_id, title, position, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [boardId, title, position]
  );
  return result.rows[0];
};

// Delete a column by its ID
const deleteColumnById = async (columnId) => {
  await pool.query("DELETE FROM columns WHERE id = $1", [columnId]);
};

// Rename a column by its ID
const renameColumnById = async (columnId, title) => {
  const result = await pool.query(
    "UPDATE columns SET title = $1 WHERE id = $2 RETURNING *",
    [title, columnId]
  );
  return result.rows[0];
};

// Update the position of a column within a board
const updateColumnPosition = async (boardId, columnId, newPosition, currentPosition) => {
  await pool.query('UPDATE columns SET position = $1 WHERE id = $2', [newPosition, columnId]);

  if (newPosition > currentPosition) {
    await pool.query(
      'UPDATE columns SET position = position - 1 WHERE board_id = $1 AND position > $2 AND position <= $3 AND id != $4',
      [boardId, currentPosition, newPosition, columnId]
    );
  } else if (newPosition < currentPosition) {
    await pool.query(
      'UPDATE columns SET position = position + 1 WHERE board_id = $1 AND position >= $2 AND position < $3 AND id != $4',
      [boardId, newPosition, currentPosition, columnId]
    );
  }
};

// Delete empty columns (with no title and no cards) from a board
const deleteEmptyColumnsWithoutCards = async (boardId) => {
  await pool.query(
    `DELETE FROM columns
     WHERE board_id = $1 AND (title IS NULL OR title = '')
     AND NOT EXISTS (
       SELECT 1 FROM cards WHERE cards.column_id = columns.id
     )`,
    [boardId]
  );
};

// Get the board ID for a given column ID
const getBoardsIdByColumnId = async (columnId) => {
  const result = await pool.query(
    "SELECT board_id FROM columns WHERE id = $1",
    [columnId]
  );
  return result.rows[0]?.board_id;
};

// Export all column-related functions
module.exports = {
  getColumnsWithCardsByBoardId,
  createColumn,
  deleteColumnById,
  renameColumnById,
  updateColumnPosition,
  deleteEmptyColumnsWithoutCards,
};
