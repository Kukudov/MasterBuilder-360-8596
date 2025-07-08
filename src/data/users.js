export const users = [
  // Admin Account
  {
    id: 'admin-001',
    name: 'System Administrator',
    email: 'admin@masterbuilder360.com',
    password: 'MB360Admin2024!',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    permissions: ['all']
  },
  
  // Manager Accounts (5)
  {
    id: 'mgr-001',
    name: 'John Mitchell',
    email: 'j.mitchell@masterbuilder360.com',
    password: 'MgrPass2024#1',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects', 'tasks', 'scheduling', 'budget', 'documents', 'reports', 'team']
  },
  {
    id: 'mgr-002',
    name: 'Sarah Johnson',
    email: 's.johnson@masterbuilder360.com',
    password: 'MgrPass2024#2',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects', 'tasks', 'scheduling', 'budget', 'documents', 'reports', 'team']
  },
  {
    id: 'mgr-003',
    name: 'Michael Chen',
    email: 'm.chen@masterbuilder360.com',
    password: 'MgrPass2024#3',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects', 'tasks', 'scheduling', 'budget', 'documents', 'reports', 'team']
  },
  {
    id: 'mgr-004',
    name: 'Emily Rodriguez',
    email: 'e.rodriguez@masterbuilder360.com',
    password: 'MgrPass2024#4',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects', 'tasks', 'scheduling', 'budget', 'documents', 'reports', 'team']
  },
  {
    id: 'mgr-005',
    name: 'David Thompson',
    email: 'd.thompson@masterbuilder360.com',
    password: 'MgrPass2024#5',
    role: 'manager',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects', 'tasks', 'scheduling', 'budget', 'documents', 'reports', 'team']
  },
  
  // Investor Accounts (5)
  {
    id: 'inv-001',
    name: 'Robert Sterling',
    email: 'r.sterling@investors.com',
    password: 'InvPass2024$1',
    role: 'investor',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects_readonly', 'reports_readonly', 'budget_readonly']
  },
  {
    id: 'inv-002',
    name: 'Margaret Wells',
    email: 'm.wells@investors.com',
    password: 'InvPass2024$2',
    role: 'investor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects_readonly', 'reports_readonly', 'budget_readonly']
  },
  {
    id: 'inv-003',
    name: 'James Morrison',
    email: 'j.morrison@investors.com',
    password: 'InvPass2024$3',
    role: 'investor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects_readonly', 'reports_readonly', 'budget_readonly']
  },
  {
    id: 'inv-004',
    name: 'Lisa Hamilton',
    email: 'l.hamilton@investors.com',
    password: 'InvPass2024$4',
    role: 'investor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects_readonly', 'reports_readonly', 'budget_readonly']
  },
  {
    id: 'inv-005',
    name: 'William Foster',
    email: 'w.foster@investors.com',
    password: 'InvPass2024$5',
    role: 'investor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    permissions: ['projects_readonly', 'reports_readonly', 'budget_readonly']
  },
  
  // Worker Accounts (25)
  {
    id: 'wrk-001',
    name: 'Carlos Martinez',
    email: 'c.martinez@workers.com',
    password: 'WrkPass2024@1',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-002',
    name: 'Anna Kowalski',
    email: 'a.kowalski@workers.com',
    password: 'WrkPass2024@2',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-003',
    name: 'Thomas Anderson',
    email: 't.anderson@workers.com',
    password: 'WrkPass2024@3',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-004',
    name: 'Maria Garcia',
    email: 'm.garcia@workers.com',
    password: 'WrkPass2024@4',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-005',
    name: 'Kevin O\'Connor',
    email: 'k.oconnor@workers.com',
    password: 'WrkPass2024@5',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-006',
    name: 'Jennifer Lee',
    email: 'j.lee@workers.com',
    password: 'WrkPass2024@6',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-007',
    name: 'Roberto Silva',
    email: 'r.silva@workers.com',
    password: 'WrkPass2024@7',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-008',
    name: 'Amanda White',
    email: 'a.white@workers.com',
    password: 'WrkPass2024@8',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-009',
    name: 'Daniel Brown',
    email: 'd.brown@workers.com',
    password: 'WrkPass2024@9',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-010',
    name: 'Sophie Turner',
    email: 's.turner@workers.com',
    password: 'WrkPass2024@10',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-011',
    name: 'Marcus Johnson',
    email: 'm.johnson@workers.com',
    password: 'WrkPass2024@11',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-012',
    name: 'Isabella Rodriguez',
    email: 'i.rodriguez@workers.com',
    password: 'WrkPass2024@12',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-013',
    name: 'Ryan Davis',
    email: 'r.davis@workers.com',
    password: 'WrkPass2024@13',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-014',
    name: 'Nicole Wilson',
    email: 'n.wilson@workers.com',
    password: 'WrkPass2024@14',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-015',
    name: 'Alex Thompson',
    email: 'a.thompson@workers.com',
    password: 'WrkPass2024@15',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-016',
    name: 'Victoria Chen',
    email: 'v.chen@workers.com',
    password: 'WrkPass2024@16',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-017',
    name: 'Jacob Miller',
    email: 'j.miller@workers.com',
    password: 'WrkPass2024@17',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-018',
    name: 'Rachel Green',
    email: 'r.green@workers.com',
    password: 'WrkPass2024@18',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-019',
    name: 'Christopher Moore',
    email: 'c.moore@workers.com',
    password: 'WrkPass2024@19',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-020',
    name: 'Stephanie Taylor',
    email: 's.taylor@workers.com',
    password: 'WrkPass2024@20',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-021',
    name: 'Matthew Clark',
    email: 'm.clark@workers.com',
    password: 'WrkPass2024@21',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-022',
    name: 'Lauren Martinez',
    email: 'l.martinez@workers.com',
    password: 'WrkPass2024@22',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-023',
    name: 'Andrew Lewis',
    email: 'a.lewis@workers.com',
    password: 'WrkPass2024@23',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-024',
    name: 'Megan Walker',
    email: 'm.walker@workers.com',
    password: 'WrkPass2024@24',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  },
  {
    id: 'wrk-025',
    name: 'Benjamin Hall',
    email: 'b.hall@workers.com',
    password: 'WrkPass2024@25',
    role: 'worker',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    permissions: ['tasks_assigned', 'time_tracking', 'daily_reports']
  }
];