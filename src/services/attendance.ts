

import { staff } from '@/lib/placeholder-data';
import type { AttendanceRecord, BreakRecord } from '@/types';
import { differenceInMinutes, isSameDay, eachDayOfInterval, format, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

// This is a more robust mock data generator
const generateMockAttendanceForDate = (targetDate: Date): AttendanceRecord[] => {
    return staff.map(s => {
        // Simple hashing to create deterministic randomness based on staff ID and date
        const seed = s.id.charCodeAt(0) + targetDate.getDate();
        let status: 'Present' | 'Absent' | 'On Leave' = 'Absent';
        if (seed % 5 === 0) status = 'On Leave';
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
                id: `break-${s.id}-${format(targetDate, 'yyyy-MM-dd')}`,
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
            id: `att-${s.id}-${format(targetDate, 'yyyy-MM-dd')}`,
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


export async function getAttendance(range: DateRange | undefined): Promise<AttendanceRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

    if (!range || !range.from) {
        // Default to today if no range
        return Promise.resolve(generateMockAttendanceForDate(new Date()));
    }

    const interval = {
        start: range.from,
        end: range.to || range.from,
    };

    const days = eachDayOfInterval(interval);
    const allRecords = days.flatMap(day => generateMockAttendanceForDate(day));
    
    return Promise.resolve(allRecords);
}


export async function getDailyAttendance(dateString: string): Promise<AttendanceRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network latency
    const targetDate = new Date(dateString);
    const data = generateMockAttendanceForDate(targetDate);
    return Promise.resolve(data);
}

export async function getStaffAttendanceHistory(staffId: string): Promise<AttendanceRecord[]> {
    // This would fetch all historical records for a staff member.
    // For now, we'll return a mock set for the last month.
    const today = new Date();
    const records: AttendanceRecord[] = [];
    for(let i=0; i < 30; i++) {
        const date = subDays(today, i);
        const dayRecord = generateMockAttendanceForDate(date).find(r => r.staffId === staffId);
        if (dayRecord) {
            records.push(dayRecord);
        }
    }
    return Promise.resolve(records);
}

// These functions would interact with a live database in a real app
// For now, they manipulate a simple in-memory state which is not persisted.
let mockAttendanceData: AttendanceRecord[] = generateMockAttendanceForDate(new Date());

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
