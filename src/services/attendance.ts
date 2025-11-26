

import { staff } from '@/lib/placeholder-data';
import type { AttendanceRecord, BreakRecord } from '@/types';
import { differenceInMinutes, isSameDay } from 'date-fns';

// This is a more robust mock data generator
const generateMockAttendanceForDate = (targetDate: Date): AttendanceRecord[] => {
    return staff.map(s => {
        // Simple hashing to create deterministic randomness based on staff ID and date
        const seed = s.id.charCodeAt(0) + targetDate.getDate();
        let status: 'Present' | 'Absent' | 'On Leave' = 'Absent';
        if (seed % 4 === 0) status = 'On Leave';
        else if (seed % 2 === 0) status = 'Present';

        if (isSameDay(targetDate, new Date())) {
            // Use live logic for today
            if (s.id === 'STAFF001') status = 'Present';
            if (s.id === 'STAFF002') status = 'On Leave';
        }


        const checkInTime = status === 'Present' ? new Date(new Date(targetDate).setHours(9, Math.random() * 30, 0, 0)).toISOString() : null;
        const checkOutTime = status === 'Present' ? new Date(new Date(targetDate).setHours(18, Math.random() * 30, 0, 0)).toISOString() : null;

        const breaks = status === 'Present' ? [
            {
                id: `break-${s.id}`,
                startTime: new Date(new Date(targetDate).setHours(13, 0, 0, 0)).toISOString(),
                endTime: new Date(new Date(targetDate).setHours(14, 0, 0, 0)).toISOString(),
            }
        ] : [];

        let totalWorkDuration = 0;
        if (checkInTime && checkOutTime) {
            totalWorkDuration = differenceInMinutes(new Date(checkOutTime), new Date(checkInTime));
        }
        const totalBreakDuration = breaks.reduce((acc, br) => {
            if(br.endTime) {
                return acc + differenceInMinutes(new Date(br.endTime), new Date(br.startTime));
            }
            return acc;
        }, 0);
        totalWorkDuration -= totalBreakDuration;

        return {
            id: `att-${s.id}-${targetDate.toISOString().split('T')[0]}`,
            staffId: s.id,
            staffName: s.name,
            staffRole: s.role,
            staffAvatar: `https://i.pravatar.cc/150?u=${s.id}`,
            date: targetDate.toISOString(),
            status: status,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            breaks: breaks,
            totalWorkDuration: totalWorkDuration > 0 ? totalWorkDuration : 0,
            totalBreakDuration: totalBreakDuration,
        };
    });
};


let mockAttendanceData: AttendanceRecord[] = generateMockAttendanceForDate(new Date());


export async function getDailyAttendance(dateString: string): Promise<AttendanceRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    const targetDate = new Date(dateString);
    const data = generateMockAttendanceForDate(targetDate);
    return Promise.resolve(data);
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
