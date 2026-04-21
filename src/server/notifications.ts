import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface NotificationPayload {
  userId: string;
  alertId: string;
  title: string;
  summary: string;
  severity: string;
  packageName: string;
  sourceUrl: string;
}

export async function sendNotifications(payload: NotificationPayload) {
  const integrations = await db.integration.findMany({
    where: { userId: payload.userId, enabled: true },
  });

  const results: Record<string, boolean> = {};

  for (const integration of integrations) {
    try {
      switch (integration.type) {
        case "SLACK":
          results.slack = await sendSlack(
            integration.config as { webhookUrl: string },
            payload
          );
          break;
        case "EMAIL":
          results.email = await sendEmail(
            integration.config as { email: string },
            payload
          );
          break;
        case "TELEGRAM":
          results.telegram = await sendTelegram(
            integration.config as { botToken: string; chatId: string },
            payload
          );
          break;
        case "PAGERDUTY":
          results.pagerduty = await sendPagerDuty(
            integration.config as { routingKey: string },
            payload
          );
          break;
      }
    } catch (error) {
      console.error(`Failed to send ${integration.type} notification:`, error);
      results[integration.type.toLowerCase()] = false;
    }
  }

  await db.alert.update({
    where: { id: payload.alertId },
    data: {
      sentSlack: results.slack ?? false,
      sentEmail: results.email ?? false,
      sentTelegram: results.telegram ?? false,
      sentPagerDuty: results.pagerduty ?? false,
    },
  });

  return results;
}

async function sendSlack(
  config: { webhookUrl: string },
  payload: NotificationPayload
): Promise<boolean> {
  const severityEmoji: Record<string, string> = {
    CRITICAL: ":rotating_light:",
    HIGH: ":warning:",
    MEDIUM: ":large_yellow_circle:",
    LOW: ":information_source:",
  };

  const response = await fetch(config.webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `${severityEmoji[payload.severity] || ":shield:"} *${payload.title}*\n\n${payload.summary}\n\n*Package:* \`${payload.packageName}\` | *Severity:* ${payload.severity}\n<${payload.sourceUrl}|View Advisory>`,
          },
        },
      ],
    }),
  });

  return response.ok;
}

async function sendEmail(
  config: { email: string },
  payload: NotificationPayload
): Promise<boolean> {
  if (!resend) return false;

  const { error } = await resend.emails.send({
    from: "BreachSignal <alerts@breachsignal.io>",
    to: config.email,
    subject: `[${payload.severity}] ${payload.title}`,
    html: `
      <h2>${payload.title}</h2>
      <p>${payload.summary}</p>
      <p><strong>Package:</strong> ${payload.packageName}</p>
      <p><strong>Severity:</strong> ${payload.severity}</p>
      <p><a href="${payload.sourceUrl}">View Advisory</a></p>
    `,
  });

  return !error;
}

async function sendTelegram(
  config: { botToken: string; chatId: string },
  payload: NotificationPayload
): Promise<boolean> {
  const response = await fetch(
    `https://api.telegram.org/bot${config.botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        parse_mode: "HTML",
        text: `<b>[${payload.severity}] ${payload.title}</b>\n\n${payload.summary}\n\nPackage: <code>${payload.packageName}</code>\n<a href="${payload.sourceUrl}">View Advisory</a>`,
      }),
    }
  );

  return response.ok;
}

async function sendPagerDuty(
  config: { routingKey: string },
  payload: NotificationPayload
): Promise<boolean> {
  if (payload.severity !== "CRITICAL" && payload.severity !== "HIGH") {
    return false;
  }

  const response = await fetch(
    "https://events.pagerduty.com/v2/enqueue",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        routing_key: config.routingKey,
        event_action: "trigger",
        payload: {
          summary: `[BreachSignal] ${payload.title}`,
          source: "breachsignal",
          severity: payload.severity === "CRITICAL" ? "critical" : "error",
          custom_details: {
            package: payload.packageName,
            advisory_url: payload.sourceUrl,
          },
        },
      }),
    }
  );

  return response.ok;
}
