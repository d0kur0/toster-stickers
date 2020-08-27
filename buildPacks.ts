import * as fs from "fs";
import * as path from "path";
import * as chalk from "chalk";
import { StickersCollection, StickersCollectionItem } from "./src/types/stickersCollection";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

/*
 * Script for build packs of stickers
 * Make json list of packs and resize images
 * */

type FilesList = {
  folder: string;
  file: string;
}[];

const imagesSize = 250;
const allowedExtensions = [".jpg", ".jpeg", ".svg", ".png", ".webp"];

(async () => {
  if (config()?.error) {
    return console.log(chalk.red("Error while parse .env"));
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });

  const stickerPacksPath = path.join(process.cwd(), "stickerPacks/sources");
  const itemsInFolder = await fs.promises.readdir(stickerPacksPath);
  const filesList: FilesList = [];

  for await (const folder of itemsInFolder) {
    const folderPath = path.join(stickerPacksPath, folder);
    const stat = await fs.promises.stat(folderPath);
    if (!stat.isDirectory()) continue;

    const filesInDir = await fs.promises.readdir(folderPath);
    if (!filesInDir.length) continue;

    for await (const file of filesInDir) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.promises.stat(filePath);

      if (!stat.isFile()) continue;
      if (!allowedExtensions.includes(path.extname(filePath))) continue;

      filesList.push({ folder, file });
    }
  }

  let packs: StickersCollection = [...new Set(filesList.map(({ folder }) => folder))].map(
    (folder): StickersCollectionItem => ({
      name: folder,
      images: [],
    }),
  );

  const progress = require("cli-progress");
  const progressBar = new progress.SingleBar({}, progress.Presets.rect);

  console.log(chalk.green("Upload stickers to cloudinary"));

  progressBar.start(filesList.length, 0, {
    speed: "N/A",
  });

  for await (const { folder, file } of filesList) {
    const response = cloudinary.uploader
      .upload(path.join(stickerPacksPath, folder, file), {
        // Если не вырезать расширение файла cloudinary.url вернёт кривой url
        public_id: `${folder}/${file.split(".").slice(0, -1).join("")}`,
      })
      .then(response => response, console.error);

    packs = packs.map(pack => {
      pack.name === folder &&
        pack.images.push(
          cloudinary
            .url(response.public_id, { width: 250, crop: "fill" })
            .replace("http://", "https://"), // lol, и никакой настройки чтобы отдавался сразу http не нашёл
        );

      return pack;
    });

    progressBar.increment();
  }

  progressBar.stop();

  const buildPath = path.join(process.cwd(), "public/build");
  const accessForBuildDir = await fs.promises.access(buildPath).then(
    () => true,
    () => false,
  );

  accessForBuildDir || (await fs.promises.mkdir(buildPath));
  await fs.promises.writeFile(path.join(buildPath, "packs.json"), JSON.stringify(packs), "utf-8");
})();
