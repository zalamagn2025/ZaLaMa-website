"use client"

import { IconX } from "@tabler/icons-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface AIProps {
  onClose: () => void
}

export function AI({ onClose }: AIProps) {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot'; timestamp: Date }>>([
    {
      text: "Bonjour ! Je suis votre conseiller financier virtuel. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const conversations = [
    {
      id: "conv1",
      title: "Budget mensuel",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      preview: "Comment établir un budget mensuel efficace ?"
    },
    {
      id: "conv2",
      title: "Épargne",
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      preview: "Quelles sont les meilleures options d'épargne en Guinée ?"
    },
    {
      id: "conv3",
      title: "Investissement immobilier",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      preview: "Comment investir dans l'immobilier à Conakry ?"
    }
  ]

  const suggestedQuestions = [
    "Comment établir un budget mensuel ?",
    "Comment économiser pour un projet ?",
    "Comment gérer mes dettes ?",
    "Quelles sont les meilleures options d'épargne ?",
    "Comment préparer ma retraite ?"
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const userMessage = {
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")
    setLoading(true)

    setTimeout(() => {
      let botResponse = ""
      const lowerCaseMessage = newMessage.toLowerCase()

      if (lowerCaseMessage.includes("budget")) {
        botResponse = "Pour établir un budget efficace, commencez par lister tous vos revenus et dépenses mensuels. Classez vos dépenses par catégories (logement, alimentation, transport, etc.) et identifiez les domaines où vous pourriez réduire vos dépenses. Essayez de suivre la règle 50/30/20 : 50% pour les besoins essentiels, 30% pour les désirs, et 20% pour l'épargne."
      } else if (lowerCaseMessage.includes("dette") || lowerCaseMessage.includes("crédit")) {
        botResponse = "Pour gérer efficacement vos dettes, commencez par les lister toutes avec leurs taux d'intérêt. Concentrez-vous d'abord sur le remboursement des dettes à taux d'intérêt élevé tout en maintenant les paiements minimums sur les autres. Envisagez de négocier avec vos créanciers pour obtenir de meilleures conditions ou un plan de remboursement adapté."
      } else if (lowerCaseMessage.includes("épargne") || lowerCaseMessage.includes("économiser")) {
        botResponse = "Pour développer votre épargne, fixez-vous un objectif clair et mettez en place un virement automatique vers un compte d'épargne dès réception de votre salaire. Commencez par constituer un fonds d'urgence équivalent à 3-6 mois de dépenses. Ensuite, diversifiez votre épargne selon vos objectifs à court, moyen et long terme."
      } else if (lowerCaseMessage.includes("investir") || lowerCaseMessage.includes("investissement")) {
        botResponse = "L'investissement est un excellent moyen de faire fructifier votre argent. En Guinée, vous pouvez envisager des placements dans l'immobilier, les obligations d'État, ou les dépôts à terme bancaires. Pour les investissements plus risqués comme les actions, assurez-vous de bien comprendre les marchés ou consultez un conseiller financier professionnel."
      } else if (lowerCaseMessage.includes("retraite")) {
        botResponse = "Pour préparer votre retraite, commencez tôt ! Renseignez-vous sur les régimes de retraite disponibles en Guinée et complétez-les par une épargne personnelle. Diversifiez vos sources de revenus futurs et envisagez des investissements à long terme comme l'immobilier qui pourra générer des revenus locatifs."
      } else {
        botResponse = "Merci pour votre question. Pour vous donner un conseil personnalisé, j'aurais besoin de plus d'informations sur votre situation financière actuelle. Pourriez-vous me parler de vos revenus, dépenses et objectifs financiers ?"
      }

      const botMessage = {
        text: botResponse,
        sender: 'bot' as const,
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, botMessage])
      setLoading(false)
    }, 1000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setNewMessage(question)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
  }

  const loadConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
    if (conversationId === "conv1") {
      setMessages([
        {
          text: "Bonjour ! Je suis votre conseiller financier virtuel. Comment puis-je vous aider aujourd'hui ?",
          sender: 'bot',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000)
        },
        {
          text: "Comment établir un budget mensuel efficace ?",
          sender: 'user',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 4 * 60 * 1000)
        },
        {
          text: "Pour établir un budget efficace, commencez par lister tous vos revenus et dépenses mensuels. Classez vos dépenses par catégories (logement, alimentation, transport, etc.) et identifiez les domaines où vous pourriez réduire vos dépenses. Essayez de suivre la règle 50/30/20 : 50% pour les besoins essentiels, 30% pour les désirs, et 20% pour l'épargne.",
          sender: 'bot',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 - 3 * 60 * 1000)
        }
      ])
    } else if (conversationId === "conv2") {
      setMessages([
        {
          text: "Bonjour ! Je suis votre conseiller financier virtuel. Comment puis-je vous aider aujourd'hui ?",
          sender: 'bot',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 10 * 60 * 1000)
        },
        {
          text: "Quelles sont les meilleures options d'épargne en Guinée ?",
          sender: 'user',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 9 * 60 * 1000)
        },
        {
          text: "En Guinée, vous avez plusieurs options d'épargne intéressantes. Les comptes d'épargne bancaires classiques offrent une sécurité mais des taux d'intérêt généralement bas. Les dépôts à terme peuvent offrir des taux plus élevés si vous acceptez de bloquer votre argent pendant une période déterminée. Les tontines sont également populaires pour l'épargne collective. Pour une épargne à long terme, envisagez les investissements immobiliers qui peuvent générer des revenus locatifs.",
          sender: 'bot',
          timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 8 * 60 * 1000)
        }
      ])
    } else if (conversationId === "conv3") {
      setMessages([
        {
          text: "Bonjour ! Je suis votre conseiller financier virtuel. Comment puis-je vous aider aujourd'hui ?",
          sender: 'bot',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 - 15 * 60 * 1000)
        },
        {
          text: "Comment investir dans l'immobilier à Conakry ?",
          sender: 'user',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 - 14 * 60 * 1000)
        },
        {
          text: "Pour investir dans l'immobilier à Conakry, commencez par rechercher les quartiers en développement qui offrent un bon potentiel de plus-value. Assurez-vous de vérifier soigneusement les titres de propriété et les documents légaux. Considérez les propriétés à rénover qui peuvent offrir une meilleure rentabilité. Pour le financement, explorez les options de prêts immobiliers auprès des banques locales ou envisagez des partenariats avec d'autres investisseurs.",
          sender: 'bot',
          timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000 - 13 * 60 * 1000)
        }
      ])
    }
    setIsHistoryOpen(false)
  }

  const startNewConversation = () => {
    setActiveConversationId(null)
    setMessages([
      {
        text: "Bonjour ! Je suis votre conseiller financier virtuel. Comment puis-je vous aider aujourd'hui ?",
        sender: 'bot',
        timestamp: new Date()
      }
    ])
    setIsHistoryOpen(false)
  }

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-[calc(100vh-80px)] relative bg-white rounded-2xl shadow-sm border border-gray-100/10"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/10">
        <div className="flex items-center justify-center flex-1">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg font-semibold text-gray-900"
          >
            Conseiller financier virtuel
          </motion.h3>
        </div>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)" }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsHistoryOpen(true)}
            className="p-2 rounded-full hover:bg-blue-500/10 hover:ring-1 hover:ring-blue-400/20 hover:shadow-md transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF8E53]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)" }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full hover:bg-blue-500/10 hover:ring-1 hover:ring-blue-400/20 hover:shadow-md transition-all duration-200"
          >
            <IconX className="h-5 w-5 text-gray-900" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-6 bg-white/30 rounded-lg">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mx-2`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white'
                    : 'bg-white/50 text-gray-900 border border-gray-100/10'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/80' : 'text-gray-900/60'}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start mx-2"
            >
              <div className="bg-white/50 rounded-lg px-4 py-2 text-gray-900 border border-gray-100/10">
                <div className="flex space-x-1">
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className="w-2 h-2 bg-[#FF8E53] rounded-full"
                  />
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-[#FF8E53] rounded-full"
                  />
                  <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-[#FF8E53] rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-6 py-4"
      >
        <p className="text-sm text-gray-900/80 mb-3">Questions suggérées :</p>
        <div className="flex flex-wrap gap-3">
          {suggestedQuestions.map((question, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 103, 30, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestedQuestion(question)}
              className="text-xs bg-white/50 text-gray-900 px-3 py-1 rounded-full border border-gray-100/10 hover:border-[#FF8E53] hover:shadow-md transition-all duration-200"
            >
              {question}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <form onSubmit={handleSendMessage} className="flex items-center px-6 py-4">
        <motion.input
          whileFocus={{ scale: 1.02, boxShadow: "0 0 10px rgba(255, 103, 30, 0.3)" }}
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Posez votre question financière..."
          className="flex-1 px-5 py-3 bg-white/50 border border-gray-100/10 rounded-l-xl text-gray-900 placeholder-gray-900/50 focus:outline-none focus:ring-2 focus:ring-[#FF8E53] transition-all duration-200"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || !newMessage.trim()}
          className="px-4 py-3 bg-gradient-to-r from-[#FF671E] to-[#FF8E53] text-white rounded-r-xl hover:from-[#FF551E] hover:to-[#FF7E53] disabled:opacity-70 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </motion.button>
      </form>

      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white z-10 flex flex-col rounded-2xl shadow-xl border border-gray-100/10"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100/10">
              <h3 className="text-lg font-semibold text-gray-900">Historique des conversations</h3>
              <motion.button
                whileHover={{ scale: 1.1, boxShadow: "0 4px 12px rgba(59, 130, 246, 0.2)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsHistoryOpen(false)}
                className="p-2 rounded-full hover:bg-blue-500/10 hover:ring-1 hover:ring-blue-400/20 hover:shadow-md transition-all duration-200"
              >
                <IconX className="h-5 w-5 text-gray-900" />
              </motion.button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(255, 103, 30, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                onClick={startNewConversation}
                className="w-full flex items-center justify-between p-4 mb-3 rounded-lg border border-gray-100/10 hover:bg-orange-500/10 hover:ring-1 hover:ring-orange-400/20 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center border border-[#FF8E53]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF8E53]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Nouvelle conversation</p>
                    <p className="text-xs text-gray-900/60">Démarrer un nouveau chat</p>
                  </div>
                </div>
              </motion.button>
              {conversations.map((conversation) => (
                <motion.button
                  key={conversation.id}
                  whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(255, 103, 30, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => loadConversation(conversation.id)}
                  className={`w-full flex items-center justify-between p-4 mb-3 rounded-lg border ${
                    activeConversationId === conversation.id
                      ? 'border-[#FF8E53] bg-white/70'
                      : 'border-gray-100/10 hover:bg-orange-500/10 hover:ring-1 hover:ring-orange-400/20 hover:shadow-md transition-all duration-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center border border-gray-100/10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FF8E53]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-gray-900">{conversation.title}</p>
                      <p className="text-xs text-gray-900/60 truncate max-w-[200px]">{conversation.preview}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-900/60">{formatDate(conversation.date)}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}