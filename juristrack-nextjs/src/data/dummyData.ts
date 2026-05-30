export const cases = [
  {
    id: 'CASE-001',
    title: 'Smith vs. Johnson',
    type: 'Civil',
    status: 'Active',
    client: 'John Smith',
    dateFiled: '2024-01-15',
    nextHearing: '2024-02-01',
    priority: 'High',
    assignedJudge: 'Judge Mary Williams'
  },
  {
    id: 'CASE-002',
    title: 'Tech Corp Copyright Dispute',
    type: 'Intellectual Property',
    status: 'Pending',
    client: 'Tech Corporation',
    dateFiled: '2024-01-20',
    nextHearing: '2024-02-05',
    priority: 'Medium',
    assignedJudge: 'Judge Robert Chen'
  },
  {
    id: 'CASE-003',
    title: 'City vs. Construction Co.',
    type: 'Municipal',
    status: 'Active',
    client: 'City Administration',
    dateFiled: '2024-01-10',
    nextHearing: '2024-01-28',
    priority: 'Low',
    assignedJudge: 'Judge Sarah Davis'
  },
  {
    id: 'CASE-004',
    title: 'Estate of Margaret Brown',
    type: 'Probate',
    status: 'Closed',
    client: 'Brown Family',
    dateFiled: '2023-12-01',
    nextHearing: null,
    priority: 'Low',
    assignedJudge: 'Judge James Wilson'
  }
]

export const hearings = [
  {
    id: 'HEAR-001',
    caseId: 'CASE-001',
    caseTitle: 'Smith vs. Johnson',
    date: '2024-02-01',
    time: '10:00 AM',
    type: 'Pre-trial Conference',
    courtroom: 'Courtroom A',
    judge: 'Judge Mary Williams',
    status: 'Scheduled'
  },
  {
    id: 'HEAR-002',
    caseId: 'CASE-002',
    caseTitle: 'Tech Corp Copyright Dispute',
    date: '2024-02-05',
    time: '2:00 PM',
    type: 'Motion Hearing',
    courtroom: 'Courtroom B',
    judge: 'Judge Robert Chen',
    status: 'Scheduled'
  },
  {
    id: 'HEAR-003',
    caseId: 'CASE-003',
    caseTitle: 'City vs. Construction Co.',
    date: '2024-01-28',
    time: '11:30 AM',
    type: 'Status Conference',
    courtroom: 'Courtroom C',
    judge: 'Judge Sarah Davis',
    status: 'In Progress'
  }
]

export const clients = [
  {
    id: 'CLI-001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
    type: 'Individual',
    cases: ['CASE-001'],
    status: 'Active'
  },
  {
    id: 'CLI-002',
    name: 'Tech Corporation',
    email: 'legal@techcorp.com',
    phone: '+1 (555) 987-6543',
    address: '456 Tech Blvd, Silicon Valley, CA 94025',
    type: 'Corporate',
    cases: ['CASE-002'],
    status: 'Active'
  },
  {
    id: 'CLI-003',
    name: 'City Administration',
    email: 'legal@city.gov',
    phone: '+1 (555) 246-8135',
    address: '789 City Hall Plaza, City, State 12345',
    type: 'Government',
    cases: ['CASE-003'],
    status: 'Active'
  }
]

export const documents = [
  {
    id: 'DOC-001',
    title: 'Complaint - Smith vs. Johnson',
    caseId: 'CASE-001',
    type: 'Complaint',
    uploadedDate: '2024-01-15',
    uploadedBy: 'Admin',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: 'DOC-002',
    title: 'Evidence Photos - Tech Corp Case',
    caseId: 'CASE-002',
    type: 'Evidence',
    uploadedDate: '2024-01-21',
    uploadedBy: 'Paralegal',
    size: '15.7 MB',
    format: 'ZIP'
  },
  {
    id: 'DOC-003',
    title: 'Contract Agreement - City Case',
    caseId: 'CASE-003',
    type: 'Contract',
    uploadedDate: '2024-01-12',
    uploadedBy: 'Attorney',
    size: '856 KB',
    format: 'PDF'
  }
]

export const judges = [
  {
    id: 'JUD-001',
    name: 'Judge Mary Williams',
    court: 'Superior Court',
    specialization: 'Civil Law',
    experience: '15 years',
    active: true
  },
  {
    id: 'JUD-002',
    name: 'Judge Robert Chen',
    court: 'Federal Court',
    specialization: 'Intellectual Property',
    experience: '12 years',
    active: true
  },
  {
    id: 'JUD-003',
    name: 'Judge Sarah Davis',
    court: 'Municipal Court',
    specialization: 'Municipal Law',
    experience: '8 years',
    active: true
  }
]

export const stats = {
  totalCases: 1247,
  activeCases: 892,
  pendingCases: 234,
  closedCases: 121,
  totalClients: 456,
  upcomingHearings: 45,
  todayHearings: 8,
  documentsUploaded: 3421
}
