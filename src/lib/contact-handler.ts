import { contactAreas, validateContact } from "./contact-validation.ts";

export type ContactEnvironment = {
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  SITE_URL?: string;
};

export function contactIsConfigured(env: ContactEnvironment) {
  return Boolean(env.RESEND_API_KEY?.trim() && env.CONTACT_FROM_EMAIL?.trim() && env.CONTACT_TO_EMAIL?.trim());
}

const MAX_BODY_BYTES = 16_000;
const WINDOW_MS = 10 * 60 * 1000;

export function createContactHandler({ env, fetcher = fetch, now = Date.now }: {
  env: ContactEnvironment;
  fetcher?: typeof fetch;
  now?: () => number;
}) {
  // Limite por processo; usar também proteção no gateway em hospedagens com múltiplas instâncias.
  const attempts = new Map<string, { count: number; expires: number }>();
  let total = { count: 0, expires: 0 };

  return async function handleContact(request: Request): Promise<Response> {
    const respond = (status: number, body: object, headers: Record<string, string> = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
    let expectedOrigin: string;
    try { expectedOrigin = new URL(env.SITE_URL || request.url).origin; }
    catch { return respond(503, { message: "O canal de envio está temporariamente indisponível." }); }
    if (request.headers.get("origin") !== expectedOrigin) return respond(403, { message: "Origem da solicitação não permitida." });
    if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return respond(415, { message: "Formato de solicitação inválido." });
    if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return respond(413, { message: "Mensagem muito extensa." });

    let input: unknown;
    try {
      const reader = request.body?.getReader();
      if (!reader) return respond(400, { message: "Preencha o formulário para continuar." });
      const chunks: Uint8Array[] = [];
      let size = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > MAX_BODY_BYTES) {
          await reader.cancel();
          return respond(413, { message: "Mensagem muito extensa." });
        }
        chunks.push(value);
      }
      const bytes = new Uint8Array(size);
      let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      input = JSON.parse(new TextDecoder().decode(bytes));
    } catch { return respond(400, { message: "Não foi possível ler o formulário." }); }

    const result = validateContact(input);
    if (!result.ok) return respond(422, { message: "Revise os campos indicados.", errors: result.errors });
    if (!contactIsConfigured(env)) return respond(503, { message: "O envio pelo site ainda está em configuração. Nenhuma mensagem foi enviada. Utilize um dos canais de contato disponíveis." });

    const time = now();
    for (const [key, item] of attempts) if (item.expires <= time) attempts.delete(key);
    if (total.expires <= time) total = { count: 0, expires: time + WINDOW_MS };
    const key = result.data.email.toLowerCase();
    const attempt = attempts.get(key) || { count: 0, expires: time + WINDOW_MS };
    if (attempt.count >= 3 || total.count >= 60) return respond(429, { message: "Muitas tentativas de contato. Aguarde alguns minutos antes de tentar novamente." }, { "Retry-After": String(Math.ceil((attempt.count >= 3 ? attempt.expires - time : total.expires - time) / 1000)) });
    attempts.set(key, { ...attempt, count: attempt.count + 1 });
    total.count += 1;

    const { data } = result;
    try {
      const upstream = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(12_000),
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL,
          to: [env.CONTACT_TO_EMAIL],
          reply_to: data.email,
          subject: `Contato pelo site — ${contactAreas[data.area]}`,
          text: ["Novo contato pelo site de Hélio Aquino", "", `Nome: ${data.name}`, `E-mail: ${data.email}`, `Telefone: ${data.phone || "Não informado"}`, `Assunto: ${contactAreas[data.area]}`, "", data.message, "", "O visitante autorizou o uso dos dados para responder a este contato."].join("\n"),
        }),
      });
      if (!upstream.ok) return respond(502, { message: "Não foi possível confirmar o envio. Seus dados continuam no formulário; tente novamente mais tarde." });
      const receipt = await upstream.json() as { id?: unknown };
      if (typeof receipt.id !== "string" || !receipt.id) return respond(502, { message: "O serviço não confirmou o recebimento. Tente novamente mais tarde." });
      return respond(200, { message: "Mensagem enviada. Obrigado pelo contato; o escritório poderá responder pelo e-mail informado." });
    } catch { return respond(502, { message: "Não foi possível confirmar o envio agora. Tente novamente em alguns minutos." }); }
  };
}
