/** How many questions an unsubscribed visitor gets to try for free, per
 * quiz version, before being asked to register. Applies both when sampling
 * the trial question set and when validating a trial submission server-side
 * (so a crafted request can't submit more than this many answers). */
export const TRIAL_QUESTION_COUNT = 8;
