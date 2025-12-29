import express from 'express';
import Channel from '../models/Channel.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create a new channel
router.post('/', authenticate, async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    // Check if user already has a channel with this name
    const existingChannel = await Channel.findOne({
      owner: req.user._id,
      channelName: channelName.trim()
    });

    if (existingChannel) {
      return res.status(400).json({ message: 'You already have a channel with this name' });
    }

    const channel = new Channel({
      channelName: channelName.trim(),
      description: description || '',
      channelBanner: channelBanner || 'https://via.placeholder.com/1280x360',
      owner: req.user._id
    });

    await channel.save();

    // Add channel to user's channels array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id }
    });

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all channels for the authenticated user
router.get('/my-channels', authenticate, async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id })
      .populate('videos')
      .sort({ createdAt: -1 });
    
    res.json(channels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific channel by ID
router.get('/:channelId', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId)
      .populate('owner', 'username avatar')
      .populate({
        path: 'videos',
        populate: {
          path: 'uploader',
          select: 'username'
        }
      });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update channel
router.put('/:channelId', authenticate, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.channelId);

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own channels' });
    }

    const { channelName, description, channelBanner } = req.body;

    if (channelName) channel.channelName = channelName.trim();
    if (description !== undefined) channel.description = description;
    if (channelBanner) channel.channelBanner = channelBanner;

    await channel.save();
    res.json(channel);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

