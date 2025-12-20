import OpenAI from 'openai';
import { config } from '../config/env';

const openai = config.openAiApiKey
  ? new OpenAI({ apiKey: config.openAiApiKey })
  : null;

export class AISummaryService {
  /**
   * Generate a plain-English summary of a bill for Gen-Z audience
   * @param rawText - The full text or summary of the bill
   * @param gradeLevel - Target reading level (default: 8th grade)
   * @returns AI-generated summary
   */
  async summarizeBill(rawText: string, gradeLevel: number = 8): Promise<string> {
    if (!openai) {
      // Fallback if OpenAI is not configured
      return this.generateFallbackSummary(rawText);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a civic education assistant. Summarize bills in plain English for a Gen-Z audience at a ${gradeLevel}th grade reading level. Be concise, engaging, and avoid jargon. Use emojis sparingly to increase engagement. Focus on: what the bill does, who it affects, and why it matters.`,
          },
          {
            role: 'user',
            content: `Summarize this bill:\n\n${rawText.substring(0, 3000)}`,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || this.generateFallbackSummary(rawText);
    } catch (error) {
      console.error('Error generating AI summary:', error);
      return this.generateFallbackSummary(rawText);
    }
  }

  /**
   * Clean and moderate user-submitted amendment text
   * @param text - Raw amendment text from user
   * @returns Cleaned and moderated text
   */
  async cleanAmendmentText(text: string): Promise<string> {
    if (!openai) {
      return this.generateFallbackCleanedText(text);
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are a content moderator for a civic platform. Clean up user-submitted amendment proposals by:
1. Fixing grammar and spelling
2. Removing extreme profanity (allow occasional mild language)
3. Detecting and flagging bot-like or malicious content
4. Maintaining the user's original intent and voice
5. Keeping it concise and clear

If the content is malicious or spam, return: "[FLAGGED: Inappropriate content]"`,
          },
          {
            role: 'user',
            content: `Clean this amendment proposal:\n\n${text}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return completion.choices[0]?.message?.content || this.generateFallbackCleanedText(text);
    } catch (error) {
      console.error('Error cleaning amendment text:', error);
      return this.generateFallbackCleanedText(text);
    }
  }

  /**
   * Fallback summary when AI is unavailable
   */
  private generateFallbackSummary(rawText: string): string {
    const truncated = rawText.substring(0, 250);
    return `${truncated}... (AI summary unavailable - configure OpenAI API key for enhanced summaries)`;
  }

  /**
   * Fallback cleaning when AI is unavailable
   */
  private generateFallbackCleanedText(text: string): string {
    // Basic cleanup: trim and limit length
    return text.trim().substring(0, 1000);
  }
}

export default new AISummaryService();
