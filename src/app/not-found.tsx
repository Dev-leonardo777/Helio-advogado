import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/ui/brand";

export default function NotFound() {
  return (
    <main className="error-page">
      <Brand />
      <p className="eyebrow">Erro 404</p>
      <h1>Página não encontrada</h1>
      <p>Na página inicial, você encontra as áreas de atuação e os canais de contato de Hélio Aquino.</p>
      <Link className="button button-gold" href="/">
        <ArrowLeft size={17} aria-hidden="true" /> Voltar ao início
      </Link>
    </main>
  );
}
