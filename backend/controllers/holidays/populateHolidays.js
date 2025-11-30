import holidayFetch from "./hollidayFetch.js";
import User from "../../database/models/User.js";
import Calendar from "../../database/models/Calendar.js";
import Event from "../../database/models/Event.js";

export default async function populateHolidays(req, res) {
  try {

    const { calendarId, id } = req.params;
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const holidayCalendar = calendarId;

    if (!holidayCalendar)
      return res.status(404).json({ message: "Holiday calendar not found" });

    // Fetch holidays
    const year = new Date().getFullYear();

    const holidays = await holidayFetch(user.country, year);

    console.log("Holiday Fetch Response:", holidays);

    for (const holiday of holidays) {
      await Event.create({
        calendar_id: holidayCalendar._id,
        title: holiday.name,
        description: holiday.description || "Holiday",
        category: 'arrengement',
        start_time: new Date(holiday.date.iso),
        end_time: new Date(holiday.date.iso),
        reminder_time: 15,
        is_all_day: true,
        reminders: [15],
        participants: [user.email]
      });
    }

    res.status(200).json({ message: "Holiday events created!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

