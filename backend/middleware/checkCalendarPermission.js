import Calendar from "../database/models/Calendar.js";

export async function hasCalendarPermission(calendarId, userId, requiredPermission = 'view') {
    const calendar = await Calendar.findById(calendarId);
    if (!calendar) return false;

    // Owner has all permissions
    if (calendar.owner.toString() === userId) {
        return true;
    }

    // Check if user is a member (invited users)
    const isMember = calendar.members?.some(
        memberId => memberId.toString() === userId
    );

    if (isMember && requiredPermission === 'view') {
        return true;
    }

    // Check shared_with permissions
    const shareEntry = calendar.shared_with?.find(
        share => share.userid?.toString() === userId && share.accepted
    );

    if (shareEntry) {
        if (requiredPermission === 'view') return true;
        if (requiredPermission === 'edit' && shareEntry.permission === 'edit') return true;
    }

    return false;
}

export default hasCalendarPermission;