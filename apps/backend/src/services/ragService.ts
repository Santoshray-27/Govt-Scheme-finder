import { GoogleGenerativeAI } from '@google/generative-ai';
import { Scheme } from '../models';

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here' 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Simple cosine similarity function
 */
function cosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
}

/**
 * Fallback recommendation using keyword/category matching
 * (Used only if AI is unavailable or as a safety net)
 */
async function getFallbackRecommendations(userProfile: any) {
  const { social, location } = userProfile;
  
  const schemes = await Scheme.find({
    isActive: true,
    $or: [
      { category: { $in: [social.category] } },
      { level: 'CENTRAL' },
      { targetGroups: { $in: [social.category, location.state] } }
    ]
  }).limit(10);

  return schemes.map(s => ({
    ...s.toObject(),
    relevanceScore: 0.5 // Lower score for fallback matches
  }));
}

export const getRecommendations = async (userProfile: any) => {
  // Try Semantic Search if Gemini is configured
  if (genAI) {
    try {
      const profileText = `
        User Profile Summary:
        Age: ${userProfile.demographics.age}
        Gender: ${userProfile.demographics.gender}
        Location: ${userProfile.location.district}, ${userProfile.location.state}
        Income: ${userProfile.economic.annualIncome}
        Occupation: ${userProfile.economic.occupation}
        Social Category: ${userProfile.social.category}
        Minority: ${userProfile.social.minority ? 'Yes' : 'No'}
        Disability: ${userProfile.social.disability ? 'Yes' : 'No'}
        BPL: ${userProfile.social.bplStatus ? 'Yes' : 'No'}
      `.trim();

      const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
      const result = await embeddingModel.embedContent(profileText);
      const userEmbedding = result.embedding.values;

      // Fetch schemes that have valid embeddings
      const schemesWithEmbeddings = await Scheme.find({ 
        isActive: true, 
        embedding: { $exists: true, $not: { $size: 0 } } 
      });

      if (schemesWithEmbeddings.length > 0) {
        const recommendations = schemesWithEmbeddings
          .map(scheme => ({
            scheme,
            similarity: cosineSimilarity(userEmbedding, scheme.embedding!)
          }))
          .sort((a, b) => b.similarity - a.similarity)
          .slice(0, 10); // Show top 10 matches

        return recommendations.map(r => ({
          ...r.scheme.toObject(),
          relevanceScore: r.similarity
        }));
      }
    } catch (err) {
      console.error('❌ Gemini Semantic search failed:', err);
    }
  }

  // Fallback to keyword matching if AI is disabled or no embeddings exist
  console.log('⚠️ Using keyword fallback for recommendations');
  return getFallbackRecommendations(userProfile);
};
