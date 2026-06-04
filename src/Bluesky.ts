import { AtpAgent, RichText } from "@atproto/api";
import console from "node:console";

let agent: AtpAgent;
async function login() {
  const file = Bun.file(".env")

  if (!await file.exists()) {
    Bun.write(".env", "URL=\nIDENTIFIER=\nPASSWORD=\n")
    console.error("Missing .env file")
    process.exit(1);
  }

  if (!process.env.URL || process.env.URL == "") {
    console.error("Please fill the URL in the .env file");
    process.exit(1);
  }

  if (!process.env.IDENTIFIER || process.env.IDENTIFIER == "") {
    console.error("Please fill the IDENTIFIER in the .env file");
    process.exit(1);
  }

  if (!process.env.PASSWORD || process.env.PASSWORD == "") {
    console.error("Please fill the PASSWORD in the .env file");
    process.exit(1);
  }

  const URL = process.env.URL;
  const IDENTIFIER = process.env.IDENTIFIER;
  const PASSWORD = process.env.PASSWORD;

  agent = new AtpAgent({ service: URL });

  await agent.login({ identifier: IDENTIFIER, password: PASSWORD });
}

async function post(text: string) {
  const rt = new RichText({ text });

  await rt.detectFacets(agent);

  const post = {
    $type: "app.bsky.feed.post",
    text: rt.text,
    facets: rt.facets,
    created_at: new Date().toISOString(),
  };

  await agent.post(post);
}

export { login, post };
