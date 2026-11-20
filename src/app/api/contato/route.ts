import { createContactHandler } from "@/lib/contact-handler";
import { getContactEnvironment } from "@/config/contact-server";

export const runtime = "nodejs";
export const POST = createContactHandler({ env: getContactEnvironment() });
