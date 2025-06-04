"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Target,
  Clock,
  Flame,
  Shield,
  Lightbulb,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  Thermometer,
  CloudLightning,
  Waves,
} from "lucide-react"
import { HelpButton, QuickHelpTips } from "@/components/help-system"

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
}

interface GameMessage {
  id: string
  message: string
  type: "action" | "event" | "ai" | "crisis" | "challenge" | "success" | "climate" | "warning"
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
  temperature: number // -10 to 50 degrees
  precipitation: number // 0 to 100 (percentage of normal)
  humidity: number // 0 to 100
  windSpeed: number // 0 to 100 km/h
  climateStability: number // 0 to 100
  globalWarming: number // 0 to 10 degrees above baseline
  seaLevel: number // 0 to 100 cm above baseline
  extremeWeatherRisk: number // 0 to 100
}

interface ClimateEvent {
  id: string
  name: string
  type: "drought" | "flood" | "heatwave" | "storm" | "freeze" | "wildfire" | "hurricane" | "blizzard"
  severity: "minor" | "moderate" | "severe" | "extreme"
  duration: number // turns
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
  progression: number // 0 to 100
  effects: Record<string, number>
  threshold: number
  triggered: boolean
}

interface DynamicChallenge {
  id: string
  title: string
  description: string
  type: "immediate" | "cascading" | "strategic" | "crisis" | "climate"
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
}

interface ChallengeTemplate {
  id: string
  title: string
  description: string
  type: "immediate" | "cascading" | "strategic" | "crisis" | "climate"
  triggerConditions: {
    actions?: string[]
    roles?: string[]
    stateThresholds?: Record<string, { min?: number; max?: number }>
    climateConditions?: Record<string, { min?: number; max?: number }>
    climateEvents?: string[]
    actionCount?: number
    turnRange?: { min: number; max: number }
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
    },
    {
      key: "infrastructure",
      name: "Build Water Infrastructure",
      cost: 5,
      impact: { water: 25, economic: 10, environmental: -5, climateResilience: 10 },
      tags: ["infrastructure", "long_term", "investment"],
    },
    {
      key: "regulations",
      name: "Enforce Water Regulations",
      cost: 3,
      impact: { water: 10, environmental: 15, economic: -10 },
      tags: ["regulation", "enforcement", "environmental"],
    },
    {
      key: "subsidies",
      name: "Water Conservation Subsidies",
      cost: 4,
      impact: { water: 12, public: 15, economic: -8, adaptationLevel: 5 },
      tags: ["incentive", "conservation", "economic"],
    },
    {
      key: "climate_adaptation",
      name: "Climate Adaptation Program",
      cost: 6,
      impact: { climateResilience: 25, adaptationLevel: 20, economic: -10, environmental: 10 },
      tags: ["climate", "adaptation", "resilience"],
    },
    {
      key: "emergency_response",
      name: "Emergency Response System",
      cost: 4,
      impact: { climateResilience: 15, public: 10, resources: -5 },
      tags: ["emergency", "preparedness", "climate"],
    },
  ],
  industry: [
    {
      key: "efficiency",
      name: "Improve Water Efficiency",
      cost: 4,
      impact: { water: 20, economic: 5, environmental: 10, adaptationLevel: 8 },
      tags: ["efficiency", "technology", "sustainable"],
    },
    {
      key: "recycling",
      name: "Water Recycling Program",
      cost: 6,
      impact: { water: 30, environmental: 20, economic: -5, climateResilience: 12 },
      tags: ["recycling", "innovation", "environmental"],
    },
    {
      key: "technology",
      name: "Invest in Water Technology",
      cost: 7,
      impact: { water: 35, economic: 15, environmental: 5, adaptationLevel: 15 },
      tags: ["technology", "innovation", "investment"],
    },
    {
      key: "partnerships",
      name: "Public-Private Partnerships",
      cost: 5,
      impact: { water: 18, economic: 20, diplomatic: 10, climateResilience: 8 },
      tags: ["partnership", "collaboration", "economic"],
    },
    {
      key: "green_infrastructure",
      name: "Green Infrastructure Investment",
      cost: 8,
      impact: { water: 25, environmental: 25, economic: 5, climateResilience: 20, adaptationLevel: 15 },
      tags: ["green", "infrastructure", "climate"],
    },
    {
      key: "carbon_reduction",
      name: "Carbon Footprint Reduction",
      cost: 5,
      impact: { environmental: 20, economic: -5, climateResilience: 10 },
      tags: ["carbon", "mitigation", "climate"],
    },
  ],
  environmental: [
    {
      key: "conservation",
      name: "Launch Conservation Campaign",
      cost: 2,
      impact: { water: 10, environmental: 20, public: 15, adaptationLevel: 5 },
      tags: ["conservation", "awareness", "public"],
    },
    {
      key: "restoration",
      name: "Ecosystem Restoration",
      cost: 5,
      impact: { water: 15, environmental: 30, economic: -10, climateResilience: 15 },
      tags: ["restoration", "ecosystem", "long_term"],
    },
    {
      key: "monitoring",
      name: "Water Quality Monitoring",
      cost: 3,
      impact: { water: 5, environmental: 25, public: 10, adaptationLevel: 8 },
      tags: ["monitoring", "quality", "health"],
    },
    {
      key: "litigation",
      name: "Environmental Litigation",
      cost: 4,
      impact: { environmental: 25, public: 5, diplomatic: -15 },
      tags: ["legal", "enforcement", "conflict"],
    },
    {
      key: "climate_research",
      name: "Climate Impact Research",
      cost: 4,
      impact: { environmental: 15, adaptationLevel: 20, climateResilience: 10 },
      tags: ["research", "climate", "science"],
    },
    {
      key: "biodiversity_protection",
      name: "Biodiversity Protection Initiative",
      cost: 6,
      impact: { environmental: 35, climateResilience: 18, water: 10, economic: -8 },
      tags: ["biodiversity", "protection", "climate"],
    },
  ],
  international: [
    {
      key: "cooperation",
      name: "Regional Water Cooperation",
      cost: 4,
      impact: { water: 20, diplomatic: 25, economic: 5, climateResilience: 10 },
      tags: ["cooperation", "regional", "diplomatic"],
    },
    {
      key: "mediation",
      name: "Conflict Mediation",
      cost: 3,
      impact: { diplomatic: 30, public: 10, water: 5 },
      tags: ["mediation", "conflict", "diplomatic"],
    },
    {
      key: "funding",
      name: "Secure International Funding",
      cost: 2,
      impact: { resources: 50, diplomatic: 15, economic: 10 },
      tags: ["funding", "international", "resources"],
    },
    {
      key: "treaties",
      name: "Water Sharing Treaties",
      cost: 6,
      impact: { water: 25, diplomatic: 35, economic: 5, climateResilience: 12 },
      tags: ["treaty", "agreement", "long_term"],
    },
    {
      key: "climate_accord",
      name: "Climate Cooperation Accord",
      cost: 7,
      impact: { diplomatic: 30, environmental: 20, climateResilience: 25, adaptationLevel: 15 },
      tags: ["climate", "international", "cooperation"],
    },
    {
      key: "disaster_aid",
      name: "International Disaster Aid",
      cost: 3,
      impact: { resources: 30, diplomatic: 20, public: 15, climateResilience: 8 },
      tags: ["aid", "disaster", "international"],
    },
  ],
}

const climateEventTemplates = [
  {
    type: "drought",
    name: "Severe Drought",
    icon: Sun,
    severityLevels: {
      minor: { duration: 3, effects: { water: -10, environmental: -5, economic: -5 } },
      moderate: { duration: 5, effects: { water: -20, environmental: -10, economic: -10, public: -5 } },
      severe: { duration: 8, effects: { water: -35, environmental: -20, economic: -15, public: -15 } },
      extreme: { duration: 12, effects: { water: -50, environmental: -30, economic: -25, public: -25 } },
    },
    adaptationOptions: ["water_rationing", "infrastructure", "efficiency"],
  },
  {
    type: "flood",
    name: "Major Flooding",
    icon: Waves,
    severityLevels: {
      minor: { duration: 2, effects: { water: 5, environmental: -5, economic: -8, public: -5 } },
      moderate: { duration: 4, effects: { water: 10, environmental: -10, economic: -15, public: -10 } },
      severe: { duration: 6, effects: { water: 15, environmental: -20, economic: -25, public: -20 } },
      extreme: { duration: 8, effects: { water: 20, environmental: -30, economic: -35, public: -30 } },
    },
    adaptationOptions: ["infrastructure", "emergency_response", "green_infrastructure"],
  },
  {
    type: "heatwave",
    name: "Extreme Heatwave",
    icon: Thermometer,
    severityLevels: {
      minor: { duration: 2, effects: { water: -8, public: -5, economic: -3 } },
      moderate: { duration: 4, effects: { water: -15, public: -10, economic: -8, environmental: -5 } },
      severe: { duration: 6, effects: { water: -25, public: -20, economic: -15, environmental: -10 } },
      extreme: { duration: 8, effects: { water: -40, public: -30, economic: -25, environmental: -20 } },
    },
    adaptationOptions: ["climate_adaptation", "emergency_response", "green_infrastructure"],
  },
  {
    type: "storm",
    name: "Severe Storm",
    icon: CloudLightning,
    severityLevels: {
      minor: { duration: 1, effects: { economic: -5, public: -3 } },
      moderate: { duration: 2, effects: { water: 5, economic: -10, public: -8, environmental: -5 } },
      severe: { duration: 3, effects: { water: 8, economic: -20, public: -15, environmental: -10 } },
      extreme: { duration: 4, effects: { water: 12, economic: -30, public: -25, environmental: -15 } },
    },
    adaptationOptions: ["emergency_response", "infrastructure", "climate_adaptation"],
  },
  {
    type: "wildfire",
    name: "Wildfire Outbreak",
    icon: Flame,
    severityLevels: {
      minor: { duration: 3, effects: { water: -5, environmental: -15, public: -8 } },
      moderate: { duration: 5, effects: { water: -10, environmental: -25, public: -15, economic: -10 } },
      severe: { duration: 7, effects: { water: -20, environmental: -40, public: -25, economic: -20 } },
      extreme: { duration: 10, effects: { water: -35, environmental: -60, public: -40, economic: -30 } },
    },
    adaptationOptions: ["restoration", "emergency_response", "biodiversity_protection"],
  },
]

const climateTrends = [
  {
    id: "global_warming",
    name: "Global Temperature Rise",
    description: "Rising global temperatures increase extreme weather frequency",
    threshold: 30,
    effects: { extremeWeatherRisk: 2, temperature: 0.5 },
  },
  {
    id: "precipitation_change",
    name: "Changing Precipitation Patterns",
    description: "Altered rainfall patterns affect water availability",
    threshold: 40,
    effects: { precipitation: -5, climateStability: -3 },
  },
  {
    id: "sea_level_rise",
    name: "Sea Level Rise",
    description: "Rising sea levels threaten coastal water infrastructure",
    threshold: 50,
    effects: { seaLevel: 2, climateStability: -2 },
  },
  {
    id: "ecosystem_disruption",
    name: "Ecosystem Disruption",
    description: "Climate change disrupts natural water cycles",
    threshold: 35,
    effects: { environmental: -2, climateStability: -4 },
  },
]

const challengeTemplates: ChallengeTemplate[] = [
  {
    id: "infrastructure_maintenance",
    title: "Infrastructure Maintenance Crisis",
    description: "Your recent infrastructure investments require immediate maintenance to prevent system failures.",
    type: "cascading",
    triggerConditions: {
      actions: ["infrastructure"],
      turnRange: { min: 3, max: 8 },
    },
    dynamicElements: {
      requirements: {
        base: { resources: 15 },
        scaling: { resources: 5 },
      },
    },
    baseRewards: { water: 20, economic: 10 },
    basePenalties: { water: -30, economic: -20, public: -15 },
    complexity: 2,
  },
  {
    id: "climate_refugee_crisis",
    title: "Climate Refugee Crisis",
    description: "Extreme weather events have displaced populations, straining water resources.",
    type: "climate",
    triggerConditions: {
      climateEvents: ["flood", "drought", "wildfire"],
      stateThresholds: { climateResilience: { max: 40 } },
    },
    dynamicElements: {
      requirements: {
        base: { resources: 25, public: 60 },
        scaling: { resources: 10 },
      },
    },
    baseRewards: { public: 30, diplomatic: 20, climateResilience: 15 },
    basePenalties: { resources: -40, public: -30, water: -20 },
    complexity: 4,
  },
  {
    id: "drought_adaptation",
    title: "Drought Adaptation Emergency",
    description: "Prolonged drought conditions require immediate adaptation measures.",
    type: "climate",
    triggerConditions: {
      climateEvents: ["drought"],
      climateConditions: { precipitation: { max: 30 } },
    },
    dynamicElements: {
      requirements: {
        base: { adaptationLevel: 40, resources: 20 },
        scaling: { resources: 8 },
      },
    },
    baseRewards: { water: 25, climateResilience: 20, adaptationLevel: 15 },
    basePenalties: { water: -35, economic: -25, public: -20 },
    complexity: 3,
  },
  {
    id: "flood_recovery",
    title: "Post-Flood Recovery Initiative",
    description: "Recent flooding has damaged infrastructure and contaminated water supplies.",
    type: "climate",
    triggerConditions: {
      climateEvents: ["flood"],
    },
    dynamicElements: {
      requirements: {
        base: { resources: 30, climateResilience: 50 },
        scaling: { resources: 12 },
      },
    },
    baseRewards: { water: 20, economic: 15, public: 25, environmental: 10 },
    basePenalties: { water: -25, economic: -30, public: -25, environmental: -15 },
    complexity: 3,
  },
  {
    id: "heatwave_response",
    title: "Heatwave Emergency Response",
    description: "Extreme temperatures are overwhelming cooling systems and increasing water demand.",
    type: "climate",
    triggerConditions: {
      climateEvents: ["heatwave"],
      climateConditions: { temperature: { min: 35 } },
    },
    dynamicElements: {
      requirements: {
        base: { resources: 20, adaptationLevel: 35 },
        scaling: { resources: 8 },
      },
    },
    baseRewards: { public: 20, climateResilience: 15, water: 10 },
    basePenalties: { public: -30, water: -25, economic: -20 },
    complexity: 2,
  },
  {
    id: "climate_mitigation",
    title: "Climate Mitigation Strategy",
    description: "Long-term climate trends require comprehensive mitigation efforts.",
    type: "strategic",
    triggerConditions: {
      stateThresholds: { adaptationLevel: { min: 60 } },
      climateConditions: { globalWarming: { min: 2 } },
    },
    dynamicElements: {
      requirements: {
        base: { resources: 40, environmental: 70, climateResilience: 60 },
        scaling: { resources: 15 },
      },
    },
    baseRewards: { environmental: 40, climateResilience: 30, diplomatic: 25, adaptationLevel: 20 },
    basePenalties: { economic: -20, resources: -25 },
    complexity: 5,
  },
]

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
  })

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

  const [messages, setMessages] = useState<GameMessage[]>([
    {
      id: "1",
      message:
        "Welcome to the Water Diplomacy Simulation. A severe drought has hit the region, and climate change is intensifying weather patterns.",
      type: "event",
      timestamp: new Date(),
    },
  ])

  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([])
  const [activeChallenges, setActiveChallenges] = useState<DynamicChallenge[]>([])
  const [activeClimateEvents, setActiveClimateEvents] = useState<ClimateEvent[]>([])
  const [climateTrendProgress, setClimateTrendProgress] = useState<ClimateTrend[]>(
    climateTrends.map((trend) => ({ ...trend, progression: 0, triggered: false })),
  )
  const [showAIRecommendations, setShowAIRecommendations] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [showQuickHelp, setShowQuickHelp] = useState(true)

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

  // Climate System Functions
  const applyClimateEffects = useCallback((effects: Record<string, number>) => {
    setGameState((prev) => ({
      ...prev,
      waterLevel: Math.max(0, Math.min(100, prev.waterLevel + (effects.water || 0))),
      publicSupport: Math.max(0, Math.min(100, prev.publicSupport + (effects.public || 0))),
      economicHealth: Math.max(0, Math.min(100, prev.economicHealth + (effects.economic || 0))),
      environmentalHealth: Math.max(0, Math.min(100, prev.environmentalHealth + (effects.environmental || 0))),
      diplomaticRelations: Math.max(0, Math.min(100, prev.diplomaticRelations + (effects.diplomaticRelations || 0))),
      climateResilience: Math.max(0, Math.min(100, prev.climateResilience + (effects.climateResilience || 0))),
      adaptationLevel: Math.max(0, Math.min(100, prev.adaptationLevel + (effects.adaptationLevel || 0))),
      resources: prev.resources + (effects.resources || 0),
    }))
  }, [])

  const updateClimateState = useCallback(() => {
    // Only update climate state on turn changes
    setClimateState((prev) => {
      // Skip update if we're not at a new turn
      if (gameState.turn % 1 !== 0) return prev

      const newState = { ...prev }

      // Seasonal progression
      const seasons: Array<"spring" | "summer" | "autumn" | "winter"> = ["spring", "summer", "autumn", "winter"]
      if (gameState.turn % 4 === 0) {
        const currentIndex = seasons.indexOf(prev.currentSeason)
        newState.currentSeason = seasons[(currentIndex + 1) % 4]
      }

      // Global warming progression
      newState.globalWarming += 0.02 + Math.random() * 0.03

      // Climate stability degradation
      newState.climateStability = Math.max(0, prev.climateStability - 0.5 - Math.random() * 1)

      // Extreme weather risk calculation
      newState.extremeWeatherRisk = Math.min(
        100,
        25 + newState.globalWarming * 8 + (100 - newState.climateStability) * 0.3,
      )

      // Seasonal temperature variations
      const seasonalTemp = {
        spring: 18,
        summer: 28,
        autumn: 20,
        winter: 8,
      }
      newState.temperature = seasonalTemp[newState.currentSeason] + newState.globalWarming + (Math.random() - 0.5) * 10

      // Precipitation variations
      const seasonalPrecip = {
        spring: 80,
        summer: 60,
        autumn: 85,
        winter: 70,
      }
      newState.precipitation = Math.max(
        0,
        Math.min(100, seasonalPrecip[newState.currentSeason] + (Math.random() - 0.5) * 30),
      )

      return newState
    })
  }, [gameState.turn])

  const updateClimateEvents = useCallback(() => {
    setActiveClimateEvents((prev) => {
      // Skip if no active events
      if (prev.length === 0) return prev

      return prev
        .map((event) => {
          const updatedEvent = { ...event, remainingDuration: event.remainingDuration - 1 }

          // Apply ongoing effects
          if (updatedEvent.remainingDuration > 0) {
            setTimeout(() => applyClimateEffects(event.effects.ongoing), 0)
          } else {
            // Apply long-term effects when event ends
            setTimeout(() => {
              applyClimateEffects(event.effects.longTerm)
              addMessage(`🌤️ Climate Event: ${event.name} has ended.`, "climate")
            }, 0)
          }

          return updatedEvent
        })
        .filter((event) => event.remainingDuration > 0)
    })
  }, [applyClimateEffects, addMessage])

  const updateClimateTrends = useCallback(() => {
    setClimateTrendProgress((prev) => {
      // Skip if no trends or no changes
      if (prev.length === 0) return prev

      return prev.map((trend) => {
        const newProgression = Math.min(100, trend.progression + Math.random() * 2 + climateState.globalWarming * 0.5)

        if (!trend.triggered && newProgression >= trend.threshold) {
          // Use setTimeout to avoid state updates during rendering
          setTimeout(() => {
            addMessage(`🌍 Climate Trend: ${trend.name} threshold reached!`, "warning")

            // Apply trend effects to climate state
            setClimateState((climateState) => ({
              ...climateState,
              extremeWeatherRisk: Math.min(
                100,
                climateState.extremeWeatherRisk + (trend.effects.extremeWeatherRisk || 0),
              ),
              temperature: climateState.temperature + (trend.effects.temperature || 0),
              precipitation: Math.max(0, climateState.precipitation + (trend.effects.precipitation || 0)),
              climateStability: Math.max(0, climateState.climateStability + (trend.effects.climateStability || 0)),
              seaLevel: climateState.seaLevel + (trend.effects.seaLevel || 0),
            }))

            // Apply trend effects to game state
            if (trend.effects.environmental) {
              applyClimateEffects({ environmental: trend.effects.environmental })
            }
          }, 0)

          return { ...trend, progression: newProgression, triggered: true }
        }

        return { ...trend, progression: newProgression }
      })
    })
  }, [climateState.globalWarming, applyClimateEffects, addMessage])

  const generateClimateEvent = useCallback(() => {
    // Higher chance during extreme weather risk periods
    const eventChance = (climateState.extremeWeatherRisk / 100) * 0.4

    if (Math.random() < eventChance) {
      const availableEvents = climateEventTemplates.filter(
        (template) => !activeClimateEvents.some((event) => event.type === template.type),
      )

      if (availableEvents.length > 0) {
        const template = availableEvents[Math.floor(Math.random() * availableEvents.length)]
        const severities: Array<"minor" | "moderate" | "severe" | "extreme"> = [
          "minor",
          "moderate",
          "severe",
          "extreme",
        ]

        // Severity based on climate conditions
        let severityIndex = 0
        if (climateState.extremeWeatherRisk > 60) severityIndex = 1
        if (climateState.extremeWeatherRisk > 80) severityIndex = 2
        if (climateState.globalWarming > 3) severityIndex = 3

        // Add randomness
        severityIndex = Math.min(3, severityIndex + Math.floor(Math.random() * 2))
        const severity = severities[severityIndex]

        const severityData = template.severityLevels[severity]

        const newEvent: ClimateEvent = {
          id: `${template.type}_${Date.now()}`,
          name: `${severity.charAt(0).toUpperCase() + severity.slice(1)} ${template.name}`,
          type: template.type,
          severity,
          duration: severityData.duration,
          remainingDuration: severityData.duration,
          effects: {
            immediate: severityData.effects,
            ongoing: Object.fromEntries(Object.entries(severityData.effects).map(([k, v]) => [k, v * 0.3])),
            longTerm: Object.fromEntries(Object.entries(severityData.effects).map(([k, v]) => [k, v * 0.1])),
          },
          description: `A ${severity} ${template.name.toLowerCase()} is affecting the region.`,
          icon: template.icon,
          adaptationOptions: template.adaptationOptions,
        }

        setActiveClimateEvents((prev) => [...prev, newEvent])
        addMessage(`🌪️ Climate Event: ${newEvent.name} has begun!`, "climate")

        // Apply immediate effects with setTimeout to avoid render-time state updates
        setTimeout(() => {
          applyClimateEffects(newEvent.effects.immediate)
        }, 0)
      }
    }
  }, [climateState, activeClimateEvents, applyClimateEffects, addMessage])

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

    // Apply action effects including new climate metrics
    setGameState((prev) => ({
      ...prev,
      waterLevel: Math.max(0, Math.min(100, prev.waterLevel + (action.impact.water || 0))),
      publicSupport: Math.max(0, Math.min(100, prev.publicSupport + (action.impact.public || 0))),
      economicHealth: Math.max(0, Math.min(100, prev.economicHealth + (action.impact.economic || 0))),
      environmentalHealth: Math.max(0, Math.min(100, prev.environmentalHealth + (action.impact.environmental || 0))),
      diplomaticRelations: Math.max(0, Math.min(100, prev.diplomaticRelations + (action.impact.diplomatic || 0))),
      climateResilience: Math.max(0, Math.min(100, prev.climateResilience + (action.impact.climateResilience || 0))),
      adaptationLevel: Math.max(0, Math.min(100, prev.adaptationLevel + (action.impact.adaptationLevel || 0))),
      resources: prev.resources - action.cost + (action.impact.resources || 0),
      turn: prev.turn + 1,
    }))

    addMessage(`Action taken: ${action.name}`, "action")

    // Climate adaptation bonus
    if (action.tags.includes("climate") || action.tags.includes("adaptation")) {
      const bonus = Math.floor(gameState.adaptationLevel / 20)
      if (bonus > 0) {
        addMessage(`Climate adaptation bonus: +${bonus} effectiveness!`, "success")
        applyClimateEffects({ climateResilience: bonus })
      }
    }

    // Hide quick help after a few turns
    if (gameState.turn >= 3) {
      setShowQuickHelp(false)
    }

    generateRandomEvent()
  }

  const completeChallenge = (challengeId: string, success: boolean) => {
    const challenge = activeChallenges.find((c) => c.id === challengeId)
    if (!challenge) return

    if (success) {
      applyClimateEffects(challenge.rewards)
      addMessage(`✅ Challenge Completed: ${challenge.title}`, "success")
    } else {
      applyClimateEffects(challenge.penalties)
      addMessage(`❌ Challenge Failed: ${challenge.title}`, "crisis")
    }

    setActiveChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: success ? "completed" : "failed" } : c)),
    )
  }

  const checkChallengeCompletion = useCallback(() => {
    activeChallenges.forEach((challenge) => {
      if (challenge.status !== "active") return

      if (challenge.deadline && gameState.turn > challenge.deadline) {
        completeChallenge(challenge.id, false)
        return
      }

      let requirementsMet = true
      for (const [key, requiredValue] of Object.entries(challenge.requirements.conditions)) {
        const currentValue = gameState[key as keyof GameState] as number
        if (currentValue < requiredValue) {
          requirementsMet = false
          break
        }
      }

      if (requirementsMet) {
        completeChallenge(challenge.id, true)
      }
    })
  }, [activeChallenges, gameState, applyClimateEffects])

  const switchRole = (newRole: string, reason: string) => {
    setGameState((prev) => ({ ...prev, currentRole: newRole }))
    addMessage(`Switched to ${roles.find((r) => r.id === newRole)?.name}: ${reason}`, "event")
  }

  const generateAIRecommendations = () => {
    const recommendations: AIRecommendation[] = []

    // Climate-specific recommendations
    activeClimateEvents.forEach((event) => {
      event.adaptationOptions.forEach((actionKey) => {
        const currentRoleActions = actions[gameState.currentRole as keyof typeof actions]
        const action = currentRoleActions?.find((a) => a.key === actionKey)
        if (action) {
          recommendations.push({
            id: `climate_${event.id}_${actionKey}`,
            actionKey,
            title: `Address ${event.name}`,
            description: `Use ${action.name} to mitigate the effects of the ongoing ${event.name.toLowerCase()}.`,
            impact: event.severity === "extreme" ? "high" : event.severity === "severe" ? "high" : "medium",
            urgency: event.remainingDuration <= 2 ? "high" : "medium",
          })
        }
      })
    })

    // Climate resilience recommendations
    if (gameState.climateResilience < 40) {
      recommendations.push({
        id: "climate_resilience",
        actionKey: "climate_adaptation",
        title: "Improve Climate Resilience",
        description: "Your region's climate resilience is low. Invest in adaptation measures.",
        impact: "high",
        urgency: "medium",
      })
    }

    // Existing recommendations...
    activeChallenges
      .filter((c) => c.status === "active")
      .forEach((challenge) => {
        recommendations.push({
          id: `challenge_${challenge.id}`,
          title: `Address ${challenge.title}`,
          description: `Focus on meeting the requirements for this active challenge to avoid penalties.`,
          impact: challenge.complexity > 2 ? "high" : "medium",
          urgency: challenge.deadline && gameState.turn >= challenge.deadline - 1 ? "high" : "medium",
        })
      })

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

  const generateRandomEvent = () => {
    const events = [
      { message: "Heavy rainfall increases water reserves by 10%", effect: { water: 10 } },
      { message: "Industrial accident contaminates water supply", effect: { water: -15, environmental: -10 } },
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
      applyClimateEffects(event.effect)
    }
  }

  const generateDynamicChallenges = useCallback(() => {
    const newChallenges: DynamicChallenge[] = []
    const recentActions = actionHistory.slice(-5)
    const currentTurn = gameState.turn

    challengeTemplates.forEach((template) => {
      let shouldTrigger = false

      // Check action-based triggers
      if (template.triggerConditions.actions) {
        const hasRequiredActions = template.triggerConditions.actions.some((action) =>
          recentActions.some((ah) => ah.actionKey === action),
        )
        if (hasRequiredActions) shouldTrigger = true
      }

      // Check climate event triggers
      if (template.triggerConditions.climateEvents && shouldTrigger) {
        const hasClimateEvent = template.triggerConditions.climateEvents.some((eventType) =>
          activeClimateEvents.some((event) => event.type === eventType),
        )
        if (!hasClimateEvent) shouldTrigger = false
      }

      // Check climate condition triggers
      if (template.triggerConditions.climateConditions && shouldTrigger) {
        const conditions = template.triggerConditions.climateConditions
        for (const [key, threshold] of Object.entries(conditions)) {
          const climateValue = climateState[key as keyof ClimateState] as number
          if (threshold.min && climateValue < threshold.min) shouldTrigger = false
          if (threshold.max && climateValue > threshold.max) shouldTrigger = false
        }
      }

      // Check other existing conditions...
      if (template.triggerConditions.roles && shouldTrigger) {
        const hasRequiredRole = template.triggerConditions.roles.includes(gameState.currentRole)
        if (!hasRequiredRole) shouldTrigger = false
      }

      if (template.triggerConditions.stateThresholds && shouldTrigger) {
        const thresholds = template.triggerConditions.stateThresholds
        for (const [key, threshold] of Object.entries(thresholds)) {
          const stateValue = gameState[key as keyof GameState] as number
          if (threshold.min && stateValue < threshold.min) shouldTrigger = false
          if (threshold.max && stateValue > threshold.max) shouldTrigger = false
        }
      }

      const existingChallenge = activeChallenges.find((c) => c.id.startsWith(template.id))
      if (existingChallenge) shouldTrigger = false

      if (shouldTrigger && Math.random() < 0.7) {
        const challenge = createChallengeFromTemplate(template, recentActions, currentTurn)
        newChallenges.push(challenge)
      }
    })

    if (newChallenges.length > 0) {
      setActiveChallenges((prev) => [...prev, ...newChallenges])
      newChallenges.forEach((challenge) => {
        addMessage(`🎯 New Challenge: ${challenge.title}`, "challenge")
      })
    }
  }, [actionHistory, gameState, activeChallenges, activeClimateEvents, climateState, addMessage])

  const createChallengeFromTemplate = (
    template: ChallengeTemplate,
    recentActions: ActionHistory[],
    currentTurn: number,
  ): DynamicChallenge => {
    const challengeId = `${template.id}_${Date.now()}`
    const complexity = Math.min(template.complexity + Math.floor(currentTurn / 10), 5)

    const requirements = { turns: 3, conditions: {} as Record<string, number> }
    if (template.dynamicElements.requirements) {
      const { base, scaling } = template.dynamicElements.requirements
      for (const [key, baseValue] of Object.entries(base)) {
        const scaledValue = baseValue + (scaling[key] || 0) * complexity
        requirements.conditions[key] = scaledValue
      }
    }

    const rewards = Object.fromEntries(
      Object.entries(template.baseRewards).map(([key, value]) => [key, value * (1 + complexity * 0.2)]),
    )
    const penalties = Object.fromEntries(
      Object.entries(template.basePenalties).map(([key, value]) => [key, value * (1 + complexity * 0.3)]),
    )

    let deadline: number | undefined
    if (template.type === "immediate") {
      deadline = currentTurn + 2
    } else if (template.type === "crisis" || template.type === "climate") {
      deadline = currentTurn + 3
    }

    return {
      id: challengeId,
      title: template.title,
      description: template.description,
      type: template.type,
      triggerActions: recentActions.map((a) => a.actionKey),
      triggerRoles: [gameState.currentRole],
      requirements,
      rewards,
      penalties,
      status: "active",
      deadline,
      complexity,
      createdAt: currentTurn,
    }
  }

  // Effect hooks
  useEffect(() => {
    updateClimateState()
  }, [updateClimateState])

  useEffect(() => {
    updateClimateEvents()
  }, [updateClimateEvents])

  useEffect(() => {
    updateClimateTrends()
  }, [updateClimateTrends])

  useEffect(() => {
    generateClimateEvent()
  }, [generateClimateEvent])

  useEffect(() => {
    generateDynamicChallenges()
  }, [generateDynamicChallenges])

  useEffect(() => {
    checkChallengeCompletion()
  }, [checkChallengeCompletion])

  const getStatusColor = (value: number) => {
    if (value >= 70) return "text-green-600"
    if (value >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "immediate":
        return <Flame className="h-4 w-4 text-red-500" />
      case "cascading":
        return <TrendingUp className="h-4 w-4 text-orange-500" />
      case "strategic":
        return <Lightbulb className="h-4 w-4 text-blue-500" />
      case "crisis":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "climate":
        return <CloudRain className="h-4 w-4 text-blue-600" />
      default:
        return <Target className="h-4 w-4" />
    }
  }

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case "spring":
        return <Leaf className="h-4 w-4 text-green-500" />
      case "summer":
        return <Sun className="h-4 w-4 text-yellow-500" />
      case "autumn":
        return <Wind className="h-4 w-4 text-orange-500" />
      case "winter":
        return <Snowflake className="h-4 w-4 text-blue-500" />
      default:
        return <Sun className="h-4 w-4" />
    }
  }

  const currentRole = roles.find((r) => r.id === gameState.currentRole)
  const currentRoleActions = actions[gameState.currentRole as keyof typeof actions] || []
  const activeActiveChallenges = activeChallenges.filter((c) => c.status === "active")

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
                  Turn {gameState.turn} - Managing water resources through adaptive diplomatic solutions
                </CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Resources: {gameState.resources}
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Active Challenges: {activeActiveChallenges.length}
                </Badge>
                <Button onClick={generateAIRecommendations} variant="outline" className="gap-2">
                  <Bot className="h-4 w-4" />
                  AI Advisor
                </Button>
                <HelpButton />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Climate Status Bar */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <CloudRain className="h-5 w-5" />
              Climate Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 text-sm">
              <div className="flex items-center gap-2">
                {getSeasonIcon(climateState.currentSeason)}
                <div>
                  <div className="font-medium capitalize">{climateState.currentSeason}</div>
                  <div className="text-xs text-muted-foreground">Season</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <div>
                  <div className="font-medium">{climateState.temperature.toFixed(1)}°C</div>
                  <div className="text-xs text-muted-foreground">Temperature</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-medium">{climateState.precipitation.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Precipitation</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <div>
                  <div className={`font-medium ${getStatusColor(climateState.climateStability)}`}>
                    {climateState.climateStability.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Stability</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <div>
                  <div className={`font-medium ${getStatusColor(100 - climateState.extremeWeatherRisk)}`}>
                    {climateState.extremeWeatherRisk.toFixed(0)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Weather Risk</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-red-500" />
                <div>
                  <div className="font-medium text-red-600">+{climateState.globalWarming.toFixed(1)}°C</div>
                  <div className="text-xs text-muted-foreground">Global Warming</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Waves className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium">+{climateState.seaLevel.toFixed(0)}cm</div>
                  <div className="text-xs text-muted-foreground">Sea Level</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="font-medium">{climateState.windSpeed.toFixed(0)} km/h</div>
                  <div className="text-xs text-muted-foreground">Wind Speed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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

            {/* Active Climate Events */}
            {activeClimateEvents.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <CloudRain className="h-5 w-5" />
                    Active Climate Events ({activeClimateEvents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeClimateEvents.map((event) => (
                      <Alert key={event.id} className="border-orange-200">
                        <div className="flex items-start gap-3">
                          <event.icon className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{event.name}</h4>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {event.severity}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {event.remainingDuration} turns
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                            <div className="text-xs">
                              <strong>Adaptation Options:</strong>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {event.adaptationOptions.map((option) => (
                                  <Badge key={option} variant="outline" className="text-xs">
                                    {option.replace("_", " ")}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
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

            {/* Dynamic Challenges */}
            {activeActiveChallenges.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Target className="h-5 w-5" />
                    Active Challenges ({activeActiveChallenges.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activeActiveChallenges.map((challenge) => (
                      <Alert key={challenge.id} className="border-amber-200">
                        <div className="flex items-start gap-3">
                          {getChallengeIcon(challenge.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{challenge.title}</h4>
                              <div className="flex gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {challenge.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Complexity: {challenge.complexity}
                                </Badge>
                                {challenge.deadline && (
                                  <Badge
                                    variant={gameState.turn >= challenge.deadline - 1 ? "destructive" : "secondary"}
                                    className="text-xs"
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    {challenge.deadline - gameState.turn} turns
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                            <div className="space-y-2">
                              <div className="text-sm">
                                <strong>Requirements:</strong>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {Object.entries(challenge.requirements.conditions).map(([key, value]) => (
                                    <Badge
                                      key={key}
                                      variant={
                                        (gameState[key as keyof GameState] as number) >= value
                                          ? "default"
                                          : "destructive"
                                      }
                                      className="text-xs"
                                    >
                                      {key}: {value}
                                      {(gameState[key as keyof GameState] as number) >= value && " ✓"}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <strong className="text-green-600">Rewards:</strong>
                                  <div className="space-y-1">
                                    {Object.entries(challenge.rewards).map(([key, value]) => (
                                      <div key={key}>
                                        {key}: +{value}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <strong className="text-red-600">Penalties:</strong>
                                  <div className="space-y-1">
                                    {Object.entries(challenge.penalties).map(([key, value]) => (
                                      <div key={key}>
                                        {key}: {value}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Available Actions</CardTitle>
                <CardDescription>
                  Choose your strategy to address the water crisis, climate challenges, and active objectives
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

            {/* Climate Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Climate Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {climateTrendProgress.map((trend) => (
                    <div key={trend.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{trend.name}</span>
                        <span className={`text-xs ${trend.triggered ? "text-red-600" : "text-muted-foreground"}`}>
                          {trend.progression.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={trend.progression} className={`h-2 ${trend.triggered ? "bg-red-100" : ""}`} />
                      <p className="text-xs text-muted-foreground mt-1">{trend.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Game Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="history" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">Action History</TabsTrigger>
                    <TabsTrigger value="challenges">Challenge Log</TabsTrigger>
                  </TabsList>
                  <TabsContent value="history" className="space-y-2">
                    <ScrollArea className="h-32">
                      {actionHistory.slice(-5).map((action, index) => (
                        <div key={index} className="text-sm p-2 border rounded mb-2">
                          <div className="font-medium">{action.actionKey}</div>
                          <div className="text-xs text-muted-foreground">
                            Turn {action.turn} - {action.role}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                  <TabsContent value="challenges" className="space-y-2">
                    <ScrollArea className="h-32">
                      {activeChallenges.slice(-5).map((challenge) => (
                        <div key={challenge.id} className="text-sm p-2 border rounded mb-2">
                          <div className="font-medium">{challenge.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {challenge.status} - Complexity {challenge.complexity}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
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
