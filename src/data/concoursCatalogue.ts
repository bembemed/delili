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
      fr: "Concours de recrutement externe de 2 720 enseignants de l'enseignement secondaire général et technique",
      ar: "مسابقة اكتتاب خارجي لـ 2720 عنصرا لصالح وزارة التربية وإصلاح النظام التعليمي",
    },
  },
] as const;
