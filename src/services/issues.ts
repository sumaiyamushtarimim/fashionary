
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

export async function updateIssue(id: string, update: Partial<Issue> & { comment?: string }): Promise<Issue | undefined> {
    const issueIndex = issues.findIndex(i => i.id === id);
    if (issueIndex === -1) return undefined;

    const issue = issues[issueIndex];
    
    // Mock current user
    const currentUser = 'Admin User';

    const newLog: IssueLog = {
        id: `ILOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: currentUser,
        action: ''
    };

    let logActions: string[] = [];

    if (update.status && update.status !== issue.status) {
        logActions.push(`Status changed to ${update.status}.`);
        issue.status = update.status;
    }
    
    if (update.assignedTo && update.assignedTo !== issue.assignedTo) {
        logActions.push(`Assigned to ${update.assignedTo}.`);
        issue.assignedTo = update.assignedTo;
    } else {
        // Auto-assign to current user if they are making a change and it's unassigned
        if (!issue.assignedTo && (update.status || update.comment)) {
            issue.assignedTo = currentUser;
            logActions.push(`Assigned to ${currentUser}.`);
        }
    }
    
    if (update.comment) {
        logActions.push(`Comment added: "${update.comment}"`);
    }

    if (logActions.length > 0) {
        newLog.action = logActions.join(' ');
        issue.logs.push(newLog);
    }
    
    if (update.status === 'Resolved' || update.status === 'Closed') {
        issue.resolvedAt = new Date().toISOString();
    }

    issues[issueIndex] = issue;
    return Promise.resolve(issue);
}
