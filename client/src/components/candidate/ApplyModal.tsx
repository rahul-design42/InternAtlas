import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';

interface ApplyModalProps {
  opportunityId: string;
  opportunityTitle: string;
  onClose: () => void;
}

const ApplyModal = ({ opportunityId, opportunityTitle, onClose }: ApplyModalProps) => {
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const queryClient = useQueryClient();

  const { data: resumes = [], isLoading: isLoadingResumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const res = await api.get('/student/resumes');
      return res.data.data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (data: { resumeId?: string }) => {
      const res = await api.post(`/student/opportunities/${opportunityId}/apply`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (uploadFile: File) => {
      const formData = new FormData();
      formData.append('resume', uploadFile);
      const res = await api.post('/student/resumes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setFile(null);
    }
  });

  const handleApply = async () => {
    try {
      let finalResumeId = selectedResumeId;

      if (file) {
        const newResume = await uploadMutation.mutateAsync(file);
        finalResumeId = newResume._id;
      }

      await applyMutation.mutateAsync({ resumeId: finalResumeId });
    } catch (err: any) {
      setUploadError(err.response?.data?.message || 'Failed to apply');
    }
  };

  if (applyMutation.isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 text-center relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-text-muted hover:text-text-primary">
            <X className="w-5 h-5" />
          </button>
          <div className="w-16 h-16 bg-success-light text-success rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-text-primary mb-2">Application Submitted!</h3>
          <p className="text-text-secondary mb-6">
            You have successfully applied to {opportunityTitle}. You can track your application status in your dashboard.
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary-dark transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-text-muted hover:text-text-primary">
          <X className="w-5 h-5" />
        </button>
        
        <h3 className="text-xl font-bold text-text-primary mb-1">Apply to {opportunityTitle}</h3>
        <p className="text-sm text-text-secondary mb-6">Choose a resume to submit with your application.</p>

        {(uploadError || applyMutation.isError || uploadMutation.isError) && (
          <div className="mb-4 p-3 bg-error-light text-error text-sm rounded-md font-medium">
            {uploadError || (applyMutation.error as any)?.response?.data?.message || 'An error occurred'}
          </div>
        )}

        <div className="space-y-4 mb-6">
          {isLoadingResumes ? (
            <div className="text-center py-4 text-text-secondary">Loading resumes...</div>
          ) : resumes.length > 0 ? (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Select Existing Resume</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {resumes.map((resume: any) => (
                  <label key={resume._id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedResumeId === resume._id && !file ? 'border-primary bg-primary-light/10' : 'border-border hover:border-primary/50'}`}>
                    <input 
                      type="radio" 
                      name="resume" 
                      checked={selectedResumeId === resume._id && !file} 
                      onChange={() => {
                        setSelectedResumeId(resume._id);
                        setFile(null);
                      }}
                      className="hidden" 
                    />
                    <FileText className={`w-5 h-5 mr-3 ${selectedResumeId === resume._id && !file ? 'text-primary' : 'text-text-muted'}`} />
                    <span className="text-sm flex-1 truncate">{resume.fileName}</span>
                    {resume.isDefault && <span className="text-xs bg-surface-secondary px-2 py-0.5 rounded text-text-secondary">Default</span>}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-text-secondary text-center py-2">No resumes found. Please upload one below.</div>
          )}

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border"></div>
            <span className="flex-shrink-0 mx-4 text-text-muted text-xs uppercase font-medium">OR</span>
            <div className="flex-grow border-t border-border"></div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Upload New Resume (PDF max 5MB)</label>
            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${file ? 'border-primary bg-primary-light/5' : 'border-border hover:border-primary hover:bg-surface-secondary'}`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className={`w-8 h-8 mb-2 ${file ? 'text-primary' : 'text-text-muted'}`} />
                <p className="text-sm text-text-secondary text-center px-4">
                  {file ? <span className="font-semibold text-primary truncate max-w-[200px] inline-block">{file.name}</span> : <span>Click to upload or drag and drop</span>}
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setFile(e.target.files[0]);
                    setSelectedResumeId('');
                  }
                }}
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={applyMutation.isPending || uploadMutation.isPending || (!selectedResumeId && !file)}
          className="w-full bg-primary text-white font-bold rounded-md py-2.5 hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {applyMutation.isPending || uploadMutation.isPending ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
};

export default ApplyModal;
