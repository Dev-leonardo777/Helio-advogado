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

    // Gera um nome seguro de arquivo ou usa o targetName
    let fileName = targetName ? targetName.trim() : "";
    if (!fileName) {
      const ext = path.extname(file.name) || ".jpg";
      const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
      fileName = `${base}_${Date.now()}${ext}`;
    }
    const cleanFileName = path.basename(fileName);

    // 1. Se estiver na nuvem da Vercel (BLOB_READ_WRITE_TOKEN presente)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`images/${cleanFileName}`, buffer, {
          access: "public",
          contentType: file.type || "image/jpeg",
        });

        return NextResponse.json({
          success: true,
          message: "Imagem enviada e hospedada na nuvem com sucesso!",
          url: blob.url,
        });
      } catch (blobErr) {
        console.error("Erro no upload para Vercel Blob:", blobErr);
      }
    }

    // 2. Fallback: Grava no disco local (desenvolvimento / ambiente local)
    const uploadDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/${cleanFileName}`;
    return NextResponse.json({
      success: true,
      message: "Imagem enviada localmente com sucesso!",
      url: publicUrl,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ success: false, message: "Erro ao processar o upload da imagem" }, { status: 500 });
  }
}
