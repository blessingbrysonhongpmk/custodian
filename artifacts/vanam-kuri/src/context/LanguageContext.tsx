import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ta' | 'en';

export const translations = {
  en: {
    // Branding & Header
    govTitle: 'GOVT. OF TAMIL NADU',
    brandName: 'PASUMAI KAVAL',
    tagline: 'You Care. They Grow.',
    searchPlaceholder: 'Search trees, ID, locations...',
    notifications: 'Notifications',
    roleCustodian: 'Custodian',
    roleAdmin: 'Org Admin',
    rolePeerVerifier: 'Peer Verifier',
    
    // Sidebar Navigation
    navMain: 'MAIN',
    navTools: 'TOOLS',
    navSupport: 'SUPPORT',
    navDashboard: 'Dashboard',
    navPassport: 'Tree Passport (3D)',
    navMyTrees: 'My Trees',
    navCustodian: 'Custodian',
    navPeerVerifier: 'Peer Verifier',
    navMapView: 'Map View',
    navReports: 'Reports',
    navAnalytics: 'Analytics',
    navNotifications: 'Notifications',
    navHelpCenter: 'Help Center',
    navSettings: 'Settings',
    sidebarQuote: 'Every Tree We Protect, Protects Us.',
    sidebarSubQuote: 'Plant. Protect. Preserve. 🌿',
    registerNewTree: '+ Register New Tree',

    // Hero Section
    heroTitle: 'You Care,',
    heroTitleHighlight: 'They Grow.',
    heroSubtitle: 'Every checkpoint. Every update. A better tomorrow.',
    heroRecordUpdate: 'Record Update 🍃',
    trustScoreLabel: 'Trust Score',
    trustScoreBadge: 'Great Job!',

    // Stat Cards
    statMyTrees: 'My Trees',
    statMyTreesSub: 'Under your care',
    statFriendsTrees: "Friends' Trees",
    statFriendsTreesSub: 'You can view & help',
    statVerifications: 'Verifications Done',
    statVerificationsSub: 'This month',
    statPendingTasks: 'Pending Tasks',
    statPendingTasksSub: 'Action required',
    statContinuity: 'Custody Continuity',
    statContinuitySub: 'Great consistency',

    // Internal Tabs
    tabMyTrees: 'My Trees',
    tabFriendsTrees: "Friends' Trees",
    tabVerifications: 'My Verifications',
    tabHandovers: 'Handover Requests',
    tabActivity: 'Activity',

    // Filter Bar
    searchFilterPlaceholder: 'Search by tree ID, name, location...',
    filterAllStatus: 'All Status',
    filterAllLocations: 'All Locations',
    sortRecentlyUpdated: 'Sort: Recently Updated',
    showingTrees: 'Showing {count} of {total} trees',

    // Statuses
    statusAlive: 'Alive',
    statusAtRisk: 'At Risk',
    statusDead: 'Dead',
    statusNotFound: 'Not Found / Removed',
    badgeNative: 'Native',
    badgePlanted: 'Planted',

    // Tree Card Details
    labelPlantedOn: 'Planted On',
    labelLastVerified: 'Last Verified',
    labelNextCheckpoint: 'Next Checkpoint',
    labelHealthScore: 'Health Score',
    btnViewPassport: 'View Passport',
    btnRecordUpdate: 'Record Update',
    btnReportIssue: 'Report Issue',
    btnVerifyTree: 'Verify Tree',
    dueTomorrow: 'Tomorrow',
    dueInDays: 'in {days} days',

    // Right Rail Profile
    myProfileTitle: 'My Profile',
    editProfile: 'Edit Profile',
    verifiedCustodian: 'Verified Custodian',
    custodianId: 'Custodian ID',
    memberSince: 'Member since',

    // Right Rail Impact
    myImpactTitle: 'My Impact',
    myImpactSubtitle: 'This is your green impact! 🌿',
    co2Absorbed: 'CO₂ Absorbed',
    o2Generated: 'O₂ Generated',
    estimated: 'Estimated',
    treesUnderCare: 'Trees Under Care',
    checkpointsDone: 'Checkpoints Done',
    viewImpactDetails: 'View Impact Details →',

    // Right Rail Pending Tasks
    pendingTasksTitle: 'Pending Tasks',
    viewAll: 'View All',
    dueIn: 'Due in',

    // Quick Actions
    quickActionsTitle: 'Quick Actions',
    actionAddTree: 'Add / Register Tree',
    actionRecordMaintenance: 'Record Maintenance',
    actionVerifyTree: 'Verify Tree',
    actionReportIssue: 'Report Tree Issue',
    actionHandover: 'Handover Tree',
    actionSupport: 'Request Support',

    // Find Nearby Trees Banner
    findNearbyTitle: 'Find Nearby Trees',
    findNearbySubtitle: 'Explore trees in your area',
    btnOpenMap: 'Open Map View',

    // Other Views
    commandTitle: 'STATE OPERATIONAL COMMAND',
    commandSubtitle: 'TRACK RESPONSIBILITY. PROTECT EVERY TREE.',
    survivalAccountability: 'Survival Accountability',
    totalPlanted: 'Trees Planted',
    verifiedAlive: 'Verified Alive',
    verifiedSurvival: 'Verified Survival',
    atRisk: 'At Risk',
    treesNearYou: 'Trees Near You',
    verificationRequired: 'Verification Required',
    startVerification: 'Start Verification',
    compareReference: 'Compare Reference',
    landmark: 'Landmark',
  },
  ta: {
    // Branding & Header
    govTitle: 'தமிழ்நாடு அரசு',
    brandName: 'பசுமை காவல்',
    tagline: 'நீங்கள் காக்கிறீர்கள் • அவை வளர்கின்றன',
    searchPlaceholder: 'மரங்கள், ஐடி, இடங்களைத் தேடுங்கள்...',
    notifications: 'அறிவிப்புகள்',
    roleCustodian: 'பாதுகாவலர்',
    roleAdmin: 'நிர்வாகி',
    rolePeerVerifier: 'சரிபார்ப்பாளர்',

    // Sidebar Navigation
    navMain: 'முதன்மை',
    navTools: 'கருவிகள்',
    navSupport: 'ஆதரவு',
    navDashboard: 'முகப்பு பலகை',
    navPassport: 'மர பாஸ்போர்ட் (3D)',
    navMyTrees: 'என் மரங்கள்',
    navCustodian: 'பாதுகாவலர்',
    navPeerVerifier: 'சரிபார்ப்பாளர்',
    navMapView: 'வரைபடக் காட்சி',
    navReports: 'அறிக்கைகள்',
    navAnalytics: 'பகுப்பாய்வு',
    navNotifications: 'அறிவிப்புகள்',
    navHelpCenter: 'உதவி மையம்',
    navSettings: 'அமைப்புகள்',
    sidebarQuote: 'நாம் காக்கும் ஒவ்வொரு மரமும் நம்மை காக்கும்.',
    sidebarSubQuote: 'நடுவோம். காப்போம். வளர்ப்போம். 🌿',
    registerNewTree: '+ புதிய மரம் பதிவு',

    // Hero Section
    heroTitle: 'நீங்கள் காக்கிறீர்கள்,',
    heroTitleHighlight: 'அவை வளர்கின்றன.',
    heroSubtitle: 'ஒவ்வொரு சோதனை. ஒவ்வொரு புதுப்பிப்பு. பசுமையான எதிர்காலம்.',
    heroRecordUpdate: 'நிலை அறிக்கை பதிவு 🍃',
    trustScoreLabel: 'நம்பகத்தன்மை',
    trustScoreBadge: 'அருமை!',

    // Stat Cards
    statMyTrees: 'என் மரங்கள்',
    statMyTreesSub: 'உங்கள் நேரடிப் பொறுப்பில்',
    statFriendsTrees: 'நண்பர்கள் மரங்கள்',
    statFriendsTreesSub: 'பார்வையிட & உதவ',
    statVerifications: 'சரிபார்ப்புகள்',
    statVerificationsSub: 'இந்த மாதம் முடிந்தது',
    statPendingTasks: 'நிலுவை பணிகள்',
    statPendingTasksSub: 'நடவடிக்கை தேவை',
    statContinuity: 'பொறுப்புத் தொடர்ச்சி',
    statContinuitySub: 'சீரான பராமரிப்பு',

    // Internal Tabs
    tabMyTrees: 'என் மரங்கள்',
    tabFriendsTrees: 'நண்பர்களின் மரங்கள்',
    tabVerifications: 'என் சரிபார்ப்புகள்',
    tabHandovers: 'ஒப்படைப்பு கோரிக்கைகள்',
    tabActivity: 'செயல்பாடுகள்',

    // Filter Bar
    searchFilterPlaceholder: 'மர ஐடி, பெயர், இருப்பிடம் தேட...',
    filterAllStatus: 'அனைத்து நிலைகளும்',
    filterAllLocations: 'அனைத்து வளாகங்களும்',
    sortRecentlyUpdated: 'வரிசை: அண்மையில் புதுப்பித்தவை',
    showingTrees: '{total} மரங்களில் {count} காட்டப்படுகின்றன',

    // Statuses
    statusAlive: 'உயிருடன்',
    statusAtRisk: 'ஆபத்தில்',
    statusDead: 'இறந்தது',
    statusNotFound: 'காணவில்லை / அகற்றப்பட்டது',
    badgeNative: 'நாட்டு மரம்',
    badgePlanted: 'நடப்பட்டது',

    // Tree Card Details
    labelPlantedOn: 'நடப்பட்ட நாள்',
    labelLastVerified: 'கடைசி சரிபார்ப்பு',
    labelNextCheckpoint: 'அடுத்த சோதனை',
    labelHealthScore: 'உடல்நல மதிப்பெண்',
    btnViewPassport: 'பாஸ்போர்ட் காண்க',
    btnRecordUpdate: 'பராமரிப்பு பதிவு',
    btnReportIssue: 'சிக்கலைத் தெரிவி',
    btnVerifyTree: 'மரத்தைச் சரிபார்',
    dueTomorrow: 'நாளை',
    dueInDays: '{days} நாட்களில்',

    // Right Rail Profile
    myProfileTitle: 'என் சுயவிவரம்',
    editProfile: 'சுயவிவரம் மாற்று',
    verifiedCustodian: 'சரிபார்க்கப்பட்ட பாதுகாவலர்',
    custodianId: 'பாதுகாவலர் எண்',
    memberSince: 'உறுப்பினர் காலம்',

    // Right Rail Impact
    myImpactTitle: 'என் பசுமைத் தாக்கம்',
    myImpactSubtitle: 'இது உங்கள் உண்மையான பசுமைத் தாக்கம்! 🌿',
    co2Absorbed: 'உறிஞ்சப்பட்ட CO₂',
    o2Generated: 'உருவாக்கப்பட்ட O₂',
    estimated: 'மதிப்பிடப்பட்டது',
    treesUnderCare: 'கவனிப்பில் உள்ள மரங்கள்',
    checkpointsDone: 'முடிந்த சோதனைகள்',
    viewImpactDetails: 'முழு விவரங்களைக் காண்க →',

    // Right Rail Pending Tasks
    pendingTasksTitle: 'நிலுவை பணிகள்',
    viewAll: 'அனைத்தும்',
    dueIn: 'காலக்கெடு',

    // Quick Actions
    quickActionsTitle: 'விரைவுச் செயல்கள்',
    actionAddTree: 'புதிய மரம் பதிவு',
    actionRecordMaintenance: 'பராமரிப்பு பதிவு',
    actionVerifyTree: 'மரத்தைச் சரிபார்',
    actionReportIssue: 'சிக்கலைத் தெரிவி',
    actionHandover: 'மர ஒப்படைப்பு',
    actionSupport: 'உதவி கோரிக்கை',

    // Find Nearby Trees Banner
    findNearbyTitle: 'அருகிலுள்ள மரங்களைக் காண்க',
    findNearbySubtitle: 'உங்கள் பகுதியிலுள்ள மரங்களை ஆராயுங்கள்',
    btnOpenMap: 'வரைபடத்தைத் திற',

    // Other Views
    commandTitle: 'மாநில செயல்பாட்டு தலைமை மையம்',
    commandSubtitle: 'பொறுப்பைக் கண்காணிக்கவும். ஒவ்வொரு மரத்தையும் பாதுகாக்கவும்.',
    survivalAccountability: 'உயிர்வாழும் பொறுப்புக்கூறல்',
    totalPlanted: 'நடப்பட்ட மரங்கள்',
    verifiedAlive: 'உயிருடன் சரிபார்க்கப்பட்டது',
    verifiedSurvival: 'உயிர்வாழும் விகிதம்',
    atRisk: 'ஆபத்தில் உள்ளவை',
    treesNearYou: 'உங்கள் அருகிலுள்ள மரங்கள்',
    verificationRequired: 'சரிபார்ப்பு தேவை',
    startVerification: 'சரிபார்ப்பைத் தொடங்கு',
    compareReference: 'சான்றுப் படத்தை ஒப்பிடு',
    landmark: 'அடையாள இடம்',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['en'], params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('pasumai_kaval_lang') || localStorage.getItem('vanam_kuri_lang') as Language) || 'ta';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('pasumai_kaval_lang', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ta' ? 'en' : 'ta');
  };

  const t = (key: keyof typeof translations['en'], params?: Record<string, string | number>): string => {
    let text = translations[language]?.[key] || translations['en']?.[key] || (key as string);
    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        text = text.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
