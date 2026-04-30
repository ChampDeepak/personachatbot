import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

import { SystemPrompt as KshitijPrompt } from './person1/systemPrompt';
import { FewShotExamples as KshitijExamples } from './person1/fewShotExamples';
import { SystemPrompt as AnshumanPrompt } from './person2/systemPrompt';
import { FewShotExamples as AnshumanExamples } from './person2/fewShotExamples';
import { SystemPrompt as AbhimanyuPrompt } from './person3/systemPrompt';
import { FewShotExamples as AbhimanyuExamples } from './person3/fewShotExamples';

type PersonKey = 'kshitij' | 'anshuman' | 'abhimanyu';

const PERSONS: Record<PersonKey, { system: string; examples: any[]; label: string }> = {
  kshitij: {
    system: KshitijPrompt.getPrompt(),
    examples: KshitijExamples.getExamples(),
    label: 'Kshitij Mishra',
  },
  anshuman: {
    system: AnshumanPrompt.getPrompt(),
    examples: AnshumanExamples.getExamples(),
    label: 'Anshuman Singh',
  },
  abhimanyu: {
    system: AbhimanyuPrompt.getPrompt(),
    examples: AbhimanyuExamples.getExamples(),
    label: 'Abhimanyu Saxena',
  },
};

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '*';

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  });
}

const PORT = Number(process.env.PORT ?? 3000);

const server = Bun.serve({
  port: PORT,
  routes: {
    '/api/health': () => json({ ok: true }),

    '/api/persons': () =>
      json({
        persons: (Object.keys(PERSONS) as PersonKey[]).map((k) => ({
          key: k,
          label: PERSONS[k].label,
        })),
      }),

    '/api/chat': {
      OPTIONS: () => new Response(null, { status: 204, headers: corsHeaders() }),
      POST: async (req) => {
        let body: { person?: string; message?: string } = {};
        try {
          body = (await req.json()) as { person?: string; message?: string };
        } catch {
          return json({ error: 'Invalid JSON body' }, 400);
        }

        const person = body.person as PersonKey | undefined;
        const message = body.message?.trim();

        if (!person || !(person in PERSONS)) {
          return json({ error: 'person must be one of: kshitij, anshuman, abhimanyu' }, 400);
        }
        if (!message) {
          return json({ error: 'message is required' }, 400);
        }

        const cfg = PERSONS[person];

        try {
          const { text } = await generateText({
            model: groq('llama-3.1-8b-instant'),
            system: cfg.system,
            messages: [
              ...cfg.examples,
              { role: 'user', content: message },
            ],
          });
          return json({ person, label: cfg.label, reply: text });
        } catch (err) {
          console.error('generateText error:', err);
          return json({ error: 'Upstream model error' }, 502);
        }
      },
    },
  },

  fetch(req) {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    return new Response('Not Found', { status: 404, headers: corsHeaders() });
  },
});

console.log(`Server listening on http://localhost:${server.port}`);
