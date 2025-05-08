// notifier.mjs
import { WebSocketProvider } from "ethers";
import 'dotenv/config'; 
import readline from "readline";

// 1) Your full WSS endpoint & contract
const ALCHEMY_WSS = `wss://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const CONTRACT   = "0x9ed8b47bc3417e3bd0507adc06e56e2fa360a4e9";

// Spinner frames
const frames = ["|", "/", "–", "\\"];
let idx       = 0;
let latestRaw = "";
let msgCount  = 0;

// Helper to render spinner on its own line
function renderSpinner() {
  readline.clearLine(process.stdout, 0);    // clear current line
  readline.cursorTo(process.stdout, 0);     // move cursor to col 0
  process.stdout.write(
    `${frames[idx++ % frames.length]} [msgs: ${msgCount}] ${latestRaw.slice(0, 60)}`
  );
}

// 2) Kick off the interval
const spinnerInterval = setInterval(renderSpinner, 200);

// 3) Create provider & subscribe
const ws = new WebSocketProvider(ALCHEMY_WSS);

ws.on({ address: CONTRACT }, (log) => {
  // 3a) Clear spinner and move down one line
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write("\n");

  // 3b) Print your timestamped log
  const ts = new Date().toISOString();
  console.log(`✅ [${ts}] New tx/log:`, log);

  // 3c) Immediately redraw spinner below the log
  renderSpinner();
});

ws.on("error", (err) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write("\n");
  console.error("⚠️ WebSocketProvider error:", err);
  renderSpinner();
});

// 4) Hook raw frames
ws.websocket.on("open", () => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  console.log("🔗 WebSocket connected");
  renderSpinner();

  ws.websocket.on("message", (data) => {
    msgCount++;
    latestRaw = data.toString();
  });

  ws.websocket.on("close", (code) => {
    clearInterval(spinnerInterval);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    console.log(`🔒 WebSocket closed (code ${code})`);
  });
});

// 5) Startup message
console.log("🚀 Notifier started; spinning until logs land…");