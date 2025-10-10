/**
 * Mock customer data for workshop exercises
 * Used throughout the Customer Intelligence Dashboard components
 */

import type { CustomerHealthData } from '@/lib/healthCalculator';

export interface Customer {
  id: string;
  name: string;
  company: string;
  healthScore: number;
  email?: string;
  subscriptionTier?: 'basic' | 'premium' | 'enterprise';
  domains?: string[]; // Customer websites to health check
  createdAt?: string;
  updatedAt?: string;
  annualContractValue?: number; // ARR in USD, used for alert prioritization
  healthData?: CustomerHealthData; // Detailed health calculation data
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Acme Corp',
    healthScore: 85,
    email: 'john.smith@acmecorp.com',
    subscriptionTier: 'premium',
    domains: ['acmecorp.com', 'portal.acmecorp.com'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    annualContractValue: 50000,
    healthData: {
      payment: {
        daysSinceLastPayment: 5,
        averagePaymentDelay: 2,
        overdueAmount: 0,
        totalContractValue: 50000
      },
      engagement: {
        loginFrequency: 4.5,
        featureUsageCount: 65,
        lastLoginDays: 2
      },
      contract: {
        daysUntilRenewal: 245,
        contractValue: 50000,
        hasRecentUpgrade: true,
        autoRenewEnabled: true
      },
      support: {
        averageResolutionTime: 18,
        satisfactionScore: 4.5,
        escalationCount: 0,
        openTicketCount: 1
      }
    }
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'TechStart Inc',
    healthScore: 45,
    email: 'sarah@techstart.io',
    subscriptionTier: 'basic',
    domains: ['techstart.io'],
    createdAt: '2024-01-20T14:22:00Z',
    updatedAt: '2024-01-20T14:22:00Z',
    annualContractValue: 15000,
    healthData: {
      payment: {
        daysSinceLastPayment: 15,
        averagePaymentDelay: 8,
        overdueAmount: 1200,
        totalContractValue: 15000
      },
      engagement: {
        loginFrequency: 1.5,
        featureUsageCount: 25,
        lastLoginDays: 12
      },
      contract: {
        daysUntilRenewal: 45,
        contractValue: 15000,
        hasRecentUpgrade: false,
        autoRenewEnabled: false
      },
      support: {
        averageResolutionTime: 52,
        satisfactionScore: 3.0,
        escalationCount: 2,
        openTicketCount: 3
      }
    }
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Global Solutions',
    healthScore: 15,
    email: 'mbrown@globalsolutions.com',
    subscriptionTier: 'basic',
    domains: ['globalsolutions.com', 'api.globalsolutions.com', 'cdn.globalsolutions.com'],
    createdAt: '2024-01-25T09:45:00Z',
    updatedAt: '2024-01-25T09:45:00Z',
    annualContractValue: 12000,
    healthData: {
      payment: {
        daysSinceLastPayment: 45,
        averagePaymentDelay: 22,
        overdueAmount: 4500,
        totalContractValue: 12000
      },
      engagement: {
        loginFrequency: 0.3,
        featureUsageCount: 8,
        lastLoginDays: 38
      },
      contract: {
        daysUntilRenewal: 18,
        contractValue: 12000,
        hasRecentUpgrade: false,
        autoRenewEnabled: false
      },
      support: {
        averageResolutionTime: 96,
        satisfactionScore: 1.5,
        escalationCount: 5,
        openTicketCount: 7
      }
    }
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'Innovation Labs',
    healthScore: 92,
    email: 'emily.davis@innovationlabs.tech',
    subscriptionTier: 'enterprise',
    domains: ['innovationlabs.tech', 'app.innovationlabs.tech'],
    createdAt: '2024-01-10T16:18:00Z',
    updatedAt: '2024-01-10T16:18:00Z',
    annualContractValue: 120000,
    healthData: {
      payment: {
        daysSinceLastPayment: 0,
        averagePaymentDelay: 0,
        overdueAmount: 0,
        totalContractValue: 120000
      },
      engagement: {
        loginFrequency: 8.2,
        featureUsageCount: 85,
        lastLoginDays: 0
      },
      contract: {
        daysUntilRenewal: 320,
        contractValue: 120000,
        hasRecentUpgrade: true,
        autoRenewEnabled: true
      },
      support: {
        averageResolutionTime: 12,
        satisfactionScore: 5.0,
        escalationCount: 0,
        openTicketCount: 0
      }
    }
  },
  {
    id: '5',
    name: 'David Wilson',
    company: 'Future Systems',
    healthScore: 60,
    email: 'dwilson@futuresystems.net',
    subscriptionTier: 'premium',
    domains: ['futuresystems.net', 'secure.futuresystems.net'],
    createdAt: '2024-01-30T11:05:00Z',
    updatedAt: '2024-01-30T11:05:00Z',
    annualContractValue: 35000,
    healthData: {
      payment: {
        daysSinceLastPayment: 12,
        averagePaymentDelay: 6,
        overdueAmount: 800,
        totalContractValue: 35000
      },
      engagement: {
        loginFrequency: 2.1,
        featureUsageCount: 42,
        lastLoginDays: 8
      },
      contract: {
        daysUntilRenewal: 120,
        contractValue: 35000,
        hasRecentUpgrade: false,
        autoRenewEnabled: true
      },
      support: {
        averageResolutionTime: 36,
        satisfactionScore: 3.5,
        escalationCount: 1,
        openTicketCount: 2
      }
    }
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    company: 'Smart Ventures',
    healthScore: 73,
    email: 'lisa@smartventures.co',
    subscriptionTier: 'premium',
    domains: ['smartventures.co'],
    createdAt: '2024-02-01T13:40:00Z',
    updatedAt: '2024-02-01T13:40:00Z',
    annualContractValue: 45000,
    healthData: {
      payment: {
        daysSinceLastPayment: 8,
        averagePaymentDelay: 3,
        overdueAmount: 0,
        totalContractValue: 45000
      },
      engagement: {
        loginFrequency: 3.2,
        featureUsageCount: 52,
        lastLoginDays: 4
      },
      contract: {
        daysUntilRenewal: 180,
        contractValue: 45000,
        hasRecentUpgrade: false,
        autoRenewEnabled: true
      },
      support: {
        averageResolutionTime: 28,
        satisfactionScore: 4.0,
        escalationCount: 0,
        openTicketCount: 1
      }
    }
  },
  {
    id: '7',
    name: 'Robert Chen',
    company: 'DataFlow Analytics',
    healthScore: 88,
    email: 'robert@dataflow.ai',
    subscriptionTier: 'enterprise',
    domains: ['dataflow.ai', 'analytics.dataflow.ai', 'api.dataflow.ai'],
    createdAt: '2024-01-12T08:15:00Z',
    updatedAt: '2024-01-12T08:15:00Z',
    annualContractValue: 95000,
    healthData: {
      payment: {
        daysSinceLastPayment: 2,
        averagePaymentDelay: 0,
        overdueAmount: 0,
        totalContractValue: 95000
      },
      engagement: {
        loginFrequency: 6.8,
        featureUsageCount: 75,
        lastLoginDays: 1
      },
      contract: {
        daysUntilRenewal: 280,
        contractValue: 95000,
        hasRecentUpgrade: true,
        autoRenewEnabled: true
      },
      support: {
        averageResolutionTime: 15,
        satisfactionScore: 4.7,
        escalationCount: 0,
        openTicketCount: 0
      }
    }
  },
  {
    id: '8',
    name: 'Maria Rodriguez',
    company: 'CloudFirst Solutions',
    healthScore: 35,
    email: 'maria.rodriguez@cloudfirst.com',
    subscriptionTier: 'basic',
    domains: ['cloudfirst.com', 'support.cloudfirst.com'],
    createdAt: '2024-01-28T15:30:00Z',
    updatedAt: '2024-01-28T15:30:00Z',
    annualContractValue: 18000,
    healthData: {
      payment: {
        daysSinceLastPayment: 38,
        averagePaymentDelay: 15,
        overdueAmount: 3000,
        totalContractValue: 18000
      },
      engagement: {
        loginFrequency: 0.8,
        featureUsageCount: 18,
        lastLoginDays: 22
      },
      contract: {
        daysUntilRenewal: 65,
        contractValue: 18000,
        hasRecentUpgrade: false,
        autoRenewEnabled: false
      },
      support: {
        averageResolutionTime: 78,
        satisfactionScore: 2.5,
        escalationCount: 3,
        openTicketCount: 5
      }
    }
  }
];

export default mockCustomers;