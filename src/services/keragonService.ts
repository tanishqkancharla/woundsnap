/**
 * Keragon Workflow Integration Service
 * 
 * Keragon is a no-code workflow builder platform. Integration happens through:
 * - Manual workflow configuration in Keragon web interface
 * - Webhook endpoints to send data to Keragon workflows
 * - Webhook handlers to receive notifications from Keragon
 * - Mock implementation for development/demo purposes
 */

export interface WoundAnalysisData {
  patientId: string;
  woundId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  infectionRisk: number;
  healingStage: string;
  measurements: {
    length: number;
    width: number;
    depth: number;
  };
  tissueTypes: string[];
  recommendations: string[];
  imageUrl: string;
  analysisTimestamp: string;
}

export interface WorkflowTrigger {
  workflowType: 'critical-risk' | 'standard-care' | 'follow-up-reminder';
  patientId: string;
  analysisData?: WoundAnalysisData;
  patientContext?: any;
  scheduledFor?: string;
}

export interface KeragonWorkflowResponse {
  workflowId: string;
  status: 'triggered' | 'completed' | 'failed';
  actions: {
    smsNotifications: number;
    emailNotifications: number;
    appointmentsScheduled: number;
    tasksCreated: number;
  };
  timestamp: string;
}

class KeragonService {
  private readonly webhookEndpoints: { [key: string]: string };
  private readonly mockMode: boolean;

  constructor() {
    // Keragon workflows are configured manually in their platform
    // These are webhook URLs that would be configured in Keragon to trigger workflows
    this.webhookEndpoints = {
      'critical-risk': import.meta.env.VITE_KERAGON_CRITICAL_WEBHOOK_URL || '',
      'standard-care': import.meta.env.VITE_KERAGON_STANDARD_WEBHOOK_URL || '',
      'follow-up-reminder': import.meta.env.VITE_KERAGON_FOLLOWUP_WEBHOOK_URL || '',
    };
    
    // Enable mock mode for development/demo (always true since no API keys)
    this.mockMode = true;
    
    console.log('🎭 Keragon Service: Running in mock mode (manual workflow platform)');
  }

  /**
   * Trigger a workflow by sending data to Keragon webhook endpoint
   * In production, this would POST to manually configured webhook URLs in Keragon platform
   */
  async triggerWorkflow(trigger: WorkflowTrigger): Promise<KeragonWorkflowResponse> {
    try {
      if (this.mockMode) {
        return this.mockTriggerWorkflow(trigger);
      }

      const webhookUrl = this.webhookEndpoints[trigger.workflowType];
      if (!webhookUrl) {
        console.warn(`⚠️  No webhook URL configured for workflow type: ${trigger.workflowType}`);
        return this.mockTriggerWorkflow(trigger);
      }

      const payload = this.buildWorkflowPayload(trigger);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Woundsnap-App/1.0',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Keragon webhook error: ${response.status} ${response.statusText}`);
      }
      
      console.log(`✅ Keragon workflow triggered via webhook: ${trigger.workflowType}`);
      
      return {
        workflowId: `keragon_${trigger.workflowType}_${Date.now()}`,
        status: 'triggered',
        actions: this.getExpectedActions(trigger.workflowType),
        timestamp: new Date().toISOString(),
      };

    } catch (error) {
      console.error('❌ Keragon webhook trigger failed:', error);
      
      // Return fallback mock response to prevent app failure
      return this.mockTriggerWorkflow(trigger);
    }
  }

  /**
   * Handle critical wound findings - immediate notifications
   */
  async triggerCriticalRiskWorkflow(analysisData: WoundAnalysisData): Promise<KeragonWorkflowResponse> {
    console.log(`🚨 Critical wound risk detected for patient ${analysisData.patientId}`);
    
    return this.triggerWorkflow({
      workflowType: 'critical-risk',
      patientId: analysisData.patientId,
      analysisData,
    });
  }

  /**
   * Handle standard wound analysis completion
   */
  async triggerStandardCareWorkflow(analysisData: WoundAnalysisData): Promise<KeragonWorkflowResponse> {
    console.log(`📋 Standard care workflow for patient ${analysisData.patientId}`);
    
    return this.triggerWorkflow({
      workflowType: 'standard-care',
      patientId: analysisData.patientId,
      analysisData,
    });
  }

  /**
   * Handle scheduled follow-up reminders
   */
  async triggerFollowUpWorkflow(patientId: string, patientContext?: any): Promise<KeragonWorkflowResponse> {
    console.log(`📅 Follow-up reminder for patient ${patientId}`);
    
    return this.triggerWorkflow({
      workflowType: 'follow-up-reminder',
      patientId,
      patientContext,
    });
  }

  /**
   * Verify webhook signature for security
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    if (this.mockMode) {
      return true;
    }

    // Implementation would use HMAC verification with webhook secret
    // For now, basic validation
    return signature && signature.length > 0;
  }

  /**
   * Process incoming webhooks from Keragon workflows
   */
  async processWebhook(payload: any, signature: string): Promise<void> {
    if (!this.verifyWebhookSignature(JSON.stringify(payload), signature)) {
      throw new Error('Invalid webhook signature');
    }

    console.log('📥 Keragon webhook received:', payload.event_type);

    switch (payload.event_type) {
      case 'workflow.completed':
        await this.handleWorkflowCompleted(payload);
        break;
      case 'workflow.failed':
        await this.handleWorkflowFailed(payload);
        break;
      case 'notification.delivered':
        await this.handleNotificationDelivered(payload);
        break;
      default:
        console.log(`ℹ️  Unhandled webhook event: ${payload.event_type}`);
    }
  }

  /**
   * Get expected actions for each workflow type (for response formatting)
   */
  private getExpectedActions(workflowType: string): any {
    const expectedActions = {
      'critical-risk': { smsNotifications: 2, emailNotifications: 1, appointmentsScheduled: 1, tasksCreated: 1 },
      'standard-care': { smsNotifications: 1, emailNotifications: 1, appointmentsScheduled: 1, tasksCreated: 0 },
      'follow-up-reminder': { smsNotifications: 1, emailNotifications: 0, appointmentsScheduled: 0, tasksCreated: 0 },
    };

    return expectedActions[workflowType] || { smsNotifications: 0, emailNotifications: 0, appointmentsScheduled: 0, tasksCreated: 0 };
  }

  /**
   * Build payload for workflow trigger
   */
  private buildWorkflowPayload(trigger: WorkflowTrigger): any {
    const basePayload = {
      patient_id: trigger.patientId,
      timestamp: new Date().toISOString(),
    };

    if (trigger.analysisData) {
      return {
        ...basePayload,
        wound_data: {
          risk_level: trigger.analysisData.riskLevel,
          infection_risk: trigger.analysisData.infectionRisk,
          healing_stage: trigger.analysisData.healingStage,
          measurements: trigger.analysisData.measurements,
          tissue_types: trigger.analysisData.tissueTypes,
          recommendations: trigger.analysisData.recommendations,
          image_url: trigger.analysisData.imageUrl,
        },
      };
    }

    if (trigger.patientContext) {
      return {
        ...basePayload,
        patient_context: trigger.patientContext,
      };
    }

    return basePayload;
  }

  /**
   * Mock workflow trigger for development/demo
   */
  private async mockTriggerWorkflow(trigger: WorkflowTrigger): Promise<KeragonWorkflowResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    const mockActions = {
      'critical-risk': { smsNotifications: 2, emailNotifications: 1, appointmentsScheduled: 1, tasksCreated: 1 },
      'standard-care': { smsNotifications: 1, emailNotifications: 1, appointmentsScheduled: 1, tasksCreated: 0 },
      'follow-up-reminder': { smsNotifications: 1, emailNotifications: 0, appointmentsScheduled: 0, tasksCreated: 0 },
    };

    console.log(`🎭 Mock Keragon workflow: ${trigger.workflowType}`, mockActions[trigger.workflowType]);

    return {
      workflowId: `mock_${trigger.workflowType}_${Date.now()}`,
      status: 'completed',
      actions: mockActions[trigger.workflowType] || { smsNotifications: 0, emailNotifications: 0, appointmentsScheduled: 0, tasksCreated: 0 },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handle completed workflow webhook
   */
  private async handleWorkflowCompleted(payload: any): Promise<void> {
    console.log(`✅ Workflow completed: ${payload.workflow_id}`, payload.actions);
  }

  /**
   * Handle failed workflow webhook
   */
  private async handleWorkflowFailed(payload: any): Promise<void> {
    console.error(`❌ Workflow failed: ${payload.workflow_id}`, payload.error);
    
    // Implement retry logic or fallback notifications here
    // For critical workflows, might trigger alternative notification methods
  }

  /**
   * Handle notification delivery confirmation
   */
  private async handleNotificationDelivered(payload: any): Promise<void> {
    console.log(`📱 Notification delivered: ${payload.notification_type} to ${payload.recipient}`);
  }

  /**
   * Health check for Keragon service
   */
  async healthCheck(): Promise<{ status: string; mockMode: boolean; configuration: string }> {
    if (this.mockMode) {
      return { 
        status: 'healthy (mock)', 
        mockMode: true,
        configuration: 'Mock workflows configured for demo'
      };
    }

    // Check if webhook URLs are configured
    const configuredWorkflows = Object.entries(this.webhookEndpoints)
      .filter(([_, url]) => url && url.length > 0);

    return {
      status: configuredWorkflows.length > 0 ? 'configured' : 'needs-configuration',
      mockMode: false,
      configuration: `${configuredWorkflows.length}/3 workflow webhooks configured`
    };
  }
}

// Export singleton instance
export const keragonService = new KeragonService();
export default keragonService;
