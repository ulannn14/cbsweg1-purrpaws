import "dotenv/config";
import { defineConfig, env } from "prisma/config";

console.log("DIRECT_URL =", process.env.DIRECT_URL); // test

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
});