// lesson-2.js
// Streaming LLM responses

import "dotenv/config";
import { GroqChatLLM } from "bee-agent-framework/adapters/groq/chat";
import { BaseMessage, Role } from "bee-agent-framework/llms/primitives/message";

// Add readline for terminal input
import readline from "readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const llm = new GroqChatLLM({
  modelId: "llama-3.2-3b-preview",
});

const processMessage = async (message) => {
  process.stdout.write("Assistant: ");
  for await (const chunk of llm.stream([
    BaseMessage.of({
      role: Role.USER,
      text: message,
    }),
  ])) {
    process.stdout.write(chunk.getTextContent());
  }
  process.stdout.write("\n\n");
};

const startChat = async () => {
  while (true) {
    const message = await rl.question("You: ");

    if (message.toLowerCase() === "bye") {
      console.log("Assistant: Goodbye!");
      rl.close();
      break;
    }

    await processMessage(message);
  }
};

// Start the chat
console.log('Start chatting (type "bye" to exit)');
startChat();
