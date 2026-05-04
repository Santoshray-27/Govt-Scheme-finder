import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scheme from './models/Scheme';
import connectDB from './config/db';

dotenv.config();

const schemes = [
  {
    schemeId: 'PM-KISAN-001',
    name: 'PM-Kisan Samman Nidhi',
    shortDescription: 'Income support of ₹6,000 per year to all landholding farmer families.',
    fullDescription: 'Under the scheme, an income support of ₹6,000 per year is provided to all landholding farmer families across the country in three equal installments of ₹2,000 each every four months.',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    level: 'CENTRAL',
    category: ['Agriculture', 'Income Support'],
    targetGroups: ['Farmers'],
    benefits: { amount: 6000, frequency: 'Annual' },
    eligibility: { occupation: 'Farmer', landOwnership: true },
    applicationProcess: 'Online through PM-Kisan portal',
    requiredDocuments: ['Aadhaar', 'Land Records', 'Bank Account'],
    isActive: true,
    embedding: new Array(1536).fill(0).map(() => Math.random()) // Mock embedding for testing
  },
  {
    schemeId: 'PM-AWAS-001',
    name: 'Pradhan Mantri Awas Yojana (Gramin)',
    shortDescription: 'Housing for all by providing assistance to BPL families for house construction.',
    fullDescription: 'Provides financial assistance to eligible rural households for construction of a permanent house with basic amenities.',
    ministry: 'Ministry of Rural Development',
    level: 'CENTRAL',
    category: ['Housing'],
    targetGroups: ['Rural Poor', 'BPL'],
    benefits: { amount: 120000, type: 'Construction Grant' },
    eligibility: { bplStatus: true, rural: true },
    applicationProcess: 'Gram Panchayat selection',
    requiredDocuments: ['BPL Card', 'Aadhaar', 'Income Certificate'],
    isActive: true,
    embedding: new Array(1536).fill(0).map(() => Math.random()) // Mock embedding
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    await Scheme.deleteMany({});
    await Scheme.insertMany(schemes);
    console.log('✅ Database Seeded with sample schemes');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
