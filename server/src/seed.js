require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Song = require('./models/Song');
const connectDB = require('./config/db');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Song.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'BeatNest',
      email: 'admin@beatnest.com',
      password: 'Admin@123456',
      role: 'admin',
      isEmailVerified: true,
      status: 'active'
    });
    await adminUser.save();
    console.log('Admin user created');

    // Create demo users
    const demoUser = new User({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@beatnest.com',
      password: 'Demo@123456',
      role: 'user',
      isEmailVerified: true,
      status: 'active'
    });
    await demoUser.save();

    const artistUser = new User({
      firstName: 'Eminem',
      lastName: 'Marshall',
      email: 'eminem@beatnest.com',
      password: 'Artist@123456',
      role: 'artist',
      isEmailVerified: true,
      status: 'active'
    });
    await artistUser.save();

    const artist2 = new User({
      firstName: 'The',
      lastName: 'Weeknd',
      email: 'weeknd@beatnest.com',
      password: 'Artist@123456',
      role: 'artist',
      isEmailVerified: true,
      status: 'active'
    });
    await artist2.save();

    const artist3 = new User({
      firstName: 'Drake',
      lastName: 'Graham',
      email: 'drake@beatnest.com',
      password: 'Artist@123456',
      role: 'artist',
      isEmailVerified: true,
      status: 'active'
    });
    await artist3.save();

    const artist4 = new User({
      firstName: 'Billie',
      lastName: 'Eilish',
      email: 'billie@beatnest.com',
      password: 'Artist@123456',
      role: 'artist',
      isEmailVerified: true,
      status: 'active'
    });
    await artist4.save();

    console.log('Demo users created');

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Hip-Hop/Rap',
        description: 'Hip-hop and rap music genre',
        icon: '🎤',
        status: 'active'
      },
      {
        name: 'Pop',
        description: 'Popular music genre',
        icon: '🎵',
        status: 'active'
      },
      {
        name: 'R&B',
        description: 'Rhythm and Blues',
        icon: '💿',
        status: 'active'
      },
      {
        name: 'Electronic',
        description: 'Electronic and EDM music',
        icon: '🎧',
        status: 'active'
      },
      {
        name: 'Rock',
        description: 'Rock music genre',
        icon: '🎸',
        status: 'active'
      }
    ]);
    console.log('Categories created');

    // Create songs with famous artists
    const songs = await Song.insertMany([
      // Eminem songs
      {
        title: 'Lose Yourself',
        artist: 'Eminem',
        artistId: artistUser._id,
        category: categories[0]._id,
        genre: 'Hip-Hop/Rap',
        duration: 326,
        description: 'An iconic hip-hop anthem about seizing opportunities and overcoming obstacles.',
        lyrics: 'You only get one shot, do not miss your chance to blow...',
        audioUrl: 'https://example.com/lose-yourself.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Lose+Yourself',
        plays: 15000000,
        likes: 500000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      {
        title: 'Stan',
        artist: 'Eminem',
        artistId: artistUser._id,
        category: categories[0]._id,
        genre: 'Hip-Hop/Rap',
        duration: 405,
        description: 'A powerful narrative song about an obsessive fan.',
        audioUrl: 'https://example.com/stan.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Stan',
        plays: 12000000,
        likes: 450000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      {
        title: 'The Real Slim Shady',
        artist: 'Eminem',
        artistId: artistUser._id,
        category: categories[0]._id,
        genre: 'Hip-Hop/Rap',
        duration: 296,
        description: 'A humorous and controversial rap song with satirical lyrics.',
        audioUrl: 'https://example.com/slim-shady.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Slim+Shady',
        plays: 10000000,
        likes: 400000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      // The Weeknd songs
      {
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        artistId: artist2._id,
        category: categories[1]._id,
        genre: 'Synthwave/Pop',
        duration: 200,
        description: 'A synthwave-influenced pop hit with infectious melodies.',
        audioUrl: 'https://example.com/blinding-lights.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Blinding+Lights',
        plays: 18000000,
        likes: 600000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      {
        title: 'Starboy',
        artist: 'The Weeknd',
        artistId: artist2._id,
        category: categories[2]._id,
        genre: 'R&B/Pop',
        duration: 235,
        description: 'A groovy R&B track featuring Daft Punk.',
        audioUrl: 'https://example.com/starboy.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Starboy',
        plays: 14000000,
        likes: 520000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      {
        title: 'Can\'t Feel My Face',
        artist: 'The Weeknd',
        artistId: artist2._id,
        category: categories[3]._id,
        genre: 'Electronic/Pop',
        duration: 215,
        description: 'An uplifting synthpop track with catchy hooks.',
        audioUrl: 'https://example.com/cant-feel.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Cant+Feel+My+Face',
        plays: 13000000,
        likes: 480000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      // Drake songs
      {
        title: 'One Dance',
        artist: 'Drake',
        artistId: artist3._id,
        category: categories[2]._id,
        genre: 'R&B/Hip-Hop',
        duration: 192,
        description: 'A smooth R&B and hip-hop fusion track.',
        audioUrl: 'https://example.com/one-dance.mp3',
        coverImage: 'https://via.placeholder.com/300?text=One+Dance',
        plays: 16000000,
        likes: 550000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      {
        title: 'God\'s Plan',
        artist: 'Drake',
        artistId: artist3._id,
        category: categories[0]._id,
        genre: 'Hip-Hop/R&B',
        duration: 225,
        description: 'An inspirational hip-hop track with a positive message.',
        audioUrl: 'https://example.com/gods-plan.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Gods+Plan',
        plays: 15000000,
        likes: 530000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      {
        title: 'Hotline Bling',
        artist: 'Drake',
        artistId: artist3._id,
        category: categories[1]._id,
        genre: 'Pop/R&B',
        duration: 205,
        description: 'A catchy pop-R&B track about late-night calls.',
        audioUrl: 'https://example.com/hotline-bling.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Hotline+Bling',
        plays: 12000000,
        likes: 420000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      // Billie Eilish songs
      {
        title: 'Bad Guy',
        artist: 'Billie Eilish',
        artistId: artist4._id,
        category: categories[1]._id,
        genre: 'Alternative/Pop',
        duration: 193,
        description: 'A dark, minimalist pop track with a distinctive vocal style.',
        audioUrl: 'https://example.com/bad-guy.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Bad+Guy',
        plays: 14000000,
        likes: 480000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      {
        title: 'Happier Than Ever',
        artist: 'Billie Eilish',
        artistId: artist4._id,
        category: categories[1]._id,
        genre: 'Pop/Alternative',
        duration: 361,
        description: 'An emotional breakup anthem with explosive crescendo.',
        audioUrl: 'https://example.com/happier-than-ever.mp3',
        coverImage: 'https://via.placeholder.com/300?text=Happier+Than+Ever',
        plays: 11000000,
        likes: 410000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      },
      {
        title: 'when we all fall asleep, where do we go?',
        artist: 'Billie Eilish',
        artistId: artist4._id,
        category: categories[1]._id,
        genre: 'Alternative/Pop',
        duration: 371,
        description: 'A haunting and introspective track about fears and doubts.',
        audioUrl: 'https://example.com/when-we-fall.mp3',
        coverImage: 'https://via.placeholder.com/300?text=When+We+Fall',
        plays: 10000000,
        likes: 390000,
        status: 'approved',
        approvalStatus: {
          status: 'approved',
          approvedBy: adminUser._id,
          approvedAt: new Date()
        },
        isPublished: true
      }
    ]);
    console.log('Songs created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
