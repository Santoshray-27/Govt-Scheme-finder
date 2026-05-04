import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import { useProfileStore } from '../store/useProfileStore';
import { 
  User as UserIcon, 
  MapPin, 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Save,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { id: 'demographics', title: 'Basic Info', icon: UserIcon },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'economic', title: 'Economic', icon: IndianRupee },
  { id: 'social', title: 'Social', icon: Users },
  { id: 'review', title: 'Review', icon: CheckCircle2 },
];

const ProfileBuilder = () => {
  const queryClient = useQueryClient();

  const { setCurrentProfile } = useProfileStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    profileName: '',
    demographics: { age: 25, gender: 'Male' },
    location: { state: 'Delhi', district: 'New Delhi', rural: false },
    economic: { annualIncome: 200000, occupation: 'Student' },
    social: { category: 'General', minority: false, disability: false, bplStatus: false },
    family: { totalMembers: 4, childrenCount: 2 },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => api.post('/profile', data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      setCurrentProfile(res.data.data);
      setIsSuccess(true);
    },
  });

  const handleNext = () => {
    if (currentStep === 0 && !formData.profileName.trim()) {
      alert('Please enter a profile name.');
      return;
    }
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[24px] p-10 md:p-14 text-center shadow-soft border border-slate-100 max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Saved</h2>
          <p className="text-slate-500 text-sm mb-8">
            Your profile <span className="font-semibold text-slate-800">"{formData.profileName}"</span> is ready. We've matched you with eligible schemes.
          </p>
          <Link to="/dashboard" className="flex items-center justify-center space-x-2 w-full bg-yojana-blue-900 text-white px-6 py-3.5 rounded-xl font-semibold shadow-md hover:bg-yojana-blue-800 transition-colors">
            <span>View Recommendations</span>
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-yojana-blue-900">Profile Builder</h1>
        <p className="text-slate-500 text-sm mt-1">Complete details to get accurate scheme matches.</p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-soft border border-slate-100 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-xs font-bold text-yojana-blue-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-yojana-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <div className="flex justify-between mt-6">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
                  ${isCompleted ? 'bg-yojana-blue-600 text-white' : 
                    isCurrent ? 'bg-yojana-blue-100 text-yojana-blue-700 font-bold ring-2 ring-yojana-blue-600 ring-offset-2' : 
                    'bg-slate-100 text-slate-400'}
                `}>
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className={`text-[10px] mt-2 font-medium hidden sm:block ${isCurrent ? 'text-yojana-blue-900' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Area */}
      <motion.form 
        key={currentStep}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-[24px] p-8 shadow-soft border border-slate-100"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 flex items-center space-x-3 text-yojana-blue-900">
          {(() => {
            const CurrentIcon = steps[currentStep].icon;
            return <CurrentIcon size={24} />;
          })()}
          <h2 className="text-xl font-bold">{steps[currentStep].title}</h2>
        </div>

        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Profile Nickname <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g. Self, Father, Family"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-yojana-blue-500 focus:ring-2 focus:ring-yojana-blue-50 outline-none transition-all"
                value={formData.profileName}
                onChange={(e) => setFormData({...formData, profileName: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Age</label>
                <input 
                  type="number" 
                  min="0" max="120"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-yojana-blue-500 focus:ring-2 focus:ring-yojana-blue-50 outline-none transition-all"
                  value={formData.demographics.age}
                  onChange={(e) => setFormData({...formData, demographics: {...formData.demographics, age: parseInt(e.target.value) || 0}})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Gender</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-yojana-blue-500 focus:ring-2 focus:ring-yojana-blue-50 outline-none transition-all appearance-none"
                  value={formData.demographics.gender}
                  onChange={(e) => setFormData({...formData, demographics: {...formData.demographics, gender: e.target.value}})}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">State</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-yojana-blue-500 focus:ring-2 focus:ring-yojana-blue-50 outline-none transition-all"
                  value={formData.location.state}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, state: e.target.value}})}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">District</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-yojana-blue-500 focus:ring-2 focus:ring-yojana-blue-50 outline-none transition-all"
                  value={formData.location.district}
                  onChange={(e) => setFormData({...formData, location: {...formData.location, district: e.target.value}})}
                />
              </div>
            </div>
            <label className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-slate-300 text-yojana-blue-600 focus:ring-yojana-blue-500"
                checked={formData.location.rural}
                onChange={(e) => setFormData({...formData, location: {...formData.location, rural: e.target.checked}})}
              />
              <span className="text-sm font-semibold text-slate-700">Resident of rural area</span>
            </label>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Annual Family Income (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:border-yojana-blue-500 focus:ring-2 focus:ring-yojana-blue-50 outline-none transition-all"
                  value={formData.economic.annualIncome}
                  onChange={(e) => setFormData({...formData, economic: {...formData.economic, annualIncome: parseInt(e.target.value) || 0}})}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Occupation</label>
              <input 
                type="text" 
                placeholder="e.g. Farmer, Student, Business"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-yojana-blue-500 focus:ring-2 focus:ring-yojana-blue-50 outline-none transition-all"
                value={formData.economic.occupation}
                onChange={(e) => setFormData({...formData, economic: {...formData.economic, occupation: e.target.value}})}
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Social Category</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-yojana-blue-500 focus:ring-2 focus:ring-yojana-blue-50 outline-none transition-all appearance-none"
                value={formData.social.category}
                onChange={(e) => setFormData({...formData, social: {...formData.social, category: e.target.value}})}
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Minority Community Member', key: 'minority' },
                { label: 'Person with Disability (PwD)', key: 'disability' },
                { label: 'BPL Card Holder', key: 'bplStatus' },
              ].map((item) => (
                <label key={item.key} className="flex items-center space-x-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded border-slate-300 text-yojana-blue-600 focus:ring-yojana-blue-500"
                    checked={(formData.social as any)[item.key]}
                    onChange={(e) => setFormData({...formData, social: {...formData.social, [item.key]: e.target.checked}})}
                  />
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-yojana-blue-50 border border-yojana-blue-100 rounded-xl p-5 text-sm">
              <p className="text-yojana-blue-800 font-medium mb-4">Please review your details before saving. Accurate details help us find the best schemes.</p>
              
              <div className="space-y-2">
                <div className="flex justify-between border-b border-yojana-blue-100 pb-2">
                  <span className="text-slate-500">Name</span>
                  <span className="font-semibold text-slate-800">{formData.profileName}</span>
                </div>
                <div className="flex justify-between border-b border-yojana-blue-100 py-2">
                  <span className="text-slate-500">Location</span>
                  <span className="font-semibold text-slate-800">{formData.location.district}, {formData.location.state}</span>
                </div>
                <div className="flex justify-between border-b border-yojana-blue-100 py-2">
                  <span className="text-slate-500">Income</span>
                  <span className="font-semibold text-slate-800">₹{formData.economic.annualIncome}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-slate-800">{formData.social.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2 text-xs text-slate-500">
              <ShieldCheck size={16} className="text-yojana-blue-600 shrink-0 mt-0.5" />
              <p>Your data is securely stored and used only for matching schemes. By proceeding, you agree to the Terms & Conditions.</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            onClick={handleBack}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center space-x-2
              ${currentStep === 0 ? 'invisible' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <ChevronLeft size={16} />
            <span>Back</span>
          </button>
          
          {currentStep < steps.length - 1 ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="px-6 py-2.5 bg-yojana-blue-900 hover:bg-yojana-blue-800 text-white rounded-xl font-semibold text-sm transition-colors shadow-md flex items-center space-x-2"
            >
              <span>Continue</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="px-6 py-2.5 bg-yojana-orange-500 hover:bg-yojana-orange-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-md flex items-center space-x-2 disabled:opacity-50"
            >
              <Save size={16} />
              <span>{mutation.isPending ? 'Saving...' : 'Save & View Schemes'}</span>
            </button>
          )}
        </div>
      </motion.form>
    </div>
  );
};

export default ProfileBuilder;
