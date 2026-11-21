import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetName = formData.get("targetName") as string | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let fileName = targetName ? targetName.trim() : "";
    if (!fileName) {
      const ext = path.extname(file.name) || ".jpg";
      const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      fileName = `${base}_${Date.now()}${ext}`;
    }
    const cleanFileName = path.basename(fileName);

    // 1. Prioridade: Se o token do Vercel Blob existir (ambiente de nuvem)
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (token) {
      try {
        const blob = await put(`images/${cleanFileName}`, buffer, {
          access: "public",
          contentType: file.type || "image/jpeg",
          token: token,
        });

        return NextResponse.json({
          success: true,
          message: "Imagem enviada e hospedada na nuvem com sucesso!",
          url: blob.url,
        });
      } catch (blobErr: unknown) {
        const errMessage = blobErr instanceof Error ? blobErr.message : String(blobErr);
        console.error("Erro no Vercel Blob:", errMessage);
        return NextResponse.json({
          success: false,
          message: `Falha no armazenamento em nuvem: ${errMessage}`,
        }, { status: 500 });
      }
    }

    // 2. Ambiente local (fallback)
    try {
      const uploadDir = path.join(process.cwd(), "public", "images");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, cleanFileName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        message: "Imagem enviada localmente com sucesso!",
        url: `/images/${cleanFileName}`,
      });
    } catch (fsErr) {
      console.error("Erro ao gravar em disco local:", fsErr);
      return NextResponse.json({
        success: false,
        message: "N├úo foi poss├¡vel gravar no disco. Configure o Vercel Blob no painel da Vercel para uploads em produ├º├úo.",
      }, { status: 500 });
    }
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("Erro geral no upload:", errMessage);
    return NextResponse.json({ success: false, message: `Erro ao processar arquivo: ${errMessage}` }, { status: 500 });
  }
}
