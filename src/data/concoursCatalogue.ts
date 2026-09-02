/** Minimal concours labels used purely to group exams on /quiz (and, on the
 * admin side, the exams list) — separate from the full official-notice data
 * in ./concours.ts (which still only describes the original 310-position
 * concours; the teacher-recruitment concours' full info page lives on the
 * `staging` branch until it's merged). Keep slugs in sync with
 * Quiz.concoursSlug values set in the admin panel. */
export const CONCOURS_CATALOGUE = [
  {
    slug: "administration-2026",
    titre: {
      fr: "Concours externe de recrutement de 310 unités (ENAJM, ISMPJ, ENAS, ISJS)",
      ar: "مسابقة خارجية لتوظيف 310 وحدة (ENAJM، ISMPJ، ENAS، ISJS)",
    },
  },
  {
    slug: "enseignement-2026",
    titre: {
      fr: "Concours de recrutement régional de 1132 agents de service d'enseignement",
      ar: "مسابقة اكتتاب حسب المقاطعات لـ 1132 مقدم خدمة تعليم",
    },
  },
] as const;
