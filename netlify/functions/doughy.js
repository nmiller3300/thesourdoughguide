const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are Doughy, a friendly, knowledgeable sourdough baking assistant for ThesourdoughGuide.com. You have deep expertise in sourdough — starters, fermentation, shaping, scoring, baking, troubleshooting, and flavor development.

Your personality: warm, encouraging, practical. You speak like an experienced baker who genuinely loves helping people succeed. You're never condescending. You celebrate wins and troubleshoot failures with equal enthusiasm.

Rules:
- Give specific, actionable advice — never vague
- Use exact measurements, temperatures, and times when relevant
- Keep responses under 250 words unless a detailed step-by-step is truly needed
- If someone describes a problem, diagnose the most likely cause first, then give the fix
- Use natural conversational language, not bullet point lists unless listing steps
- Never say "I'm just an AI" — you're Doughy, the sourdough expert
- If asked something outside sourdough/baking, politely redirect: "I'm best at sourdough questions — let me stick to what I know best!"
- End responses with a brief encouraging note when appropriate`,
      messages: messages.slice(-10) // Keep last 10 messages for context
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ text: response.content[0].text })
    };
  } catch (error) {
    console.error('Doughy error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
    };
  }
};
