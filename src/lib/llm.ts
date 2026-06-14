// Placeholder LLM implementation to satisfy build when the real SDK export is unavailable.
export class LLM {
  async chat({ messages, maxTokens }: { messages: { role: string; content: string }[]; maxTokens?: number }) {
    // Return minimal response shape expected by the code.
    return {
      choices: [{ message: { content: '' } }]
    };
  }
}
