import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import NoticeForm from '../../components/NoticeForm';
import { Loader2 } from 'lucide-react';

export default function EditNotice() {
  const router = useRouter();
  const { id } = router.query;
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchNotice = async () => {
      try {
        const { data } = await axios.get(`/api/notices/${id}`);
        setNotice(data);
      } catch (err) {
        setError('Failed to load notice');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-purple-400" />
        <p className="text-slate-400 animate-pulse">Loading notice...</p>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="text-center p-8 bg-red-900/20 backdrop-blur-md rounded-2xl text-red-400 font-medium max-w-2xl mx-auto border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <span className="block text-4xl mb-4">⚠️</span>
        {error || 'Notice not found'}
      </div>
    );
  }

  return (
    <div>
      <NoticeForm initialData={notice} isEdit={true} />
    </div>
  );
}
