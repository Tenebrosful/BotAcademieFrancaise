import { AtpAgent, RichText } from "@atproto/api";
import { parse } from "@bearz/dotenv";

let agent: AtpAgent;
async function login() {
  try {
    Deno.lstatSync(".env");
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      Deno.writeTextFileSync(".env", "URL=\nIDENTIFIER=\nPASSWORD=\n");
    } else {
      throw err;
    }
  }

  const env = parse(Deno.readTextFileSync(".env"));

  if (env.URL === "") {
    console.error("Please fill the URL in the .env file");
    Deno.exit(1);
  }

  if (env.IDENTIFIER === "") {
    console.error("Please fill the IDENTIFIER in the .env file");
    Deno.exit(1);
  }

  if (env.PASSWORD === "") {
    console.error("Please fill the PASSWORD in the .env file");
    Deno.exit(1);
  }

  const URL = env.URL;
  const IDENTIFIER = env.IDENTIFIER;
  const PASSWORD = env.PASSWORD;

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
    created_at: new Date().toISOString()
  }

  await agent.post(post);
}

export { login, post };