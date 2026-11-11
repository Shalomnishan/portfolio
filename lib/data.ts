export const profile = {
  name: "Shalom Nishan D",
  role: "AI & Data Science Student · Aspiring Data Engineer",
  location: "Kanyakumari, Tamil Nadu, India",
  city: "Kanyakumari",
  email: "shalomnishan1153@gmail.com",
  linkedin: "https://linkedin.com/in/shalom-nishan-15b3152b5",
  linkedinHandle: "in/shalom-nishan-15b3152b5",
  github: "https://github.com/dyson-25",
  githubHandle: "github.com/dyson-25",
  bio: "AI & Data Science student focused on Data Engineering and emerging tech, applying hands-on skills from internships in Flutter development and machine learning.",
};

export const stats = [
  { value: "2", unit: "", label: "Internships" },
  { value: "5", unit: "months", label: "Flutter dev experience" },
  { value: "7.66", unit: "", label: "CGPA" },
];

export type WorkItem = {
  kind: string;
  meta: string;
  title: string;
  org?: string;
  bullets: string[];
  chips: string[];
  link?: { href: string; label: string };
};

export const work: WorkItem[] = [
  {
    kind: "Project",
    meta: "IoT · Embedded",
    title: "Smart Attendance System",
    bullets: [
      "Built an IoT attendance system with ESP32-CAM that captures images and records attendance in real time.",
      "Integrated Firebase for secure cloud storage and real-time sync over Wi-Fi.",
      "Designed a low-cost automated solution that cut manual attendance work and improved accuracy.",
    ],
    chips: ["ESP32-CAM", "Firebase", "Embedded C/C++", "IoT", "Wi-Fi"],
    link: {
      href: "https://github.com/dyson-25/SMATR-ATTENDANCE",
      label: "View code",
    },
  },
  {
    kind: "Internship",
    meta: "Dec 2024 – May 2025",
    title: "Frontend Developer Intern",
    org: "Flutter Frog Software Solutions",
    bullets: [
      "Built real-time Flutter apps with Dart and Firebase.",
      "Developed responsive UIs and integrated Firebase services.",
      "Five months of hands-on frontend work, December 2024 to May 2025.",
    ],
    chips: ["Flutter", "Dart", "Firebase"],
  },
  {
    kind: "Internship",
    meta: "Jun 2025 – Jul 2025",
    title: "Machine Learning Intern",
    org: "GenLab IB",
    bullets: [
      "Worked on ML projects covering data collection, preprocessing and analysis.",
      "Took models through building and evaluation.",
      "Used Python, NumPy, Pandas, TensorFlow, Scikit-learn and Jupyter in a team.",
    ],
    chips: ["Python", "NumPy", "Pandas", "TensorFlow", "Scikit-learn", "Jupyter"],
  },
];

export const stack = [
  "Python",
  "Java",
  "Dart",
  "Flutter",
  "HTML",
  "CSS",
  "Firebase",
  "ESP32-CAM",
  "Embedded C/C++",
  "IoT",
  "NumPy",
  "Pandas",
  "TensorFlow",
  "Scikit-learn",
  "Jupyter",
  "Power BI",
  "Microsoft Excel",
  "Microsoft 365",
];

export type RecordItem = { when: string; title: string; org: string; note?: string };

export const record: { group: string; items: RecordItem[] }[] = [
  {
    group: "Internships",
    items: [
      { when: "Jun 2025 – Jul 2025", title: "Machine Learning Intern", org: "GenLab IB" },
      {
        when: "Dec 2024 – May 2025",
        title: "Frontend Developer Intern",
        org: "Flutter Frog Software Solutions",
      },
    ],
  },
  {
    group: "Education",
    items: [
      {
        when: "2023 – 2027",
        title: "B.Tech, Artificial Intelligence & Data Science",
        org: "Stella Mary's College of Engineering (Anna University), Kanyakumari",
        note: "CGPA 7.66",
      },
      { when: "2021 – 2023", title: "HSC", org: "Carmel Higher Secondary School" },
      { when: "2020 – 2021", title: "SSLC", org: "Carmel Higher Secondary School" },
    ],
  },
  {
    group: "Certifications",
    items: [
      { when: "Certificate", title: "Python", org: "CSC" },
      { when: "Certificate", title: "Web Development", org: "Inbox Info Solutions" },
    ],
  },
];

export const about = [
  "I'm an AI & Data Science student at Stella Mary's College of Engineering in Kanyakumari, focused on Data Engineering and emerging tech.",
  "I apply hands-on skills from internships in Flutter development and machine learning. The areas I care most about are Data Engineering, Generative AI and Machine Learning.",
];

export const interests = ["Data Engineering", "Generative AI", "Machine Learning"];

export const softSkills = [
  "Problem Solving",
  "Decision Making",
  "Public Speaking",
  "Teamwork",
  "Adaptability",
  "Time Management",
];

export const principles = [
  {
    title: "Learn by building",
    body: "I understand a tool best once I've made something real with it.",
  },
  {
    title: "Keep it simple",
    body: "Start with the simplest thing that works, then improve it.",
  },
  {
    title: "Check the data first",
    body: "Look at what the data says before deciding what to do.",
  },
  {
    title: "Finish what I start",
    body: "A small project that works beats a big one left half done.",
  },
];

export const agents = [
  { name: "Scout", color: "#ff3b2f" },
  { name: "Layout", color: "#3b82f6" },
  { name: "Typeset", color: "#f59e0b" },
  { name: "Motion", color: "#22c55e" },
  { name: "QA", color: "#06b6d4" },
  { name: "Deploy", color: "#f472b6" },
  { name: "Copy", color: "#f97316" },
  { name: "Render", color: "#e4e4e7" },
];
