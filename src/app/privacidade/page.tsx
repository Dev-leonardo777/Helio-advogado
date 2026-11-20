import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getContactEnvironment } from "@/config/contact-server";
import { getWhatsAppUrl, siteConfig } from "@/config/site";
import { contactIsConfigured } from "@/lib/contact-handler";

const description = "Saiba como funciona o contato com Hélio Aquino e como solicitar informações sobre seus dados.";

export const metadata: Metadata = {
  title: "Aviso de privacidade",
  description,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.name,
    title: `Aviso de privacidade | ${siteConfig.name}`,
    description,
  },
};

export default async function PrivacyPage() {
  await connection();
  const emailFormEnabled = contactIsConfigured(getContactEnvironment());
  const whatsappUrl = getWhatsAppUrl("Olá, gostaria de falar sobre meus dados pessoais.");

  return (
    <>
      <Header solid />
      <main id="conteudo" className="legal-page container">
        <Link href="/#contato" className="text-link">
          <ArrowLeft size={17} aria-hidden="true" /> Voltar ao contato
        </Link>
        <p className="section-label">{siteConfig.name}</p>
        <h1>Aviso de privacidade</h1>
        <p className="legal-intro">{description}</p>

        <h2>Contato pelo WhatsApp</h2>
        <p>
          Ao escolher o WhatsApp, você abre uma conversa com o atendimento de Hélio Aquino.
          Se escolher um assunto, ele poderá aparecer na mensagem inicial.
          Você pode revisar o texto antes de enviá-lo no aplicativo. Para o primeiro contato,
          basta informar como prefere receber o retorno.
        </p>

        {emailFormEnabled && (
          <>
            <h2>Contato pelo formulário</h2>
            <p>
              O formulário solicita seu nome, e-mail, assunto e mensagem. O telefone é opcional.
              Com sua autorização, o site encaminha esses dados ao atendimento pelo serviço
              de e-mail Resend. A solicitação pode permanecer na caixa de e-mail do atendimento
              e nos sistemas envolvidos no envio.
            </p>
          </>
        )}

        <h2>Navegação e serviços externos</h2>
        <p>
          O site guarda a preferência de animações no seu navegador. Os links para WhatsApp,
          Instagram e Google Maps abrem serviços externos, que tratam os dados de navegação
          conforme suas próprias políticas de privacidade.
        </p>

        <h2>Solicitações sobre seus dados</h2>
        <p>
          Para consultar, corrigir ou pedir a exclusão de informações que compartilhou
          no atendimento, entre em contato com Hélio Aquino
          {whatsappUrl && <> pelo <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp</a> ou</>}
          {" pelo telefone "}<a href={siteConfig.phoneHref}>{siteConfig.phone}</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
