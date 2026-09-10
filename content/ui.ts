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
    cvPdf: { fr: 'CV en PDF', en: 'CV as PDF' },
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
    cv: { fr: 'CV', en: 'CV' },
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
    description: {
      fr: "Contacter Alban Pasquelin, architecte logiciel et lead tech freelance : formulaire, email et téléphone, disponibilité immédiate, tarifs et zones d'intervention — Paris, Suisse romande, remote Europe.",
      en: 'Contact Alban Pasquelin, freelance software architect and tech lead: form, email and phone, immediate availability, rates and coverage — Paris, French-speaking Switzerland, remote across Europe.',
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
    experienceDescription: {
      fr: "Vingt ans de missions d'Alban Pasquelin : cofondateur et CTO de GoSecure, CTO de RetroRoads, architecte IPTV de MyTF1 chez e-TF1, responsable de la refonte du CMS Edito, premier responsable du pôle TV de Molotov TV.",
      en: 'Twenty years of engagements by Alban Pasquelin: co-founder and CTO of GoSecure, CTO of RetroRoads, IPTV architect of MyTF1 at e-TF1, lead on the Edito CMS rebuild, first head of the TV division at Molotov TV.',
    },
    projectsIntro: {
      fr: 'Des produits complets, construits seul, du moteur jusqu’à l’interface.',
      en: 'Whole products, built solo, from the engine up to the interface.',
    },
    projectsDescription: {
      fr: "Les produits qu'Alban Pasquelin construit seul, du moteur temps réel jusqu'à l'interface : AI Desktop Studio et ses 310 actions pilotables par un agent, la librairie de cartographie 3D map3D, le châssis d'application panels en 8 ko, et un SDK mobile de capture vidéo.",
      en: 'The products Alban Pasquelin builds solo, from the real-time engine up to the interface: AI Desktop Studio with its 310 agent-drivable actions, the map3D 3D mapping library, the 8 kB panels application chassis, and a mobile video capture SDK.',
    },
  },
} as const
