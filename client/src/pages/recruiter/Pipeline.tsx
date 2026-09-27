import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, GripVertical, ExternalLink, X, Send, Calendar, MessageCircle } from 'lucide-react';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

const STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED'];

const Pipeline = () => {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const queryClient = useQueryClient();
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [messageBody, setMessageBody] = useState('');
  const [interviewForm, setInterviewForm] = useState({ date: '', time: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, note: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const { data: opportunity, isLoading: oppLoading } = useQuery({
    queryKey: ['opportunity', opportunityId],
    queryFn: async () => {
      const res = await api.get(`/recruiter/opportunities/${opportunityId}`);
      return res.data.data;
    }
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['applications', opportunityId],
    queryFn: async () => {
      const res = await api.get(`/recruiter/opportunities/${opportunityId}/applications`);
      return res.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.put(`/recruiter/applications/${id}/status`, { status });
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['applications', opportunityId] });
      const previousApps = queryClient.getQueryData(['applications', opportunityId]);
      queryClient.setQueryData(['applications', opportunityId], (old: any[]) => 
        old.map(app => app._id === id ? { ...app, status } : app)
      );
      return { previousApps };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['applications', opportunityId], context?.previousApps);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications', opportunityId] });
    },
  });

  const { data: conversation } = useQuery({
    queryKey: ['recruiter-conversation', selectedApp?._id],
    queryFn: async () => {
      const res = await api.get(`/recruiter/applications/${selectedApp._id}/conversation`);
      return res.data.data;
    },
    enabled: !!selectedApp
  });

  const { data: messagesResponse } = useQuery({
    queryKey: ['recruiter-messages', conversation?._id],
    queryFn: async () => {
      const res = await api.get(`/recruiter/conversations/${conversation!._id}/messages`);
      return res.data;
    },
    enabled: !!conversation?._id,
    refetchInterval: 10000
  });

  const { data: interview } = useQuery({
    queryKey: ['recruiter-interview', selectedApp?._id],
    queryFn: async () => {
      const res = await api.get(`/recruiter/applications/${selectedApp._id}/interview`);
      return res.data.data;
    },
    enabled: !!selectedApp
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (body: string) => {
      await api.post(`/recruiter/applications/${selectedApp._id}/messages`, { body });
    },
    onSuccess: () => {
      setMessageBody('');
      queryClient.invalidateQueries({ queryKey: ['recruiter-conversation', selectedApp._id] });
      if (conversation?._id) {
        queryClient.invalidateQueries({ queryKey: ['recruiter-messages', conversation._id] });
      }
    }
  });

  const proposeInterviewMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post(`/recruiter/applications/${selectedApp._id}/interviews`, data);
    },
    onSuccess: () => {
      setInterviewForm({ date: '', time: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, note: '' });
      queryClient.invalidateQueries({ queryKey: ['recruiter-interview', selectedApp._id] });
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesResponse?.data, selectedApp]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedAppId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    if (draggedAppId) {
      const app = applications.find((a: any) => a._id === draggedAppId);
      if (app && app.status !== targetStatus) {
        updateStatusMutation.mutate({ id: draggedAppId, status: targetStatus });
      }
    }
    setDraggedAppId(null);
  };

  if (oppLoading || appsLoading) return <div className="p-8">Loading pipeline...</div>;

  const grouped = STATUSES.reduce((acc, status) => {
    acc[status] = applications.filter((app: any) => app.status === status);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <Link to="/recruiter/opportunities" className="inline-flex items-center text-text-secondary hover:text-primary transition-colors text-sm font-medium mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Opportunities
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">{opportunity?.title}</h1>
            <p className="text-text-secondary text-sm">Pipeline Management ({applications.length} total candidates)</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {STATUSES.map(status => (
          <div 
            key={status} 
            className="flex-shrink-0 w-80 bg-surface border border-border rounded-xl flex flex-col max-h-full"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="p-4 border-b border-border bg-surface-secondary rounded-t-xl flex justify-between items-center">
              <h3 className="font-bold text-text-primary capitalize">{status.replace('_', ' ').toLowerCase()}</h3>
              <span className="bg-white text-text-secondary text-xs font-bold px-2 py-1 rounded-full border border-border">
                {grouped[status].length}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
              {grouped[status].map(app => (
                <div 
                  key={app._id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, app._id)}
                  className="bg-white p-4 rounded-lg border border-border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-border group-hover:text-text-muted transition-colors" />
                      <p className="font-bold text-text-primary text-sm truncate w-48">
                        {app.candidateId?.email || 'Unknown User'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pl-6 flex flex-col mt-4 gap-2">
                    <span className="text-xs text-text-muted">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center justify-between">
                      <Link 
                        to={`/recruiter/candidates/${app.candidateId?._id}/profile`}
                        className="text-primary hover:text-primary-dark transition-colors flex items-center text-xs font-medium"
                      >
                        Profile <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="bg-surface-secondary hover:bg-surface border border-border text-text-primary px-3 py-1 rounded-md text-xs font-medium transition-colors"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {grouped[status].length === 0 && (
                <div className="h-24 border-2 border-dashed border-border rounded-lg flex items-center justify-center text-text-muted text-sm">
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Panel for Application Details & Communication */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSelectedApp(null)} />
          <div className="relative w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-4 border-b border-border flex justify-between items-center bg-white">
              <h2 className="text-lg font-bold text-text-primary truncate">
                {selectedApp.candidateId?.firstName} {selectedApp.candidateId?.lastName}
              </h2>
              <button onClick={() => setSelectedApp(null)} className="text-text-muted hover:text-text-primary p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Interview Status */}
              <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border bg-surface-secondary">
                  <h3 className="font-bold text-text-primary flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-primary" /> Interview Management
                  </h3>
                </div>
                <div className="p-4">
                  {interview ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-muted">Status:</span>
                        <span className={`font-bold ${interview.status === 'ACCEPTED' ? 'text-success' : interview.status === 'DECLINED' || interview.status === 'CANCELLED' ? 'text-error' : 'text-primary'}`}>
                          {interview.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Start:</span>
                        <span className="font-medium">{new Date(interview.startAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Timezone:</span>
                        <span className="font-medium">{interview.timezone}</span>
                      </div>
                    </div>
                  ) : (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (interviewForm.date && interviewForm.time) {
                          const startAt = new Date(`${interviewForm.date}T${interviewForm.time}:00`);
                          const endAt = new Date(startAt.getTime() + 60 * 60 * 1000); // 1 hr
                          proposeInterviewMutation.mutate({ startAt, endAt, timezone: interviewForm.timezone, note: interviewForm.note });
                        }
                      }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">Date</label>
                        <input type="date" required value={interviewForm.date} onChange={e => setInterviewForm(p => ({...p, date: e.target.value}))} className="w-full px-3 py-1.5 text-sm bg-surface-secondary border border-border rounded-md" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">Time</label>
                        <input type="time" required value={interviewForm.time} onChange={e => setInterviewForm(p => ({...p, time: e.target.value}))} className="w-full px-3 py-1.5 text-sm bg-surface-secondary border border-border rounded-md" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">Timezone</label>
                        <input type="text" required value={interviewForm.timezone} onChange={e => setInterviewForm(p => ({...p, timezone: e.target.value}))} className="w-full px-3 py-1.5 text-sm bg-surface-secondary border border-border rounded-md" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1">Note (Optional)</label>
                        <input type="text" value={interviewForm.note} onChange={e => setInterviewForm(p => ({...p, note: e.target.value}))} className="w-full px-3 py-1.5 text-sm bg-surface-secondary border border-border rounded-md" placeholder="e.g. Google Meet link..." />
                      </div>
                      <button type="submit" disabled={proposeInterviewMutation.isPending} className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-primary-dark">
                        Propose Interview
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Chat */}
              <div className="bg-white rounded-xl border border-border shadow-sm flex flex-col h-[400px]">
                <div className="p-4 border-b border-border bg-surface-secondary">
                  <h3 className="font-bold text-text-primary flex items-center text-sm">
                    <MessageCircle className="w-4 h-4 mr-2 text-primary" /> Messages
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
                  {messagesResponse?.data?.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-text-muted text-sm text-center">
                      <p>Start a conversation with the candidate.</p>
                    </div>
                  ) : (
                    messagesResponse?.data?.map((msg: any) => {
                      const isMine = msg.senderId === user?.id;
                      return (
                        <div key={msg._id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                          <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${isMine ? 'bg-primary text-white rounded-br-none' : 'bg-white border border-border text-text-primary rounded-bl-none shadow-sm'}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                          </div>
                          <span className="text-[10px] text-text-muted mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-3 border-t border-border bg-white">
                  <form onSubmit={(e) => { e.preventDefault(); if (messageBody.trim()) sendMessageMutation.mutate(messageBody); }} className="flex gap-2">
                    <input 
                      type="text" 
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      placeholder="Type a message..."
                      disabled={sendMessageMutation.isPending}
                      className="flex-1 px-3 py-2 bg-surface-secondary border border-border rounded-full text-sm focus:outline-none focus:border-primary"
                    />
                    <button type="submit" disabled={!messageBody.trim() || sendMessageMutation.isPending} className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark">
                      <Send className="w-4 h-4 ml-1" />
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pipeline;
