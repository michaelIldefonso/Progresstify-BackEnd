const boardService = require("../services/boardService");

const getBoards = async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const boards = await boardService.getBoards(workspaceId);
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBoardHandler = async (req, res) => {
  const { name } = req.body;
  const { workspaceId } = req.params;
  try {
    const board = await boardService.createBoard(name, workspaceId);
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBoard = async (req, res) => {
  const { workspaceId, boardId } = req.params;
  try {
    const result = await boardService.deleteBoard(boardId, workspaceId);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Board not found or not authorized" });
    }

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const renameBoard = async (req, res) => {
  const { workspaceId, boardId } = req.params;
  const { newName } = req.body;

  if (!newName) {
    return res.status(400).json({ message: "New name is required" });
  }

  try {
    const board = await boardService.renameBoard(boardId, workspaceId, newName);

    if (!board) {
      return res.status(404).json({ message: "Board not found or not authorized" });
    }

    res.status(200).json({ message: "Board renamed successfully", board });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBoards,
  createBoard: createBoardHandler,
  deleteBoard,
  renameBoard,
};
