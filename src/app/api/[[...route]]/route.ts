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

const answerRoute = app.post(
  "/answer",
  zValidator("form", questionSchema),
  async (c) => {
    try {
      const { OPEN_AI_API_KEY } = env<EnvConfig>(c);
      const openai = new OpenAI({
        apiKey: OPEN_AI_API_KEY,
      });

      // Performance -------------------------
      const start = performance.now();

      const validPayload = c.req.valid("form");

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: validPayload.message,
            // content: [
            //   {
            //     type: "text",
            //     content: validPayload.message,
            //   },
            //   {
            //     type: "image_url",
            //     image_url: {
            //       url: validPayload.image,
            //       detail: "low",
            //     },
            //   },
            // ],
          },
        ],
      });

      // ----------------------
      const end = performance.now();
      return c.json({
        data: completion,
        time: end - start,
      });
    } catch (e) {
      console.log(e);
      return c.json({ message: "error" }, 500);
    }
  }
);

export const GET = handle(app);
export const POST = handle(app);
export type AppType = typeof answerRoute;
export default app as never; // this is a hack to make the nextJs/typescript compiler happy.
