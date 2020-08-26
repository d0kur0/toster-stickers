import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";
import * as chalk from "chalk";
import { StickersCollection } from "./src/types/stickersCollection";

/*
 * Script for build packs of stickers
 * Make json list of packs and resize images
 * */

const imagesSize = 280;
const allowedExtensions = [".jpg", ".jpeg", ".svg", ".png", ".webp"];

(async () => {
  // Parse package.json for extract repository address
  const packageDotJsonPath = path.join(process.cwd(), "package.json");
  const packageDotJsonAccess = await fs.promises.access(packageDotJsonPath).then(
    () => true,
    () => false,
  );

  if (!packageDotJsonAccess) {
    return console.log(chalk.red(`package.json not found in ${packageDotJsonPath}`));
  }

  const packageDotJsonData = await fs.promises
    .readFile(packageDotJsonPath, "utf-8")
    .then(JSON.parse, console.error);

  const repositoryURL = packageDotJsonData?.repository?.url;
  if (!repositoryURL) {
    return console.log(chalk.red("repository.url key not found in package.json"));
  }

  const stickerPacksPath = path.join(process.cwd(), "stickerPacks/sources");
  const itemsInFolder = await fs.promises.readdir(stickerPacksPath);

  const packs: StickersCollection = [];

  for await (const folder of itemsInFolder) {
    const folderPath = path.join(stickerPacksPath, folder);
    const stat = await fs.promises.stat(folderPath);
    if (!stat.isDirectory()) continue;

    const filesInDir = await fs.promises.readdir(folderPath);
    if (!filesInDir.length) continue;

    const folderPathInBuild = path.join("stickerPacks/processed", folder);
    const isNewPack = await fs.promises.access(folderPathInBuild).then(
      () => false,
      () => true,
    );

    if (isNewPack) {
      console.log(chalk.green(`- New sticker pack: ${chalk.bold(folder)}`));
      console.log(folderPathInBuild);
      await fs.promises.mkdir(folderPathInBuild, { recursive: true });
    }

    const images: string[] = [];
    for await (const file of filesInDir) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.promises.stat(filePath);

      if (!stat.isFile()) continue;
      if (!allowedExtensions.includes(path.extname(filePath))) continue;
      if (isNewPack) {
        await sharp(filePath)
          .resize(imagesSize)
          .toBuffer()
          .then(
            async data =>
              await fs.promises.writeFile(path.join(folderPathInBuild, file), data, "binary"),
          )
          .catch(error => {
            console.log(chalk.red(`Error with resize image ${folder}/${file}: \n ${error}`));
          });
      }

      images.push(`${repositoryURL}/blob/master/stickerPacks/processed/${folder}/${file}?raw=true`);
    }

    packs.push({
      name: folder,
      images,
    });
  }

  const buildPath = path.join(process.cwd(), "public/build");
  const accessForBuildDir = await fs.promises.access(buildPath).then(
    () => true,
    () => false,
  );

  accessForBuildDir || (await fs.promises.mkdir(buildPath));
  await fs.promises.writeFile(path.join(buildPath, "packs.json"), JSON.stringify(packs), "utf-8");
})();
