import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Upload, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';

const Resumes = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState('');

  const { data: resumes = [], isLoading, isError } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await api.get('/student/resumes');
      return res.data.data;
    }
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await api.post('/student/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setUploadError('');
    },
    onError: (error: any) => {
      setUploadError(error.response?.data?.message || 'Failed to upload resume');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/student/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setUploadError('Only PDF files are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File must be smaller than 5MB');
        return;
      }
      uploadMutation.mutate(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (isLoading) return <div className="p-8">Loading resumes...</div>;
  if (isError) return <div className="p-8 text-error">Failed to load resumes.</div>;

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Resumes</h1>
          <p className="text-text-secondary text-sm">Manage your uploaded resumes for applications.</p>
        </div>
        <input 
          type="file" 
          accept=".pdf" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className="bg-primary text-white px-6 py-2 rounded-md font-medium flex items-center hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          <Upload className="w-4 h-4 mr-2" />
          {uploadMutation.isPending ? 'Uploading...' : 'Upload Resume'}
        </button>
      </div>

      {uploadError && (
        <div className="bg-error-light text-error p-4 rounded-lg flex items-center text-sm font-medium">
          <AlertCircle className="w-5 h-5 mr-2" />
          {uploadError}
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-border shadow-sm text-center flex flex-col items-center">
          <FileText className="w-12 h-12 text-text-muted mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No Resumes Uploaded</h3>
          <p className="text-text-secondary text-sm max-w-md mb-6">You haven't uploaded any resumes yet. Upload a PDF resume to apply for opportunities quickly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {resumes.map((resume: any) => (
            <div key={resume._id} className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-primary-light text-primary rounded-lg mr-4">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-text-primary truncate max-w-[200px]" title={resume.fileName}>{resume.fileName}</h3>
                    <p className="text-xs text-text-secondary">Uploaded on {new Date(resume.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {resume.isDefault && (
                  <span className="bg-success-light text-success text-xs px-2 py-1 rounded font-medium flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" /> Default
                  </span>
                )}
              </div>
              
              <div className="mt-auto pt-4 flex gap-3 border-t border-border">
                <a 
                  href={resume.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 border border-primary text-primary text-center py-2 rounded-md font-medium text-sm hover:bg-primary-light transition-colors"
                >
                  View
                </a>
                <button 
                  onClick={() => deleteMutation.mutate(resume._id)}
                  disabled={deleteMutation.isPending}
                  className="px-4 border border-error text-error rounded-md hover:bg-error-light transition-colors disabled:opacity-50"
                  title="Delete Resume"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resumes;
