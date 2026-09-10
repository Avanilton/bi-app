import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/local.schema.prisma",
  datasource: {
    url: "file:../local.db",
  },
});
