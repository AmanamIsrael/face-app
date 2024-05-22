import { questionSchema } from "@/services/open-ai/shema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import OpenAI from "openai";

//adding the runtime will this api compatible with cloudflare workers and vercel edge
export const runtime = "edge";

const app = new Hono().basePath("/api");

type EnvConfig = {
  OPEN_AI_API_KEY: string;
};

// add cors
app.use("/*", cors());

app.get("/", (c) => c.json({ message: "Hello World" }));

app.post("/answer", zValidator("form", questionSchema), async (c) => {
  const { OPEN_AI_API_KEY } = env<EnvConfig>(c);
  const openai = new OpenAI({
    apiKey: OPEN_AI_API_KEY,
  });

  const validPayload = c.req.valid("form");

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful forensics assistant. You are here to provide answers to on text and images you're given.",
      },
      {
        role: "user",
        content: validPayload.message,
      },
    ],
  });

  c.json({ completion });
});

export const GET = handle(app);
export default app as never; // this is a hack to make the nextJs/typescript compiler happy.
