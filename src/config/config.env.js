const dotenv= require("dotenv");

dotenv.config();

const config={
  PORT: process.env.PORT || 4000,
  JWT_SECRET: process.env.JWT_SECRET || "tsikidia_secret"

}

module.exports = config;