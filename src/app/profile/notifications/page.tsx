"use client"

import { useState } from 'react'
import { IconBell, IconCheck, IconTrash, IconRefresh, IconX } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification } from '@/types/notification'
import { notificationService } from '@/services/notificationService'
import { useRouter } from 'next/navigation'

export default function NotificationsPage() {
  const router = useRouter()
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const {
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
  } = useNotifications({ 
    limit: 20,
    unread_only: filter === 'unread'
  })

  const handleSelectNotification = (id: number) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(n => n !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(notifications.map(n => n.id))
    }
  }

  const handleBulkMarkAsRead = async () => {
    for (const id of selectedNotifications) {
      await markAsRead(id)
    }
    setSelectedNotifications([])
  }

  const handleBulkDelete = async () => {
    for (const id of selectedNotifications) {
      await deleteNotification(id)
    }
    setSelectedNotifications([])
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.lu) {
      await markAsRead(notification.id)
    }
  }

  const handleRefresh = async () => {
    clearError()
    await refreshNotifications()
  }

  return (
    <div className="min-h-screen bg-zalama-bg-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-zalama-text-secondary hover:text-zalama-text transition-colors rounded-lg hover:bg-zalama-bg-light"
            >
              <IconX size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-zalama-text flex items-center gap-3">
                <IconBell size={32} className="text-zalama-blue" />
                Notifications
              </h1>
              <p className="text-zalama-text-secondary mt-1">
                {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 text-zalama-text-secondary hover:text-zalama-text transition-colors rounded-lg hover:bg-zalama-bg-light disabled:opacity-50"
              title="Actualiser"
            >
              <IconRefresh size={20} />
            </button>
          </div>
        </div>

        {/* Filtres et actions */}
        <div className="bg-zalama-card border border-zalama-border rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filtres */}
            <div className="flex items-center gap-2">
              <span className="text-zalama-text-secondary text-sm">Filtrer :</span>
              {(['all', 'unread', 'read'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-zalama-blue text-white'
                      : 'bg-zalama-bg-light text-zalama-text-secondary hover:text-zalama-text'
                  }`}
                >
                  {filterType === 'all' ? 'Toutes' : 
                   filterType === 'unread' ? 'Non lues' : 'Lues'}
                </button>
              ))}
            </div>

            {/* Actions en lot */}
            {selectedNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-zalama-text-secondary text-sm">
                  {selectedNotifications.length} sélectionné{selectedNotifications.length > 1 ? 's' : ''}
                </span>
                <button
                  onClick={handleBulkMarkAsRead}
                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition-colors"
                >
                  <IconCheck size={16} />
                  Marquer comme lues
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition-colors"
                >
                  <IconTrash size={16} />
                  Supprimer
                </button>
              </div>
            )}

            {/* Actions globales */}
            {selectedNotifications.length === 0 && unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 px-3 py-1 bg-zalama-blue text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
              >
                <IconCheck size={16} />
                Tout marquer comme lu
              </button>
            )}
          </div>
        </div>

        {/* Liste des notifications */}
        <div className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-red-400">
              {error}
            </div>
          )}

          {loading && notifications.length === 0 && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zalama-blue mx-auto mb-4"></div>
              <p className="text-zalama-text-secondary">Chargement des notifications...</p>
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="text-center py-12">
              <IconBell size={64} className="mx-auto mb-4 text-zalama-text-muted opacity-50" />
              <h3 className="text-xl font-semibold text-zalama-text mb-2">Aucune notification</h3>
              <p className="text-zalama-text-secondary">
                {filter === 'all' 
                  ? 'Vous n\'avez aucune notification pour le moment.'
                  : filter === 'unread'
                  ? 'Toutes vos notifications ont été lues.'
                  : 'Vous n\'avez aucune notification lue.'}
              </p>
            </div>
          )}

          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-zalama-card border border-zalama-border rounded-lg p-4 hover:bg-zalama-card-hover transition-colors cursor-pointer ${
                !notification.lu ? 'border-l-4 border-l-zalama-blue' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox pour sélection multiple */}
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={(e) => {
                    e.stopPropagation()
                    handleSelectNotification(notification.id)
                  }}
                  className="mt-1 w-4 h-4 text-zalama-blue bg-zalama-bg-light border-zalama-border rounded focus:ring-zalama-blue focus:ring-2"
                />

                {/* Icône de type */}
                <div className="flex-shrink-0 mt-1">
                  <span className={`text-2xl ${notificationService.getNotificationColor(notification.type)}`}>
                    {notificationService.getNotificationIcon(notification.type)}
                  </span>
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${!notification.lu ? 'text-zalama-text' : 'text-zalama-text-secondary'}`}>
                        {notification.titre}
                      </h3>
                      <p className={`mt-1 ${!notification.lu ? 'text-zalama-text' : 'text-zalama-text-muted'}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-zalama-text-muted">
                          {notificationService.formatNotificationDate(notification.date_creation)}
                        </span>
                        {notification.type && (
                          <span className="text-xs px-2 py-1 bg-zalama-bg-light text-zalama-text-secondary rounded-full">
                            {notification.type}
                          </span>
                        )}
                        {!notification.lu && (
                          <span className="text-xs px-2 py-1 bg-zalama-blue text-white rounded-full">
                            Nouveau
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 ml-4">
                      {!notification.lu && (
                        <div className="w-2 h-2 bg-zalama-blue rounded-full"></div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="p-1 text-zalama-text-muted hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Bouton charger plus */}
          {hasMore && (
            <div className="text-center py-8">
              <button
                onClick={loadMoreNotifications}
                disabled={loading}
                className="px-6 py-2 bg-zalama-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Chargement...' : 'Charger plus de notifications'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
