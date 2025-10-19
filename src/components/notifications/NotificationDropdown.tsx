"use client"

import { useState, useRef, useEffect } from 'react'
import { IconBell, IconX, IconCheck, IconTrash, IconRefresh } from '@tabler/icons-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface Notification {
  id: number;
  employee_id: number;
  titre: string;
  message: string;
  type: string;
  priorite: string;
  lu: boolean;
  date_creation: string;
  date_lecture?: string;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

interface NotificationDropdownProps {
  className?: string
}

export function NotificationDropdown({ className = '' }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // État des notifications
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Charger les notifications
  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      // Récupérer le token d'accès depuis localStorage
      const accessToken = localStorage.getItem('employee_access_token')
      
      if (!accessToken) {
        setError('Token d\'accès non trouvé')
        return
      }

      const response = await fetch('/api/notifications?action=list', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()

      if (data.success) {
        setNotifications(data.data.notifications)
      } else {
        setError(data.error || 'Erreur lors du chargement')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  // Charger le compteur de notifications non lues
  const loadUnreadCount = async () => {
    try {
      // Récupérer le token d'accès depuis localStorage
      const accessToken = localStorage.getItem('employee_access_token')
      
      if (!accessToken) {
        return
      }

      const response = await fetch('/api/notifications?action=unread-count', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()

      if (data.success) {
        setUnreadCount(data.data.unread_count)
      }
    } catch (err) {
      console.error('Erreur lors du chargement du compteur:', err)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Marquer comme lu
    try {
      // Récupérer le token d'accès depuis localStorage
      const accessToken = localStorage.getItem('employee_access_token')
      
      if (!accessToken) {
        return
      }

      await fetch('/api/notifications?action=mark-read', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ notification_id: notification.id })
      })
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err)
    }
  }

  const handleRefresh = async () => {
    await loadNotifications()
    await loadUnreadCount()
  }

  const handleDeleteNotification = async (id: number) => {
    try {
      // Récupérer le token d'accès depuis localStorage
      const accessToken = localStorage.getItem('employee_access_token')
      
      if (!accessToken) {
        return
      }

      await fetch('/api/notifications?action=delete', {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ notification_id: id })
      })
      setNotifications(prev => prev.filter(n => n.id !== id))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      // Récupérer le token d'accès depuis localStorage
      const accessToken = localStorage.getItem('employee_access_token')
      
      if (!accessToken) {
        return
      }

      await fetch('/api/notifications?action=mark-all-read', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json' 
        }
      })
      setUnreadCount(0)
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err)
    }
  }

  // Marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Charger les données au montage
  useEffect(() => {
    loadNotifications()
    loadUnreadCount()
  }, [])

  // Composant de la modale
  const ModalContent = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
    >
      <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="relative bg-[#010D3E]/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FF671E] to-[#FF8E53] bg-clip-text text-transparent">Notifications</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(false)}
            className="text-gray-300 hover:text-[#FFFFFF]"
            aria-label="Fermer les notifications"
          >
            <IconX size={24} />
          </motion.button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {loading && notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF671E] mx-auto mb-2"></div>
              <p className="text-gray-300">Chargement des notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-gray-300 text-center py-4">Aucune notification</p>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 bg-white/5 border border-[#FF671E]/20 rounded-lg text-gray-200 hover:bg-white/10 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{notification.titre}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.date_creation).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleNotificationClick(notification)}
                      className="p-1 text-gray-400 hover:text-[#FF671E] transition-colors"
                      aria-label="Marquer comme lu"
                    >
                      <IconCheck size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      aria-label="Supprimer la notification"
                    >
                      <IconTrash size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-zalama-bg-light"
        aria-label="Notifications"
      >
        <IconBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Modal de notifications avec portail simplifié */}
      <AnimatePresence>
        {isOpen && (
          <>
            {typeof document !== 'undefined' && createPortal(
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-0 flex items-center justify-center p-4"
                style={{ zIndex: 999999 }}
              >
                <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
                <div className="relative bg-[#010D3E]/90 backdrop-blur-sm rounded-2xl p-8 w-full max-w-lg shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#FF671E] to-[#FF8E53] bg-clip-text text-transparent">Notifications</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(false)}
                      className="text-gray-300 hover:text-[#FFFFFF]"
                      aria-label="Fermer les notifications"
                    >
                      <IconX size={24} />
                    </motion.button>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {loading && notifications.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF671E] mx-auto mb-2"></div>
                        <p className="text-gray-300">Chargement des notifications...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <p className="text-gray-300 text-center py-4">Aucune notification</p>
                    ) : (
                      notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="p-4 bg-white/5 border border-[#FF671E]/20 rounded-lg text-gray-200 hover:bg-white/10 transition-all shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{notification.titre}</p>
                              <p className="text-xs text-gray-400 mt-1">{notification.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.date_creation).toLocaleString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleNotificationClick(notification)}
                                className="p-1 text-gray-400 hover:text-[#FF671E] transition-colors"
                                aria-label="Marquer comme lu"
                              >
                                <IconCheck size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                aria-label="Supprimer la notification"
                              >
                                <IconTrash size={16} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>,
              document.body
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
