/**
 * Google Gemini / Gemma AI Service for Vanam Kuri / TreeGuard
 * Interacts with Google Generative AI REST API with dynamic model fallback
 */

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Priority candidate models supported across different Google AI API keys/tiers
const CANDIDATE_MODELS = [
  'gemma-4-26b-a4b-it',
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-2.5-flash',
  'gemini-1.5-pro'
];

let workingModelCache: string | null = null;

export function isGeminiConfigured(): boolean {
  return !!(GEMINI_API_KEY && GEMINI_API_KEY.trim() !== '' && GEMINI_API_KEY !== 'your_gemini_api_key_here');
}

const SYSTEM_INSTRUCTION = `You are Vanam Kuri AI (TreeGuard Assistant), an expert ecological & tree custody AI assistant.
Your goal is to guide users, campus students, and community guardians in urban forestry, tree planting, species care, tree health diagnostics, watering schedules, pest identification, and custody handoff rules.
Keep your answers helpful, concise, well-formatted with markdown and relevant emojis, and friendly.
If asked about Vanam Kuri, explain that it is an open platform for tracking tree sapling survival, assigning 3-year human custody, verifying growth checkpoints, and earning green badges.`;

// Demo responses when Gemini API key is missing or offline
const DEMO_RESPONSES: Record<string, string> = {
  tree_care: "🌿 **Tree Care Basics**:\n- **Watering**: 5-10 liters twice a week during dry seasons.\n- **Protection**: Ensure bamboo or wire guards are secure against cattle/vehicles.\n- **Mulching**: Keep organic mulch 3 inches away from the trunk base to maintain moisture without rot.",
  custody: "📜 **Tree Custody Oath**:\nAs a Vanam Kuri guardian, you pledge 3 years of unbroken human responsibility to ensure your sapling reaches self-sufficient canopy maturity! When you graduate or move, host a Handoff Ceremony to transfer custody.",
  health: "🩺 **Tree Health Checklist**:\n1. **Leaves**: Check for yellowing (chlorosis) or dark spots (fungal infection).\n2. **Soil**: Ensure loose, well-draining soil around root zone.\n3. **Canopy**: Prune dead low twigs carefully.",
  default: "🍃 Greetings! I am **Vanam Kuri AI**.\n\nTo unlock live real-time AI responses powered by Google Gemini, please add your \`VITE_GEMINI_API_KEY\` to the \`.env\` file in your project directory.\n\nIn the meantime, feel free to ask about:\n- Tree health diagnosis\n- Watering & soil advice\n- Custody handoff procedures"
};

export async function askGeminiAI(userQuery: string, chatHistory: ChatMessage[] = []): Promise<string> {
  const queryLower = userQuery.toLowerCase();
  const apiKey = GEMINI_API_KEY.trim();

  // If Gemini API Key is configured, attempt REST API call with model fallback
  if (isGeminiConfigured()) {
    const modelsToTry = workingModelCache 
      ? [workingModelCache, ...CANDIDATE_MODELS.filter(m => m !== workingModelCache)]
      : CANDIDATE_MODELS;

    let lastErrorMessage = '';

    for (const modelName of modelsToTry) {
      try {
        const contents = [
          {
            role: 'user',
            parts: [{ text: `[System Instruction: ${SYSTEM_INSTRUCTION}]` }]
          },
          ...chatHistory.slice(-6).map((msg) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          })),
          {
            role: 'user',
            parts: [{ text: userQuery }]
          }
        ];

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ contents })
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (candidateText && candidateText.trim()) {
            workingModelCache = modelName; // Cache working model for future calls
            return candidateText.trim();
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          lastErrorMessage = errData?.error?.message || `HTTP ${response.status}`;
        }
      } catch (err: any) {
        lastErrorMessage = err.message || 'Network error';
      }
    }

    console.warn('Gemini API calls failed on all candidate models:', lastErrorMessage);
    return `⚠️ **Gemini API Notice**: ${lastErrorMessage || 'Service temporarily unavailable'}\n\nPlease verify that your API key in \`.env\` has Generative Language API permissions enabled.`;
  }

  // Fallback demo responses if key is not configured
  await new Promise((res) => setTimeout(res, 500));

  if (queryLower.includes('water') || queryLower.includes('care') || queryLower.includes('soil')) {
    return DEMO_RESPONSES.tree_care;
  } else if (queryLower.includes('custody') || queryLower.includes('handoff') || queryLower.includes('oath')) {
    return DEMO_RESPONSES.custody;
  } else if (queryLower.includes('health') || queryLower.includes('disease') || queryLower.includes('yellow')) {
    return DEMO_RESPONSES.health;
  }

  return DEMO_RESPONSES.default;
}
