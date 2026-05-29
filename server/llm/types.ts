export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LLMResult {
  text: string;
  tokenUsage: TokenUsage | null;
}

export interface GenerateOptions {
  /** When true, asks the provider to return a JSON object. */
  json?: boolean;
  /** Sampling temperature. Defaults to 0 for deterministic parsing. */
  temperature?: number;
}

export interface LLMClient {
  /**
   * Sends a text prompt to the LLM and returns the text response along with
   * token usage metadata. Use `options.json` to request structured JSON output.
   *
   * @param prompt - Instructions or questions for the model
   * @param options - Generation options (json mode, temperature)
   * @returns The model's text reply and optional token usage
   * @throws When the provider API fails or returns no content
   */
  generate(prompt: string, options?: GenerateOptions): Promise<LLMResult>;
}
