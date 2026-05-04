import mongoose, { Schema, Document } from 'mongoose';

export interface IScheme extends Document {
  schemeId: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  ministry: string;
  level: 'CENTRAL' | 'STATE' | 'LOCAL';
  category: string[];
  targetGroups: string[];
  benefits: object;
  eligibility: object;
  applicationProcess: object;
  requiredDocuments: object;
  isActive: boolean;
  embedding?: number[];
}

const SchemeSchema = new Schema<IScheme>({
  schemeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  ministry: { type: String, required: true },
  level: { type: String, enum: ['CENTRAL', 'STATE', 'LOCAL'], required: true },
  category: [{ type: String }],
  targetGroups: [{ type: String }],
  benefits: { type: Object, required: true },
  eligibility: { type: Object, required: true },
  applicationProcess: { type: Object, required: true },
  requiredDocuments: { type: Object, required: true },
  isActive: { type: Boolean, default: true },
  embedding: { type: [Number], default: [] }
});

export default mongoose.model<IScheme>('Scheme', SchemeSchema);
