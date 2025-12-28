const { createOpenAICompatible } = require('@ai-sdk/openai-compatible');
const { generateText } = require('ai');

// Create NVIDIA NIM provider instance
const nim = createOpenAICompatible({
  name: 'nim',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.NIM_API_KEY}`,
  },
});

class HintService {
  constructor() {
    // Use DeepSeek-R1 for reasoning-based hints
    this.model = nim.chatModel('qwen/qwen3-next-80b-a3b-instruct');
  }

  /**
   * Generate a hint for the user's SQL query attempt
   * @param {object} params - Hint parameters
   * @param {string} params.question - The assignment question/description
   * @param {string} params.userQuery - The user's current SQL query attempt
   * @param {string} params.errorMessage - Error message if query failed
   * @param {array} params.tables - Table schemas available
   * @param {string} params.hintContext - Additional context for hint generation
   * @returns {object} - Generated hint
   */
  async generateHint({ question, userQuery, errorMessage, tables, hintContext }) {
    const systemPrompt = `You are a helpful SQL tutor. Your role is to provide hints and guidance to help students learn SQL, but you must NEVER provide the complete solution or write the query for them.

Rules:
1. Give subtle hints that point the student in the right direction
2. If there's an error, explain what type of error it is without fixing it directly
3. Suggest SQL concepts or keywords they might need to explore
4. Ask leading questions that help them think through the problem
5. Reference relevant table columns or relationships without writing the JOIN/WHERE clause
6. Keep hints concise (2-3 sentences max)
7. NEVER write SQL code in your response
8. NEVER reveal the complete answer

You want the student to learn and figure it out themselves with minimal guidance.`;

    const tableInfo = tables
      .map(t => `Table: ${t.name} (${t.columns.map(c => c.name).join(', ')})`)
      .join('\n');

    const userPrompt = `
Assignment Question: ${question}

Available Tables:
${tableInfo}

Student's Current Query:
${userQuery || '(No query written yet)'}

${errorMessage ? `Error Message: ${errorMessage}` : ''}

${hintContext ? `Additional Context: ${hintContext}` : ''}

Please provide a helpful hint (NOT the solution) to guide the student.`;

    try {
      const { text } = await generateText({
        model: this.model,
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 200,
        temperature: 0.7,
      });

      return {
        success: true,
        hint: text.trim(),
      };
    } catch (error) {
      console.error('Hint generation error:', error.message);
      
      // Fallback hints if API fails
      const fallbackHints = [
        'Think about which tables contain the data you need. What columns would help you filter or connect them?',
        'Consider the relationship between the tables. Is there a common column that links them together?',
        'Break down the problem: What data do you need? Where is it located? How do you filter it?',
        'Review the column names in each table. Which ones match what the question is asking for?',
        'If your query has an error, check for typos in table or column names, and ensure proper SQL syntax.'
      ];

      return {
        success: true,
        hint: fallbackHints[Math.floor(Math.random() * fallbackHints.length)],
        fallback: true
      };
    }
  }
}

module.exports = new HintService();
