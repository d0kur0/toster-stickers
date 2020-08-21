import * as fs from "fs";
import * as path from "path";
import * as sharp from "sharp";
import * as chalk from "chalk";
import { StickersCollection } from "./src/types/stickersCollection";

/*
 * Script for build packs of stickers
 * Make json list of packs and resize images
 * */

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

  const stickerPacksPath = path.join(process.cwd(), "stickerPacks");
  const itemsInFolder = await fs.promises.readdir(stickerPacksPath);

  const packs: StickersCollection = [];
  const allowedExtensions = [".jpg", ".jpeg", ".svg", ".png", ".webp"];

  // Each all folders in ./stickerPacks, exclude empty.
  for await (const folder of itemsInFolder) {
    const folderPath = path.join(stickerPacksPath, folder);
    const stat = await fs.promises.stat(folderPath);
    if (!stat.isDirectory()) continue;

    const filesInDir = await fs.promises.readdir(folderPath);
    if (!filesInDir.length) continue;

    // Is not exists current folder in public/build means it's new sticker pack
    const folderPathInBuild = path.join("public/build/stickers", folder);
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

      // Resize images and copy to public/build path for new packs
      if (isNewPack) {
        await sharp(filePath)
          .resize(150)
          .toBuffer()
          .then(
            async data =>
              await fs.promises.writeFile(path.join(folderPathInBuild, file), data, "binary"),
          )
          .catch(error => {
            console.log(chalk.red(`Error with resize image ${folder}/${file}: \n ${error}`));
          });
      }

      images.push(`${repositoryURL}/blob/master/public/build/stickers/${folder}/${file}?raw=true`);
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

  console.log(packs);
})();
