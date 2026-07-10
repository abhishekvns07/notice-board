import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import DeleteConfirmModal from './DeleteConfirmModal';

interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl?: string | null;
}

interface Props {
  notice: Notice;
  onDelete: (id: string) => void;
}

export default function NoticeCard({ notice, onDelete }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isUrgent = notice.priority === 'Urgent';

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full relative group`}>
        {/* Accent Top Border for Urgent */}
        {isUrgent && <div className="h-1.5 w-full bg-red-500 absolute top-0 left-0"></div>}
        
        {notice.imageUrl && (
          <div className="w-full h-48 overflow-hidden">
             <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={notice.imageUrl} alt={notice.title} />
          </div>
        )}
        <div className={`p-6 flex flex-col flex-grow ${isUrgent && !notice.imageUrl ? 'pt-7' : ''}`}>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              {isUrgent && (
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest shadow-sm border border-red-200">
                  Urgent
                </span>
              )}
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                notice.category === 'Exam' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                notice.category === 'Event' ? 'bg-green-50 text-green-700 border border-green-200' :
                'bg-gray-50 text-gray-700 border border-gray-200'
              }`}>
                {notice.category}
              </span>
            </div>
            <div className="flex space-x-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
              <Link href={`/edit/${notice.id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                <Edit2 size={16} />
              </Link>
              <button onClick={() => setIsDeleteModalOpen(true)} className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{notice.title}</h3>
          <p className="text-gray-600 mb-6 text-sm flex-grow leading-relaxed line-clamp-4">{notice.body}</p>
          
          <div className="flex items-center text-xs font-medium text-gray-500 mt-auto pt-4 border-t border-gray-100">
            <Calendar size={14} className="mr-1.5" />
            <span>{format(new Date(notice.publishDate), 'MMMM d, yyyy')}</span>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            onDelete(notice.id);
            setIsDeleteModalOpen(false);
          }}
          title={notice.title}
        />
      )}
    </>
  );
}
