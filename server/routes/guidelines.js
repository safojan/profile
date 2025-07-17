const express = require('express');
const multer = require('multer');
const Guideline = require('../models/Guideline');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');
const { uploadToS3 } = require('../services/s3');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Get guidelines with pagination and filtering
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      trustName,
      medicalSpeciality,
      tags,
      isActive = true,
    } = req.query;

    // Build query
    const query = { isActive: isActive === 'true' };

    if (trustName && trustName !== 'all') {
      query.trustName = trustName;
    }

    if (medicalSpeciality) {
      query.medicalSpeciality = medicalSpeciality;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Handle search
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [guidelines, total] = await Promise.all([
      Guideline.find(query)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email')
        .sort(search ? { score: { $meta: 'textScore' } } : { updatedAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Guideline.countDocuments(query),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    res.json({
      success: true,
      data: {
        data: guidelines,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
      },
    });
  } catch (error) {
    console.error('Get guidelines error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch guidelines',
    });
  }
});

// Get single guideline
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const guideline = await Guideline.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!guideline) {
      return res.status(404).json({
        success: false,
        error: 'Guideline not found',
      });
    }

    res.json({
      success: true,
      data: guideline,
    });
  } catch (error) {
    console.error('Get guideline error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch guideline',
    });
  }
});

// Create new guideline (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      description,
      medicalSpeciality,
      trustName,
      content,
      tags,
    } = req.body;

    // Validate required fields
    if (!title || !medicalSpeciality || !trustName) {
      return res.status(400).json({
        success: false,
        error: 'Title, medical speciality, and trust name are required',
      });
    }

    let url = null;
    let fileType = 'text';

    // Handle file upload
    if (req.file) {
      try {
        const fileName = `guidelines/${Date.now()}-${req.file.originalname}`;
        url = await uploadToS3(req.file.buffer, fileName);
        fileType = 'pdf';
      } catch (uploadError) {
        console.error('S3 upload error:', uploadError);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload file',
        });
      }
    } else if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Either file or content is required',
      });
    }

    // Parse tags if provided as string
    let parsedTags = [];
    if (tags) {
      parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Create guideline
    const guideline = new Guideline({
      title,
      description,
      medicalSpeciality,
      trustName,
      url,
      content,
      fileType,
      tags: parsedTags,
      createdBy: req.user._id,
    });

    await guideline.save();
    await guideline.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: guideline,
      message: 'Guideline created successfully',
    });
  } catch (error) {
    console.error('Create guideline error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create guideline',
    });
  }
});

// Update guideline (admin only)
router.put('/:id', authenticateToken, requireAdmin, upload.single('file'), async (req, res) => {
  try {
    const guideline = await Guideline.findById(req.params.id);

    if (!guideline) {
      return res.status(404).json({
        success: false,
        error: 'Guideline not found',
      });
    }

    const {
      title,
      description,
      medicalSpeciality,
      trustName,
      content,
      tags,
      isActive,
    } = req.body;

    // Update fields
    if (title) guideline.title = title;
    if (description !== undefined) guideline.description = description;
    if (medicalSpeciality) guideline.medicalSpeciality = medicalSpeciality;
    if (trustName) guideline.trustName = trustName;
    if (content !== undefined) guideline.content = content;
    if (isActive !== undefined) guideline.isActive = isActive;

    // Handle tags
    if (tags) {
      guideline.tags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    }

    // Handle file upload
    if (req.file) {
      try {
        const fileName = `guidelines/${Date.now()}-${req.file.originalname}`;
        const url = await uploadToS3(req.file.buffer, fileName);
        guideline.url = url;
        guideline.fileType = 'pdf';
      } catch (uploadError) {
        console.error('S3 upload error:', uploadError);
        return res.status(500).json({
          success: false,
          error: 'Failed to upload file',
        });
      }
    }

    guideline.updatedBy = req.user._id;
    await guideline.save();
    await guideline.populate(['createdBy', 'updatedBy'], 'name email');

    res.json({
      success: true,
      data: guideline,
      message: 'Guideline updated successfully',
    });
  } catch (error) {
    console.error('Update guideline error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update guideline',
    });
  }
});

// Delete guideline (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const guideline = await Guideline.findById(req.params.id);

    if (!guideline) {
      return res.status(404).json({
        success: false,
        error: 'Guideline not found',
      });
    }

    await Guideline.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Guideline deleted successfully',
    });
  } catch (error) {
    console.error('Delete guideline error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete guideline',
    });
  }
});

// Search guidelines (separate endpoint for more complex search)
router.get('/search', optionalAuth, async (req, res) => {
  try {
    const {
      q: query,
      page = 1,
      limit = 20,
      trustName,
      medicalSpeciality,
      tags,
    } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    // Build search query
    const searchQuery = {
      $text: { $search: query },
      isActive: true,
    };

    if (trustName && trustName !== 'all') {
      searchQuery.trustName = trustName;
    }

    if (medicalSpeciality) {
      searchQuery.medicalSpeciality = medicalSpeciality;
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      searchQuery.tags = { $in: tagArray };
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Execute search
    const [guidelines, total] = await Promise.all([
      Guideline.find(searchQuery, { score: { $meta: 'textScore' } })
        .populate('createdBy', 'name email')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Guideline.countDocuments(searchQuery),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum);
    const hasNext = pageNum < totalPages;
    const hasPrev = pageNum > 1;

    res.json({
      success: true,
      data: {
        data: guidelines,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages,
          hasNext,
          hasPrev,
        },
        query,
      },
    });
  } catch (error) {
    console.error('Search guidelines error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
    });
  }
});

module.exports = router;

