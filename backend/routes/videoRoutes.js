import express from 'express';
import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all videos (with optional search and filter)
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Search by title
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    const videos = await Video.find(query)
      .populate('channelId', 'channelName')
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific video by ID
router.get('/:videoId', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId)
      .populate('channelId', 'channelName channelBanner subscribers')
      .populate('uploader', 'username avatar');

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create a new video
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      channelId,
      category
    } = req.body;

    // Validation
    if (!title || !videoUrl || !thumbnailUrl || !channelId || !category) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Verify channel ownership
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only add videos to your own channels' });
    }

    const video = new Video({
      title: title.trim(),
      description: description || '',
      videoUrl,
      thumbnailUrl,
      channelId,
      uploader: req.user._id,
      category
    });

    await video.save();

    // Add video to channel's videos array
    await Channel.findByIdAndUpdate(channelId, {
      $push: { videos: video._id }
    });

    const populatedVideo = await Video.findById(video._id)
      .populate('channelId', 'channelName')
      .populate('uploader', 'username avatar');

    res.status(201).json(populatedVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a video
router.put('/:videoId', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own videos' });
    }

    const { title, description, thumbnailUrl, category } = req.body;

    if (title) video.title = title.trim();
    if (description !== undefined) video.description = description;
    if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;
    if (category) video.category = category;

    await video.save();

    const populatedVideo = await Video.findById(video._id)
      .populate('channelId', 'channelName')
      .populate('uploader', 'username avatar');

    res.json(populatedVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a video
router.delete('/:videoId', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check ownership
    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own videos' });
    }

    // Remove video from channel's videos array
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: video._id }
    });

    await Video.findByIdAndDelete(req.params.videoId);

    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Like a video
router.post('/:videoId/like', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user._id.toString();
    const isLiked = video.likedBy.includes(userId);
    const isDisliked = video.dislikedBy.includes(userId);

    if (isLiked) {
      // Unlike
      video.likedBy = video.likedBy.filter(id => id.toString() !== userId);
      video.likes -= 1;
    } else {
      // Like
      video.likedBy.push(userId);
      video.likes += 1;

      // Remove dislike if present
      if (isDisliked) {
        video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userId);
        video.dislikes -= 1;
      }
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes, isLiked: !isLiked, isDisliked: false });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dislike a video
router.post('/:videoId/dislike', authenticate, async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const userId = req.user._id.toString();
    const isDisliked = video.dislikedBy.includes(userId);
    const isLiked = video.likedBy.includes(userId);

    if (isDisliked) {
      // Remove dislike
      video.dislikedBy = video.dislikedBy.filter(id => id.toString() !== userId);
      video.dislikes -= 1;
    } else {
      // Dislike
      video.dislikedBy.push(userId);
      video.dislikes += 1;

      // Remove like if present
      if (isLiked) {
        video.likedBy = video.likedBy.filter(id => id.toString() !== userId);
        video.likes -= 1;
      }
    }

    await video.save();
    res.json({ likes: video.likes, dislikes: video.dislikes, isLiked: false, isDisliked: !isDisliked });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

