import type { GenerateOptions, LLMClient, LLMResult } from './types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

export const geminiClient: LLMClient = {
  /**
   * Uses Google's Gemini Flash API to process a text prompt.
   * Expects `GEMINI_API_KEY` in env.
   */
  async generate(prompt: string, options: GenerateOptions = {}): Promise<LLMResult> {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: options.temperature ?? 0,
          ...(options.json ? { responseMimeType: 'application/json' } : {}),
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${err}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No content in Gemini response');
    }

    const usage = data.usageMetadata;
    const tokenUsage = usage
      ? {
          promptTokens: usage.promptTokenCount ?? 0,
          completionTokens: usage.candidatesTokenCount ?? 0,
          totalTokens: usage.totalTokenCount ?? 0,
        }
      : null;

    return { text, tokenUsage };
  },
};
