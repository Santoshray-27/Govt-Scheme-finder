export interface User {
  _id?: string;
  name: string;
  phone: string;
  email?: string;
  authMethod: 'OTP' | 'PASSWORD' | 'GOOGLE';
  createdAt?: Date | string;
  lastLogin?: Date | string;
  preferences: {
    language: string;
    notifications: boolean;
  };
}

export interface UserProfile {
  _id?: string;
  userId: string;
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

export interface Scheme {
  _id?: string;
  schemeId: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  ministry: string;
  level: 'CENTRAL' | 'STATE' | 'LOCAL';
  category: string[];
  targetGroups: string[];
  benefits: any;
  eligibility: any;
  applicationProcess: any;
  requiredDocuments: any;
  isActive: boolean;
  embedding?: number[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
