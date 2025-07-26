const axios = require("axios");

class AIService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiBase = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
    this.defaultModel = "gpt-4-turbo";

    if (!this.apiKey) {
      console.warn("OpenAI API key not found. AI features will be limited.");
    }
  }

  // System prompts for different portals
  getSystemPrompt(portal, userContext = {}) {
    const basePrompts = {
      wellness: `You are a compassionate and knowledgeable medical AI assistant for the My-wellnessAi portal, designed to help patients in rural Egypt and underserved areas access healthcare guidance.

Your role:
- Provide reliable, evidence-based health information and guidance
- Help users understand their symptoms and when to seek immediate care
- Offer wellness advice, preventive care recommendations, and lifestyle guidance
- Support users in Arabic and English languages
- Always prioritize patient safety and encourage professional medical consultation when needed

Guidelines:
- Be empathetic and culturally sensitive to Egyptian and Middle Eastern contexts
- Use simple, clear language that non-medical people can understand
- Always include disclaimers that you're not replacing professional medical care
- Encourage users to seek immediate medical attention for serious symptoms
- Provide practical advice that's accessible in rural/underserved areas
- Consider local healthcare resources and limitations

User Context: ${JSON.stringify(userContext)}

Remember: You are a supportive health companion, not a replacement for doctors. Always prioritize user safety.`,

      assist: `You are an advanced clinical decision support AI for the My-AssisstAi portal, designed to assist healthcare professionals in Egypt and globally.

Your role:
- Provide evidence-based differential diagnoses and clinical insights
- Assist with medical research and access to current medical literature
- Help with treatment protocols, guidelines, and standard operating procedures
- Support clinical decision-making with relevant medical knowledge
- Provide ICD-10 codes and medical documentation assistance
- Offer continuing medical education insights

Guidelines:
- Provide detailed, scientifically accurate medical information
- Include confidence levels and evidence quality for recommendations
- Reference current medical literature and guidelines when possible
- Consider local medical practices and available resources in Egypt
- Support both Arabic and English medical terminology
- Maintain professional medical language while being clear and actionable
- Always emphasize the importance of clinical judgment and patient assessment

User Context: ${JSON.stringify(userContext)}

Remember: You are a clinical support tool to enhance, not replace, professional medical judgment.`,

      patient_assist: `You are a highly knowledgeable medical AI, acting as an initial point of contact for patients from the My-wellnessAi portal when human doctors are unavailable. Your primary goal is to provide accurate, empathetic, and easy-to-understand medical advice, drawing upon the vast medical knowledge of My-AssisstAi.

Your role:
- Answer patient questions in a clear, concise, and reassuring manner.
- Provide initial support, advice, and instructions for maintaining health and wellness.
- Explain potential conditions and treatments in layman's terms.
- Guide patients on when and how to seek further professional medical consultation.
- Offer supportive documentation, scientific resources, and general medical knowledge.
- Maintain a compassionate and supportive tone.

Guidelines:
- Simplify complex medical jargon for a general audience.
- Always include a disclaimer that this is not a substitute for a direct doctor's consultation.
- Prioritize patient safety: if symptoms suggest a serious condition, strongly advise seeking immediate professional medical help.
- Be culturally sensitive and respectful.
- Focus on providing actionable advice that patients can understand and follow.
- Do not diagnose or prescribe. Your role is to inform and guide.

User Context: ${JSON.stringify(userContext)}

Remember: You are a bridge to care, providing initial guidance and support until a human doctor can intervene. Your responses must be safe, clear, and encouraging.`,
    };

    return basePrompts[portal] || basePrompts.wellness;
  }

  // Generate AI response for chat
  async generateChatResponse(messages, portal = "wellness", userContext = {}) {
    try {
      if (!this.apiKey) {
        throw new Error("OpenAI API key not configured");
      }

      const systemPrompt = this.getSystemPrompt(portal, userContext);

      const response = await axios.post(
        `${this.apiBase}/chat/completions`,
        {
          model: this.defaultModel,
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          temperature: 0.3,
          max_tokens: portal === "assist" ? 4000 : 2000,
          presence_penalty: 0.1,
          frequency_penalty: 0.1,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          timeout: 30000,
        }
      );

      const aiMessage = response.data.choices[0].message;
      const usage = response.data.usage;

      return {
        content: aiMessage.content,
        metadata: {
          model: response.data.model,
          tokens: usage.total_tokens,
          processingTime: Date.now(),
          confidence: this.calculateConfidence(aiMessage.content, portal),
        },
      };
    } catch (error) {
      console.error("AI Service Error:", error.response?.data || error.message);

      if (error.response?.status === 429) {
        throw new Error("AI service is currently busy. Please try again in a moment.");
      }

      if (error.response?.status === 401) {
        throw new Error("AI service authentication failed.");
      }

      throw new Error("AI service is temporarily unavailable. Please try again later.");
    }
  }

  // Analyze symptoms for wellness portal
  async analyzeSymptoms(symptoms, patientInfo = {}) {
    try {
      const prompt = `Patient Information:
Age: ${patientInfo.age || "Not specified"}
Gender: ${patientInfo.gender || "Not specified"}
Medical History: ${patientInfo.medicalHistory || "None provided"}

Symptoms: ${symptoms.join(", ")}

Please provide:
1. Possible conditions (with likelihood)
2. Urgency level (low/medium/high/emergency)
3. Recommended actions
4. When to seek immediate care
5. Self-care recommendations

Format your response in a clear, structured way for a patient to understand.`;

      const response = await this.generateChatResponse(
        [{ role: "user", content: prompt }],
        "wellness",
        patientInfo
      );

      return {
        ...response,
        urgencyLevel: this.extractUrgencyLevel(response.content),
        recommendations: this.extractRecommendations(response.content),
      };
    } catch (error) {
      throw error;
    }
  }

  // Generate differential diagnosis for doctors
  async generateDifferentialDiagnosis(caseDescription, patientData = {}) {
    try {
      const prompt = `Clinical Case:
${caseDescription}

Patient Data:
${JSON.stringify(patientData, null, 2)}

Please provide:
1. Differential diagnosis (ranked by likelihood)
2. Recommended investigations
3. Treatment considerations
4. ICD-10 codes for top diagnoses
5. Red flags to watch for
6. Follow-up recommendations

Provide evidence-based reasoning for each diagnosis.`;

      const response = await this.generateChatResponse(
        [{ role: "user", content: prompt }],
        "assist",
        patientData
      );

      return {
        ...response,
        diagnoses: this.extractDiagnoses(response.content),
        icdCodes: this.extractICDCodes(response.content),
      };
    } catch (error) {
      throw error;
    }
  }

  // Search medical knowledge base
  async searchMedicalKnowledge(query, specialty = null) {
    try {
      const prompt = `Medical Knowledge Search Query: ${query}
${specialty ? `Specialty Focus: ${specialty}` : ""}

Please provide:
1. Current evidence-based information
2. Recent research findings
3. Clinical guidelines
4. Treatment protocols
5. Relevant medical literature references

Focus on practical, actionable medical information.`;

      const response = await this.generateChatResponse(
        [{ role: "user", content: prompt }],
        "assist"
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  // New function: AI-driven patient response from assist AI
  async getPatientAssistResponse(patientQuery, patientInfo = {}) {
    try {
      const prompt = `Patient Query: ${patientQuery}

Patient Information:
Age: ${patientInfo.age || "Not specified"}
Gender: ${patientInfo.gender || "Not specified"}
Medical History: ${patientInfo.medicalHistory || "None provided"}

As a medical AI assistant, provide a compassionate, clear, and actionable response to the patient. Explain potential conditions or advice in simple terms. Always include a disclaimer that this is not a substitute for a direct doctor's consultation and advise seeking immediate professional medical help if symptoms are severe or persistent.`;

      const response = await this.generateChatResponse(
        [{ role: "user", content: prompt }],
        "patient_assist",
        patientInfo
      );

      return response;
    } catch (error) {
      throw error;
    }
  }

  // Helper methods
  calculateConfidence(content, portal) {
    // Simple confidence calculation based on content characteristics
    let confidence = 0.7;

    if (content.includes("evidence-based") || content.includes("research shows")) {
      confidence += 0.1;
    }

    if (
      content.includes("seek immediate medical attention") ||
      content.includes("emergency")
    ) {
      confidence += 0.1;
    }

    if (portal === "assist" && content.includes("ICD-10")) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  extractUrgencyLevel(content) {
    const urgencyKeywords = {
      emergency: ["emergency", "urgent", "immediate", "call 911", "hospital now"],
      high: ["high priority", "see doctor today", "urgent care"],
      medium: ["see doctor", "medical attention", "consult physician"],
      low: ["monitor", "self-care", "home remedies"],
    };

    const contentLower = content.toLowerCase();

    for (const [level, keywords] of Object.entries(urgencyKeywords)) {
      if (keywords.some((keyword) => contentLower.includes(keyword))) {
        return level;
      }
    }

    return "low";
  }

  extractRecommendations(content) {
    // Extract bullet points or numbered recommendations
    const lines = content.split("\n");
    const recommendations = [];

    for (const line of lines) {
      if (line.match(/^\d+\./) || line.match(/^[-*]/) || line.includes("recommend")) {
        recommendations.push(line.trim());
      }
    }

    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  extractDiagnoses(content) {
    // Extract potential diagnoses from the response
    const lines = content.split("\n");
    const diagnoses = [];

    for (const line of lines) {
      if (line.match(/^\d+\./) && !line.includes("ICD")) {
        diagnoses.push(line.trim());
      }
    }

    return diagnoses.slice(0, 5); // Limit to top 5 diagnoses
  }

  extractICDCodes(content) {
    // Extract ICD-10 codes from the response
    const icdPattern = /[A-Z]\d{2}\.?\d*/g;
    const matches = content.match(icdPattern) || [];
    return [...new Set(matches)]; // Remove duplicates
  }
}

module.exports = new AIService();


