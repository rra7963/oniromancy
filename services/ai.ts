/**
 * OpenAI-backed drop-in replacement for the small slice of the
 * `@google/genai` surface this app used.
 *
 * The action files keep calling `ai.models.generateContent(...)` and
 * `ai.models.generateImages(...)` with Gemini-shaped arguments; everything is
 * translated to the OpenAI Chat Completions / Images APIs here.
 *
 * Environment:
 *   OPENAI_API_KEY      required
 *   OPENAI_BASE_URL     optional, defaults to https://api.openai.com/v1
 *                       (point this at a compatible relay if you use one)
 *   OPENAI_MODEL        optional, defaults to gpt-4o-mini
 *   OPENAI_IMAGE_MODEL  optional, defaults to gpt-image-1
 */

import OpenAI from "openai";

/** Mirrors `Type` from @google/genai so existing responseSchema blocks compile. */
export const Type = {
  STRING: "string",
  NUMBER: "number",
  INTEGER: "integer",
  BOOLEAN: "boolean",
  ARRAY: "array",
  OBJECT: "object",
} as const;

type GeminiSchema = {
  type: string;
  properties?: Record<string, GeminiSchema>;
  items?: GeminiSchema;
  required?: string[];
  enum?: string[];
  description?: string;
};

export interface GenerateContentArgs {
  model?: string;
  contents: string;
  config?: {
    responseMimeType?: string;
    responseSchema?: GeminiSchema;
    temperature?: number;
  };
}

export interface GenerateImagesArgs {
  model?: string;
  prompt: string;
  config?: {
    numberOfImages?: number;
    outputMimeType?: string;
    aspectRatio?: string;
  };
}

const TEXT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

/**
 * OpenAI's strict structured-output mode requires every property to be listed
 * in `required` and `additionalProperties: false` on every object. Gemini is
 * laxer, so normalise the schema on the way through.
 */
function toJsonSchema(schema: GeminiSchema): Record<string, unknown> {
  const out: Record<string, unknown> = { type: schema.type };

  if (schema.description) out.description = schema.description;
  if (schema.enum) out.enum = schema.enum;

  if (schema.type === Type.OBJECT && schema.properties) {
    const properties: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(schema.properties)) {
      properties[key] = toJsonSchema(value);
    }
    out.properties = properties;
    out.required = Object.keys(schema.properties);
    out.additionalProperties = false;
  }

  if (schema.type === Type.ARRAY && schema.items) {
    out.items = toJsonSchema(schema.items);
  }

  return out;
}

/** Flattens a schema into prose, for the json_object fallback path. */
function describeSchema(schema: GeminiSchema, indent = ""): string {
  if (schema.type === Type.OBJECT && schema.properties) {
    return Object.entries(schema.properties)
      .map(([key, value]) => {
        const enumHint = value.enum ? ` (one of: ${value.enum.join(", ")})` : "";
        if (value.type === Type.OBJECT) {
          return `${indent}- ${key}: object\n${describeSchema(value, indent + "  ")}`;
        }
        if (value.type === Type.ARRAY && value.items) {
          return `${indent}- ${key}: array of ${value.items.type}${enumHint}`;
        }
        return `${indent}- ${key}: ${value.type}${enumHint}`;
      })
      .join("\n");
  }
  return `${indent}- value: ${schema.type}`;
}

class Models {
  constructor(private client: OpenAI) {}

  async generateContent(args: GenerateContentArgs): Promise<{ text: string }> {
    const { contents, config } = args;
    const model = resolveTextModel(args.model);
    const wantsJson =
      config?.responseMimeType === "application/json" || !!config?.responseSchema;

    if (!wantsJson) {
      const completion = await this.client.chat.completions.create({
        model,
        messages: [{ role: "user", content: contents }],
        temperature: config?.temperature,
      });
      return { text: completion.choices[0]?.message?.content ?? "" };
    }

    const schema = config?.responseSchema;

    // Preferred path: strict structured outputs.
    if (schema) {
      try {
        const completion = await this.client.chat.completions.create({
          model,
          messages: [{ role: "user", content: contents }],
          temperature: config?.temperature,
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "response",
              strict: true,
              schema: toJsonSchema(schema),
            },
          },
        });
        return { text: completion.choices[0]?.message?.content ?? "" };
      } catch (error) {
        // Many OpenAI-compatible relays reject json_schema. Fall through to
        // plain JSON mode rather than failing the whole reading.
        console.warn(
          "[ai] json_schema mode unavailable, falling back to json_object:",
          error instanceof Error ? error.message : error
        );
      }
    }

    const instructions = schema
      ? `\n\nRespond with a single JSON object and nothing else. It must contain exactly these keys:\n${describeSchema(schema)}`
      : "\n\nRespond with a single JSON object and nothing else.";

    const completion = await this.client.chat.completions.create({
      model,
      messages: [{ role: "user", content: contents + instructions }],
      temperature: config?.temperature,
      response_format: { type: "json_object" },
    });

    return { text: completion.choices[0]?.message?.content ?? "" };
  }

  async generateImages(args: GenerateImagesArgs): Promise<{
    generatedImages: Array<{ image: { imageBytes: string } }>;
  }> {
    const model = resolveImageModel(args.model);
    const format = args.config?.outputMimeType === "image/jpeg" ? "jpeg" : "png";

    // gpt-image-1 always returns base64 and accepts an output format;
    // dall-e-3 needs to be asked for base64 explicitly and takes neither.
    const params = {
      model,
      prompt: args.prompt,
      n: args.config?.numberOfImages ?? 1,
      size: pickSize(model, args.config?.aspectRatio),
      stream: false,
      ...(model.startsWith("gpt-image")
        ? { output_format: format }
        : { response_format: "b64_json" }),
    } as unknown as OpenAI.Images.ImageGenerateParamsNonStreaming;

    const result = await this.client.images.generate(params);

    const images = (result.data ?? [])
      .map((item: OpenAI.Images.Image) => item.b64_json)
      .filter((bytes): bytes is string => !!bytes)
      .map((bytes: string) => ({ image: { imageBytes: bytes } }));

    return { generatedImages: images };
  }
}

/** Gemini model names are remapped so existing call sites keep working. */
function resolveTextModel(model?: string): string {
  if (!model || model.startsWith("gemini")) return TEXT_MODEL;
  return model;
}

function resolveImageModel(model?: string): string {
  if (!model || model.startsWith("imagen")) return IMAGE_MODEL;
  return model;
}

/** Maps a Gemini aspect ratio onto the sizes each OpenAI image model accepts. */
function pickSize(model: string, aspectRatio?: string): string {
  const portrait = aspectRatio === "9:16" || aspectRatio === "3:4";
  const landscape = aspectRatio === "16:9" || aspectRatio === "4:3";

  if (model.startsWith("dall-e-3")) {
    if (portrait) return "1024x1792";
    if (landscape) return "1792x1024";
    return "1024x1024";
  }

  if (portrait) return "1024x1536";
  if (landscape) return "1536x1024";
  return "1024x1024";
}

export class GoogleGenAI {
  models: Models;

  constructor(options: {
    apiKey: string;
    httpOptions?: { headers?: Record<string, string> };
  }) {
    this.models = new Models(
      new OpenAI({
        apiKey: options.apiKey,
        baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
        defaultHeaders: options.httpOptions?.headers,
      })
    );
  }
}
