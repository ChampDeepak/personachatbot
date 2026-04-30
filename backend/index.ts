import { generateText } from 'ai';
import { Groq } from 'groq-sdk';
import { groq } from '@ai-sdk/groq';
import { SystemPrompt } from './person1/systemPrompt';
import { FewShotExamples } from './person1/fewShotExamples';


const { text } = await generateText({
    model: groq('llama-3.1-8b-instant'),
    system: SystemPrompt.getPrompt(),
    messages: [
        ...FewShotExamples.getExamples(),
        {
            role: 'user',
            content: `who are you`
        }
    ]
});

console.log(text);