import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data || {});
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, message: "Dados inválidos enviados" }, { status: 400 });
    }

    const success = await saveSiteData(body);
    if (success) {
      return NextResponse.json({ success: true, message: "Dados atualizados com sucesso na nuvem!" });
    }
    return NextResponse.json(
      { success: false, message: "Não foi possível gravar os dados. Verifique a configuração de armazenamento." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Erro na rota POST /api/admin/content:", error);
    return NextResponse.json({ success: false, message: "Erro interno no servidor ao processar os dados" }, { status: 500 });
  }
}
