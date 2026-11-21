import fs from "fs";
import path from "path";

// Caminho primário (código-fonte em desenvolvimento / repositório local)
const projectDataPath = path.join(process.cwd(), "src", "data", "content.json");

// Caminho de fallback (para ambientes serverless / read-only como Vercel temporário)
const tmpDataPath = path.join("/tmp", "content.json");

function resolveReadPath(): string {
  if (fs.existsSync(projectDataPath)) return projectDataPath;
  if (fs.existsSync(tmpDataPath)) return tmpDataPath;
  return projectDataPath;
}

export function getSiteData() {
  try {
    const targetPath = resolveReadPath();
    if (fs.existsSync(targetPath)) {
      const fileData = fs.readFileSync(targetPath, "utf8");
      return JSON.parse(fileData);
    }
  } catch (err) {
    console.error("Erro ao ler content.json:", err);
  }
  return null;
}

export function saveSiteData(data: Record<string, unknown>) {
  const contentStr = JSON.stringify(data, null, 2);
  let saved = false;

  // 1. Tenta gravar diretamente no arquivo do projeto (desenvolvimento / servidor com permissão de escrita)
  try {
    const dir = path.dirname(projectDataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(projectDataPath, contentStr, "utf8");
    saved = true;
  } catch (err) {
    console.warn("Não foi possível gravar no diretório do projeto, tentando fallback:", err);
  }

  // 2. Se falhar por restrição de permissão de sistema de arquivos (ex: Vercel serverless), grava em /tmp
  if (!saved) {
    try {
      fs.writeFileSync(tmpDataPath, contentStr, "utf8");
      saved = true;
    } catch (tmpErr) {
      console.error("Erro fatal ao gravar em /tmp:", tmpErr);
    }
  }

  return saved;
}
