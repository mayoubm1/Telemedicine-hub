const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken: auth } = require('../middleware/auth');
const audioService = require('../services/audioService');

// Configure multer for audio file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/audio');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `audio-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/mp4', 
      'audio/webm', 'audio/ogg', 'audio/flac', 'audio/m4a'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid audio file type'), false);
    }
  }
});

// Text-to-Speech endpoint
router.post('/tts', auth, async (req, res) => {
  try {
    const { text, voice = 'female_voice', language = 'ar' } = req.body;

    if (!text) {
      return res.status(400).json({ 
        message: 'Text is required',
        message_ar: 'النص مطلوب'
      });
    }

    if (text.length > 50000) {
      return res.status(400).json({ 
        message: 'Text too long (max 50,000 characters)',
        message_ar: 'النص طويل جداً (الحد الأقصى 50,000 حرف)'
      });
    }

    // Generate audio
    const audioBuffer = await audioService.textToSpeech(text, voice, language);

    // Set response headers for audio
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Length': audioBuffer.length,
      'Content-Disposition': 'inline; filename="speech.wav"',
      'Cache-Control': 'public, max-age=3600'
    });

    res.send(audioBuffer);

  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ 
      message: 'Failed to generate speech',
      message_ar: 'فشل في توليد الكلام',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Speech-to-Text endpoint
router.post('/stt', auth, upload.single('audio'), async (req, res) => {
  try {
    const { language = 'ar' } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        message: 'Audio file is required',
        message_ar: 'ملف الصوت مطلوب'
      });
    }

    // Transcribe audio
    const transcription = await audioService.speechToText(req.file.path, language);

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    res.json({
      success: true,
      transcription,
      language,
      confidence: 0.95, // Placeholder - OpenAI doesn't provide confidence scores
      duration: req.file.size / 16000 // Rough estimate
    });

  } catch (error) {
    console.error('STT error:', error);
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }

    res.status(500).json({ 
      message: 'Failed to transcribe audio',
      message_ar: 'فشل في تحويل الصوت إلى نص',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Audio translation endpoint
router.post('/translate', auth, upload.single('audio'), async (req, res) => {
  try {
    const { targetLanguage = 'en' } = req.body;

    if (!req.file) {
      return res.status(400).json({ 
        message: 'Audio file is required',
        message_ar: 'ملف الصوت مطلوب'
      });
    }

    // Translate audio
    const translation = await audioService.translateAudio(req.file.path, targetLanguage);

    // Clean up uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting temp file:', err);
    });

    res.json({
      success: true,
      translation,
      targetLanguage,
      originalLanguage: 'auto-detected'
    });

  } catch (error) {
    console.error('Audio translation error:', error);
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }

    res.status(500).json({ 
      message: 'Failed to translate audio',
      message_ar: 'فشل في ترجمة الصوت',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Medical AI audio response endpoint
router.post('/medical-response', auth, async (req, res) => {
  try {
    const { text, voice = 'female_voice', language = 'ar', conversationId } = req.body;

    if (!text) {
      return res.status(400).json({ 
        message: 'Medical text is required',
        message_ar: 'النص الطبي مطلوب'
      });
    }

    // Generate medical audio response
    const audioBuffer = await audioService.generateMedicalAudioResponse(text, voice, language);

    // Log audio generation for analytics
    if (conversationId) {
      // This would typically be logged to your analytics system
      console.log(`Generated medical audio response for conversation: ${conversationId}`);
    }

    // Set response headers for audio
    res.set({
      'Content-Type': 'audio/wav',
      'Content-Length': audioBuffer.length,
      'Content-Disposition': 'inline; filename="medical-response.wav"',
      'Cache-Control': 'public, max-age=1800' // 30 minutes cache for medical content
    });

    res.send(audioBuffer);

  } catch (error) {
    console.error('Medical audio response error:', error);
    res.status(500).json({ 
      message: 'Failed to generate medical audio response',
      message_ar: 'فشل في توليد الاستجابة الصوتية الطبية',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get supported voices endpoint
router.get('/voices', auth, async (req, res) => {
  try {
    const { language = 'ar' } = req.query;
    
    const voices = audioService.getSupportedVoices(language);
    
    res.json({
      success: true,
      voices,
      language
    });

  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({ 
      message: 'Failed to get supported voices',
      message_ar: 'فشل في الحصول على الأصوات المدعومة',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Audio service health check
router.get('/health', async (req, res) => {
  try {
    const isAvailable = await audioService.checkServiceAvailability();
    
    res.json({
      success: true,
      audioServiceAvailable: isAvailable,
      supportedFeatures: {
        textToSpeech: isAvailable,
        speechToText: isAvailable,
        audioTranslation: isAvailable,
        medicalAudio: isAvailable
      },
      supportedLanguages: ['ar', 'en'],
      maxFileSize: '25MB',
      supportedFormats: ['wav', 'mp3', 'mp4', 'webm', 'ogg', 'flac', 'm4a']
    });

  } catch (error) {
    console.error('Audio health check error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Audio service health check failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Batch TTS endpoint for multiple texts
router.post('/batch-tts', auth, async (req, res) => {
  try {
    const { texts, voice = 'female_voice', language = 'ar' } = req.body;

    if (!Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ 
        message: 'Array of texts is required',
        message_ar: 'مصفوفة من النصوص مطلوبة'
      });
    }

    if (texts.length > 10) {
      return res.status(400).json({ 
        message: 'Maximum 10 texts allowed per batch',
        message_ar: 'الحد الأقصى 10 نصوص لكل دفعة'
      });
    }

    const audioResponses = [];

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      if (text && text.length <= 50000) {
        try {
          const audioBuffer = await audioService.textToSpeech(text, voice, language);
          audioResponses.push({
            index: i,
            success: true,
            audioBase64: audioBuffer.toString('base64'),
            size: audioBuffer.length
          });
        } catch (error) {
          audioResponses.push({
            index: i,
            success: false,
            error: 'Failed to generate audio for this text'
          });
        }
      } else {
        audioResponses.push({
          index: i,
          success: false,
          error: 'Text is empty or too long'
        });
      }
    }

    res.json({
      success: true,
      results: audioResponses,
      totalProcessed: texts.length,
      successCount: audioResponses.filter(r => r.success).length
    });

  } catch (error) {
    console.error('Batch TTS error:', error);
    res.status(500).json({ 
      message: 'Failed to process batch TTS',
      message_ar: 'فشل في معالجة دفعة تحويل النص إلى كلام',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File too large (max 25MB)',
        message_ar: 'الملف كبير جداً (الحد الأقصى 25 ميجابايت)'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files (max 1)',
        message_ar: 'ملفات كثيرة جداً (الحد الأقصى 1)'
      });
    }
  }
  
  if (error.message === 'Invalid audio file type') {
    return res.status(400).json({
      message: 'Invalid audio file type',
      message_ar: 'نوع ملف الصوت غير صالح',
      supportedTypes: ['wav', 'mp3', 'mp4', 'webm', 'ogg', 'flac', 'm4a']
    });
  }

  next(error);
});

module.exports = router;

