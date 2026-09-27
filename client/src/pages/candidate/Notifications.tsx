import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCircle, Info, FileText, AlertCircle, CheckCheck } from 'lucide-react';
import api from '../../lib/axios';

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get('/notifications');
      return res.data.data;
    }
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.put(`/notifications/all/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  if (isLoading) return <div className="p-8">Loading notifications...</div>;
  if (isError) return <div className="p-8 text-error">Failed to load notifications.</div>;

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const getIcon = (type: string) => {
    switch (type) {
      case 'APPLICATION_UPDATE': return <FileText className="w-5 h-5 text-primary" />;
      case 'SYSTEM_ALERT': return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'NEW_MESSAGE': return <Info className="w-5 h-5 text-secondary" />;
      case 'OPPORTUNITY_MATCH': return <CheckCircle className="w-5 h-5 text-success" />;
      default: return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2 flex items-center">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 bg-error text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-text-secondary text-sm">Stay updated with your applications and account.</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllReadMutation.mutate()}
            disabled={markAllReadMutation.isPending}
            className="text-primary text-sm font-medium flex items-center hover:text-primary-dark"
          >
            <CheckCheck className="w-4 h-4 mr-1" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-border shadow-sm text-center flex flex-col items-center">
          <Bell className="w-12 h-12 text-text-muted mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No Notifications</h3>
          <p className="text-text-secondary text-sm max-w-md">You're all caught up! New notifications will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border shadow-sm divide-y divide-border">
          {notifications.map((notification: any) => (
            <div 
              key={notification._id} 
              className={`p-4 flex gap-4 transition-colors ${!notification.isRead ? 'bg-primary/5' : 'hover:bg-surface-secondary'}`}
            >
              <div className={`p-2 rounded-full h-fit ${!notification.isRead ? 'bg-white shadow-sm' : 'bg-surface'}`}>
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm ${!notification.isRead ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'}`}>
                  {notification.title}
                </h4>
                <p className={`text-sm mt-1 ${!notification.isRead ? 'text-text-secondary' : 'text-text-muted'}`}>
                  {notification.message}
                </p>
                <p className="text-xs text-text-muted mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
              {!notification.isRead && (
                <button 
                  onClick={() => markReadMutation.mutate(notification._id)}
                  className="w-2.5 h-2.5 rounded-full bg-primary mt-2 flex-shrink-0"
                  title="Mark as read"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
