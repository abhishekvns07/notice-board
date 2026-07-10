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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-xl text-red-700 font-medium max-w-2xl mx-auto shadow-sm border border-red-100">
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
