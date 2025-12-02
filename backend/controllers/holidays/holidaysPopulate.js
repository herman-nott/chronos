import holidayFetch from "./hollidayFetch.js";
import User from "../../database/models/User.js";
import Event from "../../database/models/Event.js";

export default async function populateHolidays(req, res) {
  try {
    const { userId } = req.params;

    // console.log(userId);
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // берём первый календарь пользователя
    if (!user.calendars || user.calendars.length === 0) {
      return res.status(404).json({ message: "No calendars found for this user" });
    }

    const calendarId = user.calendars[1]._id; 
    const year = new Date().getFullYear();

    console.log(user.country);
    console.log(year);

    await Event.deleteMany({ 
      calendar_id: calendarId, 
      category: 'arrangement', 
      is_system_holiday: true 
    });

    // fetch holidays
    const holidays = await holidayFetch(user.country, year);

    if (!holidays.length)
      return res.status(200).json({ message: "No holidays fetched" });

    for (const holiday of holidays) {
      const baseDate_start = new Date(holiday.date.iso);
      const baseDate_end = new Date(holiday.date.iso);

      baseDate_start.setHours(0,0);
      baseDate_end.setHours(0,30);

      await Event.create({
        calendar_id: calendarId,
        title: holiday.name,
        description: holiday.description || "Holiday",
        category: 'arrangement',
        start_time: baseDate_start,
        end_time: baseDate_end,
        reminder_time: 15,
        is_all_day: true,
        reminders: [15],
        participants: [user.email],
        color: '#018659',
        is_system_holiday: true,
        is_readonly: true
      });
    }

    res.status(200).json({ message: "Holiday events created!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
