import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // Se fileName não tiver barra inicial, garante salvamento dentro de public/images
    const cleanFileName = path.basename(fileName);
    const uploadDir = path.join(process.cwd(), "public", "images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, cleanFileName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/images/${cleanFileName}`;
    return NextResponse.json({
      success: true,
      message: "Imagem enviada com sucesso!",
      url: publicUrl,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ success: false, message: "Erro ao processar o upload da imagem" }, { status: 500 });
  }
}
