import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// https://env.t3.gg/docs/nextjs
export const env = createEnv({
  server: {
  },
  client: {
    NEXT_PUBLIC_URL: z.string().min(1),
    // reown
    NEXT_PUBLIC_REOWN_PROJECT_ID: z.string().min(1),
    // application general info
    NEXT_PUBLIC_APPLICATION_NAME: z.string().min(1),
    NEXT_PUBLIC_APPLICATION_DESCRIPTION: z.string().min(1),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
    NEXT_PUBLIC_APPLICATION_NAME: process.env.NEXT_PUBLIC_APPLICATION_NAME,
    NEXT_PUBLIC_APPLICATION_DESCRIPTION:
      process.env.NEXT_PUBLIC_APPLICATION_DESCRIPTION,
  },
});
