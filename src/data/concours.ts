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

export const CONCOURS = {
  titre: {
    fr: "Concours externe de recrutement de 310 unités pour l'accès à la formation à l'ENAJM, l'ISMPJ, l'ENAS et l'ISJS",
    ar: "مسابقة خارجية لتوظيف 310 وحدة للالتحاق بالتكوين بالمدرسة الوطنية للإدارة والصحافة والقضاء، والمعهد العالي للقضاء والمهن القضائية، والمدرسة الوطنية للعمل الاجتماعي، والمعهد العالي للشباب والرياضة",
  } satisfies Localized,
  organisateur: {
    fr: "Le Ministère de la Fonction Publique et du Travail et la Commission Nationale des Concours",
    ar: "وزارة الوظيفة العمومية والعمل واللجنة الوطنية للمسابقات",
  } satisfies Localized,
  totalPlaces: 310,
  dateDebut: "2026-09-12T10:00:00+00:00",
  dateFin: "2026-09-13T23:59:59+00:00",
  lieu: {
    fr: "Le centre sera précisé par communiqué",
    ar: "سيتم تحديد المركز ببلاغ لاحق",
  } satisfies Localized,
  ageMin: 18,
  ageMax: 37,
  conditionNationalite: {
    fr: "Être de nationalité mauritanienne",
    ar: "أن يكون المترشح موريتاني الجنسية",
  } satisfies Localized,
  conditionAge: {
    fr: "Être âgé(e) de 18 ans au moins et de 37 ans au plus à la date d'ouverture de la candidature",
    ar: "أن يتراوح سنه بين 18 سنة على الأقل و37 سنة على الأكثر في تاريخ فتح باب الترشح",
  } satisfies Localized,
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
  ] satisfies Localized[],
} as const;

export const POSTES: Poste[] = [
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
];
