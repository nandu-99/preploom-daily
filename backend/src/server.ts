import { app } from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";

async function startServer() {
  try {
    await connectDatabase();
    console.info("PostgreSQL connection established.");
  } catch (error) {
    console.error("Could not connect to PostgreSQL.", error);
    process.exit(1);
  }

  const server = app.listen(env.PORT, () => {
    console.info(`PrepLoom backend listening on http://localhost:${env.PORT}`);
  });

  let shuttingDown = false;

  async function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;

    console.info(`${signal} received. Closing application services.`);

    server.close(async (error) => {
      if (error) {
        console.error("Could not close the HTTP server cleanly.", error);
        process.exitCode = 1;
      }

      try {
        await disconnectDatabase();
        console.info("PostgreSQL connection closed.");
      } catch (databaseError) {
        console.error(
          "Could not close the PostgreSQL connection cleanly.",
          databaseError,
        );
        process.exitCode = 1;
      }

      process.exit();
    });
  }

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

void startServer();
