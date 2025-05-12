const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const User = require("./models/user");
const Game = require("./models/game");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const seedData = async () => {
  try {
    await User.deleteMany();
    await Game.deleteMany();

    // Hash passwords before inserting users
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedUserPassword = await bcrypt.hash("user123", 10);

    const users = [
      { username: "adminUser", password: hashedAdminPassword, isAdmin: true },
      { username: "regularUser", password: hashedUserPassword, isAdmin: false },
    ];

    const games = [
      {
        title: "Cyber Quest",
        description: "A futuristic RPG",
        price: 39.99,
        image: "cyberquest.jpg",
        slug: slugify("Cyber Quest", { lower: true }), // Generate slug dynamically
      },
      {
        title: "Mystic Lands",
        description: "An open-world adventure",
        price: 49.99,
        image: "mysticlands.jpg",
        slug: slugify("Mystic Lands", { lower: true }), // Generate slug dynamically
      },
    ];

    await User.insertMany(users);
    await Game.insertMany(games);

    console.log("Sample data inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting data:", error);
    mongoose.connection.close();
  }
};

seedData();
