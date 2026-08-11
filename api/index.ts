let serverModule: any = null;
let serverLoadError: any = null;

function getServerModule() {
  if (serverModule) return serverModule;
  if (serverLoadError) throw serverLoadError;
  try {
    // @ts-ignore
    serverModule = require("../dist/server.cjs");
    return serverModule;
  } catch (err) {
    serverLoadError = err;
    console.error("[VERCEL] Failed to load server.cjs bundle:", err);
    throw err;
  }
}

export default async function handler(req: any, res: any) {
  console.log(`[VERCEL] Incoming request: ${req.method} ${req.url}`);
  
  try {
    const { app, initializationPromise } = getServerModule();

    if (initializationPromise) {
      try {
        await initializationPromise;
      } catch (err) {
        console.error("[VERCEL] Initialization promise failed:", err);
      }
    }

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
      return res.status(500).json({ 
        status: "error", 
        message: "Internal server error: " + (err.message || String(err))
      });
    }
  }
}
