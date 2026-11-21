import { NextResponse } from "next/server";
import { getSiteData, saveSiteData } from "@/lib/site-data";

export async function GET() {
  const data = getSiteData();
  return NextResponse.json(data || {});
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const success = saveSiteData(body);
    if (success) {
      return NextResponse.json({ success: true, message: "Dados atualizados com sucesso!" });
    }
    return NextResponse.json({ success: false, message: "Falha ao gravar no arquivo" }, { status: 500 });
  } catch {
    return NextResponse.json({ success: false, message: "Erro no servidor" }, { status: 500 });
  }
}
