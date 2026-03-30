export type ScheduleSide = "left" | "right";

export interface ScheduleEvent {
  title: string;
  time: string;
  day: string;
  side: ScheduleSide;
}

export const SCHEDULE: ScheduleEvent[] = [
  { title: "Participants Check-in", time: "08:30 AM - 09:00 AM", day: "DAY 1 • 3rd April 2026", side: "left" },
  { title: "Hacking Set-Up", time: "09:00 AM - 10:00 AM", day: "DAY 1 • 3rd April 2026", side: "right" },
  { title: "Inauguration Ceremony", time: "10:00 AM - 10:30 AM", day: "DAY 1 • 3rd April 2026", side: "left" },
  { title: "BreakFast", time: "10:30 AM - 11:00 AM", day: "DAY 1 • 3rd April 2026", side: "right" },
  { title: "Hacking Begins", time: "11:00 AM", day: "DAY 1 • 3rd April 2026", side: "left" },
  { title: "Mentoring Round 1", time: "11:30 AM - 01:30 PM", day: "DAY 1 • 3rd April 2026", side: "right" },
  { title: "Lunch", time: "01:30 PM - 02:30 PM", day: "DAY 1 • 3rd April 2026", side: "left" },
  { title: "Workshop 1", time: "02:30 PM - 03:00 PM", day: "DAY 1 • 3rd April 2026", side: "right" },
  { title: "Hacking", time: "03:00 PM - 05:30 PM", day: "DAY 1 • 3rd April 2026", side: "left" },
  { title: "Workshop 2", time: "05:30 PM - 06:00 PM", day: "DAY 1 • 3rd April 2026", side: "right" },
  { title: "Evaluation Round 1", time: "06:00 PM - 08:00 PM", day: "DAY 1 • 3rd April 2026", side: "left" },
  { title: "Dinner", time: "08:00 PM - 09:00 PM", day: "DAY 1 • 3rd April 2026", side: "right" },
  { title: "Mentoring Round 2", time: "09:00 PM - 11:00 PM", day: "DAY 1 • 3rd April 2026", side: "left" },
  { title: "Mini Event (BGMI/Quiz)", time: "11:00 PM - 12:00 AM", day: "DAY 1 • 3rd April 2026", side: "right" },
  { title: "Midnight Hacking", time: "12:00 AM - 02:00 AM", day: "DAY 2 • 4th April 2026", side: "left" },
  { title: "Zumba Session", time: "02:00 AM - 03:00 AM", day: "DAY 2 • 4th April 2026", side: "right" },
  { title: "Hacking", time: "03:00 AM - 04:00 AM", day: "DAY 2 • 4th April 2026", side: "left" },
  { title: "Mini Event (Yoga/Fun)", time: "04:00 AM - 05:00 AM", day: "DAY 2 • 4th April 2026", side: "right" },
  { title: "Hacking", time: "05:00 AM - 06:00 AM", day: "DAY 2 • 4th April 2026", side: "left" },
  { title: "Submission Start", time: "06:00 AM", day: "DAY 2 • 4th April 2026", side: "right" },
  { title: "BreakFast", time: "07:00 AM - 08:00 AM", day: "DAY 2 • 4th April 2026", side: "left" },
  { title: "Final Judgement", time: "08:00 AM - 12:00 PM", day: "DAY 2 • 4th April 2026", side: "right" },
  { title: "Workshop 3", time: "12:30 PM - 01:00 PM", day: "DAY 2 • 4th April 2026", side: "left" },
  { title: "Submission End", time: "01:00 PM", day: "DAY 2 • 4th April 2026", side: "right" },
  { title: "Lunch", time: "01:00 PM - 02:00 PM", day: "DAY 2 • 4th April 2026", side: "left" },
  { title: "Result Announcement", time: "02:00 PM - 03:00 PM", day: "DAY 2 • 4th April 2026", side: "right" },
  { title: "Swags & Certificates", time: "03:00 PM - 03:30 PM", day: "DAY 2 • 4th April 2026", side: "left" },
];
