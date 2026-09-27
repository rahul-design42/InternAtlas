import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, FileText, ExternalLink, Clock, Send, Calendar, CheckCircle, XCircle } from 'lucide-react';
import api from '../../lib/axios';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [messageBody, setMessageBody] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: app, isLoading, isError } = useQuery({
    queryKey: ['application', id],
    queryFn: async () => {
      const res = await api.get(`/student/applications/${id}`);
      return res.data.data;
    }
  });

  const { data: conversation } = useQuery({
    queryKey: ['candidate-conversation', id],
    queryFn: async () => {
      const res = await api.get(`/candidate/applications/${id}/conversation`);
      return res.data.data;
    },
    enabled: !!app
  });

  const { data: messagesResponse } = useQuery({
    queryKey: ['candidate-messages', conversation?._id],
    queryFn: async () => {
      const res = await api.get(`/candidate/conversations/${conversation!._id}/messages`);
      return res.data;
    },
    enabled: !!conversation?._id,
    refetchInterval: 10000 // Simple polling instead of websockets
  });

  const { data: interview } = useQuery({
    queryKey: ['candidate-interview', id],
    queryFn: async () => {
      const res = await api.get(`/candidate/applications/${id}/interview`);
      return res.data.data;
    },
    enabled: !!app
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (body: string) => {
      await api.post(`/candidate/applications/${id}/messages`, { body });
    },
    onSuccess: () => {
      setMessageBody('');
      queryClient.invalidateQueries({ queryKey: ['candidate-conversation', id] });
      if (conversation?._id) {
        queryClient.invalidateQueries({ queryKey: ['candidate-messages', conversation._id] });
      }
    }
  });

  const respondInterviewMutation = useMutation({
    mutationFn: async ({ interviewId, status }: { interviewId: string, status: string }) => {
      await api.put(`/candidate/interviews/${interviewId}/respond`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate-interview', id] });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesResponse?.data]);

  if (isLoading) return <div className="p-8">Loading application details...</div>;
  if (isError || !app) return <div className="p-8 text-error">Failed to load application details.</div>;

  const opp = app.opportunityId;
  const org = opp?.organizationId;
  const resume = app.resumeId;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'REVIEWING': return 'bg-warning-light text-warning';
      case 'SHORTLISTED': return 'bg-success-light text-success';
      case 'REJECTED': return 'bg-error-light text-error';
      case 'ACCEPTED': return 'bg-success text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'Your application has been received and is waiting to be reviewed.';
      case 'REVIEWING': return 'The recruitment team is currently reviewing your application.';
      case 'SHORTLISTED': return 'Congratulations! You have been shortlisted for the next steps.';
      case 'REJECTED': return 'Unfortunately, the organization decided to move forward with other candidates.';
      case 'ACCEPTED': return 'Congratulations! You have been accepted for this opportunity.';
      default: return 'Status is currently unknown.';
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <Link to="/student/applications" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Applications
      </Link>

      {/* Header Card */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6 mb-6">
          <div className="flex gap-4">
            {org?.logoUrl ? (
              <img src={org.logoUrl} alt="Logo" className="w-16 h-16 rounded-lg object-cover border border-border" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-surface-secondary border border-border flex items-center justify-center font-bold text-xl text-text-muted">
                {org?.name?.charAt(0) || 'O'}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-1">{opp?.title}</h1>
              <Link to={`/opportunities/${opp?.slug}`} className="text-primary font-medium hover:underline text-sm flex items-center mb-2">
                View Original Posting <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
              <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                <span className="flex items-center"><Building2 className="w-4 h-4 mr-1.5"/> {org?.name}</span>
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5"/> {opp?.location?.city || 'Remote'}</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-secondary px-4 py-3 rounded-lg flex flex-col items-end w-full md:w-auto">
            <span className="text-xs font-medium text-text-muted mb-1">Current Status</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(app.status)}`}>
              {app.status}
            </span>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex gap-3">
          <Clock className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <p className="font-bold text-text-primary text-sm">Status Update</p>
            <p className="text-text-secondary text-sm mt-1">{getStatusText(app.status)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Application Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border">Submitted Details</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Application Date</h3>
                <p className="text-text-primary font-medium">{new Date(app.createdAt).toLocaleString()}</p>
              </div>

              {resume && (
                <div>
                  <h3 className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Attached Resume</h3>
                  <div className="flex items-center gap-3 p-3 border border-border rounded-lg bg-surface-secondary">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm text-text-primary truncate">{resume.fileName}</p>
                    </div>
                    <a 
                      href={resume.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white border border-border rounded-md text-xs font-medium hover:text-primary transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>
              )}

              {app.answers && app.answers.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-text-secondary mb-3 uppercase tracking-wider">Screening Questions</h3>
                  <div className="space-y-4">
                    {app.answers.map((answer: any, index: number) => (
                      <div key={index} className="bg-surface-secondary p-4 rounded-lg">
                        <p className="font-medium text-sm text-text-primary mb-2">Q: {answer.questionId || `Question ${index + 1}`}</p>
                        <p className="text-sm text-text-secondary">A: {answer.answerValue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Organization Info & Communication */}
        <div className="space-y-6">
          
          {/* Interview Status */}
          {interview && (
            <div className={`bg-white rounded-xl border shadow-sm p-6 ${interview.status === 'PROPOSED' ? 'border-primary' : 'border-border'}`}>
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" /> Interview {interview.status}
              </h2>
              
              <div className="space-y-3 mb-6 bg-surface-secondary p-4 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Date:</span>
                  <span className="font-bold text-text-primary">{new Date(interview.startAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Time:</span>
                  <span className="font-bold text-text-primary">{new Date(interview.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(interview.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Timezone:</span>
                  <span className="font-bold text-text-primary">{interview.timezone}</span>
                </div>
                {interview.note && (
                  <div className="mt-3 pt-3 border-t border-border text-sm text-text-secondary">
                    <span className="font-bold block mb-1">Note from Recruiter:</span>
                    {interview.note}
                  </div>
                )}
              </div>

              {interview.status === 'PROPOSED' && (
                <div className="flex gap-3">
                  <button 
                    onClick={() => respondInterviewMutation.mutate({ interviewId: interview._id, status: 'ACCEPTED' })}
                    disabled={respondInterviewMutation.isPending}
                    className="flex-1 bg-success hover:bg-success/90 text-white py-2 rounded-lg font-medium transition-colors flex justify-center items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Accept
                  </button>
                  <button 
                    onClick={() => respondInterviewMutation.mutate({ interviewId: interview._id, status: 'DECLINED' })}
                    disabled={respondInterviewMutation.isPending}
                    className="flex-1 bg-surface-secondary hover:bg-surface border border-border text-text-primary py-2 rounded-lg font-medium transition-colors flex justify-center items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Decline
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Communication / Messages */}
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-border bg-surface-secondary">
              <h2 className="text-lg font-bold text-text-primary flex items-center">
                Messages
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
              {messagesResponse?.data?.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-text-muted text-sm">
                  <p>No messages yet.</p>
                  <p>Send a message to contact the recruiter.</p>
                </div>
              ) : (
                messagesResponse?.data?.map((msg: any) => {
                  const isMine = msg.senderId === user?.id;
                  return (
                    <div key={msg._id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${isMine ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-border text-text-primary rounded-bl-none shadow-sm'}`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                      </div>
                      <span className="text-xs text-text-muted mt-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t border-border bg-white">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (messageBody.trim() && app?.status !== 'REJECTED') {
                    sendMessageMutation.mutate(messageBody);
                  }
                }}
                className="flex gap-2"
              >
                <input 
                  type="text" 
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder={app?.status === 'REJECTED' ? "Cannot message on rejected applications" : "Type a message..."}
                  disabled={app?.status === 'REJECTED' || sendMessageMutation.isPending}
                  className="flex-1 px-4 py-2 bg-surface-secondary border border-border rounded-full text-sm focus:outline-none focus:border-primary disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={!messageBody.trim() || app?.status === 'REJECTED' || sendMessageMutation.isPending}
                  className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4 pb-2 border-b border-border">About {org?.name}</h2>
            <p className="text-sm text-text-secondary mb-4 line-clamp-4">
              {org?.description || 'No description provided by the organization.'}
            </p>
            {org?.websiteUrl && (
              <a 
                href={org.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium flex items-center hover:underline"
              >
                Visit Website <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;
