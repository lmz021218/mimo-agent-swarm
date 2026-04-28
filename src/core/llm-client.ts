/**
 * LLM 客户端 - 封装 Kimi API 调用
 * 兼容 OpenAI Chat Completions 格式
 */

const API_BASE = 'https://api.moonshot.cn/v1';
const API_KEY = 'sk-kimi-gzeLdy5yWNInAVbn53UAkyiGw5j6uMhGBIXUnnUXIw5Xn89Q3ndX3dcnlz99C3kd';
const MODEL = 'kimi-k2-turbo-preview';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function chatCompletion(
  messages: ChatMessage[],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<LLMResponse> {
  const { temperature = 0.3, maxTokens = 4096 } = options;

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error ${response.status}: ${errorText}`);
  }

  const data = await response.json() as Record<string, any>;
  const choice = data.choices?.[0];

  if (!choice?.message?.content) {
    throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
  }

  return {
    content: choice.message.content.trim(),
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
  };
}

/**
 * 流式调用（用于实时展示推理过程）
 */
export async function* chatCompletionStream(
  messages: ChatMessage[],
  options: { temperature?: number } = {}
): AsyncGenerator<string> {
  const { temperature = 0.3 } = options;

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: 4096,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM API error ${response.status}: ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // skip malformed JSON
        }
      }
    }
  }
}
