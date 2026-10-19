import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.PORT, () => {
  console.info(`PrepLoom backend listening on http://localhost:${env.PORT}`);
});

function shutdown(signal: string) {
  console.info(`${signal} received. Closing the HTTP server.`);
  server.close((error) => {
    if (error) {
      console.error("Could not close the HTTP server cleanly.", error);
      process.exit(1);
    }

    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
