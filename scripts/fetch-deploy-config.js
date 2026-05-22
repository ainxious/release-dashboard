import { writeFile } from "node:fs/promises";

const configUrl = process.env.DEPLOY_CONFIG_URL;

if (!configUrl) {
  console.error("DEPLOY_CONFIG_URL is required");
  process.exit(1);
}

const response = await fetch(configUrl, {
  headers: {
    Accept: "application/json",
  },
});

if (!response.ok) {
  console.error(`Failed to fetch deploy config: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const config = await response.json();

await writeFile("deploy-config.json", `${JSON.stringify(config, null, 2)}\n`, "utf8");
console.log(`Fetched deploy config for target ${config.deploy_target ?? "unknown"}`);
