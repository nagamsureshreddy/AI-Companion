const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');

// Generate story content using Deepseek API
exports.generateStory = asyncHandler(async (req, res, next) => {
  const { title, shortDescription, genre, pages, pageDescriptions } = req.body;

  if (!title || !genre || !pages) {
    return res.status(400).json({
      success: false,
      message: 'Please provide title, genre, and pages',
    });
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: 'Deepseek API key is not configured',
    });
  }

  const pageCount = Math.max(1, Math.min(20, Number(pages) || 1));
  const outlines =
    Array.isArray(pageDescriptions) && pageDescriptions.length
      ? pageDescriptions.slice(0, pageCount)
      : new Array(pageCount).fill(shortDescription || 'Continue the story.');

  // Total token target and per-page allocation (assume ~250 words/page, ~0.75 tokens/word)
  const totalTargetTokens = Math.min(4000, Math.max(500, Math.floor(pageCount * 250 * 0.75)));
  const perPageTokens = Math.max(300, Math.floor(totalTargetTokens / pageCount));

  const storyParts = [];

  try {
    for (let i = 0; i < pageCount; i++) {
      const pageNum = i + 1;
      const outline = outlines[i] || `Continue the story on page ${pageNum}.`;
      const previousStory = storyParts.join('\n\n');
      const recentContext = previousStory.slice(-2500); // keep prompt size reasonable

      const pagePrompt =
`You are a professional AI novelist writing a multi-page story.

Title: ${title}
Genre: ${genre}

Page ${pageNum} of ${pageCount}
Outline for this page:
${outline}

Story so far (for continuity, do NOT repeat, do NOT summarize):
${previousStory ? recentContext : '[This is the first page. Start the story.]'}

Instructions for this page:
- Continue directly from the previous page.
- Do NOT recap the plot.
- Do NOT end the story early unless this is the final page (${pageNum === pageCount ? 'yes, final page' : 'no, more pages remain'}).
- Match tone and pacing; keep the narrative flowing.
- Use approximately ${perPageTokens} tokens (about one page).`;

      const response = await axios.post(
        'https://api.deepseek.com/chat/completions',
        {
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'You are a helpful story writing assistant.' },
            { role: 'user', content: pagePrompt },
          ],
          temperature: 0.7,
          max_tokens: perPageTokens,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const pageContent = response.data?.choices?.[0]?.message?.content || '';
      if (!pageContent) {
        return res.status(500).json({
          success: false,
          message: `No story content returned for page ${pageNum}`,
        });
      }

      storyParts.push(pageContent.trim());
    }

    const fullStory = storyParts.join('\n\n');

    return res.json({
      success: true,
      data: {
        content: fullStory,
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






