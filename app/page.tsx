"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Droplets,
  Users,
  Zap,
  TrendingUp,
  AlertTriangle,
  Bot,
  MessageSquare,
  Crown,
  Factory,
  Leaf,
  Globe,
  Shield,
  Lightbulb,
  Mountain,
} from "lucide-react"
import { HelpButton, QuickHelpTips } from "@/components/help-system"
import { CountrySelection, countries, type Country } from "@/components/country-selection"
import { PollutionIndicator, type WaterQualityState, type PollutionSource } from "@/components/pollution-indicator"
import { PollutionDetails } from "@/components/pollution-details"

interface AIRecommendation {
  id: string
  actionKey?: string
  roleSwitch?: string
  title: string
  description: string
  impact: "low" | "medium" | "high"
  urgency: "low" | "medium" | "high"
}

interface GameState {
  currentRole: string
  turn: number
  waterLevel: number
  publicSupport: number
  economicHealth: number
  environmentalHealth: number
  diplomaticRelations: number
  resources: number
  climateResilience: number
  adaptationLevel: number
  waterControl: number
  geopoliticalPower: number
  waterQuality: WaterQualityState
  selectedCountry?: Country
}

interface GameMessage {
  id: string
  message: string
  type:
    | "action"
    | "event"
    | "ai"
    | "crisis"
    | "challenge"
    | "success"
    | "climate"
    | "warning"
    | "diplomatic"
    | "conflict"
    | "pollution"
  timestamp: Date
}

interface ActionHistory {
  actionKey: string
  role: string
  turn: number
  impact: Record<string, number>
  timestamp: Date
}

interface ClimateState {
  currentSeason: "spring" | "summer" | "autumn" | "winter"
  temperature: number
  precipitation: number
  humidity: number
  windSpeed: number
  climateStability: number
  globalWarming: number
  seaLevel: number
  extremeWeatherRisk: number
}

interface ClimateEvent {
  id: string
  name: string
  type: "drought" | "flood" | "heatwave" | "storm" | "freeze" | "wildfire" | "hurricane" | "blizzard"
  severity: "minor" | "moderate" | "severe" | "extreme"
  duration: number
  remainingDuration: number
  effects: {
    immediate: Record<string, number>
    ongoing: Record<string, number>
    longTerm: Record<string, number>
  }
  description: string
  icon: React.ComponentType<{ className?: string }>
  adaptationOptions: string[]
}

interface ClimateTrend {
  id: string
  name: string
  description: string
  progression: number
  effects: Record<string, number>
  threshold: number
  triggered: boolean
}

interface DynamicChallenge {
  id: string
  title: string
  description: string
  type: "immediate" | "cascading" | "strategic" | "crisis" | "climate" | "diplomatic" | "geopolitical" | "pollution"
  triggerActions: string[]
  triggerRoles: string[]
  requirements: {
    turns: number
    conditions: Record<string, number>
  }
  rewards: Record<string, number>
  penalties: Record<string, number>
  status: "active" | "completed" | "failed"
  deadline?: number
  complexity: number
  createdAt: number
  countrySpecific?: string[]
}

interface GeopoliticalEvent {
  id: string
  title: string
  description: string
  type: "cooperation" | "conflict" | "trade" | "environmental" | "crisis" | "pollution"
  affectedCountries: string[]
  effects: Record<string, number>
  duration: number
  remainingDuration: number
}

interface ChallengeTemplate {
  id: string
  title: string
  description: string
  type: "immediate" | "cascading" | "strategic" | "crisis" | "climate" | "diplomatic" | "geopolitical" | "pollution"
  triggerConditions: {
    actions?: string[]
    roles?: string[]
    stateThresholds?: Record<string, { min?: number; max?: number }>
    climateConditions?: Record<string, { min?: number; max?: number }>
    climateEvents?: string[]
    actionCount?: number
    turnRange?: { min: number; max: number }
    countryTypes?: string[]
    diplomaticThresholds?: Record<string, { min?: number; max?: number }>
    pollutionThresholds?: Record<string, { min?: number; max?: number }>
  }
  dynamicElements: {
    titleVariables?: string[]
    descriptionVariables?: string[]
    requirements?: {
      base: Record<string, number>
      scaling: Record<string, number>
    }
  }
  baseRewards: Record<string, number>
  basePenalties: Record<string, number>
  complexity: number
  countrySpecific?: string[]
}

const roles = [
  { id: "government", name: "Government Official", icon: Crown, color: "bg-blue-500" },
  { id: "industry", name: "Industry Representative", icon: Factory, color: "bg-orange-500" },
  { id: "environmental", name: "Environmental Advocate", icon: Leaf, color: "bg-green-500" },
  { id: "international", name: "International Mediator", icon: Globe, color: "bg-purple-500" },
]

const actions = {
  government: [
    {
      key: "water_rationing",
      name: "Implement Water Rationing",
      cost: 2,
      impact: { water: 15, public: -10, economic: -5 },
      tags: ["regulation", "emergency", "public_policy"],
      countries: ["all"],
    },
    {
      key: "infrastructure",
      name: "Build Water Infrastructure",
      cost: 5,
      impact: { water: 25, economic: 10, environmental: -5, climateResilience: 10 },
      tags: ["infrastructure", "long_term", "investment"],
      countries: ["all"],
    },
    {
      key: "dam_construction",
      name: "Construct Strategic Dam",
      cost: 8,
      impact: { water: 40, waterControl: 20, economic: 15, environmental: -15, diplomatic: -10 },
      tags: ["infrastructure", "control", "source_only"],
      countries: ["alpinia", "highland_federation"],
    },
    {
      key: "water_release_control",
      name: "Control Water Releases",
      cost: 3,
      impact: { waterControl: 15, diplomatic: -5, geopoliticalPower: 10 },
      tags: ["control", "diplomatic", "source_only"],
      countries: ["alpinia", "highland_federation"],
    },
    {
      key: "downstream_coalition",
      name: "Form Downstream Coalition",
      cost: 4,
      impact: { diplomatic: 20, geopoliticalPower: 15, public: 10 },
      tags: ["diplomatic", "coalition", "downstream_only"],
      countries: ["riverlandia", "deltopia", "desert_emirates"],
    },
    {
      key: "international_arbitration",
      name: "Seek International Arbitration",
      cost: 6,
      impact: { diplomatic: 25, geopoliticalPower: 10, resources: -20 },
      tags: ["legal", "international", "downstream_only"],
      countries: ["riverlandia", "deltopia", "desert_emirates"],
    },
    {
      key: "pollution_regulations",
      name: "Enforce Pollution Regulations",
      cost: 5,
      impact: {
        environmentalHealth: 15,
        economic: -10,
        public: 5,
        waterQuality: { pollutionLevel: -15, waterTreatmentCapacity: 5, environmentalDamage: -10 },
      },
      tags: ["regulation", "pollution", "enforcement"],
      countries: ["all"],
    },
    {
      key: "water_quality_standards",
      name: "Implement Water Quality Standards",
      cost: 4,
      impact: {
        environmentalHealth: 10,
        diplomatic: 5,
        economic: -5,
        waterQuality: { pollutionLevel: -10, internationalStandards: true, disputeLevel: "minor" },
      },
      tags: ["regulation", "standards", "quality"],
      countries: ["all"],
    },
    {
      key: "treatment_facilities",
      name: "Build Treatment Facilities",
      cost: 7,
      impact: {
        environmentalHealth: 20,
        economic: -15,
        public: 10,
        waterQuality: { pollutionLevel: -25, waterTreatmentCapacity: 30, healthImpacts: -20 },
      },
      tags: ["infrastructure", "treatment", "health"],
      countries: ["all"],
    },
  ],
  industry: [
    {
      key: "efficiency",
      name: "Improve Water Efficiency",
      cost: 4,
      impact: { water: 20, economic: 5, environmental: 10, adaptationLevel: 8 },
      tags: ["efficiency", "technology", "sustainable"],
      countries: ["all"],
    },
    {
      key: "hydroelectric_expansion",
      name: "Expand Hydroelectric Power",
      cost: 7,
      impact: { economic: 25, waterControl: 15, environmental: -10, diplomatic: -8 },
      tags: ["energy", "infrastructure", "source_only"],
      countries: ["alpinia", "highland_federation"],
    },
    {
      key: "desalination_expansion",
      name: "Expand Desalination Capacity",
      cost: 10,
      impact: { water: 35, economic: -15, adaptationLevel: 20, environmental: -5 },
      tags: ["technology", "adaptation", "downstream_only"],
      countries: ["deltopia", "desert_emirates"],
    },
    {
      key: "water_imports",
      name: "Establish Water Import System",
      cost: 8,
      impact: { water: 30, economic: -20, diplomatic: 15, resources: -30 },
      tags: ["trade", "dependency", "downstream_only"],
      countries: ["desert_emirates", "deltopia"],
    },
    {
      key: "clean_production",
      name: "Implement Clean Production",
      cost: 6,
      impact: {
        environmentalHealth: 15,
        economic: -5,
        public: 10,
        waterQuality: { pollutionLevel: -20, environmentalDamage: -15 },
      },
      tags: ["technology", "pollution", "industry"],
      countries: ["all"],
    },
    {
      key: "industrial_monitoring",
      name: "Industrial Discharge Monitoring",
      cost: 3,
      impact: {
        environmentalHealth: 5,
        economic: -2,
        waterQuality: { pollutionLevel: -5, monitoringEfficiency: 25 },
      },
      tags: ["monitoring", "pollution", "regulation"],
      countries: ["all"],
    },
    {
      key: "pollution_treatment",
      name: "Industrial Wastewater Treatment",
      cost: 8,
      impact: {
        environmentalHealth: 20,
        economic: -10,
        diplomatic: 5,
        waterQuality: { pollutionLevel: -30, waterTreatmentCapacity: 20, healthImpacts: -15 },
      },
      tags: ["treatment", "technology", "pollution"],
      countries: ["all"],
    },
  ],
  environmental: [
    {
      key: "conservation",
      name: "Launch Conservation Campaign",
      cost: 2,
      impact: { water: 10, environmental: 20, public: 15, adaptationLevel: 5 },
      tags: ["conservation", "awareness", "public"],
      countries: ["all"],
    },
    {
      key: "glacier_protection",
      name: "Glacier Protection Initiative",
      cost: 6,
      impact: { environmental: 30, climateResilience: 20, water: 15, economic: -10 },
      tags: ["climate", "protection", "source_only"],
      countries: ["alpinia", "highland_federation"],
    },
    {
      key: "delta_restoration",
      name: "Delta Ecosystem Restoration",
      cost: 7,
      impact: { environmental: 35, climateResilience: 25, water: 10, economic: -12 },
      tags: ["restoration", "ecosystem", "downstream_only"],
      countries: ["deltopia", "riverlandia"],
    },
    {
      key: "biodiversity_protection",
      name: "Biodiversity Protection Initiative",
      cost: 6,
      impact: { environmental: 35, climateResilience: 18, water: 10, economic: -8 },
      tags: ["biodiversity", "protection", "climate"],
      countries: ["all"],
    },
    {
      key: "water_quality_monitoring",
      name: "Water Quality Monitoring Network",
      cost: 4,
      impact: {
        environmentalHealth: 10,
        public: 5,
        waterQuality: { monitoringEfficiency: 40, pollutionLevel: -5 },
      },
      tags: ["monitoring", "quality", "data"],
      countries: ["all"],
    },
    {
      key: "ecosystem_restoration",
      name: "Aquatic Ecosystem Restoration",
      cost: 7,
      impact: {
        environmentalHealth: 25,
        economic: -5,
        public: 10,
        waterQuality: { environmentalDamage: -30, pollutionLevel: -15 },
      },
      tags: ["restoration", "ecosystem", "biodiversity"],
      countries: ["all"],
    },
    {
      key: "pollution_litigation",
      name: "Pollution Litigation Campaign",
      cost: 5,
      impact: {
        environmentalHealth: 15,
        economic: -10,
        public: 5,
        waterQuality: { pollutionLevel: -20, disputeLevel: "moderate" },
      },
      tags: ["legal", "enforcement", "pollution"],
      countries: ["all"],
    },
  ],
  international: [
    {
      key: "cooperation",
      name: "Regional Water Cooperation",
      cost: 4,
      impact: { water: 20, diplomatic: 25, economic: 5, climateResilience: 10 },
      tags: ["cooperation", "regional", "diplomatic"],
      countries: ["all"],
    },
    {
      key: "water_pricing",
      name: "Implement Water Pricing",
      cost: 3,
      impact: { resources: 40, diplomatic: -15, geopoliticalPower: 15, public: -10 },
      tags: ["economic", "pricing", "source_only"],
      countries: ["alpinia", "highland_federation"],
    },
    {
      key: "compensation_claims",
      name: "Demand Upstream Compensation",
      cost: 5,
      impact: { diplomatic: -10, geopoliticalPower: 10, resources: 25, public: 15 },
      tags: ["legal", "compensation", "downstream_only"],
      countries: ["riverlandia", "deltopia", "desert_emirates"],
    },
    {
      key: "technology_sharing",
      name: "Technology Sharing Agreement",
      cost: 6,
      impact: { diplomatic: 30, adaptationLevel: 15, economic: 10, resources: -20 },
      tags: ["technology", "cooperation", "wealthy_only"],
      countries: ["highland_federation", "desert_emirates"],
    },
    {
      key: "water_quality_agreement",
      name: "Water Quality Treaty",
      cost: 6,
      impact: {
        diplomatic: 25,
        environmentalHealth: 15,
        economic: -5,
        waterQuality: { disputeLevel: "none", internationalStandards: true },
      },
      tags: ["treaty", "quality", "cooperation"],
      countries: ["all"],
    },
    {
      key: "pollution_mediation",
      name: "Cross-Border Pollution Mediation",
      cost: 4,
      impact: {
        diplomatic: 20,
        environmentalHealth: 10,
        waterQuality: { disputeLevel: "minor" },
      },
      tags: ["mediation", "pollution", "diplomatic"],
      countries: ["all"],
    },
    {
      key: "diplomatic_protest",
      name: "File Diplomatic Protest",
      cost: 3,
      impact: {
        diplomatic: -15,
        geopoliticalPower: 5,
        public: 10,
        waterQuality: { disputeLevel: "severe" },
      },
      tags: ["protest", "diplomatic", "downstream_only"],
      countries: ["riverlandia", "deltopia", "desert_emirates"],
    },
  ],
}

// Pollution challenge templates
const pollutionChallengeTemplates: ChallengeTemplate[] = [
  {
    id: "cross_border_pollution",
    title: "Cross-Border Pollution Crisis",
    description: "Industrial pollution from upstream is contaminating your water supply, causing diplomatic tensions.",
    type: "pollution",
    triggerConditions: {
      countryTypes: ["downstream"],
      pollutionThresholds: { pollutionLevel: { min: 60 } },
    },
    dynamicElements: {
      requirements: {
        base: { diplomatic: 60, environmentalHealth: 50 },
        scaling: { diplomatic: 5 },
      },
    },
    baseRewards: {
      diplomatic: 20,
      environmentalHealth: 15,
      waterQuality: { pollutionLevel: -20, disputeLevel: "minor" },
    },
    basePenalties: { diplomatic: -15, environmentalHealth: -10, public: -15 },
    complexity: 3,
    countrySpecific: ["riverlandia", "deltopia"],
  },
  {
    id: "industrial_contamination",
    title: "Industrial Contamination Emergency",
    description: "A major industrial accident has released toxic chemicals into the water system.",
    type: "pollution",
    triggerConditions: {
      roles: ["industry"],
      pollutionThresholds: { pollutionLevel: { min: 40 } },
    },
    dynamicElements: {
      requirements: {
        base: { environmentalHealth: 60, public: 50 },
        scaling: { environmentalHealth: 5 },
      },
    },
    baseRewards: { environmentalHealth: 20, public: 15, waterQuality: { pollutionLevel: -25, healthImpacts: -20 } },
    basePenalties: { environmentalHealth: -20, public: -25, economic: -15 },
    complexity: 4,
    countrySpecific: ["all"],
  },
  {
    id: "water_quality_standards",
    title: "International Water Quality Standards",
    description: "International organizations are pressuring for compliance with water quality standards.",
    type: "pollution",
    triggerConditions: {
      pollutionThresholds: { pollutionLevel: { min: 50 } },
      diplomaticThresholds: { diplomatic: { min: 40 } },
    },
    dynamicElements: {
      requirements: {
        base: { environmentalHealth: 55, resources: 30 },
        scaling: { resources: 10 },
      },
    },
    baseRewards: { diplomatic: 25, environmentalHealth: 15, waterQuality: { internationalStandards: true } },
    basePenalties: { diplomatic: -20, economic: -15 },
    complexity: 3,
    countrySpecific: ["all"],
  },
  {
    id: "public_health_crisis",
    title: "Water Pollution Health Crisis",
    description: "Contaminated drinking water is causing widespread health issues among the population.",
    type: "pollution",
    triggerConditions: {
      pollutionThresholds: { healthImpacts: { min: 60 } },
    },
    dynamicElements: {
      requirements: {
        base: { public: 60, resources: 25 },
        scaling: { public: 5 },
      },
    },
    baseRewards: { public: 30, waterQuality: { healthImpacts: -30, pollutionLevel: -15 } },
    basePenalties: { public: -25, economic: -20 },
    complexity: 4,
    countrySpecific: ["all"],
  },
]

// Pollution events
const pollutionEvents = [
  {
    title: "Industrial Discharge Incident",
    description: "A factory has illegally discharged untreated wastewater into the river system.",
    type: "pollution" as const,
    effects: {
      environmentalHealth: -15,
      public: -10,
      waterQuality: { pollutionLevel: 20, environmentalDamage: 15, healthImpacts: 10 },
    },
    duration: 3,
  },
  {
    title: "Agricultural Runoff Surge",
    description: "Heavy rains have washed fertilizers and pesticides from farmlands into water sources.",
    type: "pollution" as const,
    effects: {
      environmentalHealth: -10,
      water: -5,
      waterQuality: { pollutionLevel: 15, environmentalDamage: 20 },
    },
    duration: 2,
  },
  {
    title: "Cross-Border Pollution Complaint",
    description: "A neighboring country has filed a formal complaint about water pollution from your territory.",
    type: "pollution" as const,
    effects: {
      diplomatic: -15,
      geopoliticalPower: -5,
      waterQuality: { disputeLevel: "moderate" },
    },
    duration: 4,
  },
  {
    title: "Urban Sewage Overflow",
    description: "Heavy rainfall has caused urban sewage systems to overflow into water sources.",
    type: "pollution" as const,
    effects: {
      environmentalHealth: -10,
      public: -15,
      waterQuality: { pollutionLevel: 25, healthImpacts: 20 },
    },
    duration: 2,
  },
]

// Sample pollution sources for different countries
const countryPollutionSources: Record<string, PollutionSource[]> = {
  alpinia: [
    {
      id: "alp_mining_1",
      name: "Highland Mining Operations",
      type: "industrial",
      severity: 45,
      location: "Northern Mountains",
      description: "Metal mining operations releasing heavy metals into mountain streams.",
      origin: "alpinia",
      crossBorder: true,
    },
    {
      id: "alp_urban_1",
      name: "Capital City Runoff",
      type: "urban",
      severity: 30,
      location: "Capital Region",
      description: "Urban runoff from the capital city affecting local water quality.",
      origin: "alpinia",
      crossBorder: false,
    },
  ],
  highland_federation: [
    {
      id: "hf_industry_1",
      name: "Federation Industrial Zone",
      type: "industrial",
      severity: 55,
      location: "Eastern Plateau",
      description: "Large industrial complex with multiple factories releasing chemical waste.",
      origin: "highland_federation",
      crossBorder: true,
    },
    {
      id: "hf_agri_1",
      name: "Highland Agriculture",
      type: "agricultural",
      severity: 35,
      location: "Southern Valleys",
      description: "Intensive agriculture using fertilizers and pesticides.",
      origin: "highland_federation",
      crossBorder: true,
    },
  ],
  riverlandia: [
    {
      id: "riv_industry_1",
      name: "Riverside Manufacturing",
      type: "industrial",
      severity: 50,
      location: "Central Valley",
      description: "Manufacturing facilities located along the main river.",
      origin: "riverlandia",
      crossBorder: true,
    },
    {
      id: "riv_agri_1",
      name: "Intensive Farming District",
      type: "agricultural",
      severity: 60,
      location: "Fertile Plains",
      description: "Large-scale farming with heavy use of agrochemicals.",
      origin: "riverlandia",
      crossBorder: false,
    },
  ],
  deltopia: [
    {
      id: "del_urban_1",
      name: "Delta Metropolis",
      type: "urban",
      severity: 65,
      location: "Main Delta",
      description: "Dense urban area with inadequate sewage treatment.",
      origin: "deltopia",
      crossBorder: false,
    },
    {
      id: "del_industry_1",
      name: "Coastal Industrial Complex",
      type: "industrial",
      severity: 55,
      location: "Eastern Coast",
      description: "Heavy industries located near the coast with ocean discharge.",
      origin: "deltopia",
      crossBorder: false,
    },
  ],
  desert_emirates: [
    {
      id: "de_industry_1",
      name: "Oil Refineries",
      type: "industrial",
      severity: 70,
      location: "Northern Region",
      description: "Oil refineries with significant water contamination issues.",
      origin: "desert_emirates",
      crossBorder: false,
    },
    {
      id: "de_urban_1",
      name: "Luxury Resort Development",
      type: "urban",
      severity: 40,
      location: "Coastal Zone",
      description: "Luxury tourism development with wastewater discharge issues.",
      origin: "desert_emirates",
      crossBorder: false,
    },
  ],
}

// Cross-border pollution sources
const crossBorderPollution: Record<string, PollutionSource[]> = {
  riverlandia: [
    {
      id: "alp_to_riv_1",
      name: "Upstream Mining Discharge",
      type: "industrial",
      severity: 55,
      location: "Upper River",
      description: "Mining waste from Alpinia flowing downstream into Riverlandia's water system.",
      origin: "alpinia",
      crossBorder: true,
    },
  ],
  deltopia: [
    {
      id: "riv_to_del_1",
      name: "Agricultural Runoff",
      type: "agricultural",
      severity: 60,
      location: "River Mouth",
      description: "Agricultural chemicals from Riverlandia farms flowing into the delta.",
      origin: "riverlandia",
      crossBorder: true,
    },
    {
      id: "alp_to_del_1",
      name: "Long-Distance Industrial Pollution",
      type: "industrial",
      severity: 40,
      location: "Main River Channel",
      description: "Industrial pollutants from Alpinia reaching the delta after traveling the entire river.",
      origin: "alpinia",
      crossBorder: true,
    },
  ],
}

const WaterDiplomacyGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRole: "government",
    turn: 1,
    waterLevel: 60,
    publicSupport: 70,
    economicHealth: 65,
    environmentalHealth: 55,
    diplomaticRelations: 60,
    resources: 100,
    climateResilience: 50,
    adaptationLevel: 30,
    waterControl: 50,
    geopoliticalPower: 50,
    waterQuality: {
      pollutionLevel: 30,
      contaminationSources: [],
      waterTreatmentCapacity: 40,
      monitoringEfficiency: 30,
      healthImpacts: 20,
      environmentalDamage: 25,
      internationalStandards: false,
      disputeLevel: "none",
    },
  })

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [gameInitialized, setGameInitialized] = useState(false)

  const [climateState, setClimateState] = useState<ClimateState>({
    currentSeason: "spring",
    temperature: 20,
    precipitation: 75,
    humidity: 60,
    windSpeed: 15,
    climateStability: 70,
    globalWarming: 1.2,
    seaLevel: 15,
    extremeWeatherRisk: 25,
  })

  const [messages, setMessages] = useState<GameMessage[]>([])
  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([])
  const [activeChallenges, setActiveChallenges] = useState<DynamicChallenge[]>([])
  const [activeClimateEvents, setActiveClimateEvents] = useState<ClimateEvent[]>([])
  const [activeGeopoliticalEvents, setActiveGeopoliticalEvents] = useState<GeopoliticalEvent[]>([])
  const [climateTrendProgress, setClimateTrendProgress] = useState<ClimateTrend[]>([])
  const [showAIRecommendations, setShowAIRecommendations] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [showQuickHelp, setShowQuickHelp] = useState(true)
  const [showPollutionDetails, setShowPollutionDetails] = useState(false)

  // Define addMessage first, before any other functions that use it
  const addMessage = useCallback((message: string, type: GameMessage["type"]) => {
    const newMessage: GameMessage = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    }
    setMessages((prev) => [newMessage, ...prev])
  }, [])

  const handleCountrySelection = (country: Country) => {
    setSelectedCountry(country)

    // Initialize pollution sources based on country
    const localSources = countryPollutionSources[country.id] || []
    let incomingSources: PollutionSource[] = []

    // Add cross-border pollution for downstream countries
    if (country.type === "downstream") {
      incomingSources = crossBorderPollution[country.id] || []
    }

    // Set initial pollution level based on country type
    const initialPollutionLevel = country.type === "downstream" ? 50 : 30
    const initialDisputeLevel = country.type === "downstream" ? "moderate" : "none"

    // Set game state with country-specific values
    setGameState({
      ...country.startingStats,
      currentRole: "government",
      turn: 1,
      waterQuality: {
        pollutionLevel: initialPollutionLevel,
        contaminationSources: [...localSources, ...incomingSources],
        waterTreatmentCapacity: country.type === "downstream" ? 30 : 50,
        monitoringEfficiency: 30,
        healthImpacts: country.type === "downstream" ? 40 : 20,
        environmentalDamage: country.type === "downstream" ? 45 : 25,
        internationalStandards: false,
        disputeLevel: initialDisputeLevel,
      },
    })

    setGameInitialized(true)

    // Add initial messages
    addMessage(
      `Welcome to ${country.name}! You are now leading this ${country.type} nation in the hydro-political simulation.`,
      "event",
    )

    if (country.type === "downstream") {
      addMessage(
        `As a downstream country, you're receiving water that may be polluted by upstream activities. Monitor water quality closely.`,
        "pollution",
      )
    } else {
      addMessage(
        `As a source country, your activities can affect downstream water quality. Be mindful of potential diplomatic consequences.`,
        "pollution",
      )
    }
  }

  // Apply effects to game state including water quality
  const applyEffects = useCallback((effects: Record<string, any>) => {
    setGameState((prev) => {
      const newState = { ...prev }

      // Apply standard numeric effects
      if (effects.water) newState.waterLevel = Math.max(0, Math.min(100, prev.waterLevel + effects.water))
      if (effects.public) newState.publicSupport = Math.max(0, Math.min(100, prev.publicSupport + effects.public))
      if (effects.economic) newState.economicHealth = Math.max(0, Math.min(100, prev.economicHealth + effects.economic))
      if (effects.environmentalHealth)
        newState.environmentalHealth = Math.max(
          0,
          Math.min(100, prev.environmentalHealth + effects.environmentalHealth),
        )
      if (effects.diplomatic)
        newState.diplomaticRelations = Math.max(0, Math.min(100, prev.diplomaticRelations + effects.diplomatic))
      if (effects.climateResilience)
        newState.climateResilience = Math.max(0, Math.min(100, prev.climateResilience + effects.climateResilience))
      if (effects.adaptationLevel)
        newState.adaptationLevel = Math.max(0, Math.min(100, prev.adaptationLevel + effects.adaptationLevel))
      if (effects.resources) newState.resources = prev.resources + effects.resources
      if (effects.waterControl)
        newState.waterControl = Math.max(0, Math.min(100, prev.waterControl + effects.waterControl))
      if (effects.geopoliticalPower)
        newState.geopoliticalPower = Math.max(0, Math.min(100, prev.geopoliticalPower + effects.geopoliticalPower))

      // Apply water quality effects if present
      if (effects.waterQuality) {
        const waterQuality = { ...prev.waterQuality }

        if (effects.waterQuality.pollutionLevel) {
          waterQuality.pollutionLevel = Math.max(
            0,
            Math.min(100, waterQuality.pollutionLevel + effects.waterQuality.pollutionLevel),
          )
        }

        if (effects.waterQuality.waterTreatmentCapacity) {
          waterQuality.waterTreatmentCapacity = Math.max(
            0,
            Math.min(100, waterQuality.waterTreatmentCapacity + effects.waterQuality.waterTreatmentCapacity),
          )
        }

        if (effects.waterQuality.monitoringEfficiency) {
          waterQuality.monitoringEfficiency = Math.max(
            0,
            Math.min(100, waterQuality.monitoringEfficiency + effects.waterQuality.monitoringEfficiency),
          )
        }

        if (effects.waterQuality.healthImpacts) {
          waterQuality.healthImpacts = Math.max(
            0,
            Math.min(100, waterQuality.healthImpacts + effects.waterQuality.healthImpacts),
          )
        }

        if (effects.waterQuality.environmentalDamage) {
          waterQuality.environmentalDamage = Math.max(
            0,
            Math.min(100, waterQuality.environmentalDamage + effects.waterQuality.environmentalDamage),
          )
        }

        if (effects.waterQuality.internationalStandards !== undefined) {
          waterQuality.internationalStandards = effects.waterQuality.internationalStandards
        }

        if (effects.waterQuality.disputeLevel) {
          waterQuality.disputeLevel = effects.waterQuality.disputeLevel
        }

        newState.waterQuality = waterQuality
      }

      return newState
    })
  }, [])

  const generatePollutionEvent = useCallback(() => {
    if (!selectedCountry) return

    // Higher chance for downstream countries
    const baseChance = selectedCountry.type === "downstream" ? 0.2 : 0.1
    // Higher chance with higher pollution levels
    const pollutionFactor = gameState.waterQuality.pollutionLevel / 200 // 0-0.5 additional chance
    const eventChance = baseChance + pollutionFactor

    if (Math.random() < eventChance) {
      // Select a random pollution event
      const event = pollutionEvents[Math.floor(Math.random() * pollutionEvents.length)]

      addMessage(`🏭 Pollution Event: ${event.title} - ${event.description}`, "pollution")

      // Apply effects with a delay to avoid render-time state updates
      setTimeout(() => {
        applyEffects(event.effects)
      }, 0)
    }
  }, [selectedCountry, gameState.waterQuality.pollutionLevel, addMessage, applyEffects])

  const takeAction = (actionKey: string) => {
    const currentRoleActions = actions[gameState.currentRole as keyof typeof actions]
    const action = currentRoleActions?.find((a) => a.key === actionKey)

    if (!action || gameState.resources < action.cost) {
      addMessage("Insufficient resources to take this action!", "crisis")
      return
    }

    const actionRecord: ActionHistory = {
      actionKey,
      role: gameState.currentRole,
      turn: gameState.turn,
      impact: action.impact,
      timestamp: new Date(),
    }

    setActionHistory((prev) => [...prev, actionRecord])

    // Apply action effects
    applyEffects(action.impact)

    // Deduct resources and advance turn
    setGameState((prev) => ({
      ...prev,
      resources: prev.resources - action.cost,
      turn: prev.turn + 1,
    }))

    addMessage(`Action taken: ${action.name}`, "action")

    // Hide quick help after a few turns
    if (gameState.turn >= 3) {
      setShowQuickHelp(false)
    }

    // Generate random events
    generateRandomEvent()
    generatePollutionEvent()
  }

  const generateRandomEvent = () => {
    const events = [
      { message: "Heavy rainfall increases water reserves by 10%", effect: { water: 10 } },
      { message: "Industrial accident contaminates water supply", effect: { water: -15, environmentalHealth: -10 } },
      { message: "Public protests demand better water management", effect: { public: -20 } },
      { message: "International aid package approved", effect: { resources: 30, diplomatic: 10 } },
      { message: "New water-efficient technology discovered", effect: { water: 5, economic: 5 } },
      {
        message: "Climate research breakthrough improves adaptation",
        effect: { adaptationLevel: 8, climateResilience: 5 },
      },
    ]

    if (Math.random() < 0.3) {
      const event = events[Math.floor(Math.random() * events.length)]
      addMessage(event.message, "event")
      applyEffects(event.effect)
    }
  }

  const switchRole = (newRole: string, reason: string) => {
    setGameState((prev) => ({ ...prev, currentRole: newRole }))
    addMessage(`Switched to ${roles.find((r) => r.id === newRole)?.name}: ${reason}`, "event")
  }

  const generateAIRecommendations = () => {
    const recommendations: AIRecommendation[] = []

    // Pollution-specific recommendations
    if (gameState.waterQuality.pollutionLevel > 60) {
      recommendations.push({
        id: "pollution_crisis",
        actionKey: "pollution_regulations",
        title: "Address Pollution Crisis",
        description: "Water pollution levels are critically high. Implement pollution regulations immediately.",
        impact: "high",
        urgency: "high",
      })
    }

    if (gameState.waterQuality.disputeLevel === "severe" || gameState.waterQuality.disputeLevel === "critical") {
      recommendations.push({
        id: "pollution_diplomacy",
        actionKey: "water_quality_agreement",
        title: "Resolve Water Quality Disputes",
        description:
          "Diplomatic tensions over water quality are escalating. Consider negotiating a water quality treaty.",
        impact: "high",
        urgency: "high",
      })
    }

    if (gameState.waterQuality.healthImpacts > 50) {
      recommendations.push({
        id: "health_crisis",
        actionKey: "treatment_facilities",
        title: "Address Health Crisis",
        description:
          "Water pollution is causing serious health impacts. Build treatment facilities to protect public health.",
        impact: "high",
        urgency: "high",
      })
    }

    // Existing recommendations...
    if (gameState.waterLevel < 30) {
      recommendations.push({
        id: "water_crisis",
        actionKey: "water_rationing",
        title: "Address Water Crisis",
        description: "Water levels are critically low. Implement emergency rationing measures.",
        impact: "high",
        urgency: "high",
      })
    }

    setAiRecommendations(recommendations)
    setShowAIRecommendations(true)
  }

  const handleRecommendationAction = (recommendation: AIRecommendation) => {
    if (recommendation.actionKey) {
      takeAction(recommendation.actionKey)
      setShowAIRecommendations(false)
      return
    }

    if (recommendation.roleSwitch) {
      switchRole(recommendation.roleSwitch, "AI Advisor recommendation")
      setShowAIRecommendations(false)
      return
    }

    addMessage(`🤖 AI Advisor Recommendation Applied: ${recommendation.title}`, "ai")
    setShowAIRecommendations(false)
  }

  const getStatusColor = (value: number) => {
    if (value >= 70) return "text-green-600"
    if (value >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const currentRole = roles.find((r) => r.id === gameState.currentRole)
  const currentRoleActions = selectedCountry
    ? (actions[gameState.currentRole as keyof typeof actions] || []).filter(
        (action) =>
          action.countries.includes("all") ||
          action.countries.includes(selectedCountry.id) ||
          (action.countries.includes("source_only") && selectedCountry.type === "source") ||
          (action.countries.includes("downstream_only") && selectedCountry.type === "downstream") ||
          (action.countries.includes("wealthy_only") && selectedCountry.startingStats.economicHealth >= 70),
      )
    : []

  const neighboringCountries = selectedCountry
    ? countries.filter((c) => c.id !== selectedCountry.id && selectedCountry.neighbors.includes(c.name))
    : []

  if (!gameInitialized) {
    return <CountrySelection onCountrySelect={handleCountrySelection} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-blue-800">Water Diplomacy Simulation</CardTitle>
                <CardDescription>
                  Turn {gameState.turn} - Managing water resources and quality through diplomatic solutions
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Resources: {gameState.resources}
                </Badge>
                <Button onClick={generateAIRecommendations} variant="outline" className="gap-2">
                  <Bot className="h-4 w-4" />
                  AI Advisor
                </Button>
                <HelpButton />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {selectedCountry && (
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCountry.flag}</span>
                  <div>
                    <div className="font-semibold">{selectedCountry.name}</div>
                    <div className="text-muted-foreground">{selectedCountry.region}</div>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Mountain className="h-4 w-4 text-gray-600" />
                    <span>Water Control: {gameState.waterControl}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span>Geopolitical Power: {gameState.geopoliticalPower}%</span>
                  </div>
                  <Badge variant={selectedCountry.type === "source" ? "default" : "secondary"}>
                    {selectedCountry.type === "source" ? "Source Country" : "Downstream Country"}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Water Quality Status */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Droplets className="h-5 w-5" />
                Water Quality Status
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => setShowPollutionDetails(!showPollutionDetails)}>
                {showPollutionDetails ? "Hide Details" : "Show Details"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PollutionIndicator
              waterQuality={gameState.waterQuality}
              isDownstream={selectedCountry?.type === "downstream"}
            />
          </CardContent>
        </Card>

        {/* Pollution Details */}
        {showPollutionDetails && selectedCountry && (
          <PollutionDetails
            waterQuality={gameState.waterQuality}
            selectedCountry={selectedCountry}
            neighboringCountries={neighboringCountries}
            onTakeAction={takeAction}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Help Tips */}
            {showQuickHelp && (
              <div className="relative">
                <QuickHelpTips />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickHelp(false)}
                  className="absolute top-2 right-2"
                >
                  ×
                </Button>
              </div>
            )}

            {/* Current Role */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentRole && <currentRole.icon className="h-5 w-5" />}
                  Current Role: {currentRole?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {roles.map((role) => (
                    <Button
                      key={role.id}
                      variant={gameState.currentRole === role.id ? "default" : "outline"}
                      onClick={() => switchRole(role.id, "Manual role switch")}
                      className="flex flex-col items-center gap-2 h-auto py-4"
                    >
                      <role.icon className="h-6 w-6" />
                      <span className="text-xs text-center">{role.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Available Actions</CardTitle>
                <CardDescription>
                  Choose your strategy to address water crisis, pollution, and diplomatic challenges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {currentRoleActions.map((action) => (
                    <div key={action.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{action.name}</h4>
                        <p className="text-sm text-muted-foreground">Cost: {action.cost} resources</p>
                        <div className="flex gap-1 mt-2">
                          {action.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => takeAction(action.key)}
                        disabled={gameState.resources < action.cost}
                        className="ml-4"
                      >
                        Take Action
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            {showAIRecommendations && aiRecommendations.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Bot className="h-5 w-5" />
                    AI Advisor Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiRecommendations.map((rec) => (
                      <Alert key={rec.id} className="border-blue-200">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{rec.title}</h4>
                              <p className="text-sm">{rec.description}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge
                                  variant={
                                    rec.impact === "high"
                                      ? "destructive"
                                      : rec.impact === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  Impact: {rec.impact}
                                </Badge>
                                <Badge
                                  variant={
                                    rec.urgency === "high"
                                      ? "destructive"
                                      : rec.urgency === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  Urgency: {rec.urgency}
                                </Badge>
                              </div>
                            </div>
                            <Button onClick={() => handleRecommendationAction(rec)} size="sm">
                              Apply
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                    <Button variant="outline" onClick={() => setShowAIRecommendations(false)} className="w-full">
                      Dismiss Recommendations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Regional Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-500" />
                      Water Level
                    </span>
                    <span className={`font-semibold ${getStatusColor(gameState.waterLevel)}`}>
                      {gameState.waterLevel}%
                    </span>
                  </div>
                  <Progress value={gameState.waterLevel} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      Public Support
                    </span>
                    <span className={`font-semibold ${getStatusColor(gameState.publicSupport)}`}>
                      {gameState.publicSupport}%
                    </span>
                  </div>
                  <Progress value={gameState.publicSupport} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Economic Health
                    </span>
                    <span className={`font-semibold ${getStatusColor(gameState.economicHealth)}`}>
                      {gameState.economicHealth}%
                    </span>
                  </div>
                  <Progress value={gameState.economicHealth} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <Leaf className="h-4 w-4 text-green-600" />
                      Environmental Health
                    </span>
                    <span className={`font-semibold ${getStatusColor(gameState.environmentalHealth)}`}>
                      {gameState.environmentalHealth}%
                    </span>
                  </div>
                  <Progress value={gameState.environmentalHealth} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-500" />
                      Diplomatic Relations
                    </span>
                    <span className={`font-semibold ${getStatusColor(gameState.diplomaticRelations)}`}>
                      {gameState.diplomaticRelations}%
                    </span>
                  </div>
                  <Progress value={gameState.diplomaticRelations} className="h-2" />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <Mountain className="h-4 w-4 text-gray-600" />
                      Water Control
                    </span>
                    <span className={`font-semibold ${getStatusColor(gameState.waterControl)}`}>
                      {gameState.waterControl}%
                    </span>
                  </div>
                  <Progress value={gameState.waterControl} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      Geopolitical Power
                    </span>
                    <span className={`font-semibold ${getStatusColor(gameState.geopoliticalPower)}`}>
                      {gameState.geopoliticalPower}%
                    </span>
                  </div>
                  <Progress value={gameState.geopoliticalPower} className="h-2" />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-600" />
                      Climate Resilience
                    </span>
                    <span className={`font-semibold ${getStatusColor(gameState.climateResilience)}`}>
                      {gameState.climateResilience}%
                    </span>
                  </div>
                  <Progress value={gameState.climateResilience} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-orange-500" />
                      Adaptation Level
                    </span>
                    <span className={`font-semibold ${getStatusColor(gameState.adaptationLevel)}`}>
                      {gameState.adaptationLevel}%
                    </span>
                  </div>
                  <Progress value={gameState.adaptationLevel} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Messages Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Game Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {messages.map((msg, index) => (
                      <div key={msg.id}>
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            msg.type === "crisis"
                              ? "bg-red-50 border border-red-200"
                              : msg.type === "ai"
                                ? "bg-blue-50 border border-blue-200"
                                : msg.type === "action"
                                  ? "bg-green-50 border border-green-200"
                                  : msg.type === "challenge"
                                    ? "bg-amber-50 border border-amber-200"
                                    : msg.type === "success"
                                      ? "bg-emerald-50 border border-emerald-200"
                                      : msg.type === "climate"
                                        ? "bg-orange-50 border border-orange-200"
                                        : msg.type === "warning"
                                          ? "bg-yellow-50 border border-yellow-200"
                                          : msg.type === "pollution"
                                            ? "bg-purple-50 border border-purple-200"
                                            : msg.type === "diplomatic"
                                              ? "bg-indigo-50 border border-indigo-200"
                                              : msg.type === "conflict"
                                                ? "bg-red-100 border border-red-300"
                                                : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <p className="font-medium">{msg.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{msg.timestamp.toLocaleTimeString()}</p>
                        </div>
                        {index < messages.length - 1 && <Separator className="my-2" />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterDiplomacyGame
