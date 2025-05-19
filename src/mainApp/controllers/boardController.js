const boardService = require("../services/boardService");
const workspaceService = require("../services/workspaceService");


// Reusable verification function using req.user.id
async function verifyWorkspaceOwnership(userId, workspaceId) {
  const ownerId = await workspaceService.getUserIdByworkspaceId(workspaceId);
  if (!userId || ownerId !== userId) {
    throw new Error("You are not authorized to access this workspace");
  }
}


const getBoards = async (req, res) => {
  const { workspaceId } = req.params;
  const userId = req.user?.id;
  try {
    await verifyWorkspaceOwnership(userId, workspaceId);
    const boards = await boardService.getBoards(workspaceId);
    res.json(boards);
  } catch (err) {
    res.status(err.message === "You are not authorized to access this workspace" ? 403 : 401).json({ message: err.message });
  }
};


const createBoardHandler = async (req, res) => {
  const { name } = req.body;
  const { workspaceId } = req.params;
  const userId = req.user?.id;
  try {
    await verifyWorkspaceOwnership(userId, workspaceId);
    const board = await boardService.createBoard(name, workspaceId);
    res.json(board);
  } catch (err) {
    res.status(err.message === "You are not authorized to access this workspace" ? 403 : 401).json({ message: err.message });
  }
};



const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user?.id;
  try {
    // Get workspaceId from boardId, then verify ownership
    const workspaceId = await boardService.getWorkspaceIdByBoardId(boardId);
    await verifyWorkspaceOwnership(userId, workspaceId);
    const result = await boardService.deleteBoard(boardId, workspaceId);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Board not found or not authorized" });
    }

    res.status(200).json({ message: "Board deleted successfully" });
  } catch (err) {
    res.status(err.message === "You are not authorized to access this workspace" ? 403 : 401).json({ message: err.message });
  }
};



const renameBoard = async (req, res) => {
  const { boardId } = req.params;
  const { newName } = req.body;
  const userId = req.user?.id;

  if (!newName) {
    return res.status(400).json({ message: "New name is required" });
  }

  try {
    // Get workspaceId from boardId, then verify ownership
    const workspaceId = await boardService.getWorkspaceIdByBoardId(boardId);
    await verifyWorkspaceOwnership(userId, workspaceId);
    const board = await boardService.renameBoard(boardId, workspaceId, newName);

    if (!board) {
      return res.status(404).json({ message: "Board not found or not authorized" });
    }

    res.status(200).json({ message: "Board renamed successfully", board });
  } catch (err) {
    res.status(err.message === "You are not authorized to access this workspace" ? 403 : 401).json({ message: err.message });
  }
};

module.exports = {
  getBoards,
  createBoardHandler,
  deleteBoard,
  renameBoard,
};
