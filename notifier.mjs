// notifier.mjs
import { WebSocketProvider } from "ethers";
import 'dotenv/config';

// 1) Read your key (or full WSS URL) from the env
//    Make sure you’ve set: export ALCHEMY_API_KEY="yY5jbI8kJWd4TykIS5Tm-dnp_2-qS8H2"
const key = process.env.ALCHEMY_API_KEY;
if (!key) {
  console.error("❌ Missing ALCHEMY_API_KEY in environment");
  process.exit(1);
}
const ALCHEMY_WSS = `wss://eth-sepolia.g.alchemy.com/v2/${key}`;
const CONTRACT   = "0x9ed8b47bc3417e3bd0507adc06e56e2fa360a4e9";

// Spinner frames
const frames = ["|", "/", "–", "\\"];
let idx       = 0;
let latestRaw = "";
let msgCount  = 0;

// Draw spinner + count + raw snippet
setInterval(() => {
  process.stdout.write(
    `\r${frames[idx++ % frames.length]} [msgs: ${msgCount}] ${latestRaw.slice(0, 60)}`
  );
}, 200);

// Create the provider and subscribe to your contract’s logs
const ws = new WebSocketProvider(ALCHEMY_WSS);

ws.on({ address: CONTRACT }, (log) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  const ts = new Date().toISOString();
  console.log(`✅ [${ts}] New tx/log:`, log);
});

ws.on("error", (err) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.error("⚠️  WebSocketProvider error:", err);
});

// Once the socket is open, start capturing raw frames
ws.websocket.on("open", () => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  console.log("🔗 WebSocket connected");

  ws.websocket.on("message", (data) => {
    msgCount++;
    latestRaw = data.toString();
  });

  ws.websocket.on("close", (code) => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(`🔒 WebSocket closed (code ${code})`);
  });
});

// Kickoff message
console.log("🚀 Notifier started; spinning until logs land…");
