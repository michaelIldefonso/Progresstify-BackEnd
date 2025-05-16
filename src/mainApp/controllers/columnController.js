const columnService = require("../services/columnService");
const boardService = require("../services/boardService");
const workspaceService = require("../services/workspaceService");



// Reusable verification function (throws on failure)
async function verifyUserOwnsBoard(userId, boardId) {
  const workspaceId = await boardService.getWorkspaceIdByBoardId(boardId);
  const ownerId = await workspaceService.getUserIdByworkspaceId(workspaceId);
  if (!userId || ownerId !== userId) {
    throw new Error("You are not authorized to access this board");
  }
}

const getColumnsWithCards = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user?.id;
  try {
    await verifyUserOwnsBoard(userId, boardId);
    const columnsWithCards = await columnService.getColumnsWithCards(boardId);
    res.json(columnsWithCards);
  } catch (err) {
    if (err.message === "You are not authorized to access this board") {
      return res.status(403).json({ error: "Forbidden: You do not have access to this board." });
    }
    res.status(500).json({ error: err.message });
  }
};



const createColumnHandler = async (req, res) => {
  const { boardId } = req.params;
  const { title, order } = req.body;
  const userId = req.user?.id;
  try {
    await verifyUserOwnsBoard(userId, boardId);
    const column = await columnService.createColumn(boardId, title, order);
    res.status(201).json(column);
  } catch (err) {
    if (err.message === "You are not authorized to access this board") {
      return res.status(403).json({ error: "Forbidden: You do not have access to this board." });
    }
    res.status(500).json({ error: err.message });
  }
};



const deleteColumnHandler = async (req, res) => {
  const { columnId, boardId } = req.params;
  const userId = req.user?.id;
  try {
    if (!boardId) {
      return res.status(400).json({ error: "Missing boardId in params." });
    }
    await verifyUserOwnsBoard(userId, boardId);
    await columnService.deleteColumn(columnId);
    res.status(200).json({ message: "Column deleted successfully" });
  } catch (err) {
    if (err.message === "You are not authorized to access this board") {
      return res.status(403).json({ error: "Forbidden: You do not have access to this board." });
    }
    res.status(500).json({ error: err.message });
  }
};



const renameColumnHandler = async (req, res) => {
  const { columnId, boardId } = req.params;
  const { title } = req.body;
  const userId = req.user?.id;
  try {
    if (!boardId) {
      return res.status(400).json({ error: "Missing boardId in params." });
    }
    await verifyUserOwnsBoard(userId, boardId);
    const column = await columnService.renameColumn(columnId, title);
    res.status(200).json(column);
  } catch (err) {
    if (err.message === "You are not authorized to access this board") {
      return res.status(403).json({ error: "Forbidden: You do not have access to this board." });
    }
    res.status(500).json({ error: err.message });
  }
};



const updateColumnOrderHandler = async (req, res) => {
  const { boardId, columnId } = req.params;
  const { newOrder } = req.body;
  const userId = req.user?.id;
  try {
    await verifyUserOwnsBoard(userId, boardId);
    const currentOrderResult = await columnService.getColumnOrder(columnId);
    const currentOrder = currentOrderResult.order;

    await columnService.updateColumnOrder(boardId, columnId, newOrder, currentOrder);
    res.status(200).json({ message: "Column order updated successfully" });
  } catch (err) {
    if (err.message === "You are not authorized to access this board") {
      return res.status(403).json({ error: "Forbidden: You do not have access to this board." });
    }
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
