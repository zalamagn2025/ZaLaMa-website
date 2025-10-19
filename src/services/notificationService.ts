import { 
  Notification, 
  NotificationResponse, 
  NotificationListResponse, 
  NotificationUnreadCountResponse,
  NotificationFilters,
  NotificationUpdateData
} from '@/types/notification'

class NotificationService {
  private baseUrl = '/api/notifications'

  /**
   * Récupère la liste des notifications
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<NotificationListResponse> {
    const params = new URLSearchParams()
    
    if (filters.unread_only) params.append('unread_only', 'true')
    if (filters.type) params.append('type', filters.type)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.limit) params.append('limit', filters.limit.toString())
    if (filters.offset) params.append('offset', filters.offset.toString())
    
    params.append('action', 'list')

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la récupération des notifications')
    }

    return response.json()
  }

  /**
   * Récupère une notification spécifique
   */
  async getNotification(id: number): Promise<NotificationResponse> {
    const params = new URLSearchParams()
    params.append('action', 'get')
    params.append('id', id.toString())

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la récupération de la notification')
    }

    return response.json()
  }

  /**
   * Marque une notification comme lue
   */
  async markAsRead(notificationId: number): Promise<NotificationResponse> {
    const params = new URLSearchParams()
    params.append('action', 'mark-read')

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notification_id: notificationId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la mise à jour de la notification')
    }

    return response.json()
  }

  /**
   * Marque toutes les notifications comme lues
   */
  async markAllAsRead(): Promise<NotificationResponse> {
    const params = new URLSearchParams()
    params.append('action', 'mark-all-read')

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la mise à jour des notifications')
    }

    return response.json()
  }

  /**
   * Récupère le nombre de notifications non lues
   */
  async getUnreadCount(): Promise<NotificationUnreadCountResponse> {
    const params = new URLSearchParams()
    params.append('action', 'unread-count')

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors du comptage des notifications')
    }

    return response.json()
  }

  /**
   * Supprime une notification
   */
  async deleteNotification(notificationId: number): Promise<NotificationResponse> {
    const params = new URLSearchParams()
    params.append('action', 'delete')

    const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notification_id: notificationId }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Erreur lors de la suppression de la notification')
    }

    return response.json()
  }

  /**
   * Formate la date de création d'une notification
   */
  formatNotificationDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return 'À l\'instant'
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)} h`
    if (diffInMinutes < 10080) return `Il y a ${Math.floor(diffInMinutes / 1440)} j`
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  /**
   * Obtient l'icône selon le type de notification
   */
  getNotificationIcon(type: string): string {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      system: '⚙️',
      task: '📋',
      message: '💬',
      reminder: '⏰'
    }
    return icons[type as keyof typeof icons] || 'ℹ️'
  }

  /**
   * Obtient la couleur selon le type de notification
   */
  getNotificationColor(type: string): string {
    const colors = {
      info: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      error: 'text-red-500',
      system: 'text-gray-500',
      task: 'text-purple-500',
      message: 'text-blue-400',
      reminder: 'text-orange-500'
    }
    return colors[type as keyof typeof colors] || 'text-gray-500'
  }
}

export const notificationService = new NotificationService()
