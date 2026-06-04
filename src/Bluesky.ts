import { AtpAgent, RichText } from "@atproto/api";
import console from "node:console";

let agent: AtpAgent;
let agent_dm: AtpAgent;
let conv_id: any;
async function login() {
  const file = Bun.file(".env")

  if (!await file.exists()) {
    Bun.write(".env", "URL=\nIDENTIFIER=\nPASSWORD=\nDM_FOR_ERROR=\n")
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

  if (!process.env.DM_FOR_ERROR || process.env.DM_FOR_ERROR == "") {
    console.error("Please fill the DM_FOR_ERROR in the .env file");
    process.exit(1);
  }

  const URL = process.env.URL;
  const IDENTIFIER = process.env.IDENTIFIER;
  const PASSWORD = process.env.PASSWORD;
  const DM_FOR_ERROR = process.env.DM_FOR_ERROR;

  agent = new AtpAgent({ service: URL });

  await agent.login({ identifier: IDENTIFIER, password: PASSWORD });

  agent_dm = agent.withProxy("bsky_chat", "did:web:api.bsky.chat");
  const profile = await agent.getProfile({ actor: DM_FOR_ERROR });
  const conv = await agent_dm.chat.bsky.convo.getConvoForMembers({ members: [profile.data["did"]] })
  conv_id = conv["data"]["convo"]["id"];
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

async function dm(text: string) {
  const rt = new RichText({ text });

  await rt.detectFacets(agent);

  await agent_dm.chat.bsky.convo.sendMessage({ convoId: conv_id, message: { text: text, facets: rt.facets } });
}

export { login, post, dm };
