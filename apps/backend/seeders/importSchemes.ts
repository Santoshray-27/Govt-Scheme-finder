import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scheme from '../src/models/Scheme';
import connectDB from '../src/config/db';

dotenv.config();

const CSV_PATH = path.join(__dirname, '../data/updated_data.csv');

async function importData() {
  try {
    await connectDB();
    
    console.log('🗑️  Deleting existing schemes...');
    await Scheme.deleteMany({});
    
    const schemes: any[] = [];
    const usedIds = new Set();
    
    console.log('📖 Reading CSV file...');
    
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (row) => {
        let schemeId = row.slug || `scheme-${Math.random().toString(36).substr(2, 9)}`;
        
        // Handle potential duplicates in CSV
        if (usedIds.has(schemeId)) {
          schemeId = `${schemeId}-${Math.random().toString(36).substr(2, 5)}`;
        }
        usedIds.add(schemeId);

        const scheme = {
          schemeId: schemeId,
          name: row.scheme_name || 'Unnamed Scheme',
          shortDescription: row.details ? (row.details.substring(0, 200) + '...') : 'No description available',
          fullDescription: row.details || 'No details provided',
          ministry: row.level === 'Central' ? 'Central Government' : 'State Government',
          level: row.level === 'Central' ? 'CENTRAL' : (row.level === 'State' ? 'STATE' : 'LOCAL'),
          category: row.schemeCategory ? row.schemeCategory.split(',').map((c: string) => c.trim()) : [],
          targetGroups: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
          benefits: { text: row.benefits || 'Check details' },
          eligibility: { text: row.eligibility || 'Check details' },
          applicationProcess: { text: row.application || 'Refer to official portal' },
          requiredDocuments: { text: row.documents || 'Standard documents required' },
          isActive: true
        };
        schemes.push(scheme);
      })
      .on('end', async () => {
        console.log(`📑  Found ${schemes.length} schemes in CSV. Starting import...`);
        
        try {
          // Insert in chunks for large datasets
          const chunkSize = 500;
          for (let i = 0; i < schemes.length; i += chunkSize) {
            const chunk = schemes.slice(i, i + chunkSize);
            await Scheme.insertMany(chunk, { ordered: false });
            console.log(`✅ Imported ${Math.min(i + chunkSize, schemes.length)} / ${schemes.length}`);
          }
          
          console.log('✨ Import completed successfully!');
          process.exit(0);
        } catch (err: any) {
          console.error('❌ Error during insertion:', err.message);
          if (err.writeErrors) {
            console.error(`First 5 write errors:`, err.writeErrors.slice(0, 5));
          }
          process.exit(1);
        }
      })
      .on('error', (err) => {
        console.error('❌ Error reading CSV:', err);
        process.exit(1);
      });
      
  } catch (error) {
    console.error('❌ Connection error:', error);
    process.exit(1);
  }
}

importData();
