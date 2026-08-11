// @ts-ignore
import { app, initializationPromise } from "../dist/server.cjs";

export default async function handler(req: any, res: any) {
  console.log(`[VERCEL] Incoming request: ${req.method} ${req.url}`);
  try {
    await initializationPromise;
  } catch (err) {
    console.error("[VERCEL] Initialization failed:", err);
  }

  try {
    return await new Promise((resolve) => {
      app(req, res, (err: any) => {
        if (err) {
          console.error("[VERCEL] App error:", err);
          if (!res.headersSent) {
            res.status(500).json({ status: "error", message: "Server error: " + (err.message || String(err)) });
          }
        }
        resolve(null);
      });
    });
  } catch (err: any) {
    console.error("[VERCEL] Handler execution error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ status: "error", message: "Internal server error: " + (err.message || String(err)) });
    }
  }
}
