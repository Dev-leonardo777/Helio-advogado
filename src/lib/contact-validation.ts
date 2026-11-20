import { practiceAreas, type PracticeArea } from "../content/practice-areas.ts";

const practiceAreaNames = Object.fromEntries(
  practiceAreas.map(({ id, title }) => [id, title]),
) as Record<PracticeArea, string>;

export const contactAreas = {
  ...practiceAreaNames,
  outro: "Outro assunto",
} as const;

export type ContactData = {
  name: string;
  email: string;
  phone: string;
  area: keyof typeof contactAreas;
  message: string;
  consent: boolean;
  website: string;
};

export type ContactErrors = Partial<Record<keyof ContactData, string>>;
type ValidationResult = { ok: true; data: ContactData } | { ok: false; errors: ContactErrors };

export function validateContact(input: unknown): ValidationResult {
  const source = input && typeof input === "object" && !Array.isArray(input) ? input as Record<string, unknown> : {};
  const value = (key: string) => typeof source[key] === "string" ? source[key].trim() : "";
  const data: ContactData = {
    name: value("name"), email: value("email"), phone: value("phone"),
    area: value("area") as ContactData["area"], message: value("message"),
    consent: source.consent === true, website: value("website"),
  };
  const errors: ContactErrors = {};
  if (data.name.length < 2 || data.name.length > 100 || Array.from(data.name).some((character) => character.charCodeAt(0) < 32)) errors.name = "Informe seu nome, entre 2 e 100 caracteres.";
  if (data.email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) errors.email = "Informe um e-mail válido.";
  if (data.phone && (!/^[+()\d\s.-]+$/.test(data.phone) || !/^\d{10,15}$/.test(data.phone.replace(/\D/g, "")) || data.phone.length > 30)) errors.phone = "Informe um telefone com DDD ou deixe em branco.";
  if (!Object.hasOwn(contactAreas, data.area)) errors.area = "Selecione um assunto.";
  if (data.message.length < 20 || data.message.length > 4000) errors.message = "Escreva uma mensagem entre 20 e 4.000 caracteres.";
  if (!data.consent) errors.consent = "Autorize o uso dos dados para responder ao seu contato.";
  if (data.website) errors.website = "Não foi possível validar o formulário.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
