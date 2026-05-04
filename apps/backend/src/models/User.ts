import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  authMethod: 'OTP' | 'PASSWORD' | 'GOOGLE';
  createdAt: Date;
  lastLogin: Date;
  preferences: {
    language: string;
    notifications: boolean;
  };
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  authMethod: { type: String, enum: ['OTP', 'PASSWORD', 'GOOGLE'], default: 'OTP' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  preferences: {
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true }
  }
});

export default mongoose.model<IUser>('User', UserSchema);
