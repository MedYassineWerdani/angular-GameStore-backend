const mongoose = require("mongoose");
const slugify = require("slugify");

const GameSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  slug: { type: String, unique: true },
});

GameSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Game", GameSchema);
