import Fastify from "fastify";

type HelperState = {
  state: "IDLE" | "CONNECTING" | "CONNECTED" | "TALKING";
  room?: string;
  identity?: string;
  lastError?: string;
};

const app = Fastify({
  logger: true,
});

const cfg = {
  host: process.env.HELPER_HOST ?? "127.0.0.1",
  port: Number(process.env.HELPER_PORT ?? 26668),

  // 后续你会用到（先留着）
  serverBaseUrl: process.env.MS_SERVER_BASE_URL ?? "http://127.0.0.1:3000",
};

const helper: HelperState = {
  state: "IDLE",
};

// --- Routes ---

app.get("/health", async () => {
  return { ok: true };
});

app.get("/status", async () => {
  return {
    ok: true,
    ...helper,
  };
});

/**
 * join：后续会做两件事
 * 1) 请求 ms-server /session -> 拿 livekitUrl + token
 * 2) 用 livekit rtc-node 连接 livekit-server
 *
 * 现在先把状态机跑通（不连 livekit）
 */
app.post<{
  Body: { room: string; identity: string };
}>("/join", async (req, reply) => {
  const { room, identity } = req.body ?? ({} as any);

  if (typeof room !== "string" || room.trim() === "") {
    return reply.code(400).send({ ok: false, error: "room_required" });
  }
  if (typeof identity !== "string" || identity.trim() === "") {
    return reply.code(400).send({ ok: false, error: "identity_required" });
  }

  if (helper.state !== "IDLE") {
    return reply.code(409).send({ ok: false, error: "already_joined_or_connecting", state: helper.state });
  }

  helper.state = "CONNECTING";
  helper.room = room.trim();
  helper.identity = identity.trim();
  helper.lastError = undefined;

  // TODO: 在这里接入 livekit
  // - call ms-server to get token
  // - room.connect(livekitUrl, token)
  // - set helper.state = "CONNECTED"

  helper.state = "CONNECTED";

  return { ok: true, state: helper.state, room: helper.room, identity: helper.identity };
});

app.post("/leave", async (_req, reply) => {
  if (helper.state === "IDLE") {
    return reply.code(200).send({ ok: true, note: "already_idle" });
  }

  // TODO: room.disconnect()

  helper.state = "IDLE";
  helper.room = undefined;
  helper.identity = undefined;
  helper.lastError = undefined;

  return { ok: true, state: helper.state };
});

app.post<{
  Body: { pressed: boolean };
}>("/ptt", async (req, reply) => {
  const pressed = req.body?.pressed;

  if (typeof pressed !== "boolean") {
    return reply.code(400).send({ ok: false, error: "pressed_boolean_required" });
  }

  if (helper.state !== "CONNECTED" && helper.state !== "TALKING") {
    return reply.code(409).send({ ok: false, error: "not_connected", state: helper.state });
  }

  // TODO: pressed=true -> setMicrophoneEnabled(true)
  //       pressed=false -> setMicrophoneEnabled(false)

  helper.state = pressed ? "TALKING" : "CONNECTED";

  return { ok: true, state: helper.state };
});

// --- Start ---

app.listen({ host: cfg.host, port: cfg.port }).then(() => {
  app.log.info(`ms-helper listening on http://${cfg.host}:${cfg.port}`);
  app.log.info(`ms-server base url: ${cfg.serverBaseUrl}`);
}).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
