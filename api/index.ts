import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
let serverSetupPromise: Promise<express.Express> | null = null;

async function setupServer() {
  if (serverSetupPromise) return serverSetupPromise;

  serverSetupPromise = (async () => {
    app.use(express.json());

    // API routes
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.post("/api/send-newsletter", async (req, res) => {
      const { subject, content, subscribers } = req.body;

      if (!subject || !content || !subscribers || !Array.isArray(subscribers)) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      console.log(`Sending newsletter: "${subject}" to ${subscribers.length} subscribers.`);

      const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

      // Check if SMTP credentials are provided
      if (EMAIL_HOST && EMAIL_USER && EMAIL_PASS) {
        try {
          const transporter = nodemailer.createTransport({
            host: EMAIL_HOST,
            port: parseInt(EMAIL_PORT || "587"),
            secure: EMAIL_PORT === "465", // true for 465, false for other ports
            auth: {
              user: EMAIL_USER,
              pass: EMAIL_PASS,
            },
          });

          // Send emails in chunks to avoid rate limits
          const chunkSize = 10;
          let sentCount = 0;

          for (let i = 0; i < subscribers.length; i += chunkSize) {
            const chunk = subscribers.slice(i, i + chunkSize);
            const sendPromises = chunk.map(email => 
              transporter.sendMail({
                from: EMAIL_FROM || EMAIL_USER,
                to: email,
                subject: subject,
                text: content, // Plain text version
                html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                        ${content.replace(/\n/g, '<br>')}
                      </div>`
              })
            );

            await Promise.all(sendPromises);
            sentCount += chunk.length;
            console.log(`Sent chunk of ${chunk.length} emails. Total: ${sentCount}`);
          }

          return res.json({ 
            success: true, 
            message: `Newsletter successfully sent to ${subscribers.length} subscribers.`,
            count: subscribers.length
          });
        } catch (error: any) {
          console.error("Error sending newsletter via SMTP:", error);
          return res.status(500).json({ error: "Failed to send newsletter via SMTP. Please check your credentials." });
        }
      } else {
        // Fallback to simulation if no SMTP credentials
        console.log("No SMTP credentials found. Simulating email sending...");
        try {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Log the "sent" emails
          subscribers.forEach(email => {
            console.log(`[SIMULATED EMAIL SENT] To: ${email} | Subject: ${subject}`);
          });

          res.json({ 
            success: true, 
            message: `(SIMULATED) Newsletter successfully sent to ${subscribers.length} subscribers. No SMTP credentials provided.`,
            count: subscribers.length,
            simulated: true
          });
        } catch (error: any) {
          console.error("Error simulating newsletter sending:", error);
          res.status(500).json({ error: "Failed to simulate newsletter sending" });
        }
      }
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      // Serve static files in production
      // On Vercel, dist is at root, api/index.ts is in api/
      const distPath = path.join(__dirname, "..", "dist");
      app.use(express.static(distPath));
      
      // API routes are already handled above. 
      // For any other route, serve index.html (SPA fallback)
      app.get("*", (req, res) => {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send("Frontend not built. Run 'npm run build' first.");
        }
      });
    }

    return app;
  })();

  return serverSetupPromise;
}

// For local development
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  const PORT = 3000;
  setupServer().then((server) => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}

// Vercel serverless function handler
export default async (req: any, res: any) => {
  const server = await setupServer();
  return server(req, res);
};
