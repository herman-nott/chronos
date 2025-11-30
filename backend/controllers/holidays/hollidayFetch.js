export default async function holidayFetch (contry, year) {
  const url =`https://calendarific.com/api/v2/holidays?&api_key=zfRZoy8pG1q0c8GMHtW7nZe7vdIZ1Nib&country=${contry}&year=${year}`.replace(/\s+/g, "");
  // const url =`https://calendarific.com/api/v2/holidays?&api_key=zfRZoy8pG1q0c8GMHtW7nZe7vdIZ1Nib&country=US&year=2025`.replace(/\s+/g, "");

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("holidayFetch response:", data?.response?.holidays);
    return data?.response?.holidays || [];
  } catch (err) {
    console.error("holidayFetch error:", err);
    return [];
  }
}
