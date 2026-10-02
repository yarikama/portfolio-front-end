// What the admin's welcome page offers each day: a short thought to start
// with, and a question to write about. One of each per calendar day, the
// same all day, in turn.

export const THOUGHTS = [
  'The best notes read like a letter to the person you were last month: here is what you did not know yet, and here is how it felt to find out.',
  'A server that runs for a month without anyone thinking about it is a quiet kind of success. Nobody claps. The coffee still tastes better.',
  'Every bug is a sentence the code was trying to say. Read it slowly before you correct its grammar.',
  'Writing is debugging for thoughts. When a paragraph will not come out clean, the idea underneath usually has a race condition.',
  'There is a moment, right after a test turns green, when the whole system feels like a room you finally tidied. Stay in it for one sip.',
  'Measure first. Most of what felt slow yesterday was waiting, not working, and waiting is the easiest thing to give back.',
  'Good defaults are a quiet kindness. Someone you will never meet starts from wherever you left things.',
  'The clearest explanation is often the second one. Write it once to understand it, then again so someone else can.',
  'A homelab is a garden. A little pruning every week beats one heroic weekend a year.',
  'Curiosity compounds. The odd question you chased last month is probably why today’s problem looks familiar.',
  'Ship the small version. It will teach you more than the plan for the big one ever could.',
  'Readers forgive plain words. They rarely forgive being made to work for an idea you could have simply handed them.',
  'Not every day needs a breakthrough. Some days are for leaving the code a little easier to read than you found it.',
  'Rest is part of the build. The fix that hid all afternoon often turns up on the walk to refill the cup.',
]

export const PROMPTS = [
  'What did you learn this week that you wish someone had told you sooner?',
  'Pick one number from your dashboards. What story is it telling?',
  'Explain something you built to a friend who has never written code.',
  'What broke recently, and what did it teach you about the system around it?',
  'Which tool do you reach for without thinking, and why that one?',
  'Write down a decision you made, and the options you turned down.',
  'What would you build next if the GPU had twice the memory?',
  'Which question from a visitor surprised you, and how would you answer it now?',
  'What is something you believed a year ago about software that you no longer do?',
  'Describe a small win from this week in three sentences.',
  'What would you tell someone starting the project you just finished?',
  'Which paper, post or talk changed how you work, and how?',
]

/** Whole days since 1970 in local time: the same index all day long. */
export function dayIndex(date: Date): number {
  const local = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor(local / 86_400_000)
}

export function forToday<T>(items: T[], date: Date): T {
  return items[dayIndex(date) % items.length]
}

export function greeting(date: Date): string {
  const hour = date.getHours()
  if (hour < 5) return 'Still up'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
