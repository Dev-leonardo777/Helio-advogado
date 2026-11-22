import fs from "fs";
import path from "path";
import { put, get, list } from "@vercel/blob";

// Token permanente do Vercel Blob configurado
const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN ||
  "vercel_blob_rw_H4nu1pda7HZ6qsU4_QByC6XqOH5zFaQbmKzT3ci4FrHRyjq";

const localDataPath = path.join(process.cwd(), "src", "data", "content.json");
const tmpDataPath = path.join("/tmp", "content.json");

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
 * Lê os dados atualizados do Vercel Blob (se disponível) ou do arquivo local
 */
export async function getSiteData() {
  if (BLOB_TOKEN) {
    try {
      const { blobs } = await list({ prefix: "site-content.json", token: BLOB_TOKEN });
      if (blobs.length > 0) {
        const latestBlob = blobs[0];
        const res = await get(latestBlob.url, { access: "private", token: BLOB_TOKEN });
        if (res && res.stream) {
          const streamResponse = new Response(res.stream);
          const text = await streamResponse.text();
          return JSON.parse(text);
        }
      }
    } catch (blobErr) {
      console.warn("Aviso ao ler do Vercel Blob, usando fallback local:", blobErr);
    }
  }

  return getLocalData();
}

/**
 * Salva os dados no Vercel Blob para persistência em nuvem imediata e perpétua
 */
export async function saveSiteData(data: Record<string, unknown>): Promise<{ success: boolean; message: string }> {
  if (BLOB_TOKEN) {
    try {
      const contentStr = JSON.stringify(data, null, 2);
      await put("site-content.json", contentStr, {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 0,
        token: BLOB_TOKEN,
      });
      // Também atualiza o disco local se possível
      saveLocalData(data);
      return { success: true, message: "Todas as alterações foram salvas com sucesso na nuvem!" };
    } catch (cloudErr: unknown) {
      const errStr = cloudErr instanceof Error ? cloudErr.message : String(cloudErr);
      console.error("Erro no Vercel Blob:", errStr);
      return { success: false, message: `Erro ao salvar na nuvem: ${errStr}` };
    }
  }

  const savedLocal = saveLocalData(data);
  return { success: savedLocal, message: savedLocal ? "Salvo localmente." : "Falha ao gravar arquivo." };
}
