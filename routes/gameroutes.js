const express = require("express");
const Game = require("../models/game");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Access denied" });

  try {
    const {
      title,
      description,
      price,
      image,
      tags,
      genre,
      releaseDate,
      developer,
      platform,
    } = req.body;

    const game = new Game({
      title,
      description,
      price,
      image,
      tags,
      genre,
      releaseDate,
      developer,
      platform,
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  try {
    const games = await Game.find().skip(skip).limit(limit);
    const totalGames = await Game.countDocuments();
    const totalPages = Math.ceil(totalGames / limit);

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

router.get("/slug/:slug", async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) return res.status(404).json({ message: "Game not found" });
    res.json(game);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Game (Admin only)
router.put("/:slug", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Access denied" });

  try {
    const updatedGame = await Game.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );

    if (!updatedGame)
      return res.status(404).json({ message: "Game not found" });

    res.json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Game (Admin only)
router.delete("/:slug", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin)
    return res.status(403).json({ message: "Access denied" });
  await Game.findOneAndDelete({ slug: req.params.slug });
  res.json({ message: "Game deleted" });
});

module.exports = router;
