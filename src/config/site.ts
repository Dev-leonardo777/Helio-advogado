const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim() || "(62) 99370-8424";
const phoneDigits = phone.replace(/\D/g, "");
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "5562993708424";

export const siteConfig = {
  name: "Hélio Aquino",
  role: "Advogado Criminalista",
  description: "Hélio Aquino é advogado criminalista com atuação no Tribunal do Júri, em prisões em flagrante e em processos relacionados à Lei de Drogas.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  phone,
  phoneHref: `tel:+${phoneDigits.length <= 11 ? "55" : ""}${phoneDigits}`,
  whatsapp,
  instagram: "https://www.instagram.com/helioaquinoadvogado/",
  maps: "https://www.google.com/maps/place/H%C3%A9lio+Aquino+Advogado+Criminalista/data=!4m7!3m6!1s0x935ea5dd537b761d:0xb2dccac695239aab!8m2!3d-16.3318081!4d-48.9613813!16s%2Fg%2F11h231bcfp!19sChIJHXZ7U92lXpMRq5ojlcbK3LI?hl=pt-BR",
  address: process.env.NEXT_PUBLIC_OFFICE_ADDRESS?.trim() || "",
  registration: process.env.NEXT_PUBLIC_OAB_REGISTRATION?.trim() || "",
} as const;

export const navigation = [
  { label: "Início", href: "/#inicio", id: "inicio" },
  { label: "Atuação", href: "/#atuacao", id: "atuacao" },
  { label: "Prêmio 2026", href: "/#premios", id: "premios" },
  { label: "O advogado", href: "/#escritorio", id: "escritorio" },
  { label: "Galeria Forense", href: "/#galeria", id: "galeria" },
  { label: "Na mídia", href: "/#equipe", id: "equipe" },
  { label: "Princípios", href: "/#diferenciais", id: "diferenciais" },
  { label: "Contato", href: "/#contato", id: "contato" },
] as const;

export function getWhatsAppUrl(message = "Olá, Dr. Hélio Aquino. Gostaria de conversar sobre um atendimento.") {
  if (!/^\d{10,15}$/.test(siteConfig.whatsapp)) return null;
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
