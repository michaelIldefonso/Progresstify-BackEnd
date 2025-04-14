const pool = require("../../config/db");

const createCard = async (columnId, text, checked, position) => {
  const result = await pool.query(
    "INSERT INTO cards (column_id, text, checked, position) VALUES ($1, $2, $3, $4) RETURNING *",
    [columnId, text, checked, position]
  );
  return result.rows[0];
};

const deleteCardById = async (id) => {
  const result = await pool.query("DELETE FROM cards WHERE id = $1 RETURNING *", [id]);
  return result;
};

const updateCard = async (id, title, text, checked, position) => {
  const result = await pool.query(
    "UPDATE cards SET title = $1, text = $2, checked = $3, position = $4 WHERE id = $5 RETURNING *",
    [title, text, checked, position, id]
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

module.exports = {
  createCard,
  deleteCardById,
  updateCard,
  toggleCardChecked,
  moveCard,
};
