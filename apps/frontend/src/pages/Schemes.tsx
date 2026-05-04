import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import { useState } from 'react';
import { Search, Filter, ChevronRight, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Schemes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');

  const { data: schemes, isLoading } = useQuery({
    queryKey: ['schemes'],
    queryFn: async () => {
      const { data } = await api.get('/schemes');
      return data.data;
    },
  });

  const filteredSchemes = schemes?.filter((s: any) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filter === 'ALL' || s.level === filter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-3xl font-bold text-yojana-blue-900 tracking-tight">Scheme Directory</h1>
          <p className="text-slate-500 mt-2 font-medium">Browse through all active government schemes.</p>
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by scheme name or description..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-yojana-blue-100 focus:border-yojana-blue-500 outline-none shadow-sm transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
          <Filter size={18} className="text-slate-400 ml-2" />
          {['ALL', 'CENTRAL', 'STATE'].map((l) => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === l ? 'bg-yojana-blue-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-100 shadow-soft" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes?.map((scheme: any) => (
            <motion.div 
              layout
              key={scheme._id}
              className="bg-white rounded-2xl border border-slate-200 shadow-soft hover:shadow-lg transition-shadow flex flex-col overflow-hidden group"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex px-3 py-1 bg-yojana-blue-50 text-yojana-blue-800 text-xs font-bold rounded-full border border-yojana-blue-100">
                    {scheme.level}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-yojana-blue-700 transition-colors">
                  {scheme.name}
                </h3>
                
                <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
                  {scheme.shortDescription}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {scheme.category?.slice(0, 2).map((cat: string) => (
                    <span key={cat} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium border border-slate-200">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-500 max-w-[60%]">
                  <Landmark size={14} className="shrink-0 text-yojana-orange-500" />
                  <span className="text-xs font-medium truncate">{scheme.ministry}</span>
                </div>
                <Link 
                  to={`/scheme/${scheme._id}`}
                  className="text-sm font-semibold text-yojana-blue-700 hover:text-yojana-blue-900 flex items-center space-x-1"
                >
                  <span>Details</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && filteredSchemes?.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-soft">
          <Search size={40} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No schemes found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Schemes;
