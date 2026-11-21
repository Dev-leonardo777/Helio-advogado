import test from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "../src/lib/contact-validation.ts";
import { createContactHandler } from "../src/lib/contact-handler.ts";

// Dados fictícios exclusivamente para testes. Nenhuma mensagem é enviada.
const valid = { name: "Pessoa de Teste", email: "teste@example.com", phone: "", area: "tribunal-do-juri", message: "Mensagem de teste sobre um atendimento jurídico.", consent: true, website: "" };
const env = { RESEND_API_KEY: "test-key-not-real", CONTACT_FROM_EMAIL: "site@example.com", CONTACT_TO_EMAIL: "office@example.com", SITE_URL: "http://localhost:3000" };
function request(payload = valid, headers = {}) {
  return new Request("http://localhost:3000/api/contato", { method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000", ...headers }, body: JSON.stringify(payload) });
}
const accepted = async () => Response.json({ id: "mock-receipt" });

test("validação aceita dados válidos e normaliza espaços", () => {
  const result = validateContact({ ...valid, name: "  Pessoa de Teste  " });
  assert.equal(result.ok, true);
  assert.equal(result.data.name, "Pessoa de Teste");
});

test("validação rejeita campos vazios, e-mail inválido e autorização ausente", () => {
  const result = validateContact({ name: "X", email: "invalido", area: "inexistente", message: "curta", consent: "true" });
  assert.equal(result.ok, false);
  for (const key of ["name", "email", "area", "message", "consent"]) assert.ok(result.errors[key]);
});

test("validação rejeita telefone inválido, honeypot, controles e excesso de texto", () => {
  assert.equal(validateContact({ ...valid, phone: "123" }).ok, false);
  assert.equal(validateContact({ ...valid, website: "spam.example.com" }).ok, false);
  assert.equal(validateContact({ ...valid, name: "Teste\nInjetado" }).ok, false);
  assert.equal(validateContact({ ...valid, message: "a".repeat(4001) }).ok, false);
  assert.equal(validateContact({ ...valid, area: "__proto__" }).ok, false);
  assert.equal(validateContact(null).ok, false);
});

test("servidor impede envio com origem externa, sem origem ou formato incorreto", async () => {
  const handler = createContactHandler({ env, fetcher: accepted });
  assert.equal((await handler(request(valid, { Origin: "https://external.example.com" }))).status, 403);
  assert.equal((await handler(request(valid, { Origin: "" }))).status, 403);
  assert.equal((await handler(request(valid, { "Content-Type": "text/plain" }))).status, 415);
});

test("servidor rejeita JSON quebrado e corpo acima do limite mesmo sem content-length", async () => {
  const handler = createContactHandler({ env, fetcher: accepted });
  const broken = new Request("http://localhost:3000/api/contato", { method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" }, body: "{" });
  assert.equal((await handler(broken)).status, 400);
  assert.equal((await handler(request({ ...valid, message: "a".repeat(17000) }))).status, 413);
});

test("servidor valida novamente os dados e não chama o provedor em caso de erro", async () => {
  let called = false;
  const handler = createContactHandler({ env, fetcher: async () => { called = true; return accepted(); } });
  assert.equal((await handler(request({ ...valid, consent: false }))).status, 422);
  assert.equal(called, false);
});

test("sem configuração, responde 503 e não simula sucesso", async () => {
  const handler = createContactHandler({ env: {}, fetcher: () => { throw new Error("Não deve enviar"); } });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /Nenhuma mensagem foi enviada/);
});

test("envio usa destinatário fixo, reply_to validado e texto sem interpolação HTML", async () => {
  let captured;
  const handler = createContactHandler({ env, fetcher: async (url, options) => { captured = { url, options, body: JSON.parse(options.body) }; return accepted(); } });
  const response = await handler(request({ ...valid, message: "Mensagem com <script>alert(1)</script> para teste." }));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(captured.url, "https://api.resend.com/emails");
  assert.deepEqual(captured.body.to, [env.CONTACT_TO_EMAIL]);
  assert.equal(captured.body.reply_to, valid.email);
  assert.equal(captured.body.html, undefined);
  assert.match(captured.body.text, /<script>/);
});

test("falha, recibo ausente ou timeout do provedor nunca resultam em sucesso", async () => {
  for (const fetcher of [async () => new Response("failure", { status: 500 }), async () => Response.json({}), async () => { throw new Error("timeout"); }]) {
    const handler = createContactHandler({ env, fetcher });
    assert.equal((await handler(request())).status, 502);
  }
});

test("limita tentativas por e-mail e permite envio após expirar a janela", async () => {
  let time = 1_000;
  const handler = createContactHandler({ env, fetcher: accepted, now: () => time });
  for (let index = 0; index < 3; index++) assert.equal((await handler(request())).status, 200);
  const limited = await handler(request());
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "600");
  time += 600_001;
  assert.equal((await handler(request())).status, 200);
});
