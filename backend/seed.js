import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Channel from './models/Channel.js';
import Video from './models/Video.js';
import Comment from './models/Comment.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/youtube-clone';

const sampleUsers = [
  {
    username: 'JohnDoe',
    email: 'john@example.com',
    password: 'password123',
    avatar: 'https://via.placeholder.com/150/065fd4/ffffff?text=JD'
  },
  {
    username: 'JaneSmith',
    email: 'jane@example.com',
    password: 'password123',
    avatar: 'https://via.placeholder.com/150/ff0000/ffffff?text=JS'
  },
  {
    username: 'TechGuru',
    email: 'tech@example.com',
    password: 'password123',
    avatar: 'https://via.placeholder.com/150/00ff00/ffffff?text=TG'
  }
];

const sampleChannels = [
  {
    channelName: 'Code with John',
    description: 'Coding tutorials and tech reviews by John Doe.',
    channelBanner: 'https://via.placeholder.com/1280x360/065fd4/ffffff?text=Code+with+John',
    subscribers: 5200
  },
  {
    channelName: 'Jane\'s Cooking Channel',
    description: 'Delicious recipes and cooking tips.',
    channelBanner: 'https://via.placeholder.com/1280x360/ff0000/ffffff?text=Jane+Cooking',
    subscribers: 3200
  },
  {
    channelName: 'Tech Reviews',
    description: 'Latest tech reviews and gadget unboxings.',
    channelBanner: 'https://via.placeholder.com/1280x360/00ff00/ffffff?text=Tech+Reviews',
    subscribers: 8500
  }
];

const sampleVideos = [
  {
    title: 'Learn React in 30 Minutes',
    description: 'A quick tutorial to get started with React. We cover components, props, state, and hooks.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://via.placeholder.com/640x360/065fd4/ffffff?text=React+Tutorial',
    category: 'Education',
    views: 15200,
    likes: 1023,
    dislikes: 45
  },
  {
    title: 'How to Make Perfect Pasta',
    description: 'Learn the secret to making restaurant-quality pasta at home.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://via.placeholder.com/640x360/ff0000/ffffff?text=Pasta+Recipe',
    category: 'Food',
    views: 8900,
    likes: 567,
    dislikes: 12
  },
  {
    title: 'iPhone 15 Pro Review',
    description: 'Complete review of the new iPhone 15 Pro. Is it worth the upgrade?',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://via.placeholder.com/640x360/00ff00/ffffff?text=iPhone+Review',
    category: 'Technology',
    views: 45000,
    likes: 3200,
    dislikes: 89
  },
  {
    title: 'JavaScript ES6 Features Explained',
    description: 'Understanding arrow functions, destructuring, and more ES6 features.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://via.placeholder.com/640x360/065fd4/ffffff?text=JavaScript+ES6',
    category: 'Education',
    views: 23400,
    likes: 1890,
    dislikes: 34
  },
  {
    title: 'Top 10 Gaming Moments 2024',
    description: 'The most epic gaming moments from this year.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://via.placeholder.com/640x360/ff0000/ffffff?text=Gaming+Moments',
    category: 'Gaming',
    views: 67000,
    likes: 4500,
    dislikes: 120
  },
  {
    title: 'Best Travel Destinations 2024',
    description: 'Explore the most beautiful places to visit this year.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://via.placeholder.com/640x360/00ff00/ffffff?text=Travel+Destinations',
    category: 'Travel',
    views: 18900,
    likes: 1234,
    dislikes: 23
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Channel.deleteMany({});
    await Video.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.insertMany(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Create channels
    const channels = [];
    for (let i = 0; i < sampleChannels.length; i++) {
      const channel = new Channel({
        ...sampleChannels[i],
        owner: users[i]._id
      });
      await channel.save();
      channels.push(channel);

      // Add channel to user
      users[i].channels.push(channel._id);
      await users[i].save();
    }
    console.log(`Created ${channels.length} channels`);

    // Create videos
    const videos = [];
    for (let i = 0; i < sampleVideos.length; i++) {
      const channelIndex = i % channels.length;
      const video = new Video({
        ...sampleVideos[i],
        channelId: channels[channelIndex]._id,
        uploader: channels[channelIndex].owner
      });
      await video.save();
      videos.push(video);

      // Add video to channel
      channels[channelIndex].videos.push(video._id);
      await channels[channelIndex].save();
    }
    console.log(`Created ${videos.length} videos`);

    // Create sample comments
    const comments = [];
    for (let i = 0; i < videos.length; i++) {
      const comment = new Comment({
        videoId: videos[i]._id,
        userId: users[i % users.length]._id,
        text: `Great video! Very helpful. This is comment ${i + 1}.`
      });
      await comment.save();
      comments.push(comment);
    }
    console.log(`Created ${comments.length} comments`);

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: jane@example.com, Password: password123');
    console.log('Email: tech@example.com, Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

