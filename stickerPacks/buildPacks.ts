import * as fs from "fs";
import * as path from "path";
import { StickersCollection } from "../src/types/stickersCollection";

(async () => {
  const itemsInFolder = await fs.promises.readdir(__dirname);
  const packs: StickersCollection = [];
  const allowedExtensions = [".jpg", ".jpeg", ".svg", ".png", ".webp"];

  for await (const folder of itemsInFolder) {
    const folderPath = path.join(__dirname, folder);
    const stat = await fs.promises.stat(folderPath);
    if (!stat.isDirectory()) continue;

    const filesInDir = await fs.promises.readdir(folderPath);
    if (!filesInDir.length) continue;

    const images: string[] = [];
    for await (const file of filesInDir) {
      const filePath = path.join(folderPath, file);
      const stat = await fs.promises.stat(filePath);

      if (!stat.isFile()) continue;
      if (!allowedExtensions.includes(path.extname(filePath))) continue;

      images.push(file);
    }

    packs.push({
      name: folder,
      images,
    });
  }

  const buildPath = path.join(__dirname, "../public/build");
  const accessForBuildDir = await fs.promises.access(buildPath).then(
    () => true,
    () => false,
  );

  accessForBuildDir || (await fs.promises.mkdir(buildPath));
  await fs.promises.writeFile(path.join(buildPath, "packs.json"), JSON.stringify(packs), "utf-8");
})();
