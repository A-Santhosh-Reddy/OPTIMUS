"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "es" | "fr" | "de";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeName: "English (US)", flag: "🇺🇸" },
  { code: "es", label: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", label: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", label: "German", nativeName: "Deutsch", flag: "🇩🇪" },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Navigation
    "nav.dashboard": "Security Dashboard",
    "nav.analyzer": "URL & Threat Analyzer",
    "nav.findings": "Threat Findings",
    "nav.incidents": "Incident Cases",
    "nav.brands": "Brand Protection",
    "nav.threatIntel": "Threat Intelligence",
    "nav.auditLogs": "Security Audit Logs",
    "nav.heuristicCore": "Heuristic Core",
    "nav.online": "ONLINE",

    // User Menu
    "menu.upgrade": "Upgrade plan",
    "menu.personalization": "Personalization",
    "menu.profile": "Profile",
    "menu.settings": "Settings",
    "menu.help": "Help Desk & AI Copilot",
    "menu.logout": "Log out",
    "menu.loggingOut": "Signing out...",

    // Topbar
    "topbar.shield": "CYBER MATRIX SHIELD",
    "topbar.ssrfPill": "SSRF-SAFE LEXICAL ANALYSIS",
    "topbar.signOut": "Sign Out",
    "topbar.notifications": "Security Notifications",
    "topbar.notifSub": "Live SOC telemetry & incident feed",
    "topbar.readAll": "Read All",
    "topbar.all": "All",
    "topbar.unread": "Unread",
    "topbar.critical": "High/Critical",
    "topbar.testAlert": "+ Test Alert",
    "topbar.clearList": "Clear List",
    "topbar.inspect": "Inspect",
    "topbar.allClear": "All Clear • No Alerts",

    // Personalization Modal
    "personalization.title": "CYBER INTERFACE PERSONALIZATION",
    "personalization.desc": "Configure your SOC console language, audio, visuals, and telemetry preferences.",
    "personalization.language": "Console Language",
    "personalization.languageSub": "Select primary interface display locale",
    "personalization.audio": "Audio Telemetry Cues",
    "personalization.audioSub": "Play synthetic frequency beep on threat detection",
    "personalization.testAudio": "Test",
    "personalization.grid": "Holographic Cyber Grid",
    "personalization.gridSub": "Render matrix grid overlay in background",
    "personalization.refresh": "Telemetry Stream Refresh",
    "personalization.refreshSub": "Dashboard live polling interval",
    "personalization.save": "Save Preferences",
    "personalization.saved": "Personalization preferences saved successfully!",
    "personalization.savedLocale": "Interface language updated to",

    // Settings Modal
    "settings.title": "SOC HEURISTIC ENGINE SETTINGS",
    "settings.desc": "Adjust detection rule parameters and risk score calibration.",
    "settings.critical": "Critical Threshold",
    "settings.criticalSub": "Triggers immediate takedown notice alert",
    "settings.ssrf": "SSRF Safety Mode",
    "settings.ssrfSub": "Zero outbound HTTP GET/POST to untrusted targets",
    "settings.shannon": "Shannon Entropy Limit",
    "settings.shannonSub": "Classifies randomized DGA and token strings",
    "settings.levenshtein": "Levenshtein Edit Max",
    "settings.levenshteinSub": "Fuzzy typosquatting brand matching range",
    "settings.save": "Save Heuristic Rules",

    // General Dashboard
    "dash.welcome": "Welcome back",
    "dash.activeThreats": "Active Threats",
    "dash.scannedUrls": "Monitored Domains",
    "dash.brandAssets": "Brand Assets",
    "dash.incidents": "Open Incidents",
    "dash.quickAnalyze": "Instant Threat Vector Scan",
    "dash.analyzeBtn": "Analyze URL",
  },
  es: {
    // Navigation
    "nav.dashboard": "Panel de Seguridad",
    "nav.analyzer": "Analizador de URLs y Amenazas",
    "nav.findings": "Hallazgos de Amenazas",
    "nav.incidents": "Casos de Incidentes",
    "nav.brands": "Protección de Marca",
    "nav.threatIntel": "Inteligencia de Amenazas",
    "nav.auditLogs": "Registros de Auditoría",
    "nav.heuristicCore": "Núcleo Heurístico",
    "nav.online": "EN LÍNEA",

    // User Menu
    "menu.upgrade": "Mejorar plan",
    "menu.personalization": "Personalización",
    "menu.profile": "Perfil de Analista",
    "menu.settings": "Configuración del Motor",
    "menu.help": "Soporte y Copiloto IA",
    "menu.logout": "Cerrar sesión",
    "menu.loggingOut": "Cerrando sesión...",

    // Topbar
    "topbar.shield": "ESCUDO MATRIZ CIBERNÉTICA",
    "topbar.ssrfPill": "ANÁLISIS LÉXICO SEGURO (ANTI-SSRF)",
    "topbar.signOut": "Cerrar Sesión",
    "topbar.notifications": "Notificaciones de Seguridad",
    "topbar.notifSub": "Telemetría SOC en vivo y flujo de incidentes",
    "topbar.readAll": "Marcar Todo Leído",
    "topbar.all": "Todos",
    "topbar.unread": "No leídos",
    "topbar.critical": "Críticos / Altos",
    "topbar.testAlert": "+ Alerta de Prueba",
    "topbar.clearList": "Limpiar Lista",
    "topbar.inspect": "Inspeccionar",
    "topbar.allClear": "Todo Despejado • Sin Alertas",

    // Personalization Modal
    "personalization.title": "PERSONALIZACIÓN DE LA INTERFAZ CIBERNÉTICA",
    "personalization.desc": "Configure el idioma, sonido, gráficos y telemetría de su consola SOC.",
    "personalization.language": "Idioma de la Consola",
    "personalization.languageSub": "Seleccione el idioma principal de la interfaz",
    "personalization.audio": "Alertas de Audio Sintético",
    "personalization.audioSub": "Reproducir tono de frecuencia al detectar amenazas",
    "personalization.testAudio": "Probar",
    "personalization.grid": "Cuadrícula Holográfica Cyber",
    "personalization.gridSub": "Mostrar superposición de matriz en el fondo",
    "personalization.refresh": "Cadencia de Actualización",
    "personalization.refreshSub": "Intervalo de sondeo en vivo del panel",
    "personalization.save": "Guardar Preferencias",
    "personalization.saved": "¡Preferencias de personalización guardadas con éxito!",
    "personalization.savedLocale": "Idioma de la interfaz actualizado a",

    // Settings Modal
    "settings.title": "CONFIGURACIÓN DEL MOTOR HEURÍSTICO SOC",
    "settings.desc": "Ajuste las reglas de detección y calibración de riesgo.",
    "settings.critical": "Umbral Crítico",
    "settings.criticalSub": "Activa aviso de eliminación inmediata",
    "settings.ssrf": "Modo de Seguridad SSRF",
    "settings.ssrfSub": "Cero conexiones salientes a objetivos no verificados",
    "settings.shannon": "Límite de Entropía de Shannon",
    "settings.shannonSub": "Clasifica cadenas aleatorias DGA y credenciales",
    "settings.levenshtein": "Distancia Levenshtein Máxima",
    "settings.levenshteinSub": "Rango de coincidencia difusa para typosquatting",
    "settings.save": "Guardar Reglas Heurísticas",

    // General Dashboard
    "dash.welcome": "Bienvenido de nuevo",
    "dash.activeThreats": "Amenazas Activas",
    "dash.scannedUrls": "Dominios Monitoreados",
    "dash.brandAssets": "Activos de Marca",
    "dash.incidents": "Incidentes Abiertos",
    "dash.quickAnalyze": "Escaneo Instantáneo de Amenazas",
    "dash.analyzeBtn": "Analizar URL",
  },
  fr: {
    // Navigation
    "nav.dashboard": "Tableau de Bord Sécurité",
    "nav.analyzer": "Analyseur d'URL & Menaces",
    "nav.findings": "Détections de Menaces",
    "nav.incidents": "Dossiers d'Incidents",
    "nav.brands": "Protection de Marque",
    "nav.threatIntel": "Renseignement Menaces",
    "nav.auditLogs": "Journaux d'Audit Sécurité",
    "nav.heuristicCore": "Cœur Heuristique",
    "nav.online": "EN LIGNE",

    // User Menu
    "menu.upgrade": "Mettre à niveau",
    "menu.personalization": "Personnalisation",
    "menu.profile": "Profil Analyste",
    "menu.settings": "Paramètres Moteur",
    "menu.help": "Assistance & Copilote IA",
    "menu.logout": "Se déconnecter",
    "menu.loggingOut": "Déconnexion...",

    // Topbar
    "topbar.shield": "BOUCLIER MATRICE CYBER",
    "topbar.ssrfPill": "ANALYSE LEXICALE SANS SSRF",
    "topbar.signOut": "Déconnexion",
    "topbar.notifications": "Notifications de Sécurité",
    "topbar.notifSub": "Télémétrie SOC en direct & flux d'incidents",
    "topbar.readAll": "Tout Marquer Lu",
    "topbar.all": "Tous",
    "topbar.unread": "Non lus",
    "topbar.critical": "Critiques / Élevés",
    "topbar.testAlert": "+ Alerte Test",
    "topbar.clearList": "Vider la Liste",
    "topbar.inspect": "Inspecter",
    "topbar.allClear": "Zone Sûre • Aucune Alerte",

    // Personalization Modal
    "personalization.title": "PERSONNALISATION DE L'INTERFACE CYBER",
    "personalization.desc": "Configurez la langue, le son, le visuel et la télémétrie de la console SOC.",
    "personalization.language": "Langue de la Console",
    "personalization.languageSub": "Sélectionnez la langue principale d'affichage",
    "personalization.audio": "Indices Sonores de Télémétrie",
    "personalization.audioSub": "Émettre un signal sonore lors d'une détection de menace",
    "personalization.testAudio": "Tester",
    "personalization.grid": "Grille Cyber Holographique",
    "personalization.gridSub": "Afficher la matrice en arrière-plan",
    "personalization.refresh": "Fréquence de Rafraîchissement",
    "personalization.refreshSub": "Intervalle d'actualisation en direct du tableau",
    "personalization.save": "Enregistrer les Préférences",
    "personalization.saved": "Préférences de personnalisation enregistrées avec succès !",
    "personalization.savedLocale": "Langue de l'interface modifiée en",

    // Settings Modal
    "settings.title": "PARAMÈTRES DU MOTEUR HEURISTIQUE SOC",
    "settings.desc": "Ajustez les règles de détection et le score de risque.",
    "settings.critical": "Seuil Critique",
    "settings.criticalSub": "Déclenche une notification immédiate de retrait",
    "settings.ssrf": "Mode Sécurité SSRF",
    "settings.ssrfSub": "Zéro requête sortante HTTP vers les cibles",
    "settings.shannon": "Limite d'Entropie de Shannon",
    "settings.shannonSub": "Classifie les algorithmes DGA et jetons aléatoires",
    "settings.levenshtein": "Distance Levenshtein Max",
    "settings.levenshteinSub": "Portée de détection du typosquattage de marque",
    "settings.save": "Enregistrer les Règles Heuristiques",

    // General Dashboard
    "dash.welcome": "Bienvenue",
    "dash.activeThreats": "Menaces Actives",
    "dash.scannedUrls": "Domaines Surveillés",
    "dash.brandAssets": "Actifs de Marque",
    "dash.incidents": "Incidents Ouverts",
    "dash.quickAnalyze": "Scan Immédiat de Vecteurs de Menaces",
    "dash.analyzeBtn": "Analyser l'URL",
  },
  de: {
    // Navigation
    "nav.dashboard": "Sicherheits-Dashboard",
    "nav.analyzer": "URL- & Bedrohungs-Analyzer",
    "nav.findings": "Bedrohungs-Ergebnisse",
    "nav.incidents": "Vorfalls-Fälle",
    "nav.brands": "Markenschutz",
    "nav.threatIntel": "Bedrohungsinformationen",
    "nav.auditLogs": "Sicherheits-Audit-Logs",
    "nav.heuristicCore": "Heuristischer Kern",
    "nav.online": "ONLINE",

    // User Menu
    "menu.upgrade": "Plan upgraden",
    "menu.personalization": "Personalisierung",
    "menu.profile": "Analysten-Profil",
    "menu.settings": "Engine-Einstellungen",
    "menu.help": "Helpdesk & KI-Copilot",
    "menu.logout": "Abmelden",
    "menu.loggingOut": "Abmeldung läuft...",

    // Topbar
    "topbar.shield": "CYBER-MATRIX-SCHUTZSCHILD",
    "topbar.ssrfPill": "SSRF-SICHERE LEXIKALISCHE ANALYSE",
    "topbar.signOut": "Abmelden",
    "topbar.notifications": "Sicherheits-Benachrichtigungen",
    "topbar.notifSub": "Live-SOC-Telemetrie & Vorfalls-Feed",
    "topbar.readAll": "Alle gelesen",
    "topbar.all": "Alle",
    "topbar.unread": "Ungelesen",
    "topbar.critical": "Hoch / Kritisch",
    "topbar.testAlert": "+ Test-Alarm",
    "topbar.clearList": "Liste leeren",
    "topbar.inspect": "Prüfen",
    "topbar.allClear": "Alles sicher • Keine Alarme",

    // Personalization Modal
    "personalization.title": "CYBER-INTERFACE-PERSONALISIERUNG",
    "personalization.desc": "Konfigurieren Sie Konsolen-Sprache, Audio, Visuals und Telemetrie.",
    "personalization.language": "Konsolen-Sprache",
    "personalization.languageSub": "Wählen Sie die primäre Anzeigesprache der Benutzeroberfläche",
    "personalization.audio": "Audio-Telemetrie-Signale",
    "personalization.audioSub": "Synthetischen Signalton bei Bedrohungserkennung abspielen",
    "personalization.testAudio": "Testen",
    "personalization.grid": "Holografisches Cyber-Raster",
    "personalization.gridSub": "Matrix-Gitter im Hintergrund einblenden",
    "personalization.refresh": "Telemetrie-Aktualisierungsrate",
    "personalization.refreshSub": "Live-Abfrageintervall des Dashboards",
    "personalization.save": "Einstellungen speichern",
    "personalization.saved": "Personalisierungseinstellungen erfolgreich gespeichert!",
    "personalization.savedLocale": "Oberflächensprache aktualisiert auf",

    // Settings Modal
    "settings.title": "SOC-HEURISTIK-ENGINE-EINSTELLUNGEN",
    "settings.desc": "Erkennungsregeln und Risikoskalierung anpassen.",
    "settings.critical": "Kritischer Schwellenwert",
    "settings.criticalSub": "Löst sofortigen Deaktivierungs-Alarm aus",
    "settings.ssrf": "SSRF-Sicherheitsmodus",
    "settings.ssrfSub": "Keine ausgehenden HTTP-Verbindungen zu Zielen",
    "settings.shannon": "Shannon-Entropie-Limit",
    "settings.shannonSub": "Klassifiziert zufällige DGA- und Token-Zeichenfolgen",
    "settings.levenshtein": "Levenshtein-Distanz Max",
    "settings.levenshteinSub": "Toleranzbereich für Typosquatting-Markenabgleich",
    "settings.save": "Heuristikregeln speichern",

    // General Dashboard
    "dash.welcome": "Willkommen zurück",
    "dash.activeThreats": "Aktive Bedrohungen",
    "dash.scannedUrls": "Überwachte Domains",
    "dash.brandAssets": "Markenwerte",
    "dash.incidents": "Offene Vorfälle",
    "dash.quickAnalyze": "Sofortiger Bedrohungs-Vektor-Scan",
    "dash.analyzeBtn": "URL analysieren",
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  currentOption: LanguageOption;
  availableLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  currentOption: SUPPORTED_LANGUAGES[0],
  availableLanguages: SUPPORTED_LANGUAGES,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  // Load persisted language from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("optimus_language") as LanguageCode;
      if (saved && ["en", "es", "fr", "de"].includes(saved)) {
        setLanguageState(saved);
        if (typeof document !== "undefined") {
          document.documentElement.lang = saved;
        }
      }
    } catch {
      // localStorage may fail in restricted sandbox environments
    }
  }, []);

  const setLanguage = (newLang: LanguageCode) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem("optimus_language", newLang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = newLang;
      }
    } catch {}
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  const currentOption =
    SUPPORTED_LANGUAGES.find((opt) => opt.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentOption,
        availableLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
