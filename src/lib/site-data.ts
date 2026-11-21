import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "content.json");

export function getSiteData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileData = fs.readFileSync(dataFilePath, "utf8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error("Erro ao ler content.json:", err);
  }
  return null;
}

export function saveSiteData(data: Record<string, unknown>) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Erro ao gravar content.json:", err);
    return false;
  }
}
