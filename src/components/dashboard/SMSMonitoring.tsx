'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

interface SMSAnalytics {
  totalSent: number
  successRate: number
  averageResponseTime: number
  errorsByType: Record<string, number>
  totalErrors: number
  lastUpdated: Date
}

interface SMSMonitoringProps {
  className?: string
}

export default function SMSMonitoring({ className }: SMSMonitoringProps) {
  const [analytics, setAnalytics] = useState<SMSAnalytics | null>(null)
  const [healthStatus, setHealthStatus] = useState<'HEALTHY' | 'WARNING' | 'CRITICAL'>('HEALTHY')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sms/analytics')
      const data = await response.json()
      
      if (data.success) {
        setAnalytics(data.data.analytics)
        setHealthStatus(data.data.healthStatus)
        setError(null)
      } else {
        setError('Erreur lors de la récupération des données')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const resetAnalytics = async () => {
    try {
      const response = await fetch('/api/sms/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      })
      
      if (response.ok) {
        fetchAnalytics()
      }
    } catch (err) {
      console.error('Erreur reset analytics:', err)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-green-500'
      case 'WARNING': return 'bg-yellow-500'
      case 'CRITICAL': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY': return <CheckCircle className="h-4 w-4" />
      case 'WARNING': return <AlertTriangle className="h-4 w-4" />
      case 'CRITICAL': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Monitoring SMS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Monitoring SMS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Monitoring SMS
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${getHealthColor(healthStatus)} text-white`}
            >
              {getHealthIcon(healthStatus)}
              {healthStatus}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAnalytics}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {analytics && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total envoyés</span>
                  <span className="font-semibold">{analytics.totalSent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Taux de succès</span>
                  <span className="font-semibold">{analytics.successRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Erreurs totales</span>
                  <span className="font-semibold text-red-600">{analytics.totalErrors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Temps moyen</span>
                  <span className="font-semibold">{analytics.averageResponseTime.toFixed(0)}ms</span>
                </div>
              </div>
            </div>

            {Object.keys(analytics.errorsByType).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Types d'erreurs</h4>
                <div className="space-y-1">
                  {Object.entries(analytics.errorsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{type}</span>
                      <Badge variant="destructive" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Dernière mise à jour</span>
                <span>{new Date(analytics.lastUpdated).toLocaleTimeString('fr-FR')}</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetAnalytics}
              className="w-full"
            >
              Réinitialiser les analytics
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
} 