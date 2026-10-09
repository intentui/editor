import { loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import { z } from "zod";
import { pageSchema } from "fumadocs-core/source/schema";

const docs = defineDocs({
  dir: "src/content/docs",
  docs: {
    schema: pageSchema.extend({
      description: z.string(),
      references: z.array(z.string().url()).optional(),
      status: z.enum(["new", "beta"]).optional(),
    }),
  },
});

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
