import app from "./app";
import config from "./config";

async function main() {
  try {
    app.listen(config.port);
  } catch (err) {
    process.exit(1);
  }
}

main();
