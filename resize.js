/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputFolder = "./public/players_original";
const outputFolder = "./public/players";

fs.readdirSync(inputFolder).forEach((file) => {
  const inputFilePath = path.join(inputFolder, file);
  const outputFilePath = path.join(outputFolder, file);

  sharp(inputFilePath)
    .resize({ width: 600 })
    .toFile(outputFilePath)
    .then(() => {
      console.log(`Resized ${file}`);
    })
    .catch((err) => {
      console.error(`Error processing ${file}:`, err);
    });
});
