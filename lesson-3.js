// lesson-3.js
// Creating an agent with tool usage (including custom tools)

import "dotenv/config";
import { GroqChatLLM } from "bee-agent-framework/adapters/groq/chat";
import { DuckDuckGoSearchTool } from "bee-agent-framework/tools/search/duckDuckGoSearch";
import { OpenMeteoTool } from "bee-agent-framework/tools/weather/openMeteo";
import { BeeAgent } from "bee-agent-framework/agents/bee/agent";
import { TokenMemory } from "bee-agent-framework/memory/tokenMemory";
import { createSupportTicket } from "./custom-tools.js";

// Add readline for terminal input
import readline from "readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Define LLM
const llm = new GroqChatLLM({
  modelId: "llama-3.1-70b-versatile",
});

// Define Memory
// Use TokenMemory with LLM in order to keep token usage in check
const memory = new TokenMemory({ llm });

// Tools
const tools = [
  new DuckDuckGoSearchTool(),
  new OpenMeteoTool(),
  createSupportTicket,
];

// Define Agent
const agent = new BeeAgent({
  llm,
  memory,
  tools,
});

const processMessage = async (message) => {
  const response = await agent
    .run({
      prompt: message,
    })
    .observe((emitter) => {
      emitter.on("update", async ({ data, update, meta }) => {
        console.log(`Agent (${update.key}): ${update.value}`);
      });
    });

  console.log(`Agent: ${response.result.text}`);
};

const startChat = async () => {
  while (true) {
    const message = await rl.question("You: ");

    if (message.toLowerCase() === "bye") {
      console.log("Agent: Goodbye!");
      rl.close();
      break;
    }

    await processMessage(message);
  }
};

// Start the chat
console.log('Start chatting (type "bye" to exit)');
startChat();
