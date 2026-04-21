import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const addPackageSchema = z.object({
  packageName: z
    .string()
    .min(1, "Package name is required")
    .regex(/^(@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/, "Invalid package name"),
  version: z.string().optional(),
  ecosystem: z.enum(["npm", "pypi", "rubygems", "maven", "go"]).default("npm"),
});

export const packageJsonSchema = z.object({
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
});

export const integrationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("slack"),
    webhookUrl: z.string().url("Please enter a valid Slack webhook URL"),
  }),
  z.object({
    type: z.literal("pagerduty"),
    routingKey: z.string().min(1, "Routing key is required"),
  }),
  z.object({
    type: z.literal("telegram"),
    botToken: z.string().min(1, "Bot token is required"),
    chatId: z.string().min(1, "Chat ID is required"),
  }),
  z.object({
    type: z.literal("email"),
    email: z.string().email("Please enter a valid email address"),
  }),
]);

export const alertFilterSchema = z.object({
  severity: z.enum(["critical", "high", "medium", "low", "info"]).optional(),
  status: z.enum(["new", "acknowledged", "resolved", "ignored"]).optional(),
  packageName: z.string().optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type AddPackageInput = z.infer<typeof addPackageSchema>;
export type IntegrationInput = z.infer<typeof integrationSchema>;
