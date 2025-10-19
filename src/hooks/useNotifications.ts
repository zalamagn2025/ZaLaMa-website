import { useState, useEffect, useCallback } from 'react'
import { Notification, NotificationFilters } from '@/types/notification'
import { notificationService } from '@/services/notificationService'

interface UseNotificationsReturn {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  hasMore: boolean
  refreshNotifications: () => Promise<void>
  loadMoreNotifications: () => Promise<void>
  markAsRead: (id: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: number) => Promise<void>
  clearError: () => void
}

export function useNotifications(filters: NotificationFilters = {}): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)

  const limit = filters.limit || 20

  // Fonction pour charger les notifications
  const loadNotifications = useCallback(async (reset = false) => {
    try {
      setLoading(true)
      setError(null)

      const currentOffset = reset ? 0 : offset
      const response = await notificationService.getNotifications({
        ...filters,
        limit,
        offset: currentOffset
      })

      if (response.success && response.data) {
        const newNotifications = response.data.notifications
        const totalPages = response.data.pagination.totalPages
        const currentPage = Math.floor(currentOffset / limit) + 1

        setNotifications(prev => reset ? newNotifications : [...prev, ...newNotifications])
        setHasMore(currentPage < totalPages)
        setOffset(currentOffset + limit)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des notifications')
    } finally {
      setLoading(false)
    }
  }, [filters, limit, offset])

  // Fonction pour recharger les notifications
  const refreshNotifications = useCallback(async () => {
    setOffset(0)
    await loadNotifications(true)
    await loadUnreadCount()
  }, [loadNotifications])

  // Fonction pour charger plus de notifications
  const loadMoreNotifications = useCallback(async () => {
    if (!loading && hasMore) {
      await loadNotifications(false)
    }
  }, [loadNotifications, loading, hasMore])

  // Fonction pour charger le compteur de notifications non lues
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount()
      if (response.success && response.data) {
        setUnreadCount(response.data.unread_count)
      }
    } catch (err) {
      console.error('Erreur lors du chargement du compteur:', err)
    }
  }, [])

  // Fonction pour marquer une notification comme lue
  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id)
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, lu: true, date_lecture: new Date().toISOString() }
            : notification
        )
      )
      
      // Mettre à jour le compteur
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }, [])

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead()
      
      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => ({
          ...notification,
          lu: true,
          date_lecture: new Date().toISOString()
        }))
      )
      
      setUnreadCount(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    }
  }, [])

  // Fonction pour supprimer une notification
  const deleteNotification = useCallback(async (id: number) => {
    try {
      await notificationService.deleteNotification(id)
      
      // Mettre à jour l'état local
      setNotifications(prev => {
        const notification = prev.find(n => n.id === id)
        const wasUnread = notification && !notification.lu
        const filtered = prev.filter(n => n.id !== id)
        
        // Mettre à jour le compteur si la notification supprimée était non lue
        if (wasUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
        
        return filtered
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    }
  }, [])

  // Fonction pour effacer l'erreur
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Charger les notifications au montage et quand les filtres changent
  useEffect(() => {
    refreshNotifications()
  }, [])

  // Charger le compteur de notifications non lues au montage
  useEffect(() => {
    loadUnreadCount()
  }, [loadUnreadCount])

  // Polling pour le compteur de notifications non lues (toutes les 30 secondes)
  useEffect(() => {
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [loadUnreadCount])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    refreshNotifications,
    loadMoreNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearError
  }
}
