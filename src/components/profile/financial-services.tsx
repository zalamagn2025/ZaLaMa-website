"use client"

import { IconArrowRight } from "@tabler/icons-react"
import { useState, useRef, useEffect } from "react"
import { SalaryAdvanceForm } from "./salary-advance-form"

export function FinancialServices() {
  const [activeService, setActiveService] = useState<string | null>(null)

  // Données fictives pour la démonstration
  const userPhone = "+224 625 21 21 15"

  const services = [
    {
      id: "advance",
      title: "Avance sur salaire",
      description: "Obtenez une avance sur votre prochain salaire, pour vos imprevus et urgences financières",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-indigo-500">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <line x1="7" y1="15" x2="9" y2="15" />
          <line x1="11" y1="15" x2="13" y2="15" />
        </svg>
      ),
      maxpourcent: "25%",
      eligibility: "Disponible"
    },
    {
      id: "loan",
      title: "Conseil financier",
      description: "Obtenez des conseils financiers personnalisés pour gérer vos finances.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-green-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      maxpourcent: "50%",
      eligibility: "Disponible"
    },
    {
      id: "p2p",
      title: "Prêt entre particuliers",
      description: "Des prêts directs entre utilisateurs, à moindre coût pour les emprunteurs et rentables pour les prêteurs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-yellow-500">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      ),
      maxAmount: "25 000 000",
      eligibility: "Disponible"
    }
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Services financiers disponibles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div 
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors cursor-pointer"
            onClick={() => setActiveService(service.id)}
          >
            <div className="flex items-center mb-4">
              {service.icon}
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">{service.title}</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{service.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {service.id=="p2p" ? "Montant max" : "Pourcentage max"}
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">{
                    service.id=="p2p" ? service.maxAmount : service.maxpourcent
                    }</p>
              </div>
              <button className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                Demander <IconArrowRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeService && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800">
            {activeService === "advance" ? (
              <SalaryAdvanceForm onClose={() => setActiveService(null)} userPhone={userPhone} />
            ) : activeService === "loan" ? (
              <FinancialAdviceForm onClose={() => setActiveService(null)} />
            ) : (
              <ServiceForm serviceId={activeService} onClose={() => setActiveService(null)} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface ServiceFormProps {
  serviceId: string
  onClose: () => void
}

function FinancialAdviceForm({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Array<{text: string, sender: 'user' | 'bot', timestamp: Date}>>([
    {
      text: "Bonjour ! Je suis votre conseiller financier virtuel. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Options de conseil prédéfinies
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
    
    // Ajouter le message de l'utilisateur
    const userMessage = {
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setNewMessage("")
    setLoading(true)
    
    // Simuler une réponse du chatbot après un délai
    setTimeout(() => {
      let botResponse = ""
      
      // Logique simple pour générer des réponses basées sur des mots-clés
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
      
      setMessages(prev => [...prev, botMessage])
      setLoading(false)
    }, 1000)
  }

  const handleSuggestedQuestion = (question: string) => {
    setNewMessage(question)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Conseiller financier virtuel</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' 
                  ? 'text-indigo-200' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mb-2">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Questions suggérées :</p>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuestion(question)}
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Posez votre question financière..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          type="submit"
          disabled={loading || !newMessage.trim()}
          className="px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-70"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </form>
    </div>
  )
}

function ServiceForm({ serviceId, onClose }: ServiceFormProps) {
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const [duration, setDuration] = useState("1")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simuler une soumission
    setTimeout(() => {
      setLoading(false)
      onClose()
    }, 1500)
  }

  const getServiceTitle = () => {
    switch (serviceId) {
      case "p2p":
        return "Demande de prêt entre particuliers"
      default:
        return "Demande de service financier"
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{getServiceTitle()}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          &times;
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Montant demandé (GNF)
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ex: 500000"
              required
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Motif de la demande
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Expliquez brièvement pourquoi vous avez besoin de ce financement"
              required
            />
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Durée de remboursement (mois)
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            >
              <option value="1">1 mois</option>
              <option value="3">3 mois</option>
              <option value="6">6 mois</option>
              <option value="12">12 mois</option>
            </select>
          </div>

          <div className="flex items-center mt-6">
            <input
              id="terms"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              J&rsquo;accepte les conditions générales et je comprends les modalités de remboursement
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:opacity-70"
          >
            {loading ? "Traitement en cours..." : "Soumettre la demande"}
          </button>
        </div>
      </form>
    </div>
  )
} 