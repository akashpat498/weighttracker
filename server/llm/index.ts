import { geminiClient } from './gemini';
import { openaiClient } from './openai';

const PROVIDER = process.env.LLM_PROVIDER || 'openai';

export const llm = PROVIDER === 'gemini' ? geminiClient : openaiClient;
