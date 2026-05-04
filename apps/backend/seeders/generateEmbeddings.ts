import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Scheme from '../src/models/Scheme';
import connectDB from '../src/config/db';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

async function generateEmbeddings() {
  try {
    await connectDB();
    console.log('📦 Connected to MongoDB');

    // Parse --limit flag
    const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
    const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

    // Fetch schemes that don't have embeddings or have an empty array
    let schemes = await Scheme.find({
      $or: [
        { embedding: { $exists: false } },
        { embedding: { $size: 0 } }
      ]
    });

    if (limit) {
      console.log(`🧪 LIMIT MODE: Processing only first ${limit} schemes.`);
      schemes = schemes.slice(0, limit);
    }

    const totalToProcess = schemes.length;
    console.log(`🔍 Found ${totalToProcess} schemes needing embeddings.`);

    if (totalToProcess === 0) {
      console.log('✅ All schemes already have embeddings.');
      process.exit(0);
    }

    let totalProcessed = 0;
    const startTime = Date.now();
    
    for (const scheme of schemes) {
      let success = false;
      let retries = 0;

      while (!success && retries < 3) {
        try {
          const textToEmbed = `
            Scheme Name: ${scheme.name}
            Description: ${scheme.shortDescription}
            Category: ${scheme.category.join(', ')}
            Ministry: ${scheme.ministry}
            Target Groups: ${scheme.targetGroups.join(', ')}
          `.trim();

          const result = await embeddingModel.embedContent(textToEmbed);
          
          if (result && result.embedding && result.embedding.values) {
            await Scheme.updateOne(
              { _id: scheme._id },
              { $set: { embedding: result.embedding.values } }
            );
            totalProcessed++;
            success = true;
            
            const percentage = ((totalProcessed / totalToProcess) * 100).toFixed(1);
            const elapsed = (Date.now() - startTime) / 1000;
            process.stdout.write(`\r📈 Progress: ${totalProcessed}/${totalToProcess} (${percentage}%) | Time: ${elapsed.toFixed(1)}s`);
          }

        } catch (err: any) {
          if (err.message.includes('429')) {
            console.log(`\n🛑 Rate limit hit (429). Waiting 60 seconds... (Retry ${retries + 1}/3)`);
            await new Promise(resolve => setTimeout(resolve, 60000));
            retries++;
          } else {
            console.error(`\n❌ Error for ${scheme.schemeId}:`, err.message);
            break; // Skip to next scheme on other errors
          }
        }
      }

      if (!success) continue;

      // 1. 1200ms delay after every scheme
      if (totalProcessed < totalToProcess) {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }

      // 2. 15 seconds delay after every 5 schemes
      if (totalProcessed % 5 === 0 && totalProcessed < totalToProcess) {
        process.stdout.write(`\n⏳ Cooling down: Waiting 15 seconds after 5 schemes...\n`);
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
    }

    console.log(`\n✨ Successfully generated and saved ${totalProcessed} embeddings!`);
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Critical error during embedding generation:', error.message);
    process.exit(1);
  }
}

generateEmbeddings();
