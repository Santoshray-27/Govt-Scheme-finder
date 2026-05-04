import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProfile extends Document {
  userId: mongoose.Types.ObjectId;
  profileName: string;
  demographics: {
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    maritalStatus: string;
  };
  location: {
    state: string;
    district: string;
    rural: boolean;
  };
  economic: {
    annualIncome: number;
    occupation: string;
    employmentStatus: string;
    assets?: {
      landOwnership: boolean;
      landSize?: number;
      houseOwnership: boolean;
    };
  };
  social: {
    category: 'GENERAL' | 'OBC' | 'SC' | 'ST';
    minority: boolean;
    disability: boolean;
    bplStatus: boolean;
  };
  family: {
    familySize: number;
    dependents: number;
    childrenUnder18: number;
  };
}

const UserProfileSchema = new Schema<IUserProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  profileName: { type: String, required: true },
  demographics: {
    age: { type: Number, required: true },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'], required: true },
    maritalStatus: { type: String, required: true }
  },
  location: {
    state: { type: String, required: true },
    district: { type: String, required: true },
    rural: { type: Boolean, required: true }
  },
  economic: {
    annualIncome: { type: Number, required: true },
    occupation: { type: String, required: true },
    employmentStatus: { type: String, required: true },
    assets: {
      landOwnership: { type: Boolean },
      landSize: { type: Number },
      houseOwnership: { type: Boolean }
    }
  },
  social: {
    category: { type: String, enum: ['GENERAL', 'OBC', 'SC', 'ST'], required: true },
    minority: { type: Boolean, default: false },
    disability: { type: Boolean, default: false },
    bplStatus: { type: Boolean, default: false }
  },
  family: {
    familySize: { type: Number, required: true },
    dependents: { type: Number, required: true },
    childrenUnder18: { type: Number, required: true }
  }
});

export default mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
