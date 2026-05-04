import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';
import { Sparkles, ArrowRight, AlertCircle, Search, UserPlus, RefreshCcw, Landmark, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile, Scheme, ApiResponse } from '@yojana/shared';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { currentProfile, setCurrentProfile } = useProfileStore();

  // Fetch profiles
  const { data: profiles, isLoading: profilesLoading } = useQuery<UserProfile[]>({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<UserProfile[]>>('/profile');
      if (data.success && data.data && data.data.length > 0 && !currentProfile) {
        setCurrentProfile(data.data[0]);
      }
      return data.data || [];
    },
  });

  // Fetch recommendations
  const { data: recommendations, isLoading: recommendLoading, refetch, isFetching } = useQuery<Scheme[]>({
    queryKey: ['recommendations', currentProfile?._id],
    queryFn: async () => {
      if (!currentProfile?._id) return [];
      const { data } = await api.post<ApiResponse<Scheme[]>>('/recommend', { userProfileId: currentProfile._id });
      return data.data?.slice(0, 6) || [];
    },
    enabled: !!currentProfile?._id,
  });

  if (profilesLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-yojana-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Loading your portal...</p>
      </div>
    );
  }

  const hasProfiles = profiles && profiles.length > 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-yojana-blue-900 rounded-2xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="2" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold mb-4 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>3,400+ Schemes Live</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Welcome back, {user?.name}
            </h1>
            <p className="text-yojana-blue-100 text-lg max-w-xl">
              Discover and apply for government schemes tailored specifically to your profile.
            </p>
          </div>
          <Link 
            to="/profile-builder" 
            className="shrink-0 bg-yojana-orange-500 hover:bg-yojana-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition-all flex items-center space-x-2"
          >
            <UserPlus size={20} />
            <span>Create New Profile</span>
          </Link>
        </div>
      </div>

      {/* Profile Selector */}
      {hasProfiles && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          <span className="text-sm font-semibold text-slate-500 shrink-0">Active Profile:</span>
          {profiles.map((profile: UserProfile) => (
            <button
              key={profile._id}
              onClick={() => setCurrentProfile(profile)}
              className={`
                px-5 py-2 rounded-full text-sm font-semibold transition-all shrink-0 border
                ${currentProfile?._id === profile._id 
                  ? 'bg-yojana-blue-50 border-yojana-blue-600 text-yojana-blue-900 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}
              `}
            >
              {profile.profileName}
            </button>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      {!hasProfiles ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-soft">
          <div className="w-20 h-20 bg-yojana-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-yojana-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Complete Your Profile</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            To recommend the best schemes for you, we need a few details about your demographic and economic status.
          </p>
          <Link to="/profile-builder" className="inline-flex items-center space-x-2 bg-yojana-blue-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-yojana-blue-800 transition-colors shadow-md">
            <span>Get Started</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg text-yojana-orange-600">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
            </div>
            <button 
              onClick={() => refetch()}
              disabled={recommendLoading || isFetching}
              className="flex items-center space-x-2 text-sm font-semibold text-yojana-blue-600 hover:text-yojana-blue-800 disabled:opacity-50 transition-colors"
            >
              <RefreshCcw size={16} className={(recommendLoading || isFetching) ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {recommendLoading || isFetching ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft h-64 animate-pulse flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between mb-4">
                        <div className="h-6 w-20 bg-slate-200 rounded-full" />
                        <div className="h-8 w-12 bg-slate-200 rounded-lg" />
                      </div>
                      <div className="h-5 w-3/4 bg-slate-200 rounded mb-3" />
                      <div className="h-4 w-full bg-slate-100 rounded mb-2" />
                      <div className="h-4 w-2/3 bg-slate-100 rounded" />
                    </div>
                    <div className="h-10 w-full bg-slate-100 rounded-xl mt-4" />
                  </div>
                ))}
              </motion.div>
            ) : recommendations && recommendations.length > 0 ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {recommendations.map((rec: Scheme & { relevanceScore?: number }, idx: number) => (
                  <motion.div 
                    key={rec._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-lg transition-shadow flex flex-col overflow-hidden group"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4 gap-2">
                        <span className="inline-flex px-3 py-1 bg-yojana-blue-50 text-yojana-blue-800 text-xs font-bold rounded-full border border-yojana-blue-100">
                          {rec.level}
                        </span>
                        <div className="flex flex-col items-end bg-green-50 border border-green-100 px-3 py-1 rounded-lg">
                          <span className="text-green-700 font-bold text-sm leading-none">
                            {Math.round((rec.relevanceScore || 0) * 100)}%
                          </span>
                          <span className="text-[9px] text-green-600 font-semibold uppercase mt-0.5">Match</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-yojana-blue-700 transition-colors">
                        {rec.name}
                      </h3>
                      
                      <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
                        {rec.shortDescription}
                      </p>

                      {/* Tags row */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {rec.category?.slice(0, 2).map((cat: string) => (
                          <span key={cat} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-slate-500 max-w-[60%]">
                        <Landmark size={14} className="shrink-0" />
                        <span className="text-xs font-medium truncate">{rec.ministry}</span>
                      </div>
                      <Link 
                        to={`/scheme/${rec._id}`}
                        className="text-sm font-semibold text-yojana-blue-700 hover:text-yojana-blue-900 flex items-center space-x-1"
                      >
                        <span>Details</span>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-soft flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search size={28} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">No Specific Matches Found</h3>
                <p className="text-slate-500 mb-6 text-sm max-w-sm">
                  We couldn't find highly specific matches. Check your profile details or browse the directory.
                </p>
                <Link to="/schemes" className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  Browse Directory
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
