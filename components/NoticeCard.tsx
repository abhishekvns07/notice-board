import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Pencil, Trash2, Calendar } from 'lucide-react';
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
      <div className={`relative group rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-6 shadow-xl transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 hover:shadow-purple-500/20 flex flex-col h-full ${isUrgent ? 'ring-1 ring-red-500/50' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 leading-tight">
              {notice.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {notice.category}
              </span>
              {isUrgent && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
                  Urgent
                </span>
              )}
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {format(new Date(notice.publishDate), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link href={`/edit/${notice.id}`}>
              <button className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-purple-500/50 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
            </Link>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-red-500/50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {notice.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-white/10 h-48 relative shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={notice.imageUrl} 
              alt={notice.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        
        <p className="text-slate-300 text-sm line-clamp-4 leading-relaxed flex-grow">
          {notice.body}
        </p>
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
