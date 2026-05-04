import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { ArrowLeft, ExternalLink, ShieldCheck, FileText, CheckCircle, Info, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';

const SchemeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: scheme, isLoading } = useQuery({
    queryKey: ['scheme', id],
    queryFn: async () => {
      const { data } = await api.get(`/schemes/${id}`);
      return data.data;
    },
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 font-bold">Fetching details...</p>
    </div>
  );
  
  if (!scheme) return <div className="text-center py-20 font-black text-slate-400">Scheme not found</div>;

  const renderContent = (content: any) => {
    if (typeof content === 'string') return content;
    if (content && typeof content === 'object') {
      if (content.text) return content.text;
      return Object.entries(content)
        .map(([key, val]) => `${key}: ${val}`)
        .join('\n');
    }
    return 'Refer to official guidelines.';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-32"
    >
      <button 
        onClick={() => navigate(-1)}
        className="group flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition-all mb-8 font-black uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Discovery</span>
      </button>

      <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100">
        {/* Header Section */}
        <div className="bg-slate-900 p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[80px]" />
          <div className="relative z-10">
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/40">
                {scheme.level} GOVERNMENT
              </span>
              <span className="bg-slate-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-slate-700">
                {scheme.ministry}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">{scheme.name}</h1>
            <div className="flex items-center space-x-4 text-indigo-300 font-bold">
              <Landmark size={20} />
              <span className="text-lg">Official Scheme Details</span>
            </div>
          </div>
        </div>

        <div className="p-10 md:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              {/* Description */}
              <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Info size={24} />
                  </div>
                  <span>Overview</span>
                </h2>
                <div className="text-slate-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                  {scheme.fullDescription}
                </div>
              </section>

              {/* Eligibility */}
              <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <CheckCircle size={24} />
                  </div>
                  <span>Who can apply?</span>
                </h2>
                <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 font-medium text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {renderContent(scheme.eligibility)}
                </div>
              </section>

              {/* Documents */}
              <section>
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <FileText size={24} />
                  </div>
                  <span>Required Documents</span>
                </h2>
                <div className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 font-medium text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {renderContent(scheme.requiredDocuments)}
                </div>
              </section>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-10">
              <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-600/30 sticky top-10">
                <h3 className="text-xl font-black mb-6 flex items-center space-x-3">
                  <ShieldCheck size={28} />
                  <span>How to Apply</span>
                </h3>
                <p className="text-indigo-100/90 text-base mb-10 leading-relaxed font-medium">
                  {renderContent(scheme.applicationProcess)}
                </p>
                <a 
                  href={scheme.applicationLink || '#'} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-white text-indigo-600 py-5 rounded-2xl font-black shadow-xl hover:bg-indigo-50 transition-all flex items-center justify-center space-x-3 active:scale-95"
                >
                  <span>Official Portal</span>
                  <ExternalLink size={20} />
                </a>
              </div>

              <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <h4 className="font-black text-slate-400 uppercase tracking-widest text-[10px] mb-4">Benefit Type</h4>
                <div className="text-2xl font-black text-slate-900 leading-tight">
                  {renderContent(scheme.benefits)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SchemeDetail;
