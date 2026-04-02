export type ScheduleSide = "left" | "right";

export interface ScheduleEvent {
  title: string;
  time: string;
  day: string;
  venue: string;
  side: ScheduleSide;
}

export const OFFLINE_SCHEDULE: ScheduleEvent[] = [
  { title: "Participants Check-in", time: "08:30 AM - 09:30 AM", day: "DAY 1 • 3rd April 2026", venue: "Registration Desk (Registrar Office )", side: "left" },
  { title: "Inauguration Ceremony", time: "09:30 AM - 10:30 AM", day: "DAY 1 • 3rd April 2026", venue: "Auditorium", side: "right" },
  { title: "Hacking Begins", time: "10:30 AM", day: "DAY 1 • 3rd April 2026", venue: "2F01,2F07 & 2F32", side: "left" },
  { title: "Mentoring Round 1", time: "11:00 AM - 01:00 PM", day: "DAY 1 • 3rd April 2026", venue: "2F01,2F07 & 2F32", side: "right" },
  { title: "Lunch", time: "12:30 PM - 02:00 PM", day: "DAY 1 • 3rd April 2026", venue: "YogaHall", side: "left" },
  { title: "Hacking", time: "02:00 PM - 05:30 PM", day: "DAY 1 • 3rd April 2026", venue: "2F01,2F07 & 2F32", side: "right" },
  { title: "Workshop 1", time: "02:00 PM - 02:30 PM", day: "DAY 1 • 3rd April 2026", venue: "2F01,2F07 & 2F32", side: "left" },
  { title: "Workshop 2", time: "05:30 PM - 06:00 PM", day: "DAY 1 • 3rd April 2026", venue: "2F01,2F07 & 2F32", side: "right" },
  { title: "Evaluation Round 1", time: "06:00 PM - 08:00 PM", day: "DAY 1 • 3rd April 2026", venue: "2F01,2F07 & 2F32", side: "left" },
  { title: "Dinner", time: "08:00 PM - 09:00 PM", day: "DAY 1 • 3rd April 2026", venue: "YogaHall", side: "right" },
  { title: "Hacking", time: "09:00 PM - 10:30 PM", day: "DAY 1 • 3rd April 2026", venue: "2F01,2F07 & 2F32", side: "left" },
  { title: "Mentoring/Evaluation Round 2", time: "10:30 PM - 12:30 AM", day: "DAY 2 • 4th April 2026", venue: "2F01,2F07 & 2F32", side: "right" },
  { title: "Mini Event (BGMI & Quiz )", time: "12:30 AM - 02:00 AM", day: "DAY 2 • 4th April 2026", venue: "2F01,2F07 & 2F32", side: "left" },
  { title: "Midnight Snacks", time: "01:30 AM - 02:00 AM", day: "DAY 2 • 4th April 2026", venue: "2F01,2F07 & 2F32", side: "right" },
  { title: "Zumba Session", time: "02:00 AM - 02:30 AM", day: "DAY 2 • 4th April 2026", venue: "2nd Floor", side: "left" },
  { title: "Hacking", time: "02:30 AM - 04:00 AM", day: "DAY 2 • 4th April 2026", venue: "2F01,2F07 & 2F32", side: "right" },
  { title: "Mini Event (Yoga & Fun activities )", time: "04:00 AM - 05:00 AM", day: "DAY 2 • 4th April 2026", venue: "2F01,2F07 & 2F32", side: "left" },
  { title: "Hacking", time: "05:00 AM - 07:00 AM", day: "DAY 2 • 4th April 2026", venue: "2F01,2F07 & 2F32", side: "right" },
  { title: "BreakFast", time: "07:00 AM - 08:00 AM", day: "DAY 2 • 4th April 2026", venue: "Yoga Hall", side: "left" },
  { title: "Hacking", time: "08:00 AM - 10:00 AM", day: "DAY 2 • 4th April 2026", venue: "2F01,2F07 & 2F32", side: "right" },
  { title: "Final Evaluation Round", time: "10:00 AM - 12:30 AM", day: "DAY 2 • 4th April 2026", venue: "2F01,2F07 & 2F32", side: "left" },
  { title: "Submission Start", time: "11:00 AM", day: "DAY 2 • 4th April 2026", venue: "Devfolio", side: "right" },
  { title: "WorkShop 3 / Swag Distribution", time: "12:00 PM - 12:30 PM", day: "DAY 2 • 4th April 2026", venue: "2F02", side: "left" },
  { title: "Lunch", time: "12:30 PM - 01:30 PM", day: "DAY 2 • 4th April 2026", venue: "Yogahall", side: "right" },
  { title: "Submission End", time: "02:30 PM", day: "DAY 2 • 4th April 2026", venue: "Devfolio", side: "left" },
  { title: "Result Announcement & Valedictory Ceremony", time: "03:00 PM - 04:30 PM", day: "DAY 2 • 4th April 2026", venue: "Auditorium", side: "right" },
];

export const ONLINE_SCHEDULE: ScheduleEvent[] = [
  { title: "Check-in", time: "08:30 AM - 11:00 AM", day: "DAY 1 • 3rd April 2026", venue: "Online (Discord)", side: "left" },
  { title: "PPT & Video Submission", time: "11:00 AM - 01:00 PM", day: "DAY 1 • 3rd April 2026", venue: "Online Platform", side: "right" },
  { title: "Evaluation Round 1(Elimination Round)", time: "01:00 PM - 05:00 PM", day: "DAY 1 • 3rd April 2026", venue: "Online Platform", side: "left" },
  { title: "Workshop (Algorand)", time: "05:30 PM - 06:00 PM", day: "DAY 1 • 3rd April 2026", venue: "Online Stream", side: "right" },
  { title: "Evaluation Round 1 Result", time: "06:00 PM", day: "DAY 1 • 3rd April 2026", venue: "Discord", side: "left" },
  { title: "Mentoring & Evaluation Round 2", time: "06:15 PM - 10:00 PM", day: "DAY 1 • 3rd April 2026", venue: "Online Sessions", side: "right" },
  { title: "Hacking Time", time: "10:00 PM - 06:00 AM", day: "DAY 2 • 4th April 2026", venue: "Online", side: "left" },
  { title: "Devfolio Submission (Pre)", time: "06:00 AM - 08:00 AM", day: "DAY 2 • 4th April 2026", venue: "Devfolio", side: "right" },
  { title: "Evaluation Round 2 Result", time: "09:00 AM", day: "DAY 2 • 4th April 2026", venue: "Discord", side: "left" },
  { title: "Final Judgement Round", time: "09:30 AM - 12:00 AM", day: "DAY 2 • 4th April 2026", venue: "Online Sessions", side: "right" },
  { title: "Devfolio Submission End", time: "01:00 PM", day: "DAY 2 • 4th April 2026", venue: "Devfolio", side: "left" },
  { title: "Final Result Announcement", time: "03:00 PM - 4:30 PM", day: "DAY 2 • 4th April 2026", venue: "Online Stream", side: "right" },
];
