import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'

export const sanitizePrompt = (input) =>
  input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .slice(0, 2000)

export const checkRateLimit = () => {
  const history = JSON.parse(localStorage.getItem('gen_history') || '[]')
  const recent = history.filter((t) => t > Date.now() - 3600000)
  if (recent.length >= 10) return false
  localStorage.setItem('gen_history', JSON.stringify([...recent, Date.now()]))
  return true
}

export const getDailyCount = () => {
  const today = new Date().toISOString().split('T')[0]
  const data = JSON.parse(localStorage.getItem('daily_usage') || '{}')
  if (data.date !== today) return 0
  return data.count || 0
}

export const incrementDailyCount = () => {
  const today = new Date().toISOString().split('T')[0]
  const data = JSON.parse(localStorage.getItem('daily_usage') || '{}')
  const count = data.date === today ? (data.count || 0) + 1 : 1
  localStorage.setItem('daily_usage', JSON.stringify({ date: today, count }))
  return count
}

const STATIC_INSTRUCTIONS = `
You are an expert web developer building a "Static Website".
Generate a single, beautiful HTML file.
Requirements:
- All CSS inside <style> tag in <head>.
- All JS inside <script> tag before </body>.
- Modern CSS (gradients, animations, responsive).
- Output the HTML content exactly as valid HTML string.
- Provide a helpful chat message explaining what you built and suggesting next steps (e.g., "Your site is ready! Click Preview to see it live. Want me to add a contact form?").
- Ensure the file path is 'index.html'.
`

const FULLSTACK_INSTRUCTIONS = `
You are an expert full-stack developer building a "Full Stack App".
Generate a complete file tree for a functioning Next.js 15 application using App Router, TypeScript, Tailwind CSS v4, shadcn/ui, Supabase for auth and database, and Hono.js for API routes.
Requirements:
- Provide necessary files. File paths should be relative to the project root (e.g., 'app/page.tsx', 'app/layout.tsx', 'api/index.ts', 'components/ui/button.tsx', 'lib/supabase.ts', 'supabase/schema.sql', 'README.md').
- The generated 'package.json' MUST exactly include these dependencies pre-configured:
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "@supabase/supabase-js": "^2.0.0",
    "hono": "^4.0.0",
    "zod": "^3.0.0",
    "@shadcn/ui": "latest"
  }
}
- Provide a helpful chat message explaining what you built and offering next steps (e.g., "Your app is ready! Next steps: 1) Run \`npm install\` 2) Add your Supabase URL to \`.env.local\` 3) Deploy to Vercel.").
`

export const generateProject = async (apiKey, messages, projectType = 'static') => {
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          message: { type: SchemaType.STRING, description: 'Contextual AI reply with next-step instructions' },
          files: {
            type: SchemaType.ARRAY,
            description: 'List of generated files. For static, just index.html. For fullstack, the whole file tree.',
            items: {
              type: SchemaType.OBJECT,
              properties: {
                path: { type: SchemaType.STRING, description: 'File path, e.g. index.html or src/App.jsx' },
                content: { type: SchemaType.STRING, description: 'The absolute full content of the file. Do not truncate.' }
              },
              required: ['path', 'content']
            }
          }
        },
        required: ['message', 'files']
      }
    }
  })

  // Format messages for standard Gemini Chat API
  // We extract the user prompt from messages or just send the entire chat history.
  const systemInstruction = projectType === 'static' ? STATIC_INSTRUCTIONS : FULLSTACK_INSTRUCTIONS;
  
  // Create a chat session to maintain context
  const chatMessages = messages.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.role === 'user' ? sanitizePrompt(msg.content) : msg.content }]
  }));

  // We inject the system instruction into the very first message
  if (chatMessages.length > 0) {
    chatMessages[0].parts[0].text = `[SYSTEM INSTRUCTION: ${systemInstruction}]\n\n` + chatMessages[0].parts[0].text;
  }

  const result = await model.generateContent({ contents: chatMessages });
  const response = await result.response;
  const jsonText = response.text();
  try {
    return JSON.parse(jsonText);
  } catch (err) {
    console.error('Failed to parse Gemini JSON output', err, jsonText);
    throw new Error('Invalid JSON response from AI');
  }
}
