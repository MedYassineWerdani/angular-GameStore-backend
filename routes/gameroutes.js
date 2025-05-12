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
router.get("/", async (req, res) => {
  const games = await Game.find();
  res.json(games);
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
