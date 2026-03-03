const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');

// Generate story content using Deepseek API
exports.generateStory = asyncHandler(async (req, res, next) => {
  const { title, shortDescription, genre, pages } = req.body;

  if (!title || !shortDescription || !genre || !pages) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, shortDescription, genre, and pages',
    });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: 'Deepseek API key is not configured',
    });
  }

  // Rough token target based on pages (assume ~250 words/page, ~0.75 tokens/word)
  const targetTokens = Math.min(4000, Math.max(500, Math.floor(pages * 250 * 0.75)));

  const prompt = `
You are a professional AI novelist.

Write a complete, fully developed story based on the following:

Title: ${title}
Genre: ${genre}
Short description: ${shortDescription}

Length Requirement:
- The story MUST be approximately ${pages} full pages.
- Target length: at least ${targetTokens} tokens.
- Do NOT stop early.
- Do NOT summarize.
- Do NOT end abruptly.
- Continue writing until the story is fully complete and reaches the required length.

Structure Requirements:
- Include a clear beginning, rising action, climax, falling action, and resolution.
- Use detailed descriptions, dialogue, and immersive world-building.
- Ensure the ending feels satisfying and complete.

Output only the story text. Do not include explanations or commentary.`;

  try {
    const response = await axios.post(
      'https://api.deepseek.com/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful story writing assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: targetTokens,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const content = response.data?.choices?.[0]?.message?.content || '';

    if (!content) {
      return res.status(500).json({
        success: false,
        message: 'No story content returned from AI',
      });
    }

    return res.json({
      success: true,
      data: {
        content,
      },
    });
  } catch (error) {
    console.error('Deepseek API error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate story',
      error: error.response?.data || error.message,
    });
  }
});






