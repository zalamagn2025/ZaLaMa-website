export interface Notification {
  id: number;
  employee_id: number;
  titre: string;
  message: string;
  type: NotificationType;
  priorite: NotificationPriority;
  lu: boolean;
  date_creation: string;
  date_lecture?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'system'
  | 'task'
  | 'message'
  | 'reminder';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export interface NotificationListResponse extends NotificationResponse {
  data: {
    notifications: Notification[];
    pagination: {
      limit: number;
      offset: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface NotificationUnreadCountResponse extends NotificationResponse {
  data: {
    unread_count: number;
  };
}

export interface NotificationFilters {
  unread_only?: boolean;
  type?: NotificationType;
  priority?: NotificationPriority;
  limit?: number;
  offset?: number;
}

export interface NotificationCreateData {
  employee_id: number;
  titre: string;
  message: string;
  type?: NotificationType;
  priority?: NotificationPriority;
  metadata?: Record<string, any>;
}

export interface NotificationUpdateData {
  lu?: boolean;
  date_lecture?: string;
}
