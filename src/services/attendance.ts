

import { staff } from '@/lib/placeholder-data';
import type { AttendanceRecord, BreakRecord } from '@/types';
import { differenceInMinutes } from 'date-fns';

let mockAttendanceData: AttendanceRecord[] = staff.map(s => {
    let status: 'Present' | 'Absent' | 'On Leave' = 'Absent';
    if (s.id === 'STAFF001') status = 'Present';
    if (s.id === 'STAFF002') status = 'On Leave';

    const checkInTime = status === 'Present' ? new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() : null; // 4 hours ago
    const breaks = status === 'Present' ? [
        {
            id: `break-${s.id}`,
            startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        }
    ] : [];

    let totalWorkDuration = 0;
    if (checkInTime) {
        totalWorkDuration = differenceInMinutes(new Date(), new Date(checkInTime));
    }
    const totalBreakDuration = breaks.reduce((acc, br) => {
        if(br.endTime) {
            return acc + differenceInMinutes(new Date(br.endTime), new Date(br.startTime));
        }
        return acc;
    }, 0);
    totalWorkDuration -= totalBreakDuration;

    return {
        id: `att-${s.id}`,
        staffId: s.id,
        staffName: s.name,
        staffRole: s.role,
        staffAvatar: `https://i.pravatar.cc/150?u=${s.id}`,
        date: new Date().toISOString(),
        status: status,
        checkInTime: checkInTime,
        checkOutTime: null,
        breaks: breaks,
        totalWorkDuration: totalWorkDuration,
        totalBreakDuration: totalBreakDuration,
    };
});

export async function getDailyAttendance(date: string): Promise<AttendanceRecord[]> {
    // In a real app, you'd fetch data for the given date. Here we return the mock data for today.
    return Promise.resolve(mockAttendanceData);
}

export async function getStaffAttendanceHistory(staffId: string): Promise<AttendanceRecord[]> {
    // This would fetch all historical records for a staff member.
    // For now, we'll return the single mock record if it matches.
    const record = mockAttendanceData.find(r => r.staffId === staffId);
    return record ? Promise.resolve([record]) : Promise.resolve([]);
}

export async function clockIn(staffId: string): Promise<AttendanceRecord> {
    const recordIndex = mockAttendanceData.findIndex(r => r.staffId === staffId);
    if (recordIndex !== -1) {
        mockAttendanceData[recordIndex] = {
            ...mockAttendanceData[recordIndex],
            status: 'Present',
            checkInTime: new Date().toISOString(),
            checkOutTime: null,
            breaks: [],
        };
        return mockAttendanceData[recordIndex];
    }
    throw new Error("Staff member not found");
}

export async function clockOut(staffId: string): Promise<AttendanceRecord> {
    const recordIndex = mockAttendanceData.findIndex(r => r.staffId === staffId);
    if (recordIndex !== -1) {
        const checkOutTime = new Date().toISOString();
        const { checkInTime, breaks } = mockAttendanceData[recordIndex];
        
        let totalWorkDuration = 0;
        if(checkInTime) {
            totalWorkDuration = differenceInMinutes(new Date(checkOutTime), new Date(checkInTime));
        }

        const totalBreakDuration = breaks.reduce((acc, br) => {
            if(br.endTime) {
                return acc + differenceInMinutes(new Date(br.endTime), new Date(br.startTime));
            }
            return acc;
        }, 0);

        totalWorkDuration -= totalBreakDuration;

        mockAttendanceData[recordIndex] = {
            ...mockAttendanceData[recordIndex],
            checkOutTime: checkOutTime,
            totalWorkDuration: totalWorkDuration,
            totalBreakDuration: totalBreakDuration,
        };
        return mockAttendanceData[recordIndex];
    }
    throw new Error("Staff member not found");
}

export async function startBreak(staffId: string): Promise<AttendanceRecord> {
    const recordIndex = mockAttendanceData.findIndex(r => r.staffId === staffId);
    if (recordIndex !== -1) {
        const newBreak: BreakRecord = {
            id: `break-${Date.now()}`,
            startTime: new Date().toISOString(),
            endTime: null,
        };
        mockAttendanceData[recordIndex].breaks.push(newBreak);
        return mockAttendanceData[recordIndex];
    }
    throw new Error("Staff member not found");
}

export async function endBreak(staffId: string): Promise<AttendanceRecord> {
    const recordIndex = mockAttendanceData.findIndex(r => r.staffId === staffId);
    if (recordIndex !== -1) {
        const lastBreakIndex = mockAttendanceData[recordIndex].breaks.length - 1;
        if (lastBreakIndex >= 0 && !mockAttendanceData[recordIndex].breaks[lastBreakIndex].endTime) {
            mockAttendanceData[recordIndex].breaks[lastBreakIndex].endTime = new Date().toISOString();
        }
        return mockAttendanceData[recordIndex];
    }
    throw new Error("Staff member not found");
}
