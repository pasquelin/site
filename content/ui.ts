import type { I18n, Lang } from './types'

export const t = (s: I18n, lang: Lang): string => s[lang]

export const UI = {
  // Navigation — file names in dev mode, plain words in human mode.
  nav: {
    whoami: { file: 'whoami.ts', label: { fr: 'Profil', en: 'Profile' } },
    experience: { file: 'experience/', label: { fr: 'Parcours', en: 'Experience' } },
    projects: { file: 'projects/', label: { fr: 'Projets', en: 'Projects' } },
    ai: { file: 'ai.md', label: { fr: 'IA', en: 'AI' } },
    contact: { file: 'contact.sh', label: { fr: 'Contact', en: 'Contact' } },
  },

  mode: {
    human: { fr: 'humain', en: 'human' },
    dev: { fr: 'dev', en: 'dev' },
    switchTo: {
      fr: 'Basculer la présentation',
      en: 'Switch presentation',
    },
  },

  available: { fr: 'Disponible', en: 'Available' },
  availableLong: {
    fr: 'Disponible pour des missions freelance',
    en: 'Available for freelance work',
  },

  actions: {
    contact: { fr: 'Me contacter', en: 'Get in touch' },
    downloadCv: { fr: 'Télécharger le CV', en: 'Download CV' },
    viewSource: { fr: 'Voir le code source', en: 'View source' },
    liveDemo: { fr: 'Démo en ligne', en: 'Live demo' },
    openScene: { fr: 'Visualiser', en: 'Visualise' },
    closeScene: { fr: 'Fermer la visualisation', en: 'Close visualisation' },
    openTerminal: { fr: 'Ouvrir le terminal', en: 'Open terminal' },
    closeTerminal: { fr: 'Réduire le terminal', en: 'Collapse terminal' },
    back: { fr: 'Retour', en: 'Back' },
  },

  headings: {
    experience: { fr: 'Parcours', en: 'Experience' },
    projects: { fr: 'Projets', en: 'Projects' },
    stack: { fr: 'Technologies', en: 'Technologies' },
    awards: { fr: 'Distinctions', en: 'Awards' },
    clients: { fr: 'Clients', en: 'Clients' },
    doctrine: { fr: 'Méthode', en: 'Method' },
    results: { fr: 'Résultats', en: 'Results' },
    elsewhere: { fr: 'Ailleurs', en: 'Elsewhere' },
    inspector: { fr: 'Inspecteur', en: 'Inspector' },
    links: { fr: 'Liens', en: 'Links' },
    availability: { fr: 'Disponibilité', en: 'Availability' },
    rates: { fr: 'Tarifs', en: 'Rates' },
    services: { fr: 'Prestations', en: 'Services' },
    edge: { fr: 'Ce qui me distingue', en: 'What sets me apart' },
    education: { fr: 'Formation', en: 'Education' },
    languages: { fr: 'Langues', en: 'Languages' },
  },

  contact: {
    title: { fr: 'Parlons de votre projet', en: 'Let us talk about your project' },
    intro: {
      fr: "Décrivez le besoin en quelques lignes. Je réponds sous 24 heures ouvrées.",
      en: 'Describe the need in a few lines. I reply within one working day.',
    },
    name: { fr: 'Votre nom', en: 'Your name' },
    email: { fr: 'Votre email', en: 'Your email' },
    company: { fr: 'Société (facultatif)', en: 'Company (optional)' },
    message: { fr: 'Votre message', en: 'Your message' },
    messagePlaceholder: {
      fr: 'Le contexte, ce que vous cherchez à construire, et le calendrier si vous en avez un.',
      en: 'The context, what you are trying to build, and the timeline if you have one.',
    },
    send: { fr: 'Envoyer le message', en: 'Send message' },
    sending: { fr: 'Envoi en cours', en: 'Sending' },
    sent: { fr: 'Message envoyé. Je reviens vers vous sous 24 heures ouvrées.', en: 'Message sent. I will come back to you within one working day.' },
    failed: {
      fr: "L'envoi a échoué. Écrivez-moi directement à",
      en: 'Sending failed. Write to me directly at',
    },
    errName: { fr: 'Indiquez votre nom.', en: 'Enter your name.' },
    errEmail: { fr: 'Indiquez une adresse email valide.', en: 'Enter a valid email address.' },
    errMessage: { fr: 'Écrivez quelques mots sur votre projet.', en: 'Write a few words about your project.' },
    orDirect: { fr: 'Ou directement', en: 'Or directly' },
    throttled: {
      fr: 'Trop de messages envoyés depuis cette connexion. Réessayez dans quelques minutes, ou écrivez à',
      en: 'Too many messages from this connection. Try again in a few minutes, or write to',
    },
  },

  meta: {
    experienceIntro: {
      fr: 'Les missions et les entreprises, avec ce qui en est sorti.',
      en: 'The engagements and the companies, and what came out of them.',
    },
    projectsIntro: {
      fr: 'Des produits complets, construits seul, du moteur jusqu’à l’interface.',
      en: 'Whole products, built solo, from the engine up to the interface.',
    },
  },
} as const
