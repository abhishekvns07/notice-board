import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface NoticeFormValues {
  title: string;
  body: string;
  category: string;
  priority: string;
  publishDate: string;
  imageUrl?: string;
}

interface Props {
  initialData?: NoticeFormValues & { id: string };
  isEdit?: boolean;
}

export default function NoticeForm({ initialData, isEdit }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<NoticeFormValues>({
    defaultValues: initialData ? {
      ...initialData,
      publishDate: initialData.publishDate ? format(new Date(initialData.publishDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
    } : {
      category: 'General',
      priority: 'Normal',
      publishDate: format(new Date(), 'yyyy-MM-dd')
    }
  });

  const onSubmit = async (data: NoticeFormValues) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      if (isEdit && initialData) {
        await axios.put(`/api/notices/${initialData.id}`, data);
      } else {
        await axios.post('/api/notices', data);
      }
      router.push('/');
    } catch (error) {
      console.error(error);
      setSubmitError('An error occurred while saving the notice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "mt-1 block w-full rounded-xl bg-slate-900/50 border border-white/10 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-3 transition-colors placeholder:text-slate-500";
  const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5 ml-1";

  return (
    <div className="relative group rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 max-w-2xl mx-auto shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-8 tracking-tight">
          {isEdit ? 'Edit Notice' : 'Create New Notice'}
        </h2>
        
        {submitError && (
          <div className="mb-6 p-4 bg-red-900/20 backdrop-blur-md rounded-xl text-red-400 text-sm border border-red-500/20 shadow-sm flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className={labelClasses}>Title <span className="text-purple-400">*</span></label>
            <input
              {...register('title', { required: 'Title is required' })}
              type="text"
              id="title"
              className={inputClasses}
              placeholder="E.g., Mid-term Examination Schedule"
            />
            {errors.title && <p className="mt-1.5 text-sm text-red-400 ml-1">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="body" className={labelClasses}>Body <span className="text-purple-400">*</span></label>
            <textarea
              {...register('body', { required: 'Body is required' })}
              id="body"
              rows={5}
              className={inputClasses}
              placeholder="Details of the notice..."
            />
            {errors.body && <p className="mt-1.5 text-sm text-red-400 ml-1">{errors.body.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className={labelClasses}>Category <span className="text-purple-400">*</span></label>
              <select
                {...register('category', { required: 'Category is required' })}
                id="category"
                className={`${inputClasses} [&>option]:bg-slate-900`}
              >
                <option value="General">General</option>
                <option value="Exam">Exam</option>
                <option value="Event">Event</option>
              </select>
              {errors.category && <p className="mt-1.5 text-sm text-red-400 ml-1">{errors.category.message}</p>}
            </div>

            <div>
              <label htmlFor="priority" className={labelClasses}>Priority <span className="text-purple-400">*</span></label>
              <select
                {...register('priority', { required: 'Priority is required' })}
                id="priority"
                className={`${inputClasses} [&>option]:bg-slate-900`}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
              </select>
              {errors.priority && <p className="mt-1.5 text-sm text-red-400 ml-1">{errors.priority.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="publishDate" className={labelClasses}>Publish Date <span className="text-purple-400">*</span></label>
            <input
              {...register('publishDate', { required: 'Publish date is required' })}
              type="date"
              id="publishDate"
              className={`${inputClasses} [color-scheme:dark]`}
            />
            {errors.publishDate && <p className="mt-1.5 text-sm text-red-400 ml-1">{errors.publishDate.message}</p>}
          </div>

          <div>
            <label htmlFor="imageUrl" className={labelClasses}>Image URL <span className="text-slate-500 font-normal ml-1">(Optional)</span></label>
            <input
              {...register('imageUrl')}
              type="url"
              id="imageUrl"
              className={inputClasses}
              placeholder="https://example.com/image.jpg"
            />
            <p className="mt-2 ml-1 text-xs text-slate-400">Provide a direct URL to an image to be displayed with the notice.</p>
          </div>

          <div className="pt-8 flex justify-end gap-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-full text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-8 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-600 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 disabled:opacity-50 disabled:hover:translate-y-0 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                'Save Notice'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
