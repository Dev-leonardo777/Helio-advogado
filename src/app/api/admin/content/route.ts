import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/site-data";

export async function GET() {
  const data = getSiteData();
  return NextResponse.json(data || {});
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, message: "Dados inválidos enviados" }, { status: 400 });
    }

    const success = saveSiteData(body);
    if (success) {
      return NextResponse.json({ success: true, message: "Dados atualizados com sucesso!" });
    }
    return NextResponse.json(
      { success: false, message: "Não foi possível gravar no arquivo de dados. Verifique as permissões de gravação." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Erro na rota POST /api/admin/content:", error);
    return NextResponse.json({ success: false, message: "Erro interno no servidor ao processar os dados" }, { status: 500 });
  }
}
