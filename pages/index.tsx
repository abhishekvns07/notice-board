import { useEffect, useState } from 'react';
import axios from 'axios';
import NoticeCard from '../components/NoticeCard';
import { Loader2 } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl?: string | null;
}

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/notices');
      setNotices(data);
    } catch (err: any) {
      setError(err.response?.data?.details || 'Failed to fetch notices');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/notices/${id}`);
      setNotices((prev) => prev.filter((notice) => notice.id !== id));
    } catch (err) {
      alert('Failed to delete notice');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
        <p className="text-slate-400 animate-pulse">Loading notices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-900/20 backdrop-blur-md rounded-2xl text-red-400 font-medium max-w-2xl mx-auto border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <span className="block text-4xl mb-4">⚠️</span>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4 tracking-tight drop-shadow-sm">
          Recent Notices
        </h1>
        <p className="text-slate-400 text-lg">
          Stay updated with the latest announcements and important information.
        </p>
      </div>
      
      {notices.length === 0 ? (
        <div className="text-center py-24 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
          <div className="relative z-10">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-white/10 mb-6 border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
              <svg className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No notices found</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">There are currently no active notices. Check back later or create a new one!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
