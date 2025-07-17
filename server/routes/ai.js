const express = require('express');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const Guideline = require('../models/Guideline');

const router = express.Router();

// Simple AI chat endpoint (placeholder for RAG implementation)
router.post('/chat', optionalAuth, async (req, res) => {
  try {
    const { message, guidelineId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    // For now, return a simple response
    // In production, this would integrate with a RAG system
    let response = "I'm a placeholder AI assistant. In the full implementation, I would use RAG (Retrieval-Augmented Generation) to provide answers based on the clinical guidelines in the database.";

    // If a specific guideline is referenced, mention it
    if (guidelineId) {
      try {
        const guideline = await Guideline.findById(guidelineId);
        if (guideline) {
          response = `Based on the guideline "${guideline.title}" from ${guideline.trustName}, I would provide specific information here. This is a placeholder response - the full RAG implementation would analyze the guideline content and provide relevant answers.`;
        }
      } catch (error) {
        console.error('Error fetching guideline for AI chat:', error);
      }
    }

    // Simple keyword-based responses for demo
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('cardiology') || lowerMessage.includes('heart')) {
      response = "For cardiology-related questions, I would search through all cardiology guidelines in the database and provide evidence-based answers. This is a demo response.";
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      response = "For emergency medicine queries, I would prioritize the most recent emergency guidelines and provide quick, actionable information. This is a demo response.";
    } else if (lowerMessage.includes('pediatric') || lowerMessage.includes('children')) {
      response = "For pediatric questions, I would reference age-appropriate guidelines and dosing information. This is a demo response.";
    }

    res.json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString(),
        ...(guidelineId && { guidelineId }),
      },
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      error: 'AI chat service unavailable',
    });
  }
});

// Get chat history (if implementing persistent chat)
router.get('/chat/history', authenticateToken, async (req, res) => {
  try {
    // Placeholder for chat history
    // In production, you'd store chat sessions in the database
    res.json({
      success: true,
      data: {
        sessions: [],
        message: 'Chat history feature not yet implemented',
      },
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat history',
    });
  }
});

// Search guidelines for AI context
router.post('/search-context', optionalAuth, async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    // Search for relevant guidelines to provide context for AI
    const guidelines = await Guideline.find(
      {
        $text: { $search: query },
        isActive: true,
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .select('title description trustName medicalSpeciality content')
      .lean();

    res.json({
      success: true,
      data: {
        guidelines,
        query,
        count: guidelines.length,
      },
    });
  } catch (error) {
    console.error('AI search context error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search for context',
    });
  }
});

module.exports = router;

