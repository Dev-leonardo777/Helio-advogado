// Importar somente em Server Components e Route Handlers.
export function getContactEnvironment() {
  return {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    SITE_URL: process.env.SITE_URL,
  };
}
