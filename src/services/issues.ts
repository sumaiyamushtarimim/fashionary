
import { issues } from '@/lib/placeholder-data';
import { Issue, IssueLog } from '@/types';

// In a real app, you'd fetch this from your API

export async function getIssues(): Promise<Issue[]> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(issues);
}

export async function getIssueById(id: string): Promise<Issue | undefined> {
  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const issue = issues.find((i) => i.id === id);
  return Promise.resolve(issue);
}

export async function createIssue(orderId: string, title: string, description: string, priority: Issue['priority']): Promise<Issue> {
    const newIssue: Issue = {
        id: `ISSUE-${(issues.length + 1).toString().padStart(3, '0')}`,
        orderId,
        title,
        description,
        priority,
        status: 'Open',
        createdAt: new Date().toISOString(),
        createdBy: 'Saleha Akter', // Mock current user
        logs: [
            {
                id: `ILOG-${Date.now()}`,
                timestamp: new Date().toISOString(),
                user: 'Saleha Akter',
                action: 'Issue Created.'
            }
        ]
    };
    issues.unshift(newIssue); // Add to the beginning of the array
    return Promise.resolve(newIssue);
}

export async function updateIssue(id: string, newStatus: Issue['status'], comment?: string): Promise<Issue | undefined> {
    const issueIndex = issues.findIndex(i => i.id === id);
    if (issueIndex === -1) return undefined;

    const issue = issues[issueIndex];
    
    const newLog: IssueLog = {
        id: `ILOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: 'Admin User', // Mock current user
        action: ''
    };

    if (newStatus !== issue.status) {
        issue.status = newStatus;
        newLog.action = `Status changed to ${newStatus}.`;
        if (comment) {
            newLog.action += ` Comment: "${comment}"`;
        }
    } else if (comment) {
        newLog.action = `Comment added: "${comment}"`;
    }

    if(newLog.action) {
        issue.logs.push(newLog);
    }
    
    if (newStatus === 'Resolved' || newStatus === 'Closed') {
        issue.resolvedAt = new Date().toISOString();
    }

    issues[issueIndex] = issue;
    return Promise.resolve(issue);
}
