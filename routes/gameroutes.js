const express = require("express");
const Game = require("../models/game");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Create a Game (Admin only)
// Secured game modification routes
router.post("/", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Access denied" });
  const game = new Game(req.body);
  await game.save();
  res.status(201).json(game);
});

// Get all Games
// router.get("/", async (req, res) => {
//   const games = await Game.find();
//   res.json(games);
// });

// Get all Games with Pagination
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1 if no page is provided
  const pageSize = 6; // Number of games per page
  const skip = (page - 1) * pageSize;

  try {
    // Fetch paginated games
    const games = await Game.find().skip(skip).limit(pageSize);

    // Count total number of games
    const totalGames = await Game.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalGames / pageSize);

    // Send response with paginated data
    res.json({
      games,
      totalPages,
      currentPage: page,
      totalGames,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch games" });
  }
});

// Get a Game by Slug
router.get("/:slug", async (req, res) => {
  const game = await Game.findOne({ slug: req.params.slug });
  if (!game) return res.status(404).json({ message: "Game not found" });
  res.json(game);
});

// Update Game (Admin only)
router.put("/:slug", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Access denied" });
  const game = await Game.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true }
  );
  res.json(game);
});

// Delete Game (Admin only)
router.delete("/:slug", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Access denied" });
  await Game.findOneAndDelete({ slug: req.params.slug });
  res.json({ message: "Game deleted" });
});

// // Secure game modification routes
// router.put("/:slug", authMiddleware, async (req, res) => {
//   if (!req.user.isAdmin)
//     return res.status(403).json({ message: "Access denied" });
//   const game = await Game.findOneAndUpdate(
//     { slug: req.params.slug },
//     req.body,
//     { new: true }
//   );
//   res.json(game);
// });

// router.delete("/:slug", authMiddleware, async (req, res) => {
//   if (!req.user.isAdmin)
//     return res.status(403).json({ message: "Access denied" });
//   await Game.findOneAndDelete({ slug: req.params.slug });
//   res.json({ message: "Game deleted" });
// });

module.exports = router;
