export const reports = [
  {
    id: '1',
    title: 'Weekly Progress Report - Week 12',
    type: 'progress',
    projectId: '1',
    createdBy: 'mgr-001',
    createdAt: '2024-03-22T00:00:00Z',
    status: 'completed',
    summary: 'Foundation work completed ahead of schedule. Steel frame installation progressing well.',
    details: {
      tasksCompleted: 12,
      tasksInProgress: 8,
      tasksOverdue: 1,
      budgetSpent: 9750000,
      budgetRemaining: 5250000
    }
  },
  {
    id: '2',
    title: 'Budget Analysis - Q1 2024',
    type: 'budget',
    projectId: '1',
    createdBy: 'mgr-001',
    createdAt: '2024-03-31T00:00:00Z',
    status: 'completed',
    summary: 'Project is 65% complete with 65% of budget utilized. On track for completion within budget.',
    details: {
      budgetTotal: 15000000,
      budgetSpent: 9750000,
      budgetRemaining: 5250000,
      percentageSpent: 65,
      projectedOverrun: 0
    }
  },
  {
    id: '3',
    title: 'Safety Inspection Report',
    type: 'safety',
    projectId: '1',
    createdBy: 'mgr-001',
    createdAt: '2024-03-15T00:00:00Z',
    status: 'completed',
    summary: 'All safety protocols being followed. Minor violations corrected immediately.',
    details: {
      inspectionDate: '2024-03-15',
      violations: 2,
      violationsResolved: 2,
      safetyScore: 98,
      recommendations: 3
    }
  },
  {
    id: '4',
    title: 'Monthly Progress Report - March',
    type: 'progress',
    projectId: '2',
    createdBy: 'mgr-002',
    createdAt: '2024-03-31T00:00:00Z',
    status: 'completed',
    summary: 'Site preparation completed. Concrete pouring phase initiated.',
    details: {
      tasksCompleted: 8,
      tasksInProgress: 5,
      tasksOverdue: 0,
      budgetSpent: 11250000,
      budgetRemaining: 13750000
    }
  },
  {
    id: '5',
    title: 'Environmental Compliance Report',
    type: 'environmental',
    projectId: '2',
    createdBy: 'mgr-002',
    createdAt: '2024-03-20T00:00:00Z',
    status: 'completed',
    summary: 'All environmental regulations being met. No violations reported.',
    details: {
      complianceScore: 100,
      violations: 0,
      auditDate: '2024-03-20',
      nextAuditDate: '2024-06-20'
    }
  },
  {
    id: '6',
    title: 'Quality Control Assessment',
    type: 'quality',
    projectId: '3',
    createdBy: 'mgr-003',
    createdAt: '2024-03-10T00:00:00Z',
    status: 'completed',
    summary: 'Initial quality assessments completed. Minor adjustments needed.',
    details: {
      qualityScore: 87,
      issuesFound: 3,
      issuesResolved: 2,
      recommendedActions: 4
    }
  },
  {
    id: '7',
    title: 'Project Completion Report',
    type: 'completion',
    projectId: '4',
    createdBy: 'mgr-004',
    createdAt: '2023-12-20T00:00:00Z',
    status: 'completed',
    summary: 'Mall renovation project completed successfully within budget and timeline.',
    details: {
      finalBudget: 11800000,
      budgetVariance: -200000,
      timelineVariance: -5,
      customerSatisfaction: 95,
      defectsReported: 2
    }
  },
  {
    id: '8',
    title: 'Bridge Construction Status',
    type: 'progress',
    projectId: '5',
    createdBy: 'mgr-005',
    createdAt: '2024-03-25T00:00:00Z',
    status: 'completed',
    summary: 'Bridge deck installation 80% complete. Safety barrier installation pending.',
    details: {
      tasksCompleted: 15,
      tasksInProgress: 3,
      tasksOverdue: 0,
      budgetSpent: 14400000,
      budgetRemaining: 3600000
    }
  },
  {
    id: '9',
    title: 'Traffic Impact Analysis',
    type: 'traffic',
    projectId: '5',
    createdBy: 'mgr-005',
    createdAt: '2024-02-15T00:00:00Z',
    status: 'completed',
    summary: 'Traffic flow analysis completed. Minimal impact on local traffic expected.',
    details: {
      trafficReduction: 15,
      alternativeRoutes: 3,
      impactDuration: 30,
      mitigationMeasures: 5
    }
  },
  {
    id: '10',
    title: 'Hospital Extension Feasibility',
    type: 'feasibility',
    projectId: '6',
    createdBy: 'mgr-001',
    createdAt: '2024-03-18T00:00:00Z',
    status: 'completed',
    summary: 'Environmental impact study initiated. Preliminary results positive.',
    details: {
      feasibilityScore: 85,
      riskFactors: 3,
      mitigationStrategies: 5,
      approvalStatus: 'pending'
    }
  }
];