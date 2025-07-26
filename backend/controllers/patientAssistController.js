const AIService = require("../services/aiService");
const Conversation = require("../models/Conversation");
const User = require("../models/User");

exports.getPatientAssistResponse = async (req, res) => {
  const { query, patientInfo } = req.body;
  const userId = req.user.id; // Assuming user is authenticated

  if (!query) {
    return res.status(400).json({ message: "Query is required." });
  }

  try {
    // Find or create a conversation for this patient assist interaction
    // For simplicity, we'll create a new one for each interaction for now.
    // In a real scenario, you might want to manage ongoing conversations.
    let conversation = await Conversation.findOne({
      userId,
      portal: "patient_assist",
      isActive: true,
    }).sort({ createdAt: -1 });

    if (!conversation) {
      conversation = new Conversation({
        userId,
        sessionId: `patient-assist-${userId}-${Date.now()}`,
        portal: "patient_assist",
        title: query.substring(0, 50) + (query.length > 50 ? "..." : ""),
        context: { patientAge: patientInfo?.age, patientGender: patientInfo?.gender },
      });
      await conversation.save();
    }

    // Add user query to conversation
    await conversation.addMessage("user", query);

    const aiResponse = await AIService.getPatientAssistResponse(query, patientInfo);

    // Add AI response to conversation
    await conversation.addMessage("assistant", aiResponse.content, aiResponse.metadata);

    res.status(200).json({
      response: aiResponse.content,
      metadata: aiResponse.metadata,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Error in patient assist controller:", error);
    res.status(500).json({ message: error.message });
  }
};


