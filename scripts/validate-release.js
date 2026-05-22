import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile } from "node:fs/promises";

const execFile = promisify(execFileCallback);

const configPath = process.argv[2] ?? "deploy-config.json";
const rawConfig = await readFile(configPath, "utf8");
const config = JSON.parse(rawConfig);

/* TODO: Remove debug */
console.log("*** DEBUG deploy-config.json ***");
console.log(JSON.stringify(config, null, 2));

const storageEndpoint = config.s3_endpoint;
const releaseBucket = config.s3_bucket;
const artifactKey = config.s3_key;
const releaseVersion = config.release?.version ?? "unknown";

if (!releaseBucket || !artifactKey) {
  console.error("Deploy config missing required s3 bucket or s3 key fields");
  process.exit(1);
}

if (!storageEndpoint) {
  console.error("Deploy config missing required s3 endpoint field");
  process.exit(1);
}

const artifactUrl = `${storageEndpoint.replace(/\/$/, "")}/${releaseBucket}/${artifactKey}`;

console.log(`Preparing release validation for ${releaseVersion}`);
console.log(`Preparing deployment target ${config.deploy_target ?? "unknown"}`);

const response = await fetch(artifactUrl);

if (!response.ok) {
  console.error(`Failed to fetch release artifact: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const artifactBuffer = Buffer.from(await response.arrayBuffer());

if (artifactBuffer.length === 0) {
  console.error("Fetched release artifact is empty");
  process.exit(1);
}

await writeFile("release-bundle.tar.gz", artifactBuffer);

console.log(`Release bundle downloaded (${artifactBuffer.length} bytes)`);

const { stdout: tarListing } = await execFile("tar", ["-tzf", "release-bundle.tar.gz"]);
const tarEntries = tarListing.split("\n").filter(Boolean);
const expectedPrefix = `release-dashboard-${config.build_id ?? "unknown"}/`;
const expectedEntries = [
  `${expectedPrefix}dist/index.html`,
  `${expectedPrefix}manifest.json`,
  `${expectedPrefix}deploy-notes.txt`,
  `${expectedPrefix}README.txt`,
];

for (const expectedEntry of expectedEntries) {
  if (!tarEntries.includes(expectedEntry)) {
    console.error(`Release bundle missing expected entry: ${expectedEntry}`);
    process.exit(1);
  }
}

const { stdout: manifestContent } = await execFile("tar", [
  "-xOzf",
  "release-bundle.tar.gz",
  `${expectedPrefix}manifest.json`,
]);
const manifest = JSON.parse(manifestContent);

if (manifest.build_id !== config.build_id) {
  console.error(`Release manifest build_id mismatch: expected ${config.build_id}, got ${manifest.build_id}`);
  process.exit(1);
}

if (manifest.release_version !== releaseVersion) {
  console.error(`Release manifest version mismatch: expected ${releaseVersion}, got ${manifest.release_version}`);
  process.exit(1);
}

console.log(`Validated ${expectedEntries.length} required bundle entries`);
console.log("Release bundle metadata matches deploy config");
