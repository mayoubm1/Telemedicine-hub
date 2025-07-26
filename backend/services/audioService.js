const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

class AudioService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.openaiApiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';
  }

  /**
   * Convert text to speech using OpenAI TTS
   * @param {string} text - Text to convert to speech
   * @param {string} voice - Voice type ('male_voice' or 'female_voice')
   * @param {string} language - Language code ('ar' or 'en')
   * @returns {Promise<Buffer>} Audio buffer
   */
  async textToSpeech(text, voice = 'female_voice', language = 'ar') {
    try {
      // Map our voice types to OpenAI voices
      const voiceMapping = {
        'male_voice': language === 'ar' ? 'onyx' : 'echo',
        'female_voice': language === 'ar' ? 'nova' : 'shimmer'
      };

      const selectedVoice = voiceMapping[voice] || 'nova';

      // Prepare text for better Arabic pronunciation if needed
      let processedText = text;
      if (language === 'ar') {
        // Add Arabic-specific text processing for better pronunciation
        processedText = this.preprocessArabicText(text);
      }

      const response = await axios.post(
        `${this.openaiApiBase}/audio/speech`,
        {
          model: 'tts-1-hd', // High quality model
          input: processedText,
          voice: selectedVoice,
          response_format: 'wav',
          speed: 1.0
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('Text-to-Speech error:', error.response?.data || error.message);
      throw new Error('Failed to generate speech');
    }
  }

  /**
   * Convert speech to text using OpenAI Whisper
   * @param {Buffer|string} audioBuffer - Audio buffer or file path
   * @param {string} language - Language code ('ar' or 'en')
   * @returns {Promise<string>} Transcribed text
   */
  async speechToText(audioBuffer, language = 'ar') {
    try {
      const formData = new FormData();
      
      // Handle both buffer and file path inputs
      if (Buffer.isBuffer(audioBuffer)) {
        formData.append('file', audioBuffer, {
          filename: 'audio.wav',
          contentType: 'audio/wav'
        });
      } else if (typeof audioBuffer === 'string' && fs.existsSync(audioBuffer)) {
        formData.append('file', fs.createReadStream(audioBuffer));
      } else {
        throw new Error('Invalid audio input');
      }

      formData.append('model', 'whisper-1');
      formData.append('language', language);
      formData.append('response_format', 'json');
      formData.append('temperature', '0.2');

      const response = await axios.post(
        `${this.openaiApiBase}/audio/transcriptions`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            ...formData.getHeaders()
          }
        }
      );

      return response.data.text;
    } catch (error) {
      console.error('Speech-to-Text error:', error.response?.data || error.message);
      throw new Error('Failed to transcribe audio');
    }
  }

  /**
   * Translate audio from one language to another
   * @param {Buffer|string} audioBuffer - Audio buffer or file path
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<string>} Translated text
   */
  async translateAudio(audioBuffer, targetLanguage = 'en') {
    try {
      const formData = new FormData();
      
      if (Buffer.isBuffer(audioBuffer)) {
        formData.append('file', audioBuffer, {
          filename: 'audio.wav',
          contentType: 'audio/wav'
        });
      } else if (typeof audioBuffer === 'string' && fs.existsSync(audioBuffer)) {
        formData.append('file', fs.createReadStream(audioBuffer));
      } else {
        throw new Error('Invalid audio input');
      }

      formData.append('model', 'whisper-1');
      formData.append('response_format', 'json');

      const response = await axios.post(
        `${this.openaiApiBase}/audio/translations`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            ...formData.getHeaders()
          }
        }
      );

      return response.data.text;
    } catch (error) {
      console.error('Audio translation error:', error.response?.data || error.message);
      throw new Error('Failed to translate audio');
    }
  }

  /**
   * Generate audio response for medical AI
   * @param {string} medicalText - Medical response text
   * @param {string} voice - Voice preference
   * @param {string} language - Language preference
   * @returns {Promise<Buffer>} Audio buffer
   */
  async generateMedicalAudioResponse(medicalText, voice = 'female_voice', language = 'ar') {
    try {
      // Process medical text for better audio delivery
      const processedText = this.processMedicalTextForSpeech(medicalText, language);
      
      // Generate audio with appropriate pacing for medical content
      return await this.textToSpeech(processedText, voice, language);
    } catch (error) {
      console.error('Medical audio generation error:', error);
      throw error;
    }
  }

  /**
   * Process medical text for better speech synthesis
   * @param {string} text - Medical text
   * @param {string} language - Language code
   * @returns {string} Processed text
   */
  processMedicalTextForSpeech(text, language) {
    let processedText = text;

    if (language === 'ar') {
      // Arabic medical text processing
      processedText = processedText
        // Add pauses after medical terms
        .replace(/(\d+)\s*(ملغ|غرام|مل|لتر)/g, '$1 $2.')
        // Add pauses after bullet points
        .replace(/•/g, '. ')
        // Improve pronunciation of common medical terms
        .replace(/COVID-19/g, 'كوفيد تسعة عشر')
        .replace(/CT/g, 'سي تي')
        .replace(/MRI/g, 'إم آر آي')
        .replace(/ECG/g, 'إي سي جي');
    } else {
      // English medical text processing
      processedText = processedText
        // Add pauses for better comprehension
        .replace(/(\d+)\s*(mg|g|ml|L)/g, '$1 $2.')
        // Spell out abbreviations
        .replace(/\bCT\b/g, 'C.T.')
        .replace(/\bMRI\b/g, 'M.R.I.')
        .replace(/\bECG\b/g, 'E.C.G.')
        .replace(/\bBP\b/g, 'blood pressure')
        .replace(/\bHR\b/g, 'heart rate');
    }

    // Common processing for both languages
    processedText = processedText
      // Add pauses after sentences
      .replace(/\./g, '. ')
      // Add pauses after colons
      .replace(/:/g, ': ')
      // Remove multiple spaces
      .replace(/\s+/g, ' ')
      .trim();

    return processedText;
  }

  /**
   * Preprocess Arabic text for better TTS pronunciation
   * @param {string} text - Arabic text
   * @returns {string} Processed text
   */
  preprocessArabicText(text) {
    return text
      // Add diacritics for better pronunciation of medical terms
      .replace(/صحة/g, 'صِحَّة')
      .replace(/طبيب/g, 'طَبِيب')
      .replace(/مريض/g, 'مَرِيض')
      .replace(/علاج/g, 'عِلاج')
      .replace(/دواء/g, 'دَوَاء')
      // Improve number pronunciation
      .replace(/(\d+)/g, (match) => this.convertNumberToArabicWords(match))
      // Add natural pauses
      .replace(/،/g, '، ')
      .replace(/؛/g, '؛ ')
      .replace(/؟/g, '؟ ')
      .replace(/!/g, '! ');
  }

  /**
   * Convert numbers to Arabic words for better pronunciation
   * @param {string} number - Number as string
   * @returns {string} Number in Arabic words
   */
  convertNumberToArabicWords(number) {
    const arabicNumbers = {
      '0': 'صفر', '1': 'واحد', '2': 'اثنان', '3': 'ثلاثة', '4': 'أربعة',
      '5': 'خمسة', '6': 'ستة', '7': 'سبعة', '8': 'ثمانية', '9': 'تسعة',
      '10': 'عشرة', '11': 'أحد عشر', '12': 'اثنا عشر', '13': 'ثلاثة عشر',
      '14': 'أربعة عشر', '15': 'خمسة عشر', '16': 'ستة عشر', '17': 'سبعة عشر',
      '18': 'ثمانية عشر', '19': 'تسعة عشر', '20': 'عشرون'
    };

    const num = parseInt(number);
    if (num <= 20 && arabicNumbers[num.toString()]) {
      return arabicNumbers[num.toString()];
    }
    
    // For larger numbers, keep as digits for now
    return number;
  }

  /**
   * Save audio buffer to file
   * @param {Buffer} audioBuffer - Audio buffer
   * @param {string} filePath - Output file path
   * @returns {Promise<string>} File path
   */
  async saveAudioToFile(audioBuffer, filePath) {
    try {
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Write audio buffer to file
      fs.writeFileSync(filePath, audioBuffer);
      
      return filePath;
    } catch (error) {
      console.error('Error saving audio file:', error);
      throw new Error('Failed to save audio file');
    }
  }

  /**
   * Get supported voices for TTS
   * @param {string} language - Language code
   * @returns {Array} Available voices
   */
  getSupportedVoices(language = 'ar') {
    const voices = {
      'ar': [
        { id: 'male_voice', name: 'صوت ذكوري', gender: 'male', openaiVoice: 'onyx' },
        { id: 'female_voice', name: 'صوت أنثوي', gender: 'female', openaiVoice: 'nova' }
      ],
      'en': [
        { id: 'male_voice', name: 'Male Voice', gender: 'male', openaiVoice: 'echo' },
        { id: 'female_voice', name: 'Female Voice', gender: 'female', openaiVoice: 'shimmer' }
      ]
    };

    return voices[language] || voices['en'];
  }

  /**
   * Check if audio service is available
   * @returns {Promise<boolean>} Service availability
   */
  async checkServiceAvailability() {
    try {
      if (!this.openaiApiKey) {
        return false;
      }

      // Test with a simple request
      const testText = 'Test';
      await this.textToSpeech(testText, 'female_voice', 'en');
      return true;
    } catch (error) {
      console.error('Audio service availability check failed:', error);
      return false;
    }
  }
}

module.exports = new AudioService();

