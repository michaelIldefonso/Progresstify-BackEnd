const pool = require("../../config/db");

const getColumnsWithCardsByBoardId = async (boardId) => {
  await deleteEmptyColumnsWithoutCards(boardId); // Ensure empty columns without cards are deleted

  const columnsResult = await pool.query(
    'SELECT * FROM columns WHERE board_id = $1 ORDER BY "order"',
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

const createColumn = async (boardId, title, order) => {
  const result = await pool.query(
    'INSERT INTO columns (board_id, title, "order", created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [boardId, title, order]
  );
  return result.rows[0];
};

const deleteColumnById = async (columnId) => {
  await pool.query("DELETE FROM columns WHERE id = $1", [columnId]);
};

const renameColumnById = async (columnId, title) => {
  const result = await pool.query(
    "UPDATE columns SET title = $1 WHERE id = $2 RETURNING *",
    [title, columnId]
  );
  return result.rows[0];
};

const updateColumnOrder = async (boardId, columnId, newOrder, currentOrder) => {
  await pool.query('UPDATE columns SET "order" = $1 WHERE id = $2', [newOrder, columnId]);

  if (newOrder > currentOrder) {
    await pool.query(
      'UPDATE columns SET "order" = "order" - 1 WHERE board_id = $1 AND "order" > $2 AND "order" <= $3 AND id != $4',
      [boardId, currentOrder, newOrder, columnId]
    );
  } else if (newOrder < currentOrder) {
    await pool.query(
      'UPDATE columns SET "order" = "order" + 1 WHERE board_id = $1 AND "order" >= $2 AND "order" < $3 AND id != $4',
      [boardId, newOrder, currentOrder, columnId]
    );
  }
};

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

const getBoardsIdByColumnId = async (columnId) => {
  const result = await pool.query(
    "SELECT board_id FROM columns WHERE id = $1",
    [columnId]
  );
  return result.rows[0]?.board_id;
};

module.exports = {
  getColumnsWithCardsByBoardId,
  createColumn,
  deleteColumnById,
  renameColumnById,
  updateColumnOrder,
  deleteEmptyColumnsWithoutCards,
};
