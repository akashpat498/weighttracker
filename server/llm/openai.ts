import type { GenerateOptions, LLMClient, LLMResult } from './types';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o';

export const openaiClient: LLMClient = {
  /**
   * Uses OpenAI's chat completions API (gpt-4o by default) to process a text prompt.
   * Expects `OPENAI_API_KEY` in env.
   */
  async generate(prompt: string, options: GenerateOptions = {}): Promise<LLMResult> {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: options.temperature ?? 0,
        ...(options.json ? { response_format: { type: 'json_object' } } : {}),
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${err}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
      };
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const tokenUsage = data.usage
      ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        }
      : null;

    return { text: content, tokenUsage };
  },
};
