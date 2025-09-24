import axios from "axios";

class AIService {
  constructor() {
    this.googleApiKey = process.env.GOOGLE_AI_API_KEY;
    this.groqApiKey = process.env.GROQ_API_KEY;
  }

  // Enhanced summarization with better error handling
  async generateSummary(text) {
    if (!text || text.trim().length < 20) {
      throw new Error("Text too short to summarize (minimum 20 characters)");
    }

    try {
      return await this.generateSummaryWithGoogle(text);
    } catch (googleError) {
      console.log("Google AI failed, trying Groq...", googleError.message);

      try {
        return await this.generateSummaryWithGroq(text);
      } catch (groqError) {
        console.log(
          "Groq failed, using extractive summary...",
          groqError.message
        );
        return this.extractiveSummary(text);
      }
    }
  }

  // Google AI Studio Gemini API
  async generateSummaryWithGoogle(text) {
    if (!this.googleApiKey) {
      throw new Error("Google AI API key not configured");
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.googleApiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Please provide a concise summary of the following voice note in 2-3 sentences. Focus on the main points and key information:\n\n"${text}"`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 150,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text.trim();
    } else {
      throw new Error("Invalid response from Google AI API");
    }
  }

  // Groq API with Llama
  async generateSummaryWithGroq(text) {
    if (!this.groqApiKey) {
      throw new Error("Groq API key not configured");
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that creates concise summaries of voice notes. Always respond in 2-3 sentences.",
          },
          {
            role: "user",
            content: `Please provide a concise summary of this voice note in 2-3 sentences:\n\n"${text}"`,
          },
        ],
        max_tokens: 150,
        temperature: 0.3,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.groqApiKey}`,
        },
        timeout: 10000,
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error("Invalid response from Groq API");
    }
  }

  // Improved extractive summary
  extractiveSummary(text) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);

    if (sentences.length <= 2) {
      return text.length > 200 ? text.substring(0, 200) + "..." : text;
    }

    const firstSentence = sentences[0].trim();
    const maxSentences = Math.min(3, Math.ceil(sentences.length * 0.4));
    const selectedSentences = sentences.slice(0, maxSentences);

    return selectedSentences.join(". ") + ".";
  }

  // Health check for AI services - For Testing purposes only
  async healthCheck() {
    const status = {
      google: !!this.googleApiKey,
      groq: !!this.groqApiKey,
      working: false,
    };

    // Quick test with a simple phrase
    try {
      await this.generateSummary(
        "This is a test message to check if AI summarization is working properly."
      );
      status.working = true;
    } catch (error) {
      console.log("AI health check failed:", error.message);
    }

    return status;
  }
}

export default new AIService();
