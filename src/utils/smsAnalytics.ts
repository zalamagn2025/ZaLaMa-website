interface SMSAnalytics {
  totalSent: number;
  successRate: number;
  averageResponseTime: number;
  errorsByType: Record<string, number>;
  totalErrors: number;
  lastUpdated: Date;
}

class SMSAnalyticsService {
  private analytics: SMSAnalytics = {
    totalSent: 0,
    successRate: 0,
    averageResponseTime: 0,
    errorsByType: {},
    totalErrors: 0,
    lastUpdated: new Date()
  };

  private responseTimes: number[] = [];
  private successfulSends = 0;

  trackSMSSend(result: any, duration: number): void {
    this.analytics.totalSent++;
    this.responseTimes.push(duration);
    
    if (result.success) {
      this.successfulSends++;
    } else {
      this.analytics.totalErrors++;
      this.trackError(result.error);
    }
    
    this.updateSuccessRate();
    this.updateAverageResponseTime();
    this.analytics.lastUpdated = new Date();
    
    // Log pour monitoring
    this.logAnalytics();
  }

  private updateSuccessRate(): void {
    if (this.analytics.totalSent > 0) {
      this.analytics.successRate = (this.successfulSends / this.analytics.totalSent) * 100;
    }
  }

  private trackError(error: string | undefined): void {
    const errorType = this.categorizeError(error);
    this.analytics.errorsByType[errorType] = (this.analytics.errorsByType[errorType] || 0) + 1;
  }

  private categorizeError(error: string | undefined): string {
    if (!error) {
      return 'UNKNOWN_ERROR';
    }
    
    if (error.includes('UNAUTHORIZED') || error.includes('INVALID_CREDENTIALS')) {
      return 'AUTH_ERROR';
    }
    if (error.includes('INVALID_PHONE') || error.includes('FORMAT')) {
      return 'PHONE_FORMAT_ERROR';
    }
    if (error.includes('SERVICE_UNAVAILABLE') || error.includes('TIMEOUT')) {
      return 'SERVICE_ERROR';
    }
    if (error.includes('QUOTA') || error.includes('LIMIT')) {
      return 'QUOTA_ERROR';
    }
    return 'UNKNOWN_ERROR';
  }

  private updateAverageResponseTime(): void {
    if (this.responseTimes.length > 0) {
      const sum = this.responseTimes.reduce((a, b) => a + b, 0);
      this.analytics.averageResponseTime = sum / this.responseTimes.length;
    }
  }

  private logAnalytics(): void {
    /*console.log('📊 SMS Analytics:', {
      ...this.analytics,
      successRate: `${this.analytics.successRate.toFixed(2)*/}%`,
      averageResponseTime: `${this.analytics.averageResponseTime.toFixed(2)}ms`
    });
  }

  getAnalytics(): SMSAnalytics {
    return { 
      ...this.analytics,
      successRate: Number(this.analytics.successRate.toFixed(2)),
      averageResponseTime: Number(this.analytics.averageResponseTime.toFixed(2))
    };
  }

  resetAnalytics(): void {
    this.analytics = {
      totalSent: 0,
      successRate: 0,
      averageResponseTime: 0,
      errorsByType: {},
      totalErrors: 0,
      lastUpdated: new Date()
    };
    this.responseTimes = [];
    this.successfulSends = 0;
  }

  getHealthStatus(): 'HEALTHY' | 'WARNING' | 'CRITICAL' {
    if (this.analytics.successRate >= 95) return 'HEALTHY';
    if (this.analytics.successRate >= 80) return 'WARNING';
    return 'CRITICAL';
  }
}

export const smsAnalytics = new SMSAnalyticsService(); 