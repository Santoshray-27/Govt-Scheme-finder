import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit number');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/send-otp', { phone });
      setStep('otp');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/verify-otp', { 
        phone, 
        otp: otpValue, 
        name: 'User'
      });
      setAuth(data.user, data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (step === 'otp') {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Government Branding Header */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-yojana-orange-500" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 mb-6">
            <ShieldCheck size={36} className="text-yojana-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-yojana-blue-900 tracking-tight">YojanaSetu</h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">Access your personalized government schemes</p>
        </div>

        <div className="bg-white p-8 sm:p-10 rounded-[24px] shadow-soft border border-slate-100 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-yojana-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.form 
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOtp} 
                className="space-y-6 relative z-10"
              >
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">Mobile Number</label>
                  <div className="flex border border-slate-300 rounded-xl overflow-hidden focus-within:border-yojana-blue-600 focus-within:ring-2 focus-within:ring-yojana-blue-50 transition-all bg-slate-50">
                    <div className="flex items-center px-4 bg-slate-100 border-r border-slate-300">
                      <span className="text-lg mr-2">🇮🇳</span>
                      <span className="font-semibold text-slate-600">+91</span>
                    </div>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="9876543210"
                      className="w-full py-4 px-4 bg-transparent text-slate-900 font-semibold tracking-wide placeholder:text-slate-400 focus:outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || phone.length !== 10}
                  className="w-full bg-yojana-blue-900 hover:bg-yojana-blue-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue Securely</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyOtp} 
                className="space-y-6 relative z-10"
              >
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-1">Verify Mobile Number</label>
                  <p className="text-xs text-slate-500 mb-6">Enter the 6-digit code sent to +91 {phone}</p>
                  
                  <div className="flex justify-between gap-2 sm:gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => otpRefs.current[idx] = el}
                        type="text"
                        maxLength={1}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-yojana-blue-900 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-yojana-blue-600 focus:ring-2 focus:ring-yojana-blue-50 outline-none transition-all"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      />
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full bg-yojana-blue-900 hover:bg-yojana-blue-800 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Verify & Login</span>
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
                
                <button 
                  type="button" 
                  onClick={() => {
                    setStep('phone');
                    setOtp(['', '', '', '', '', '']);
                    setError('');
                  }}
                  className="w-full text-yojana-blue-600 text-sm font-medium hover:underline text-center"
                >
                  Edit mobile number
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        <div className="mt-8 flex items-center justify-center space-x-2 text-slate-400 text-xs font-medium">
          <ShieldCheck size={14} />
          <span>Secured by YojanaSetu Auth Gateway</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
