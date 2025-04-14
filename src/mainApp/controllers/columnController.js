const columnService = require("../services/columnService");

const getColumnsWithCards = async (req, res) => {
  const { boardId } = req.params;
  try {
    const columnsWithCards = await columnService.getColumnsWithCards(boardId);
    res.json(columnsWithCards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createColumnHandler = async (req, res) => {
  const { boardId } = req.params;
  const { title, order } = req.body;
  try {
    const column = await columnService.createColumn(boardId, title, order);
    res.status(201).json(column);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteColumnHandler = async (req, res) => {
  const { columnId } = req.params;
  try {
    await columnService.deleteColumn(columnId);
    res.status(200).json({ message: "Column deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const renameColumnHandler = async (req, res) => {
  const { columnId } = req.params;
  const { title } = req.body;
  try {
    const column = await columnService.renameColumn(columnId, title);
    res.status(200).json(column);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateColumnOrderHandler = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { newOrder } = req.body;
  try {
    const currentOrderResult = await columnService.getColumnOrder(columnId);
    const currentOrder = currentOrderResult.order;

    await columnService.updateColumnOrder(boardId, columnId, newOrder, currentOrder);
    res.status(200).json({ message: "Column order updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getColumnsWithCards,
  createColumnHandler,
  deleteColumnHandler,
  renameColumnHandler,
  updateColumnOrderHandler,
};
