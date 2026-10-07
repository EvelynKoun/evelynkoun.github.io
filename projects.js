/*
  Site + project data. Shared by every page (nav, footer, Work page, "More work" rows).

  To add a case study:
    1. Copy case-study-template.html  ->  your-project.html   (keep it in this folder)
    2. Put its images in images/your-project/
    3. Add one entry to PROJECTS below. It appears on the Work page, in the footer
       and in the "More work this way" row of every other case study.
*/
window.SITE = {
  name: 'Evelina Kounoukla',
  email: 'evelynkounoukla@gmail.com',
  tagline: 'UI/UX/Product designer currently crafting experiences at Trasys',
  resume: 'evelina-kounoukla-resume.pdf',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/evelynkounoukla/' }
  ]
};

window.PROJECTS = [
  {
    slug: 'risk-management',
    href: 'risk-management.html',
    title: 'Risk Management',                       // card + page title
    subtitle: 'Product design · FinTech · Banking',  // card subtitle
    footerLabel: 'Risk Management: Platform UX & Design System',
    years: [2017, 2018],
    cover: 'images/risk-management/dashboard-dark.png'
  },
  {
    slug: 'chemical-data',
    href: 'chemical-data.html',
    title: 'Chemical Data',
    subtitle: 'Web & mobile app · Science',
    footerLabel: 'Chemical Data: Web & Mobile App',
    years: [2024],
    cover: 'images/chemical-data/web-details.png'
  },
  {
    slug: 'estat-web-admin',
    href: 'estat-web-admin.html',
    title: 'Estat Web Admin',
    subtitle: 'eUI design system · Public sector',
    footerLabel: 'Estat Web Admin: eUI Redesign',
    years: [],                                       // add years when known
    cover: 'images/estat-web-admin/new-objects.png'
  }
];
