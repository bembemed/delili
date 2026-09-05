export type Localized = {
  fr: string;
  ar: string;
};

export type Poste = {
  ministere: string;
  ministereFull: Localized;
  corps: Localized;
  places: number;
  diplome: Localized;
};

export type ConcoursEntry = {
  slug: string;
  titre: Localized;
  organisateur: Localized;
  totalPlaces: number;
  dateDebut: string;
  dateFin: string;
  lieu: Localized;
  ageMin: number;
  ageMax: number;
  conditionNationalite: Localized;
  conditionAge: Localized;
  /** Free-text summary of the exam date(s), since not every concours is a
   * single fixed day (this one is staggered by district, confirmed later
   * via convocations) — shown next to examDatesLabel on the concours page. */
  examDatesValue: Localized;
  /** Training schools candidates join after succeeding — omitted for
   * concours (like direct teaching postings) that don't have this step. */
  ecoles?: Localized[];
  postes: Poste[];
};

export const CONCOURS_LIST: ConcoursEntry[] = [
  {
    slug: "administration-2026",
    titre: {
      fr: "Concours externe de recrutement de 310 unités pour l'accès à la formation à l'ENAJM, l'ISMPJ, l'ENAS et l'ISJS",
      ar: "مسابقة خارجية لتوظيف 310 وحدة للالتحاق بالتكوين بالمدرسة الوطنية للإدارة والصحافة والقضاء، والمعهد العالي للقضاء والمهن القضائية، والمدرسة الوطنية للعمل الاجتماعي، والمعهد العالي للشباب والرياضة",
    },
    organisateur: {
      fr: "Le Ministère de la Fonction Publique et du Travail et la Commission Nationale des Concours",
      ar: "وزارة الوظيفة العمومية والعمل واللجنة الوطنية للمسابقات",
    },
    totalPlaces: 310,
    dateDebut: "2026-09-12T10:00:00+00:00",
    dateFin: "2026-09-13T23:59:59+00:00",
    lieu: {
      fr: "Le centre sera précisé par communiqué",
      ar: "سيتم تحديد المركز ببلاغ لاحق",
    },
    ageMin: 18,
    ageMax: 37,
    conditionNationalite: {
      fr: "Être de nationalité mauritanienne",
      ar: "أن يكون المترشح موريتاني الجنسية",
    },
    conditionAge: {
      fr: "Être âgé(e) de 18 ans au moins et de 37 ans au plus à la date d'ouverture de la candidature",
      ar: "أن يتراوح سنه بين 18 سنة على الأقل و37 سنة على الأكثر في تاريخ فتح باب الترشح",
    },
    examDatesValue: {
      fr: "samedi et dimanche 12 et 13 septembre 2026, à 10h",
      ar: "يومي السبت والأحد 12 و13 سبتمبر 2026، على الساعة العاشرة",
    },
    ecoles: [
      {
        fr: "École Nationale d'Administration, de Journalisme et de la Magistrature (ENAJM)",
        ar: "المدرسة الوطنية للإدارة والصحافة والقضاء (ENAJM)",
      },
      {
        fr: "Institut Supérieur de la Magistrature et des Professions Judiciaires (ISMPJ)",
        ar: "المعهد العالي للقضاء والمهن القضائية (ISMPJ)",
      },
      {
        fr: "École Nationale de l'Action Sociale (ENAS)",
        ar: "المدرسة الوطنية للعمل الاجتماعي (ENAS)",
      },
      {
        fr: "Institut Supérieur de la Jeunesse et des Sports (ISJS)",
        ar: "المعهد العالي للشباب والرياضة (ISJS)",
      },
    ],
    postes: [
      {
        ministere: "MJ",
        ministereFull: { fr: "Ministère de la Justice", ar: "وزارة العدل" },
        corps: { fr: "Greffier en chef", ar: "كاتب ضبط رئيسي" },
        places: 30,
        diplome: {
          fr: "Diplôme de licence en Cheria ou en droit obtenu après le baccalauréat",
          ar: "شهادة الإجازة في الشريعة أو الحقوق يتم الحصول عليها بعد البكالوريا",
        },
      },
      {
        ministere: "MJ",
        ministereFull: { fr: "Ministère de la Justice", ar: "وزارة العدل" },
        corps: { fr: "Greffier", ar: "كاتب ضبط" },
        places: 30,
        diplome: { fr: "Baccalauréat", ar: "شهادة البكالوريا" },
      },
      {
        ministere: "MF",
        ministereFull: { fr: "Ministère des Finances", ar: "وزارة المالية" },
        corps: { fr: "Inspecteur principal du trésor", ar: "مفتش خزينة رئيسي" },
        places: 30,
        diplome: {
          fr: "Diplôme du deuxième cycle de l'Enseignement supérieur en droit, en économie, en administration ou en sciences sociales, obtenu après le baccalauréat",
          ar: "شهادة السلك الثاني من التعليم العالي في الحقوق أو الاقتصاد أو الإدارة أو العلوم الاجتماعية، يتم الحصول عليها بعد البكالوريا",
        },
      },
      {
        ministere: "MF",
        ministereFull: { fr: "Ministère des Finances", ar: "وزارة المالية" },
        corps: { fr: "Inspecteur des impôts", ar: "مفتش ضرائب" },
        places: 20,
        diplome: {
          fr: "Diplôme du premier cycle de l'Enseignement supérieur en droit, en économie, en administration ou en sciences sociales, obtenu après le baccalauréat",
          ar: "شهادة السلك الأول من التعليم العالي في الحقوق أو الاقتصاد أو الإدارة أو العلوم الاجتماعية، يتم الحصول عليها بعد البكالوريا",
        },
      },
      {
        ministere: "MF",
        ministereFull: { fr: "Ministère des Finances", ar: "وزارة المالية" },
        corps: { fr: "Contrôleur trésor", ar: "مراقب خزينة" },
        places: 20,
        diplome: { fr: "Baccalauréat", ar: "شهادة البكالوريا" },
      },
      {
        ministere: "MF",
        ministereFull: { fr: "Ministère des Finances", ar: "وزارة المالية" },
        corps: { fr: "Contrôleur impôts", ar: "مراقب ضرائب" },
        places: 20,
        diplome: { fr: "Baccalauréat", ar: "شهادة البكالوريا" },
      },
      {
        ministere: "MFPT",
        ministereFull: {
          fr: "Ministère de la Fonction Publique et du Travail",
          ar: "وزارة الوظيفة العمومية والعمل",
        },
        corps: { fr: "Juriste", ar: "قانوني" },
        places: 60,
        diplome: {
          fr: "Diplôme du deuxième cycle de l'Enseignement supérieur en droit ou en administration",
          ar: "شهادة السلك الثاني من التعليم العالي في الحقوق أو الإدارة",
        },
      },
      {
        ministere: "MFPT",
        ministereFull: {
          fr: "Ministère de la Fonction Publique et du Travail",
          ar: "وزارة الوظيفة العمومية والعمل",
        },
        corps: { fr: "Rédacteur d'administration", ar: "محرر إدارة" },
        places: 20,
        diplome: { fr: "Baccalauréat", ar: "شهادة البكالوريا" },
      },
      {
        ministere: "MASEF",
        ministereFull: {
          fr: "Ministère de l'Action Sociale, de l'Enfance et de la Famille",
          ar: "وزارة العمل الاجتماعي والطفولة والأسرة",
        },
        corps: { fr: "Formateur langue des signes et braille", ar: "مكون إشارة وبرايل" },
        places: 25,
        diplome: {
          fr: "Diplôme du premier cycle de l'enseignement supérieur en sciences sociales ou équivalent obtenu après le baccalauréat",
          ar: "شهادة السلك الأول من التعليم العالي في العلوم الاجتماعية أو ما يعادلها يتم الحصول عليها بعد البكالوريا",
        },
      },
      {
        ministere: "MASEF",
        ministereFull: {
          fr: "Ministère de l'Action Sociale, de l'Enfance et de la Famille",
          ar: "وزارة العمل الاجتماعي والطفولة والأسرة",
        },
        corps: { fr: "Formateur en promotion féminine", ar: "مكون للترقية النسوية" },
        places: 25,
        diplome: {
          fr: "Diplôme du premier cycle de l'enseignement supérieur en sciences sociales ou équivalent obtenu après le baccalauréat",
          ar: "شهادة السلك الأول من التعليم العالي في العلوم الاجتماعية أو ما يعادلها يتم الحصول عليها بعد البكالوريا",
        },
      },
      {
        ministere: "MASEF",
        ministereFull: {
          fr: "Ministère de l'Action Sociale, de l'Enfance et de la Famille",
          ar: "وزارة العمل الاجتماعي والطفولة والأسرة",
        },
        corps: { fr: "Contrôleur de jardins d'enfants", ar: "مراقب حدائق أطفال" },
        places: 20,
        diplome: { fr: "Baccalauréat", ar: "شهادة البكالوريا" },
      },
      {
        ministere: "MAJESSC",
        ministereFull: {
          fr: "Ministère de l'Autonomisation de la Jeunesse, de l'Emploi et de la Fonction Civile",
          ar: "وزارة تمكين الشباب والتشغيل والخدمة المدنية",
        },
        corps: { fr: "Commissaire de la jeunesse", ar: "مفوض شباب" },
        places: 10,
        diplome: { fr: "Baccalauréat", ar: "شهادة البكالوريا" },
      },
    ],
  },
  {
    slug: "enseignement-2026",
    titre: {
      fr: "Concours de recrutement externe de 2 720 enseignants de l'enseignement secondaire général et technique, au profit du Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
      ar: "مسابقة اكتتاب خارجي لألفين وسبعمائة وعشرين (2720) عنصرا لصالح وزارة التربية وإصلاح النظام التعليمي",
    },
    organisateur: {
      fr: "Le Ministère de l'Éducation et de la Réforme du Système d'Enseignement (avec le Ministère de la Fonction Publique et du Travail et la Commission Nationale des Concours)",
      ar: "وزارة التربية وإصلاح النظام التعليمي (بالاشتراك مع وزارة الوظيفة العمومية والعمل واللجنة الوطنية للمسابقات)",
    },
    totalPlaces: 2720,
    dateDebut: "2026-09-12T08:00:00+00:00",
    dateFin: "2026-09-13T23:59:59+00:00",
    lieu: {
      fr: "Les épreuves se dérouleront dans les locaux de l'Université de Nouakchott",
      ar: "ستجرى الاختبارات بمباني جامعة نواكشوط",
    },
    ageMin: 18,
    ageMax: 40,
    conditionNationalite: {
      fr: "Être de nationalité mauritanienne",
      ar: "أن يكون المترشح موريتاني الجنسية",
    },
    conditionAge: {
      fr: "Être âgé(e) de 18 à 40 ans selon la filière (18-38 ans pour le recrutement de Maîtres principaux en formation, 18-37 ans pour les Maîtres en formation avec Baccalauréat ; certaines filières contractuelles, réservées aux prestataires de service déjà en poste, sont ouvertes aux plus de 40 ans)",
      ar: "أن يتراوح السن بين 18 و40 سنة حسب الشعبة (18-38 سنة لاكتتاب المعلمين الرئيسيين للتكوين، و18-37 سنة لمعلمي التكوين بشهادة الباكالوريا؛ وبعض شعب التعاقد المخصصة لمقدمي خدمة التعليم في الخدمة مفتوحة لمن تجاوزت أعمارهم 40 سنة)",
    },
    examDatesValue: {
      fr: "Candidatures en ligne du 31 août au 7 septembre 2026 (candidature.cnc.gov.mr) ; épreuves les 12 ou 13 septembre 2026 (horaire précisé ultérieurement selon la spécialité)",
      ar: "الترشح عن بعد من 31 أغسطس إلى 7 سبتمبر 2026 (candidature.cnc.gov.mr)؛ الامتحان يومي 12 أو 13 سبتمبر 2026 (يحدد التوقيت لاحقا حسب التخصص)",
    },
    postes: [
      {
        ministere: "MEN",
        ministereFull: {
          fr: "Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
          ar: "وزارة التربية وإصلاح النظام التعليمي",
        },
        corps: { fr: "Maître principal (recrutement pour formation)", ar: "معلم رئيسي (اكتتاب للتكوين)" },
        places: 1000,
        diplome: {
          fr: "Diplôme du premier cycle de l'enseignement supérieur",
          ar: "شهادة السلك الأول من التعليم العالي",
        },
      },
      {
        ministere: "MEN",
        ministereFull: {
          fr: "Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
          ar: "وزارة التربية وإصلاح النظام التعليمي",
        },
        corps: { fr: "Maître avec Baccalauréat (recrutement pour formation)", ar: "معلم بالبكالوريا (اكتتاب للتكوين)" },
        places: 1000,
        diplome: {
          fr: "Baccalauréat, ou relevé de notes du baccalauréat 2026",
          ar: "شهادة البكالوريا من التعليم الثانوي أو كشف درجات البكالوريا لسنة 2026",
        },
      },
      {
        ministere: "MEN",
        ministereFull: {
          fr: "Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
          ar: "وزارة التربية وإصلاح النظام التعليمي",
        },
        corps: { fr: "Professeur de lycée (recrutement direct, prestataires de service)", ar: "أستاذ ثانوية (اكتتاب مباشر من مقدمي خدمة التعليم)" },
        places: 3,
        diplome: {
          fr: "Baccalauréat et diplôme du second cycle de l'enseignement supérieur",
          ar: "شهادتا الباكالوريا والسلك الثاني من التعليم الجامعي",
        },
      },
      {
        ministere: "MEN",
        ministereFull: {
          fr: "Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
          ar: "وزارة التربية وإصلاح النظام التعليمي",
        },
        corps: { fr: "Professeur de collège (recrutement direct, prestataires de service)", ar: "أستاذ إعدادية (اكتتاب مباشر من مقدمي خدمة التعليم)" },
        places: 107,
        diplome: {
          fr: "Baccalauréat et diplôme du premier cycle de l'enseignement supérieur",
          ar: "شهادتا الباكالوريا والسلك الأول من التعليم الجامعي",
        },
      },
      {
        ministere: "MEN",
        ministereFull: {
          fr: "Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
          ar: "وزارة التربية وإصلاح النظام التعليمي",
        },
        corps: { fr: "Enseignant contractuel de collège (prestataires de service)", ar: "مدرس متعاقد للإعدادية (من مقدمي خدمة التعليم)" },
        places: 28,
        diplome: {
          fr: "Diplôme du premier cycle de l'enseignement supérieur",
          ar: "شهادة السلك الأول من التعليم العالي",
        },
      },
      {
        ministere: "MEN",
        ministereFull: {
          fr: "Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
          ar: "وزارة التربية وإصلاح النظام التعليمي",
        },
        corps: { fr: "Enseignant contractuel de lycée (prestataires de service)", ar: "مدرس متعاقد للثانوية (من مقدمي خدمة التعليم)" },
        places: 4,
        diplome: {
          fr: "Maîtrise ou Master",
          ar: "شهادة الميتريز أو الماستر",
        },
      },
      {
        ministere: "MEN",
        ministereFull: {
          fr: "Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
          ar: "وزارة التربية وإصلاح النظام التعليمي",
        },
        corps: { fr: "Maître (recrutement direct, prestataires de service)", ar: "معلم (اكتتاب مباشر من مقدمي خدمة التعليم)" },
        places: 443,
        diplome: {
          fr: "Être déjà prestataire de service d'enseignement en poste",
          ar: "أن يكون مقدم خدمة تعليم في الخدمة",
        },
      },
      {
        ministere: "MEN",
        ministereFull: {
          fr: "Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
          ar: "وزارة التربية وإصلاح النظام التعليمي",
        },
        corps: { fr: "Maître contractuel avec Baccalauréat (prestataires de service)", ar: "معلم متعاقد بشهادة الباكالوريا (من مقدمي خدمة التعليم)" },
        places: 93,
        diplome: {
          fr: "Baccalauréat de l'enseignement secondaire",
          ar: "شهادة باكالوريا التعليم الثانوي",
        },
      },
      {
        ministere: "MEN",
        ministereFull: {
          fr: "Ministère de l'Éducation et de la Réforme du Système d'Enseignement",
          ar: "وزارة التربية وإصلاح النظام التعليمي",
        },
        corps: { fr: "Maître contractuel avec BEPC (prestataires de service)", ar: "معلم متعاقد بشهادة ختم الدروس الإعدادية (من مقدمي خدمة التعليم)" },
        places: 42,
        diplome: {
          fr: "Brevet d'études du premier cycle (BEPC)",
          ar: "شهادة ختم الدروس الإعدادية",
        },
      },
    ],
  },
];

/** The concours candidates actually register and practice for on Delili —
 * used for the homepage/dashboard countdown and CTA. The other entries in
 * CONCOURS_LIST are informational only (shown on /concours) until practice
 * exams exist for them too. */
export const FEATURED_CONCOURS = CONCOURS_LIST[0];
