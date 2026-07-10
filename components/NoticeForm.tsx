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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{isEdit ? 'Edit Notice' : 'Create New Notice'}</h2>
      
      {submitError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="E.g., Mid-term Examination Schedule"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">Body *</label>
          <textarea
            {...register('body', { required: 'Body is required' })}
            id="body"
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="Details of the notice..."
          />
          {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body.message}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              {...register('category', { required: 'Category is required' })}
              id="category"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
            >
              <option value="General">General</option>
              <option value="Exam">Exam</option>
              <option value="Event">Event</option>
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
            <select
              {...register('priority', { required: 'Priority is required' })}
              id="priority"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-white"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
            </select>
            {errors.priority && <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">Publish Date *</label>
          <input
            {...register('publishDate', { required: 'Publish date is required' })}
            type="date"
            id="publishDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
          {errors.publishDate && <p className="mt-1 text-sm text-red-600">{errors.publishDate.message}</p>}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
          <input
            {...register('imageUrl')}
            type="url"
            id="imageUrl"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-1 text-xs text-gray-500">Provide a direct URL to an image to be displayed with the notice.</p>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors"
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
  );
}
