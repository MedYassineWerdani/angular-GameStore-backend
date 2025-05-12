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
      {
        title: "Skyrim",
        description: "An epic open-world RPG set in a fantasy universe",
        price: 59.99,
        image: "skyrim.jpg",
        slug: slugify("Skyrim", { lower: true }),
      },
      {
        title: "The Witcher 3: Wild Hunt",
        description:
          "A narrative-driven action RPG set in a dark fantasy world",
        price: 49.99,
        image: "witcher3.jpg",
        slug: slugify("The Witcher 3: Wild Hunt", { lower: true }),
      },
      {
        title: "Red Dead Redemption 2",
        description: "A western-themed action-adventure game",
        price: 59.99,
        image: "rdr2.jpg",
        slug: slugify("Red Dead Redemption 2", { lower: true }),
      },
      {
        title: "Minecraft",
        description: "A sandbox game where you build and explore worlds",
        price: 26.99,
        image: "minecraft.jpg",
        slug: slugify("Minecraft", { lower: true }),
      },
      {
        title: "The Legend of Zelda: Breath of the Wild",
        description: "An open-world adventure game set in the Zelda universe",
        price: 59.99,
        image: "breathofthewild.jpg",
        slug: slugify("The Legend of Zelda: Breath of the Wild", {
          lower: true,
        }),
      },
      {
        title: "Horizon Zero Dawn",
        description: "An action RPG in a post-apocalyptic world",
        price: 49.99,
        image: "horizonzerodawn.jpg",
        slug: slugify("Horizon Zero Dawn", { lower: true }),
      },
      {
        title: "Assassin's Creed Odyssey",
        description: "An open-world RPG set in Ancient Greece",
        price: 59.99,
        image: "assassinscreedodyssey.jpg",
        slug: slugify("Assassin's Creed Odyssey", { lower: true }),
      },
      {
        title: "Fallout 4",
        description: "A post-apocalyptic open-world RPG",
        price: 39.99,
        image: "fallout4.jpg",
        slug: slugify("Fallout 4", { lower: true }),
      },
      {
        title: "Grand Theft Auto V",
        description:
          "An open-world action-adventure game set in the fictional city of Los Santos",
        price: 29.99,
        image: "gtav.jpg",
        slug: slugify("Grand Theft Auto V", { lower: true }),
      },
      {
        title: "Overwatch",
        description: "A team-based multiplayer first-person shooter",
        price: 39.99,
        image: "overwatch.jpg",
        slug: slugify("Overwatch", { lower: true }),
      },
      {
        title: "Battlefield 1",
        description: "A first-person shooter set in World War I",
        price: 49.99,
        image: "battlefield1.jpg",
        slug: slugify("Battlefield 1", { lower: true }),
      },
      {
        title: "Call of Duty: Modern Warfare",
        description: "A first-person shooter set in modern warfare scenarios",
        price: 59.99,
        image: "codmw.jpg",
        slug: slugify("Call of Duty: Modern Warfare", { lower: true }),
      },
      {
        title: "FIFA 22",
        description: "A soccer simulation game",
        price: 59.99,
        image: "fifa22.jpg",
        slug: slugify("FIFA 22", { lower: true }),
      },
      {
        title: "NBA 2K21",
        description: "A basketball simulation game",
        price: 59.99,
        image: "nba2k21.jpg",
        slug: slugify("NBA 2K21", { lower: true }),
      },
      {
        title: "Rocket League",
        description: "A fast-paced hybrid of soccer and car racing",
        price: 19.99,
        image: "rocketleague.jpg",
        slug: slugify("Rocket League", { lower: true }),
      },
      {
        title: "Fortnite",
        description: "A battle royale game where players fight for survival",
        price: 0.0,
        image: "fortnite.jpg",
        slug: slugify("Fortnite", { lower: true }),
      },
      {
        title: "Apex Legends",
        description: "A free-to-play battle royale first-person shooter",
        price: 0.0,
        image: "apexlegends.jpg",
        slug: slugify("Apex Legends", { lower: true }),
      },
      {
        title: "Minecraft Dungeons",
        description: "A dungeon crawler spin-off of Minecraft",
        price: 29.99,
        image: "minecraftdungeons.jpg",
        slug: slugify("Minecraft Dungeons", { lower: true }),
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
