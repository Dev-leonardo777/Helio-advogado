import fs from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

// Caminho local de desenvolvimento
const localDataPath = path.join(process.cwd(), "src", "data", "content.json");
const tmpDataPath = path.join("/tmp", "content.json");

// Lê dados locais como fallback seguro
function getLocalData() {
  try {
    if (fs.existsSync(localDataPath)) {
      return JSON.parse(fs.readFileSync(localDataPath, "utf8"));
    }
    if (fs.existsSync(tmpDataPath)) {
      return JSON.parse(fs.readFileSync(tmpDataPath, "utf8"));
    }
  } catch (err) {
    console.error("Erro ao ler dados locais:", err);
  }
  return null;
}

// Salva localmente
function saveLocalData(data: Record<string, unknown>): boolean {
  const contentStr = JSON.stringify(data, null, 2);
  try {
    const dir = path.dirname(localDataPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(localDataPath, contentStr, "utf8");
    return true;
  } catch {
    try {
      fs.writeFileSync(tmpDataPath, contentStr, "utf8");
      return true;
    } catch (tmpErr) {
      console.error("Erro ao salvar local/tmp:", tmpErr);
      return false;
    }
  }
}

/**
 * Obtém os dados do site.
 * Se BLOB_READ_WRITE_TOKEN existir (Vercel na nuvem), busca do Vercel Blob com revalidação imediata.
 * Caso contrário, lê do arquivo local do projeto.
 */
export async function getSiteData() {
  // 1. Tenta carregar do Vercel Blob se o token estiver configurado
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "site-content.json" });
      if (blobs.length > 0) {
        // Pega o blob mais recente
        const latestBlob = blobs[0];
        const res = await fetch(`${latestBlob.url}?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          return json;
        }
      }
    } catch (blobErr) {
      console.warn("Aviso ao buscar dados do Vercel Blob, usando fallback local:", blobErr);
    }
  }

  // 2. Fallback: Lê do sistema de arquivos local
  return getLocalData();
}

/**
 * Salva os dados do site.
 * Se BLOB_READ_WRITE_TOKEN existir, salva no Vercel Blob para persistência em nuvem definitiva.
 * Também mantém o arquivo local atualizado quando possível.
 */
export async function saveSiteData(data: Record<string, unknown>): Promise<boolean> {
  let savedCloud = false;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const contentStr = JSON.stringify(data, null, 2);
      await put("site-content.json", contentStr, {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
        cacheControlMaxAge: 0,
      });
      savedCloud = true;
    } catch (cloudErr) {
      console.error("Erro ao salvar no Vercel Blob:", cloudErr);
    }
  }

  // Também grava local para manter sincronizado quando executado em dev
  const savedLocal = saveLocalData(data);

  return savedCloud || savedLocal;
}
