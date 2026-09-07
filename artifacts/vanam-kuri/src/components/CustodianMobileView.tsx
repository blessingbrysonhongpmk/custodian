import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Tree } from '../types/custodia';
import { useLanguage } from '../context/LanguageContext';
import { 
  TreePine, 
  Users, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  MapPin, 
  ChevronRight, 
  Plus, 
  Droplets, 
  Camera, 
  ArrowRightLeft, 
  HelpCircle, 
  X, 
  Calendar, 
  Compass, 
  HeartHandshake, 
  FileText, 
  Award, 
  ExternalLink, 
  Sparkles, 
  LayoutGrid, 
  LayoutList, 
  Check, 
  Phone, 
  Mail, 
  Building2, 
  UserCheck, 
  Activity,
  Leaf,
  Bell
} from 'lucide-react';
import { TamilNaduSeal } from './TamilNaduSeal';


interface CustodianMobileViewProps {
  trees: Tree[];
  onOpenTree: (treeId: string) => void;
  onOpenHandoff: (tree: Tree) => void;
  onOpenVerification: (tree: Tree) => void;
  onOpenRegisterTree?: () => void;
  simulatedCustodian?: string;
}

export interface CustodianTreeItem {
  id: string;
  speciesName: string;
  botanicalName: string;
  tamilName: string;
  location: string;
  campusZone: string;
  landmark: string;
  coordinates: [number, number];
  plantedDate: string;
  lastVerificationDate: string;
  nextCheckpointDate: string;
  nextCheckpointRelative: string;
  isUrgent?: boolean;
  healthScore: number;
  status: 'ALIVE' | 'AT_RISK' | 'DEAD' | 'NOT_FOUND' | 'UNASSIGNED';
  reason?: string;
  photoUrl: string;
  referencePhotoUrl: string;
  originalPlantationPhotoUrl: string;
  isNative: boolean;
  growthStage: string;
  custodyChain: {
    stage: string;
    description: string;
    date: string;
    completed: boolean;
  }[];
  verificationTimeline: {
    stage: string;
    title: string;
    date: string;
    status: 'completed' | 'current' | 'upcoming';
    photoUrl?: string;
  }[];
  maintenanceHistory: {
    id: string;
    date: string;
    type: string;
    notes: string;
  }[];
}

export interface FriendTreeItem {
  id: string;
  treeId: string;
  friendName: string;
  friendRole: string;
  treeSpecies: string;
  botanicalName: string;
  location: string;
  campusZone: string;
  landmark: string;
  status: 'ALIVE' | 'AT_RISK' | 'OVERDUE';
  lastVerifiedRelative: string;
  lastVerifiedDate: string;
  healthScore: number;
  photoUrl: string;
  referencePhotoUrl: string;
}

export interface CustodianVerificationRecord {
  id: string;
  verificationCode: string;
  treeId: string;
  treeSpecies: string;
  verifiedBy: string;
  date: string;
  result: 'ALIVE' | 'AT_RISK' | 'NOT_FOUND';
  evidenceType: string;
  status: 'Accepted' | 'Review Required' | 'Pending Audit';
  notes?: string;
  anomalyReason?: string;
  actionRequested?: string;
  photoUrl: string;
  locationMatched: boolean;
}

export interface HandoverRequestItem {
  id: string;
  type: 'outgoing' | 'incoming';
  treeId: string;
  treeSpecies: string;
  location: string;
  fromCustodian: string;
  toCustodian: string;
  reason: string;
  status: 'Waiting for acceptance' | 'Action required' | 'Accepted' | 'Declined';
  initiatedDate: string;
  dueInDays: number;
  healthScore: number;
  notes: string;
  photoUrl: string;
}

export const CustodianMobileView: React.FC<CustodianMobileViewProps> = ({
  trees,
  onOpenTree,
  onOpenHandoff,
  onOpenVerification,
  onOpenRegisterTree,
  simulatedCustodian = "Arun K.",
}) => {
  const { language, t } = useLanguage();

  // Navigation Tabs state: Internal to Custodian page only
  const [activeTab, setActiveTab] = useState<'my-trees' | 'friends-trees' | 'verifications' | 'handover' | 'activity'>('my-trees');

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'health' | 'checkpoint'>('recent');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'completed' | 'pending' | 'flagged'>('all');

  // Profile data state
  const [profile, setProfile] = useState({
    name: "Arun K.",
    badge: "Verified Custodian",
    trustScore: 98,
    custodianId: "CUST-TN-2024-0089",
    email: "arun.k@ecoclub.edu.in",
    phone: "+91 98765 43210",
    institution: "St. Xavier's College",
    location: "Eco Club, St. Xavier's College",
    memberSince: "Jan 2025",
    continuityRate: 96,
    myTreesCount: 3,
    friendsTreesCount: 7,
    verificationsDoneCount: 12,
    pendingTasksCount: 2,
    co2Kg: 128,
    o2Kg: 94,
  });

  // Modals state
  const [inspectTree, setInspectTree] = useState<CustodianTreeItem | null>(null);
  const [recordMaintenanceTree, setRecordMaintenanceTree] = useState<CustodianTreeItem | null>(null);
  const [reportIssueTree, setReportIssueTree] = useState<CustodianTreeItem | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [referencePhotoPreview, setReferencePhotoPreview] = useState<{ title: string; photoUrl: string; landmark: string; coordinates: string } | null>(null);

  // Form states for modals
  const [maintenanceForm, setMaintenanceForm] = useState({
    type: 'Watering',
    liters: '15',
    notes: 'Hydrated root basin with organic neem cake slurry. Bamboo guard inspected and firm.',
  });
  const [issueForm, setIssueForm] = useState({
    issueType: 'Maintenance / Soil Dryness',
    severity: 'Attention',
    notes: '',
  });
  const [editProfileForm, setEditProfileForm] = useState({
    phone: profile.phone,
    email: profile.email,
    institution: profile.institution,
    location: profile.location,
  });

  // Toast feedback
  const [localToast, setLocalToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setLocalToast(msg);
    setTimeout(() => setLocalToast(null), 3500);
  };

  // 1. CUSTODIAN'S 3+ TREES (Section 5 & 6)
  const [myTreesData, setMyTreesData] = useState<CustodianTreeItem[]>([
    {
      id: "TN-PALM-005",
      speciesName: "Palmyra Palm (State Tree)",
      botanicalName: "Borassus flabellifer",
      tamilName: "பனை மரம்",
      location: "Ramanathapuram Shoreline Belt",
      campusZone: "Coastal Protection Sector",
      landmark: "Ramanathapuram Shoreline Zone 1, Milestone 4",
      coordinates: [9.3639, 78.8395],
      plantedDate: "14 Apr 2024",
      lastVerificationDate: "15 Apr 2024",
      nextCheckpointDate: "14 Oct 2025",
      nextCheckpointRelative: "in 18 days",
      healthScore: 98,
      status: "ALIVE",
      photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
      originalPlantationPhotoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
      isNative: true,
      growthStage: "Stage 3 (Heritage Growth)",
      custodyChain: [
        { stage: "Planted", description: "Planted by Green Tamil Nadu Initiative", date: "14 Apr 2024", completed: true },
        { stage: "Assigned", description: "Assigned to Arun K. (Heritage Tree Guardian)", date: "14 Apr 2024", completed: true },
        { stage: "Peer Audit", description: "Verified by Forest Dept Ranger", date: "15 Apr 2024", completed: true },
        { stage: "Maintenance", description: "Root collar cleared & soil aerated", date: "15 Feb 2025", completed: true },
      ],
      verificationTimeline: [
        { stage: "Plantation", title: "Sapling Planting", date: "14 Apr 2024", status: "completed", photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80" },
        { stage: "1 Year", title: "Deep Root Anchorage", date: "14 Apr 2025", status: "completed", photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80" },
        { stage: "3 Year", title: "Canopy Emergence", date: "14 Oct 2025", status: "current" },
      ],
      maintenanceHistory: [
        { id: "M-PLM-01", date: "15 Feb 2025", type: "Soil Aeration", notes: "Collar clearing and sand stabilization ring built." },
      ]
    },
    {
      id: "TG-IND-001",
      speciesName: "Neem Tree",
      botanicalName: "Azadirachta indica",
      tamilName: "வேம்பு",
      location: "Main Campus • Block A",
      campusZone: "Main Campus",
      landmark: "Near Science Block entrance, 15m east of solar fountain",
      coordinates: [13.0827, 80.2707],
      plantedDate: "12 Jan 2025",
      lastVerificationDate: "12 Aug 2025",
      nextCheckpointDate: "10 Sep 2025",
      nextCheckpointRelative: "in 6 days",
      healthScore: 92,
      status: "ALIVE",
      photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      originalPlantationPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      isNative: true,
      growthStage: "Stage 3 (6M-1Y)",
      custodyChain: [
        { stage: "Planted", description: "Planted by Green Tamil Nadu Initiative", date: "12 Jan 2025", completed: true },
        { stage: "Assigned", description: "Assigned to Arun K. (Lead Student Custodian)", date: "12 Jan 2025", completed: true },
        { stage: "Peer Audit", description: "Verified by Suresh R. (Peer Verifier #14)", date: "12 Aug 2025", completed: true },
        { stage: "Maintenance", description: "15L hydration & organic mulch logged", date: "28 Aug 2025", completed: true },
        { stage: "Next Checkpoint", description: "1-Year Milestone Audit Scheduled", date: "10 Sep 2025", completed: false },
        { stage: "Graduation Handover", description: "Scheduled transition to Junior Custodian", date: "Oct 2025", completed: false },
      ],
      verificationTimeline: [
        { stage: "Plantation", title: "Sapling Planting", date: "12 Jan 2025", status: "completed", photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80" },
        { stage: "1 Month", title: "Root Settlement", date: "12 Feb 2025", status: "completed", photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80" },
        { stage: "6 Month", title: "Canopy & Stem Audit", date: "12 Aug 2025", status: "completed", photoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80" },
        { stage: "1 Year", title: "Canopy Milestone", date: "10 Sep 2025", status: "current" },
        { stage: "3 Year", title: "Permanent Forest Cover", date: "12 Jan 2028", status: "upcoming" },
      ],
      maintenanceHistory: [
        { id: "M-101", date: "28 Aug 2025", type: "Watering", notes: "15 Liters drip hydration with neem-cake organic slurry." },
        { id: "M-092", date: "14 Aug 2025", type: "Mulch & Weeding", notes: "Applied dried leaf ring mulch around 40cm root perimeter." },
        { id: "M-080", date: "20 Jul 2025", type: "Tree Guard Repair", notes: "Tightened wire ties on bamboo outer mesh." },
      ]
    },
    {
      id: "TG-IND-002",
      speciesName: "Pongamia",
      botanicalName: "Pongamia pinnata",
      tamilName: "புங்கன்",
      location: "Main Campus • Block B",
      campusZone: "Main Campus",
      landmark: "Beside Library walkway and rainwater recharge well",
      coordinates: [13.0835, 80.2715],
      plantedDate: "18 Jan 2025",
      lastVerificationDate: "20 Jul 2025",
      nextCheckpointDate: "25 Sep 2025",
      nextCheckpointRelative: "in 21 days",
      healthScore: 88,
      status: "ALIVE",
      photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
      originalPlantationPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      isNative: true,
      growthStage: "Stage 2 (1M-6M)",
      custodyChain: [
        { stage: "Planted", description: "Planted by Green Tamil Nadu Initiative", date: "18 Jan 2025", completed: true },
        { stage: "Assigned", description: "Assigned to Arun K.", date: "18 Jan 2025", completed: true },
        { stage: "Peer Audit", description: "Verified by Priya S. (Peer Verifier #08)", date: "20 Jul 2025", completed: true },
        { stage: "Maintenance", description: "Deep root watering logged", date: "22 Aug 2025", completed: true },
        { stage: "Next Checkpoint", description: "6-Month Progress Checkpoint", date: "25 Sep 2025", completed: false },
      ],
      verificationTimeline: [
        { stage: "Plantation", title: "Sapling Planting", date: "18 Jan 2025", status: "completed", photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80" },
        { stage: "1 Month", title: "Establishment Check", date: "18 Feb 2025", status: "completed", photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80" },
        { stage: "6 Month", title: "Canopy Checkpoint", date: "25 Sep 2025", status: "current" },
        { stage: "1 Year", title: "Survival Verification", date: "18 Jan 2026", status: "upcoming" },
      ],
      maintenanceHistory: [
        { id: "M-201", date: "22 Aug 2025", type: "Watering", notes: "12L deep soak. Soil moisture level 70%." },
        { id: "M-185", date: "05 Aug 2025", type: "Soil Aeration", notes: "Light hoeing around root zone to improve aeration." },
      ]
    },
    {
      id: "TG-IND-003",
      speciesName: "Indian Mahogany",
      botanicalName: "Swietenia mahagoni",
      tamilName: "மகாகனி",
      location: "Sports Ground",
      campusZone: "Sports Ground",
      landmark: "East boundary perimeter behind cricket nets",
      coordinates: [13.0812, 80.2698],
      plantedDate: "02 Feb 2025",
      lastVerificationDate: "02 Jul 2025",
      nextCheckpointDate: "05 Sep 2025",
      nextCheckpointRelative: "Tomorrow",
      isUrgent: true,
      healthScore: 76,
      status: "AT_RISK",
      reason: "Verification due",
      photoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
      originalPlantationPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      isNative: true,
      growthStage: "Stage 2 (1M-6M)",
      custodyChain: [
        { stage: "Planted", description: "Planted at Sports Ground perimeter", date: "02 Feb 2025", completed: true },
        { stage: "Assigned", description: "Assigned to Arun K.", date: "02 Feb 2025", completed: true },
        { stage: "Peer Audit", description: "Last audit completed on 02 Jul 2025", date: "02 Jul 2025", completed: true },
        { stage: "Next Checkpoint", description: "Mandatory Scheduled Verification DUE TOMORROW", date: "05 Sep 2025", completed: false },
      ],
      verificationTimeline: [
        { stage: "Plantation", title: "Sapling Planting", date: "02 Feb 2025", status: "completed", photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80" },
        { stage: "1 Month", title: "Root Settlement", date: "02 Mar 2025", status: "completed", photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80" },
        { stage: "6 Month", title: "Audit Verification (DUE)", date: "05 Sep 2025", status: "current" },
        { stage: "1 Year", title: "Annual Audit", date: "02 Feb 2026", status: "upcoming" },
      ],
      maintenanceHistory: [
        { id: "M-301", date: "25 Aug 2025", type: "Watering", notes: "10L watering. Ground is dry due to high sports field heat reflection." },
      ]
    }
  ]);

  // 2. FRIENDS' TREES (Section 7: Environmental Verification Network)
  const [friendsTrees, setFriendsTrees] = useState<FriendTreeItem[]>([
    {
      id: "F-1",
      treeId: "TG-IND-014",
      friendName: "Priya S.",
      friendRole: "Lead Custodian • Botany Dept",
      treeSpecies: "Neem",
      botanicalName: "Azadirachta indica",
      location: "North Campus",
      campusZone: "North Campus",
      landmark: "Outside Botany Greenhouse Sector 1",
      status: "ALIVE",
      lastVerifiedRelative: "2 days ago",
      lastVerifiedDate: "02 Sep 2026",
      healthScore: 94,
      photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "F-2",
      treeId: "TG-IND-021",
      friendName: "Rahul M.",
      friendRole: "Custodian • NSS Unit 3",
      treeSpecies: "Pungam",
      botanicalName: "Pongamia pinnata",
      location: "School Block",
      campusZone: "School Block",
      landmark: "Primary School courtyard garden patch",
      status: "AT_RISK",
      lastVerifiedRelative: "Today",
      lastVerifiedDate: "04 Sep 2026",
      healthScore: 68,
      photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "F-3",
      treeId: "TG-IND-032",
      friendName: "Meena R.",
      friendRole: "Custodian • Green Council",
      treeSpecies: "Rain Tree",
      botanicalName: "Samanea saman",
      location: "Garden Area",
      campusZone: "Garden Area",
      landmark: "Central Lawn fountain corner",
      status: "ALIVE",
      lastVerifiedRelative: "5 days ago",
      lastVerifiedDate: "30 Aug 2026",
      healthScore: 95,
      photoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "F-4",
      treeId: "TN-COL-00084",
      friendName: "Kavitha N.",
      friendRole: "Custodian • Green Squad",
      treeSpecies: "Indian Beech",
      botanicalName: "Pongamia pinnata",
      location: "Hostel Grove South",
      campusZone: "Hostel Grove",
      landmark: "Beside Block C entrance",
      status: "AT_RISK",
      lastVerifiedRelative: "12 days ago",
      lastVerifiedDate: "23 Aug 2026",
      healthScore: 52,
      photoUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "F-5",
      treeId: "TG-IND-018",
      friendName: "Gokul M.",
      friendRole: "Custodian • Eco Volunteers",
      treeSpecies: "Teak",
      botanicalName: "Tectona grandis",
      location: "West Gate Quad",
      campusZone: "West Campus",
      landmark: "Near Cycle Stand boundary fence",
      status: "ALIVE",
      lastVerifiedRelative: "1 week ago",
      lastVerifiedDate: "28 Aug 2026",
      healthScore: 91,
      photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "F-6",
      treeId: "TG-IND-027",
      friendName: "Divya K.",
      friendRole: "Custodian • 2nd Year Zoology",
      treeSpecies: "Jamun",
      botanicalName: "Syzygium cumini",
      location: "Eco Pond Walk",
      campusZone: "Lake Bund",
      landmark: "South Bank near overflow weir",
      status: "ALIVE",
      lastVerifiedRelative: "3 days ago",
      lastVerifiedDate: "01 Sep 2026",
      healthScore: 89,
      photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
    },
    {
      id: "F-7",
      treeId: "TG-IND-009",
      friendName: "Suresh R.",
      friendRole: "Peer Verifier • Physics Dept",
      treeSpecies: "Peepal",
      botanicalName: "Ficus religiosa",
      location: "Admin Block Front",
      campusZone: "Admin Block",
      landmark: "Heritage circle lawn near flag mast",
      status: "ALIVE",
      lastVerifiedRelative: "4 days ago",
      lastVerifiedDate: "31 Aug 2026",
      healthScore: 96,
      photoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80",
      referencePhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    }
  ]);

  // 3. MY VERIFICATIONS (Section 8)
  const [verificationsList, setVerificationsList] = useState<CustodianVerificationRecord[]>([
    {
      id: "V-1",
      verificationCode: "V-1042",
      treeId: "TG-IND-014",
      treeSpecies: "Neem",
      verifiedBy: "Arun K.",
      date: "02 Sep 2026",
      result: "ALIVE",
      evidenceType: "Photo + GPS Matched",
      status: "Accepted",
      notes: "Canopy density 94%. Fresh shoots observed. Bamboo tree guard secure.",
      photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
      locationMatched: true,
    },
    {
      id: "V-2",
      verificationCode: "V-1038",
      treeId: "TG-IND-021",
      treeSpecies: "Pungam",
      verifiedBy: "Arun K.",
      date: "28 Aug 2026",
      result: "AT_RISK",
      evidenceType: "Physical Audit",
      status: "Review Required",
      anomalyReason: "Maintenance issue — dry soil bed around root flare",
      actionRequested: "Deep hydration requested. Irrigation line check needed.",
      notes: "Sapling healthy overall but moisture stress detected in surrounding soil bed.",
      photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&auto=format&fit=crop&q=80",
      locationMatched: true,
    },
    {
      id: "V-3",
      verificationCode: "V-1025",
      treeId: "TG-IND-032",
      treeSpecies: "Rain Tree",
      verifiedBy: "Arun K.",
      date: "20 Aug 2026",
      result: "ALIVE",
      evidenceType: "Photo + Canopy Metric",
      status: "Accepted",
      notes: "Excellent leaf color index. 1.8m height reached with 95% foliage vigor.",
      photoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80",
      locationMatched: true,
    },
    {
      id: "V-4",
      verificationCode: "V-1011",
      treeId: "TG-IND-001",
      treeSpecies: "Neem Tree",
      verifiedBy: "Suresh R. (Peer)",
      date: "12 Aug 2026",
      result: "ALIVE",
      evidenceType: "Photo + Stem Diameter",
      status: "Accepted",
      notes: "Arun K.'s custodial tree inspected. Stem girth 14cm. Zero pest activity.",
      photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
      locationMatched: true,
    },
    {
      id: "V-5",
      verificationCode: "V-0994",
      treeId: "TG-IND-002",
      treeSpecies: "Pongamia",
      verifiedBy: "Priya S. (Peer)",
      date: "18 Jul 2026",
      result: "ALIVE",
      evidenceType: "Photo + Soil Moisture",
      status: "Accepted",
      notes: "Ground mulch intact. Good branching structure.",
      photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&auto=format&fit=crop&q=80",
      locationMatched: true,
    },
    {
      id: "V-6",
      verificationCode: "V-0972",
      treeId: "TG-IND-018",
      treeSpecies: "Teak",
      verifiedBy: "Arun K.",
      date: "04 Jul 2026",
      result: "ALIVE",
      evidenceType: "Photo + GPS Matched",
      status: "Accepted",
      notes: "Sapling firmly staked. New leaves emerging.",
      photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&auto=format&fit=crop&q=80",
      locationMatched: true,
    }
  ]);

  // 4. HANDOVER REQUESTS (Section 9)
  const [handoverRequests, setHandoverRequests] = useState<HandoverRequestItem[]>([
    {
      id: "HO-1",
      type: "outgoing",
      treeId: "TG-IND-003",
      treeSpecies: "Indian Mahogany",
      location: "Sports Ground • East Perimeter",
      fromCustodian: "Arun K. (Graduating)",
      toCustodian: "Priya S. (Botany Dept)",
      reason: "Graduation / Academic Completion",
      status: "Waiting for acceptance",
      initiatedDate: "01 Sep 2026",
      dueInDays: 14,
      healthScore: 76,
      notes: "Handover protocol initiated due to upcoming convocation. Successor notified via institutional email.",
      photoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "HO-2",
      type: "incoming",
      treeId: "TG-IND-021",
      treeSpecies: "Pongamia",
      location: "School Block • Front lawn",
      fromCustodian: "Rahul M. (3rd Year Civil)",
      toCustodian: "Arun K. (Eco Club)",
      reason: "Semester Exchange Program",
      status: "Action required",
      initiatedDate: "02 Sep 2026",
      dueInDays: 5,
      healthScore: 68,
      notes: "Rahul M. is departing for exchange semester. Requesting Arun K. to take over custody and hydration oversight.",
      photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&auto=format&fit=crop&q=80",
    }
  ]);

  // 5. ACTIVITY TIMELINE (Section 10)
  const [activityFeed, setActivityFeed] = useState([
    {
      id: "A-1",
      period: "Today",
      time: "10:15 AM",
      type: "verification",
      title: "Verified tree TG-IND-014 (Neem)",
      description: "Peer verification submitted for Priya S. Evidence: High consistency photo + GPS.",
      badge: "Accepted",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "A-2",
      period: "Today",
      time: "08:30 AM",
      type: "maintenance",
      title: "Maintenance update recorded for TG-IND-001",
      description: "15 Liters drip hydration with neem cake organic slurry applied.",
      badge: "Logged",
      icon: Droplets,
      color: "text-blue-600 bg-blue-50",
    },
    {
      id: "A-3",
      period: "Yesterday",
      time: "04:00 PM",
      type: "alert",
      title: "TG-IND-003 Checkpoint Reminder",
      description: "Scheduled 6-month verification checkpoint window opens tomorrow.",
      badge: "Action Due",
      icon: AlertTriangle,
      color: "text-amber-600 bg-amber-50",
    },
    {
      id: "A-4",
      period: "2 days ago",
      time: "02:15 PM",
      type: "handover",
      title: "Custody transfer request received for TG-IND-021",
      description: "Rahul M. requested transfer of responsibility due to semester exchange.",
      badge: "Pending",
      icon: ArrowRightLeft,
      color: "text-purple-600 bg-purple-50",
    },
    {
      id: "A-5",
      period: "5 days ago",
      time: "11:30 AM",
      type: "verification",
      title: "Tree TG-IND-001 audit approved",
      description: "Peer verifier Suresh R. confirmed 92% health index and zero anomalies.",
      badge: "Passed",
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      id: "A-6",
      period: "1 week ago",
      time: "09:00 AM",
      type: "score",
      title: "Trust score milestone reached: 98%",
      description: "System algorithm awarded +2% reliability rating for 100% on-time milestone compliance.",
      badge: "+2% Boost",
      icon: Award,
      color: "text-amber-600 bg-amber-50",
    }
  ]);

  // Filter and sort for My Trees
  const filteredMyTrees = useMemo(() => {
    return myTreesData.filter((tree) => {
      const matchesSearch = 
        tree.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tree.speciesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tree.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === 'ALL' ? true :
        statusFilter === 'ALIVE' ? tree.status === 'ALIVE' :
        statusFilter === 'AT_RISK' ? tree.status === 'AT_RISK' : true;

      const matchesLocation = 
        locationFilter === 'ALL' ? true :
        locationFilter === 'Block A' ? tree.location.includes('Block A') :
        locationFilter === 'Block B' ? tree.location.includes('Block B') :
        locationFilter === 'Sports Ground' ? tree.location.includes('Sports Ground') : true;

      return matchesSearch && matchesStatus && matchesLocation;
    }).sort((a, b) => {
      if (sortBy === 'health') return b.healthScore - a.healthScore;
      if (sortBy === 'checkpoint') return a.isUrgent ? -1 : 1;
      return 0; // Default recent
    });
  }, [myTreesData, searchQuery, statusFilter, locationFilter, sortBy]);

  // Handle accepting an incoming handover
  const handleAcceptHandover = (item: HandoverRequestItem) => {
    setHandoverRequests(prev => prev.map(req => req.id === item.id ? { ...req, status: 'Accepted' } : req));
    triggerToast(`🌱 Successfully accepted custody of ${item.treeId} (${item.treeSpecies}). Custody continuity secured!`);
    
    setActivityFeed(prev => [
      {
        id: `A-${Date.now()}`,
        period: "Just now",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "handover",
        title: `Accepted custody of ${item.treeId}`,
        description: `Responsibility transferred from ${item.fromCustodian}. Handover certificate generated.`,
        badge: "Transferred",
        icon: HeartHandshake,
        color: "text-emerald-600 bg-emerald-50",
      },
      ...prev
    ]);

    setProfile(prev => ({
      ...prev,
      myTreesCount: prev.myTreesCount + 1,
      pendingTasksCount: Math.max(0, prev.pendingTasksCount - 1)
    }));
  };

  // Handle declining an incoming handover
  const handleDeclineHandover = (item: HandoverRequestItem) => {
    setHandoverRequests(prev => prev.map(req => req.id === item.id ? { ...req, status: 'Declined' } : req));
    triggerToast(`Transfer request for ${item.treeId} declined.`);
  };

  // Handle saving new maintenance log
  const handleSaveMaintenance = () => {
    if (!recordMaintenanceTree) return;
    const newLog = {
      id: `M-${Date.now().toString().slice(-4)}`,
      date: "Today, " + new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      type: maintenanceForm.type,
      notes: `${maintenanceForm.liters ? maintenanceForm.liters + 'L: ' : ''}${maintenanceForm.notes}`,
    };

    setMyTreesData(prev => prev.map(tree => {
      if (tree.id === recordMaintenanceTree.id) {
        return {
          ...tree,
          maintenanceHistory: [newLog, ...tree.maintenanceHistory]
        };
      }
      return tree;
    }));

    setActivityFeed(prev => [
      {
        id: `A-${Date.now()}`,
        period: "Just now",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "maintenance",
        title: `Maintenance recorded for ${recordMaintenanceTree.id}`,
        description: `${maintenanceForm.type}: ${maintenanceForm.notes}`,
        badge: "Logged",
        icon: Droplets,
        color: "text-blue-600 bg-blue-50",
      },
      ...prev
    ]);

    triggerToast(`✓ Maintenance logged for ${recordMaintenanceTree.id}! Tamil Nadu Green ledger synchronized.`);
    setRecordMaintenanceTree(null);
  };

  // Handle reporting tree issue
  const handleSaveIssue = () => {
    if (!reportIssueTree) return;

    setMyTreesData(prev => prev.map(tree => {
      if (tree.id === reportIssueTree.id) {
        return {
          ...tree,
          status: 'AT_RISK',
          reason: issueForm.issueType,
        };
      }
      return tree;
    }));

    triggerToast(`⚠️ Incident logged for ${reportIssueTree.id}. Campus Sustainability Officer dispatched.`);
    setReportIssueTree(null);
  };

  // Handle updating profile
  const handleSaveProfile = () => {
    setProfile(prev => ({
      ...prev,
      phone: editProfileForm.phone,
      email: editProfileForm.email,
      institution: editProfileForm.institution,
      location: editProfileForm.location,
    }));
    triggerToast("✓ Custodian profile updated successfully.");
    setIsEditProfileOpen(false);
  };

  // Helper to trigger verification for a tree
  const handleTriggerVerify = (treeId: string) => {
    const existing = trees.find(t => t.id === treeId);
    if (existing) {
      onOpenVerification(existing);
    } else {
      const syntheticTree: Tree = {
        id: treeId,
        speciesName: treeId === "TG-IND-003" ? "Indian Mahogany" : "Pongamia",
        botanicalName: "Swietenia mahagoni",
        tamilName: "மகாகனி",
        plantedAt: "2025-02-02",
        zone: "Sports Ground",
        landmark: "East boundary perimeter behind cricket nets",
        coordinates: [13.0812, 80.2698],
        status: "at-risk",
        healthScore: 76,
        initialHeightCm: 50,
        currentHeightCm: 85,
        initialPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
        currentPhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
        currentCustodian: "Arun K.",
        currentCustodianUnit: "Eco Club",
        currentCustodianEmail: "arun.k@ecoclub.edu.in",
        organization: "Government of Tamil Nadu • Pasumai Kaval",
        checkpoints: [],
        custodyHistory: [],
        maintenanceLogs: [],
        growthStage: 2,
      };
      onOpenVerification(syntheticTree);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto font-sans">
      {/* Toast Notification */}
      {localToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#052E1F] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400/40 text-xs font-semibold flex items-center gap-3 animate-rise max-w-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping shrink-0" />
          <span>{localToast}</span>
        </div>
      )}

      {/* 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* LEFT / CENTER MAIN COLUMN (8 of 12 columns on desktop)   */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. CUSTODIAN GREETING */}
          <div className="tn-card-heritage p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-start gap-4 max-w-lg">
              <TamilNaduSeal size={46} className="mt-1" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black tracking-tight text-slate-900">
                    {t('dashboard.greeting', { name: simulatedCustodian })}
                  </h2>
                  <span className="tn-badge-heritage text-[10px]">சான்றளிக்கப்பட்ட பாதுகாவலர்</span>
                </div>
                <p className="text-xs text-slate-600 max-w-md pt-0.5">
                  You are responsible for {myTreesData.length} trees including <strong className="text-[#004D38]">TN-PALM-005</strong> (Palmyra Palm • பனை மரம்).
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => setRecordMaintenanceTree(myTreesData[0])}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    <span>{t('heroRecordUpdate')}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 text-center min-w-[150px] shrink-0 self-end sm:self-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">{t('dashboard.complianceScore')}</span>
              <div className="text-3xl font-bold text-slate-900 tracking-tight mt-0.5">{profile.trustScore}%</div>
              <span className="text-[11px] font-semibold text-emerald-700 block mt-0.5">{t('dashboard.excellentStanding')}</span>
            </div>
          </div>

          {/* 3. CUSTODIAN SUMMARY STATISTICS (5 CARDS) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {/* Card 1: My Trees */}
            <div 
              onClick={() => setActiveTab('my-trees')}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                <TreePine className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{profile.myTreesCount}</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{t('statMyTrees')}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{t('statMyTreesSub')}</div>
            </div>

            {/* Card 2: Friends' Trees */}
            <div 
              onClick={() => setActiveTab('friends-trees')}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-blue-300 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{profile.friendsTreesCount}</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{t('statFriendsTrees')}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{t('statFriendsTreesSub')}</div>
            </div>

            {/* Card 3: Verifications Done */}
            <div 
              onClick={() => setActiveTab('verifications')}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{profile.verificationsDoneCount}</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{t('statVerifications')}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{t('statVerificationsSub')}</div>
            </div>

            {/* Card 4: Pending Tasks */}
            <div 
              onClick={() => setActiveTab('my-trees')}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-2 group-hover:scale-110 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                {profile.pendingTasksCount}
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              </div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{t('statPendingTasks')}</div>
              <div className="text-[10px] text-amber-700 font-semibold mt-0.5">{t('statPendingTasksSub')}</div>
            </div>

            {/* Card 5: Custody Continuity */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:border-emerald-300 transition-all group col-span-2 sm:col-span-1">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{profile.continuityRate}%</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">{t('statContinuity')}</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">{t('statContinuitySub')}</div>
            </div>
          </div>

          {/* 4. MAIN INTERNAL NAVIGATION TABS (Section 4) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-sm">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {[
                { id: 'my-trees', label: t('tabMyTrees'), icon: TreePine, count: profile.myTreesCount },
                { id: 'friends-trees', label: t('tabFriendsTrees'), icon: Users, count: profile.friendsTreesCount },
                { id: 'verifications', label: t('tabVerifications'), icon: CheckCircle2, count: profile.verificationsDoneCount },
                { id: 'handover', label: t('tabHandovers'), icon: ArrowRightLeft, count: handoverRequests.length, hasAlert: true },
                { id: 'activity', label: t('tabActivity'), icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#052E1F] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                        isActive 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                    {tab.hasAlert && !isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB CONTENT 1: MY TREES (Section 5 & 6)                   */}
          {/* ======================================================== */}
          {activeTab === 'my-trees' && (
            <div className="space-y-4">
              {/* Controls bar: Search, Filter, Sort, View Toggle */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchFilterPlaceholder')}
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-slate-800 placeholder-slate-400 font-medium"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Filter Status */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="ALL">{t('filterAllStatus')}</option>
                    <option value="ALIVE">{t('statusAlive')}</option>
                    <option value="AT_RISK">{t('statusAtRisk')}</option>
                  </select>

                  {/* Filter Campuses */}
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="ALL">{t('filterAllLocations')}</option>
                    <option value="Block A">Block A</option>
                    <option value="Block B">Block B</option>
                    <option value="Sports Ground">Sports Ground</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="recent">{t('sortRecentlyUpdated')}</option>
                    <option value="health">Sort: Health Score</option>
                    <option value="checkpoint">Sort: Next Due</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden shrink-0">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`}
                      title="List View"
                    >
                      <LayoutList className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500 hover:text-slate-800'}`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tree List / Grid */}
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-3.5"}>
                {filteredMyTrees.map((tree) => {
                  const isAtRisk = tree.status === 'AT_RISK' || tree.isUrgent;

                  return (
                    <div
                      key={tree.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-md relative overflow-hidden ${
                        isAtRisk
                          ? 'border-amber-300/80 bg-gradient-to-r from-amber-50/40 via-amber-50/20 to-white shadow-sm ring-1 ring-amber-400/40'
                          : 'border-slate-200/90'
                      } ${viewMode === 'grid' ? 'p-5 flex flex-col justify-between' : 'p-4 sm:p-5'}`}
                    >
                      {/* Left Bell Icon for At-Risk Tree matching baseline */}
                      {isAtRisk && (
                        <div className="absolute top-4 left-2 text-amber-500">
                          <Bell className="w-3.5 h-3.5 fill-amber-400/30" />
                        </div>
                      )}

                      <div className={viewMode === 'grid' ? "space-y-4" : "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"}>
                        
                        {/* Column 1: Photo + Tree Details */}
                        <div className="flex items-start gap-3.5 min-w-[240px] flex-1">
                          {/* Tree Photo with Alive/At Risk Badge */}
                          <div className="relative shrink-0 cursor-pointer" onClick={() => setInspectTree(tree)}>
                            <img
                              src={tree.photoUrl}
                              alt={tree.speciesName}
                              className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border border-slate-200 shadow-sm hover:scale-105 transition-transform"
                            />
                            <div className="absolute -bottom-1 -left-1">
                              {tree.status === 'ALIVE' ? (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-700 text-white shadow-sm flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                  {t('statusAlive')}
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-600 text-white shadow-sm flex items-center gap-1">
                                  {t('statusAtRisk')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* ID, Species, Location, Native Tag */}
                          <div className="space-y-0.5">
                            <div className="font-mono font-bold text-xs text-emerald-800 tracking-tight">
                              {tree.id}
                            </div>
                            <h3 
                              onClick={() => setInspectTree(tree)}
                              className="text-sm font-extrabold text-slate-900 hover:text-emerald-700 cursor-pointer"
                            >
                              {language === 'ta' ? `${tree.tamilName} • ${tree.speciesName}` : tree.speciesName}
                            </h3>
                            <div className="text-xs text-slate-500 truncate max-w-[200px]">
                              {tree.location}
                            </div>
                            <div className="pt-0.5">
                              <span className="inline-block px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                                {t('badgeNative')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Planted On */}
                        <div className="min-w-[100px] shrink-0 text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('labelPlantedOn')}</span>
                          <span className="text-xs font-bold text-slate-800 mt-0.5 block">{tree.plantedDate}</span>
                        </div>

                        {/* Column 3: Next Checkpoint */}
                        <div className="min-w-[120px] shrink-0 text-left">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('labelNextCheckpoint')}</span>
                          <span className="text-xs font-bold text-slate-800 mt-0.5 block">{tree.nextCheckpointDate}</span>
                          <span className={`text-[11px] font-extrabold block mt-0.5 ${isAtRisk ? 'text-amber-700' : 'text-emerald-600'}`}>
                            {tree.isUrgent ? t('dueTomorrow') : tree.nextCheckpointRelative}
                          </span>
                        </div>

                        {/* Column 4: Health Score Progress Bar */}
                        <div className="w-24 shrink-0 text-left">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{t('labelHealthScore')}</span>
                            <span className={`font-extrabold ${isAtRisk ? 'text-amber-700' : 'text-emerald-700'}`}>{tree.healthScore}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${isAtRisk ? 'bg-amber-500' : 'bg-emerald-600'}`}
                              style={{ width: `${tree.healthScore}%` }}
                            />
                          </div>
                        </div>

                        {/* Column 5: Action Button & Chevron */}
                        <div className="flex items-center gap-2 shrink-0 justify-end">
                          {isAtRisk ? (
                            <button
                              onClick={() => handleTriggerVerify(tree.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>{t('btnVerifyTree')}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setRecordMaintenanceTree(tree)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
                            >
                              <Droplets className="w-3.5 h-3.5" />
                              <span>{t('btnRecordUpdate')}</span>
                            </button>
                          )}

                          <button
                            onClick={() => setReportIssueTree(tree)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Report Issue"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setInspectTree(tree)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="View Tree Passport"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Responsibility Chain / Landmark Footer Bar */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100/90 flex items-center justify-between text-[11px] text-slate-500 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-1.5 font-medium shrink-0">
                          <span className="font-bold text-slate-700">{language === 'ta' ? 'பொறுப்புச் சங்கிலி:' : 'Responsibility Chain:'}</span>
                          <span className="text-emerald-700 font-semibold">{t('badgePlanted')}</span>
                          <span>→</span>
                          <span className="text-emerald-700 font-semibold">{language === 'ta' ? 'ஒதுக்கப்பட்டது (அருண்)' : 'Assigned (Arun K.)'}</span>
                          <span>→</span>
                          <span className="text-emerald-700 font-semibold">{language === 'ta' ? 'சரிபார்க்கப்பட்டது' : 'Peer Verified'}</span>
                          <span>→</span>
                          <span className={isAtRisk ? "text-amber-700 font-bold underline" : "text-slate-600"}>{t('labelNextCheckpoint')}</span>
                        </div>
                        <button
                          onClick={() => setInspectTree(tree)}
                          className="text-[10px] font-bold text-emerald-700 hover:underline shrink-0 ml-3"
                        >
                          {language === 'ta' ? 'முழு பாஸ்போர்ட் காண்க →' : 'View Full Passport →'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination & Count */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
                <span>Showing {filteredMyTrees.length} of {myTreesData.length} trees</span>
                <div className="flex items-center gap-1.5 font-bold">
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed">‹</button>
                  <span className="px-3 py-1 rounded-lg bg-emerald-700 text-white">1</span>
                  <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-400 cursor-not-allowed">›</button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB CONTENT 2: FRIENDS' TREES (Section 7)                 */}
          {/* ======================================================== */}
          {activeTab === 'friends-trees' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white rounded-2xl border border-blue-200/80 p-5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-900 font-extrabold text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Environmental Verification Network</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                    7 Associated Trees Nearby
                  </span>
                </div>
                <p className="text-xs text-blue-950/80 leading-relaxed">
                  As an accredited custodian, you can review nearby trees cared for by fellow students and volunteers. 
                  Conducting peer audits creates independent multi-party accountability across the campus green canopy.
                </p>
                <div className="flex items-center gap-4 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>MY RESPONSIBILITY: 3 Trees</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-blue-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>FRIENDS' / PEER NETWORK: 7 Trees</span>
                  </div>
                </div>
              </div>

              {/* Friends' Trees List */}
              <div className="space-y-3">
                {friendsTrees.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.photoUrl}
                        alt={item.treeSpecies}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-500">{item.treeId}</span>
                          <span className="font-bold text-slate-900 text-sm">{item.treeSpecies}</span>
                          {item.status === 'ALIVE' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                              Alive
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-bold text-[10px] border border-amber-300">
                              At Risk
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-700 font-medium flex items-center gap-1">
                          <span className="text-slate-400">Custodian:</span>
                          <span className="font-bold text-slate-900">{item.friendName}</span>
                          <span className="text-slate-400 font-normal">({item.friendRole})</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.location}
                          </span>
                          <span>•</span>
                          <span>Last verified: {item.lastVerifiedRelative}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <button
                        onClick={() => setReferencePhotoPreview({
                          title: `${item.treeId} — ${item.treeSpecies} (${item.friendName})`,
                          photoUrl: item.referencePhotoUrl,
                          landmark: item.landmark,
                          coordinates: "13.0841° N, 80.2710° E"
                        })}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
                      >
                        View Landmark
                      </button>

                      <button
                        onClick={() => handleTriggerVerify(item.treeId)}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                          item.status === 'AT_RISK'
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB CONTENT 3: ALL MY VERIFICATIONS (Section 8)          */}
          {/* ======================================================== */}
          {activeTab === 'verifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  {[
                    { id: 'all', label: 'All Audits (12)' },
                    { id: 'completed', label: 'Completed (9)' },
                    { id: 'pending', label: 'Pending (2)' },
                    { id: 'flagged', label: 'Flagged (1)' },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setVerificationFilter(filter.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        verificationFilter === filter.id
                          ? 'bg-[#052E1F] text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-medium">Synced with TN Gov Environmental Ledger</span>
              </div>

              <div className="space-y-3">
                {verificationsList.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-emerald-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-emerald-200/60">
                          {record.verificationCode.slice(0, 4)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-slate-900">{record.verificationCode}</span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="font-bold text-slate-900 text-xs">{record.treeId} ({record.treeSpecies})</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Verified by: <span className="font-semibold text-slate-700">{record.verifiedBy}</span> • Date: {record.date}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {record.result === 'ALIVE' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ALIVE
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            AT RISK
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-1">Status: {record.status}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 flex items-start gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-800">Evidence:</span> {record.evidenceType}
                        {record.notes && <p className="text-slate-600 mt-0.5">{record.notes}</p>}
                        {record.anomalyReason && (
                          <p className="text-amber-800 font-semibold mt-1">
                            ⚠️ Note: {record.anomalyReason} {record.actionRequested && `— ${record.actionRequested}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB CONTENT 4: HANDOVER REQUESTS (Section 9)             */}
          {/* ======================================================== */}
          {activeTab === 'handover' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-50 to-white border border-amber-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-amber-950 text-sm">Graduation Handover Alert</h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-[10px] font-black">14 DAYS REMAINING</span>
                    </div>
                    <p className="text-xs text-amber-900/80 mt-1 leading-relaxed">
                      Your graduation handover is due in 14 days. Reassign custody of active trees to junior custodians to maintain 100% continuous care.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onOpenHandoff(trees[0] || myTreesData[0] as any)}
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors shadow-sm shrink-0 whitespace-nowrap"
                >
                  Initiate New Handover
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider px-1">
                  Active Transfer Requests
                </h4>

                {handoverRequests.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          item.type === 'outgoing' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          <ArrowRightLeft className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {item.type === 'outgoing' ? 'Custody Transfer Request (Outgoing)' : 'Incoming Custody Transfer'}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              item.status === 'Declined' ? 'bg-red-50 text-red-700' :
                              item.type === 'incoming' ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Tree: <span className="font-mono font-bold text-slate-700">{item.treeId}</span> ({item.treeSpecies}) • {item.location}
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-xs text-slate-500 shrink-0">
                        <span className="block font-semibold text-slate-700">Due in {item.dueInDays} days</span>
                        <span className="text-[10px] text-slate-400">Initiated {item.initiatedDate}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 rounded-xl p-3.5 text-xs text-slate-700">
                      <div>
                        <span className="text-slate-400 font-medium block text-[10px] uppercase">From Custodian</span>
                        <span className="font-bold text-slate-900">{item.fromCustodian}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-medium block text-[10px] uppercase">Assigned Successor</span>
                        <span className="font-bold text-slate-900">{item.toCustodian}</span>
                      </div>
                      <div className="sm:col-span-2 pt-1 border-t border-slate-200/60">
                        <span className="text-slate-400 font-medium text-[10px] uppercase">Reason: </span>
                        <span className="font-medium text-slate-800">{item.reason} — {item.notes}</span>
                      </div>
                    </div>

                    {item.status !== 'Accepted' && item.status !== 'Declined' && (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        {item.type === 'incoming' ? (
                          <>
                            <button
                              onClick={() => handleDeclineHandover(item)}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAcceptHandover(item)}
                              className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-sm"
                            >
                              Accept Responsibility
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => triggerToast("Reviewing handover dossier...")}
                              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                            >
                              Review Handover
                            </button>
                            <button
                              onClick={() => triggerToast("Priya S. has received notification reminder.")}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                            >
                              Resend Notification
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB CONTENT 5: ACTIVITY TIMELINE (Section 10)            */}
          {/* ======================================================== */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>Activity & Responsibility Timeline</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">Real-time audit log</span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activityFeed.map((act) => {
                  const Icon = act.icon;
                  return (
                    <div key={act.id} className="relative group">
                      <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{act.period} • {act.time}</span>
                          <span className={`px-2 py-0.2 rounded-md text-[10px] font-extrabold ${act.color}`}>
                            {act.badge}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{act.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 11. QUICK ACTIONS SECTION & FIND NEARBY TREES BANNER */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Quick Actions Bar */}
            <div className="md:col-span-8 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs flex flex-col justify-between">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
                Quick Actions
              </h4>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {/* + Add Tree */}
                <button
                  onClick={() => {
                    if (onOpenRegisterTree) onOpenRegisterTree();
                    else triggerToast("Register tree modal opened.");
                  }}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-800 text-center transition-all group flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100/60 text-emerald-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] font-bold leading-tight">{t('actionAddTree')}</div>
                  <div className="text-[9px] text-slate-400">▾</div>
                </button>

                {/* Record Update */}
                <button
                  onClick={() => setRecordMaintenanceTree(myTreesData[0])}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-800 text-center transition-all group flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100/60 text-blue-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] font-bold leading-tight">{t('actionRecordMaintenance')}</div>
                  <div className="text-[9px] text-slate-400">▾</div>
                </button>

                {/* Verify Tree */}
                <button
                  onClick={() => handleTriggerVerify("TG-IND-003")}
                  className="p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200 hover:border-amber-400 text-amber-950 text-center transition-all group flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] font-bold leading-tight">{t('actionVerifyTree')}</div>
                  <div className="text-[9px] text-amber-800 font-semibold">▾</div>
                </button>

                {/* Report Issue */}
                <button
                  onClick={() => setReportIssueTree(myTreesData[0])}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-800 hover:text-red-800 text-center transition-all group flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-100/60 text-red-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] font-bold leading-tight">{t('actionReportIssue')}</div>
                  <div className="text-[9px] text-slate-400">▾</div>
                </button>

                {/* Handover Tree */}
                <button
                  onClick={() => onOpenHandoff(trees[0] || myTreesData[0] as any)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-800 hover:text-purple-800 text-center transition-all group flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-100/60 text-purple-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] font-bold leading-tight">{t('actionHandover')}</div>
                  <div className="text-[9px] text-slate-400">▾</div>
                </button>

                {/* Request Support */}
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-800 text-center transition-all group flex flex-col items-center justify-center cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[11px] font-bold leading-tight">{t('actionSupport')}</div>
                  <div className="text-[9px] text-slate-400">▾</div>
                </button>
              </div>
            </div>

            {/* Find Nearby Trees Banner Card (from reference screenshot) */}
            <div className="md:col-span-4 rounded-2xl overflow-hidden shadow-2xs border border-emerald-600/30 bg-[#0A3822] text-white p-4 relative flex flex-col justify-between">
              <div className="relative z-10 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <h5 className="font-extrabold text-sm text-white">{t('findNearbyTitle')}</h5>
                </div>
                <p className="text-[11px] text-emerald-200/90 font-medium">{t('findNearbySubtitle')}</p>
              </div>

              <div className="relative z-10 pt-3">
                <button 
                  onClick={() => triggerToast("📍 Launching Tamil Nadu Campus Tree Locator Map...")}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{t('btnOpenMap')}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN (4 of 12 columns on desktop)                */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-6">

          {/* 2. PROFILE PANEL (Section 2 - from reference screenshot) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {t('myProfileTitle')}
              </h3>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                {t('editProfile')}
              </button>
            </div>

            {/* Profile Avatar & Name */}
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80" 
                  alt="Arun K." 
                  className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500/40 shadow-sm"
                />
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-emerald-600 text-white border-2 border-white flex items-center justify-center shadow">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-slate-900 leading-tight">
                  {language === 'ta' ? 'அருண் கே.' : profile.name}
                </h4>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 border border-emerald-200">
                  <UserCheck className="w-3 h-3" />
                  {t('verifiedCustodian')}
                </span>
              </div>
            </div>

            {/* Profile Meta Details */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate font-medium text-slate-700">{profile.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">{profile.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">{profile.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">{t('custodianId')}: CUST-2025-0178</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">{t('memberSince')} {profile.memberSince}</span>
              </div>
            </div>
          </div>

          {/* 12. MY IMPACT PANEL (Section 12 - from reference screenshot) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">{t('myImpactTitle')}</h3>
              <p className="text-xs text-slate-500 font-medium">{t('myImpactSubtitle')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-amber-900 uppercase mb-1">
                  <Droplets className="w-3 h-3 text-amber-600" />
                  {t('co2Absorbed')}
                </div>
                <div className="text-xl font-extrabold text-slate-900">{profile.co2Kg} kg</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">{t('estimated')}</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 text-center">
                <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-900 uppercase mb-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {t('o2Generated')}
                </div>
                <div className="text-xl font-extrabold text-slate-900">{profile.o2Kg} kg</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">{t('estimated')}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50">
                <TreePine className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-900 block">{profile.myTreesCount}</span>
                  <span className="text-[10px] text-slate-500">{t('treesUnderCare')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-slate-900 block">{profile.verificationsDoneCount}</span>
                  <span className="text-[10px] text-slate-500">{t('checkpointsDone')}</span>
                </div>
              </div>
            </div>

            <div className="pt-1 text-center">
              <button
                onClick={() => setIsImpactModalOpen(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>{t('viewImpactDetails')}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 15. PENDING TASKS PANEL (Section 15 - from reference screenshot) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">{t('pendingTasksTitle')}</h3>
              <button
                onClick={() => setActiveTab('my-trees')}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="space-y-2.5">
              {/* Task 1: Urgent */}
              <div 
                onClick={() => handleTriggerVerify("TG-IND-003")}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 transition-colors flex items-start gap-3 cursor-pointer group"
              >
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900 truncate">Verify TG-IND-003</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">Indian Mahogany • Sports Ground</p>
                  <span className="text-[10px] font-extrabold text-amber-700 block mt-0.5">Due tomorrow</span>
                </div>
              </div>

              {/* Task 2: Normal Maintenance */}
              <div 
                onClick={() => setRecordMaintenanceTree(myTreesData[0])}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-emerald-50/60 transition-colors flex items-start gap-3 cursor-pointer group"
              >
                <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900 truncate">Record maintenance for TG-IND-001</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">Main Campus • Block A</p>
                  <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">Due in 2 days</span>
                </div>
              </div>

              {/* Task 3: Handover */}
              <div 
                onClick={() => setActiveTab('handover')}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-blue-50/60 transition-colors flex items-start gap-3 cursor-pointer group"
              >
                <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900 truncate">Accept handover TG-IND-021</span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">From: Rahul M.</p>
                  <span className="text-[10px] font-bold text-blue-700 block mt-0.5">Due in 5 days</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 13. MODAL: TREE PASSPORT & INSPECTION (Using createPortal) */}
      {/* ======================================================== */}
      {inspectTree && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto animate-rise">
            <button
              onClick={() => setInspectTree(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-sm text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {inspectTree.id}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  inspectTree.status === 'ALIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {inspectTree.status === 'ALIVE' ? 'ALIVE — VERIFIED' : 'AT RISK'}
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                {inspectTree.speciesName}
                <span className="text-sm font-normal text-slate-500 ml-2">({inspectTree.botanicalName} • {inspectTree.tamilName})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {inspectTree.location} — {inspectTree.landmark}
              </p>
            </div>

            {/* Dual Evidence Comparison Photos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Original Plantation Photo ({inspectTree.plantedDate})
                </span>
                <img
                  src={inspectTree.originalPlantationPhotoUrl}
                  alt="Plantation stage"
                  className="w-full h-36 rounded-2xl object-cover border border-slate-200"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Latest Verification Photo ({inspectTree.lastVerificationDate})
                </span>
                <img
                  src={inspectTree.photoUrl}
                  alt="Current state"
                  className="w-full h-36 rounded-2xl object-cover border border-slate-200"
                />
              </div>
            </div>

            {/* Core Tree Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-2xl p-4 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Health</span>
                <span className="font-extrabold text-slate-900 text-sm">{inspectTree.healthScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Growth Stage</span>
                <span className="font-extrabold text-slate-900 text-sm">{inspectTree.growthStage}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">GPS Coordinates</span>
                <span className="font-mono font-medium text-slate-700 text-[11px] block mt-0.5">
                  {inspectTree.coordinates[0]}° N, {inspectTree.coordinates[1]}° E
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Caretaker</span>
                <span className="font-bold text-emerald-800 text-sm">Arun K.</span>
              </div>
            </div>

            {/* Verification Timeline (Section 13) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Verification Milestones Timeline
              </h4>
              <div className="grid grid-cols-5 gap-2 text-center text-xs">
                {inspectTree.verificationTimeline.map((milestone, idx) => (
                  <div key={idx} className={`p-2.5 rounded-xl border ${
                    milestone.status === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' :
                    milestone.status === 'current' ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-400' :
                    'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    <div className="font-extrabold text-[11px]">{milestone.stage}</div>
                    <div className="text-[10px] font-medium mt-0.5">{milestone.title}</div>
                    <div className="text-[9px] text-slate-400 mt-1">{milestone.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Responsibility Chain (Section 17) */}
            <div className="space-y-2 bg-emerald-50/40 rounded-2xl p-4 border border-emerald-100">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Custody & Human Responsibility Chain
              </h4>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Pasumai Kaval tracks tree survival through verified continuity of care:
              </p>
              <div className="space-y-1.5 pt-1 text-xs text-slate-700">
                {inspectTree.custodyChain.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${step.completed ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <span className="font-bold text-slate-800 min-w-[110px]">{step.stage}:</span>
                    <span className="text-slate-600">{step.description}</span>
                    <span className="text-slate-400 text-[10px] ml-auto">{step.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Classifications note (Section 13: Tree Not Found vs DEAD) */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800 block">Tamil Nadu Accountability Protocol:</span>
              <p className="text-[11px] leading-relaxed">
                Allowed audit statuses: <span className="font-semibold text-emerald-700">ALIVE</span>, <span className="font-semibold text-amber-700">AT RISK</span>, <span className="font-semibold text-red-700">DEAD</span>, <span className="font-semibold text-purple-700">NOT FOUND / REMOVED</span>, and <span className="font-semibold text-slate-700">UNASSIGNED</span>. Missing trees are classified as <i>Not Found</i> rather than presumed Dead until ground confirmation.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setInspectTree(null);
                  onOpenTree(inspectTree.id);
                }}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in Full 3D Passport Viewer
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const t = inspectTree;
                    setInspectTree(null);
                    setRecordMaintenanceTree(t);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
                >
                  Record Maintenance
                </button>
                <button
                  onClick={() => {
                    const id = inspectTree.id;
                    setInspectTree(null);
                    handleTriggerVerify(id);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                >
                  Verify Tree
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: RECORD MAINTENANCE                                */}
      {/* ======================================================== */}
      {recordMaintenanceTree && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative my-auto animate-rise">
            <button
              onClick={() => setRecordMaintenanceTree(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold text-emerald-700">Record Maintenance Log</div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {recordMaintenanceTree.id} — {recordMaintenanceTree.speciesName}
              </h3>
              <p className="text-xs text-slate-500">{recordMaintenanceTree.location}</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Maintenance Type</label>
                <select
                  value={maintenanceForm.type}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Watering">Watering & Hydration</option>
                  <option value="Organic Fertilizer / Mulch">Organic Fertilizer / Mulch Ring</option>
                  <option value="Tree Guard Repair">Tree Guard Bamboo Mesh Repair</option>
                  <option value="Pruning">Pruning & Canopy Grooming</option>
                  <option value="Soil Aeration">Soil Aeration & Weeding</option>
                  <option value="Pest Treatment">Bio-Pesticide (Neem Oil Spray)</option>
                </select>
              </div>

              {maintenanceForm.type === 'Watering' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Water Quantity (Liters)</label>
                  <input
                    type="number"
                    value={maintenanceForm.liters}
                    onChange={(e) => setMaintenanceForm(prev => ({ ...prev, liters: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Observations & Notes</label>
                <textarea
                  value={maintenanceForm.notes}
                  onChange={(e) => setMaintenanceForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="Record soil condition, bamboo guard status..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRecordMaintenanceTree(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMaintenance}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm"
              >
                Submit Maintenance Record
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: REPORT ISSUE                                      */}
      {/* ======================================================== */}
      {reportIssueTree && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative my-auto animate-rise">
            <button
              onClick={() => setReportIssueTree(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold text-red-600">{t('passport.reportIssue')}</div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                {reportIssueTree.id} — {reportIssueTree.speciesName}
              </h3>
              <p className="text-xs text-slate-500">{reportIssueTree.location}</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Issue Category</label>
                <select
                  value={issueForm.issueType}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, issueType: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="Water shortage">Water Shortage / Severe Soil Dryness</option>
                  <option value="Cattle damage">Cattle / Stray Animal Grazing Damage</option>
                  <option value="Tree Guard Damaged">Tree Guard Mesh Broken</option>
                  <option value="Pest or Disease">Leaf Blight / Pest Infestation</option>
                  <option value="Tree missing / not found">Tree Missing / Not Found at Coordinates</option>
                  <option value="Vandalism">Physical Stem Damage / Vandalism</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Severity</label>
                <select
                  value={issueForm.severity}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                >
                  <option value="Normal">Normal — Routine Attention</option>
                  <option value="Attention">Attention — Intervene within 48 Hours</option>
                  <option value="Urgent">Urgent — Immediate Grounds Intervention Needed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description & Immediate Action Needed</label>
                <textarea
                  value={issueForm.notes}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800"
                  placeholder="Describe damage, animal breach, or broken guard..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReportIssueTree(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveIssue}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Dispatch Incident Report
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: EDIT PROFILE                                      */}
      {/* ======================================================== */}
      {isEditProfileOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative my-auto animate-rise">
            <button
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold text-emerald-700">Verified Custodian Profile</div>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{profile.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{profile.custodianId}</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editProfileForm.phone}
                  onChange={(e) => setEditProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Institution & Unit</label>
                <input
                  type="text"
                  value={editProfileForm.location}
                  onChange={(e) => setEditProfileForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-medium"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 text-[11px] space-y-1">
                <span className="font-bold block">Accreditation Details:</span>
                <p>Trust Score: 98% • Custody Continuity: 96% • Verification Accuracy: High Consistency.</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: IMPACT METHODOLOGY DETAILS                        */}
      {/* ======================================================== */}
      {isImpactModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative my-auto animate-rise">
            <button
              onClick={() => setIsImpactModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Methodology & Estimates</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Environmental Impact Ledger</h3>
              <p className="text-xs text-slate-500 mt-0.5">Calculations certified under Tamil Nadu Green Mission Guidelines</p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-600" /> Carbon Sequestration (128 kg Estimated)
                </h5>
                <p className="text-slate-600 text-[11px]">
                  Estimated based on sapling age, canopy biomass growth formulas, and botanical species coefficients (Azadirachta indica: ~22kg/year at maturity; Swietenia mahagoni: ~28kg/year).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" /> Oxygen Generation (94 kg Estimated)
                </h5>
                <p className="text-slate-600 text-[11px]">
                  Derived from photosynthetic leaf surface area estimations across verified audits. A healthy sapling generates roughly 0.73kg of oxygen per kilogram of carbon sequestered.
                </p>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                *Note: Values are marked as "Estimated" in compliance with operational reporting guidelines. Ground verification records validate living canopy survival to ensure real-world permanence.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsImpactModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: REFERENCE PHOTO & LANDMARK PREVIEW (Section 14)   */}
      {/* ======================================================== */}
      {referencePhotoPreview && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative my-auto animate-rise">
            <button
              onClick={() => setReferencePhotoPreview(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">Tree Location & Ground Identification</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-0.5">{referencePhotoPreview.title}</h3>
            </div>

            <img
              src={referencePhotoPreview.photoUrl}
              alt="Reference landmark"
              className="w-full h-56 rounded-2xl object-cover border border-slate-200 shadow-inner"
            />

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Landmark: {referencePhotoPreview.landmark}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-slate-600 text-[11px]">
                <Compass className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>GPS: {referencePhotoPreview.coordinates}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500">Matches physical campus grid</span>
              <button
                onClick={() => setReferencePhotoPreview(null)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ======================================================== */}
      {/* MODAL: REQUEST SUPPORT                                   */}
      {/* ======================================================== */}
      {isSupportModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative my-auto animate-rise">
            <button
              onClick={() => setIsSupportModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-emerald-700">Support & Ground Logistics</span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">Contact Campus Ground Team</h3>
              <p className="text-xs text-slate-500">Need emergency water tanks, replacement bamboo guards, or verification advice?</p>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Dr. Malathi V.</span>
                  <span className="text-slate-500 text-[11px]">Campus Sustainability Officer</span>
                </div>
                <button 
                  onClick={() => { triggerToast("Dialing Sustainability Officer..."); setIsSupportModalOpen(false); }}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100"
                >
                  Call
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Grounds & Irrigation Control</span>
                  <span className="text-slate-500 text-[11px]">Sector B Water Tank Dispatch</span>
                </div>
                <button 
                  onClick={() => { triggerToast("Water tanker dispatch request sent!"); setIsSupportModalOpen(false); }}
                  className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100"
                >
                  Request Tank
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Tamil Nadu Green Helpline</span>
                  <span className="text-slate-500 text-[11px]">Toll-Free 1800-425-TREE</span>
                </div>
                <button 
                  onClick={() => { triggerToast("Helpline connected."); setIsSupportModalOpen(false); }}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Info
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
