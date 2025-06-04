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
} from "lucide-react"

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
}

interface GameMessage {
  id: string
  message: string
  type: "action" | "event" | "ai" | "crisis" | "challenge" | "success"
  timestamp: Date
}

interface ActionHistory {
  actionKey: string
  role: string
  turn: number
  impact: Record<string, number>
  timestamp: Date
}

interface DynamicChallenge {
  id: string
  title: string
  description: string
  type: "immediate" | "cascading" | "strategic" | "crisis"
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
  type: "immediate" | "cascading" | "strategic" | "crisis"
  triggerConditions: {
    actions?: string[]
    roles?: string[]
    stateThresholds?: Record<string, { min?: number; max?: number }>
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
      impact: { water: 25, economic: 10, environmental: -5 },
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
      impact: { water: 12, public: 15, economic: -8 },
      tags: ["incentive", "conservation", "economic"],
    },
  ],
  industry: [
    {
      key: "efficiency",
      name: "Improve Water Efficiency",
      cost: 4,
      impact: { water: 20, economic: 5, environmental: 10 },
      tags: ["efficiency", "technology", "sustainable"],
    },
    {
      key: "recycling",
      name: "Water Recycling Program",
      cost: 6,
      impact: { water: 30, environmental: 20, economic: -5 },
      tags: ["recycling", "innovation", "environmental"],
    },
    {
      key: "technology",
      name: "Invest in Water Technology",
      cost: 7,
      impact: { water: 35, economic: 15, environmental: 5 },
      tags: ["technology", "innovation", "investment"],
    },
    {
      key: "partnerships",
      name: "Public-Private Partnerships",
      cost: 5,
      impact: { water: 18, economic: 20, diplomatic: 10 },
      tags: ["partnership", "collaboration", "economic"],
    },
  ],
  environmental: [
    {
      key: "conservation",
      name: "Launch Conservation Campaign",
      cost: 2,
      impact: { water: 10, environmental: 20, public: 15 },
      tags: ["conservation", "awareness", "public"],
    },
    {
      key: "restoration",
      name: "Ecosystem Restoration",
      cost: 5,
      impact: { water: 15, environmental: 30, economic: -10 },
      tags: ["restoration", "ecosystem", "long_term"],
    },
    {
      key: "monitoring",
      name: "Water Quality Monitoring",
      cost: 3,
      impact: { water: 5, environmental: 25, public: 10 },
      tags: ["monitoring", "quality", "health"],
    },
    {
      key: "litigation",
      name: "Environmental Litigation",
      cost: 4,
      impact: { environmental: 25, public: 5, diplomatic: -15 },
      tags: ["legal", "enforcement", "conflict"],
    },
  ],
  international: [
    {
      key: "cooperation",
      name: "Regional Water Cooperation",
      cost: 4,
      impact: { water: 20, diplomatic: 25, economic: 5 },
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
      impact: { water: 25, diplomatic: 35, economic: 5 },
      tags: ["treaty", "agreement", "long_term"],
    },
  ],
}

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
    id: "public_backlash",
    title: "Public Backlash Against Rationing",
    description:
      "Citizens are protesting water rationing policies. Address their concerns or face political consequences.",
    type: "immediate",
    triggerConditions: {
      actions: ["water_rationing"],
      stateThresholds: { public: { max: 50 } },
    },
    dynamicElements: {
      requirements: {
        base: { public: 20 },
        scaling: { public: 10 },
      },
    },
    baseRewards: { public: 25, diplomatic: 10 },
    basePenalties: { public: -25, resources: -20 },
    complexity: 1,
  },
  {
    id: "technology_breakthrough",
    title: "Technology Innovation Opportunity",
    description: "Your technology investments have opened new possibilities. Capitalize on this breakthrough.",
    type: "strategic",
    triggerConditions: {
      actions: ["technology", "efficiency"],
      actionCount: 2,
    },
    dynamicElements: {
      requirements: {
        base: { resources: 25, economic: 60 },
        scaling: { resources: 10 },
      },
    },
    baseRewards: { water: 40, economic: 30, environmental: 15 },
    basePenalties: { resources: -15 },
    complexity: 3,
  },
  {
    id: "environmental_lawsuit",
    title: "Environmental Legal Challenge",
    description: "Environmental groups are challenging your recent decisions in court. Prepare your defense.",
    type: "cascading",
    triggerConditions: {
      actions: ["infrastructure", "regulations"],
      roles: ["government", "industry"],
      stateThresholds: { environmental: { max: 40 } },
    },
    dynamicElements: {
      requirements: {
        base: { resources: 20, diplomatic: 50 },
        scaling: { resources: 8 },
      },
    },
    baseRewards: { diplomatic: 20, public: 15 },
    basePenalties: { resources: -30, public: -20, environmental: -15 },
    complexity: 2,
  },
  {
    id: "international_crisis",
    title: "Cross-Border Water Dispute",
    description: "Neighboring regions are disputing water rights. Your diplomatic skills are needed urgently.",
    type: "crisis",
    triggerConditions: {
      actions: ["cooperation", "treaties"],
      stateThresholds: { diplomatic: { min: 70 } },
    },
    dynamicElements: {
      requirements: {
        base: { diplomatic: 80, resources: 30 },
        scaling: { resources: 15 },
      },
    },
    baseRewards: { water: 50, diplomatic: 40, resources: 100 },
    basePenalties: { water: -40, diplomatic: -50, economic: -25 },
    complexity: 4,
  },
  {
    id: "economic_downturn",
    title: "Economic Impact Assessment",
    description:
      "Your environmental policies are affecting the local economy. Find a balance or face economic collapse.",
    type: "strategic",
    triggerConditions: {
      actions: ["restoration", "regulations", "litigation"],
      stateThresholds: { economic: { max: 35 } },
    },
    dynamicElements: {
      requirements: {
        base: { economic: 50, resources: 20 },
        scaling: { resources: 10 },
      },
    },
    baseRewards: { economic: 35, public: 20 },
    basePenalties: { economic: -30, resources: -25 },
    complexity: 3,
  },
  {
    id: "conservation_success",
    title: "Conservation Program Expansion",
    description: "Your conservation efforts are showing results. Expand the program for greater impact.",
    type: "strategic",
    triggerConditions: {
      actions: ["conservation", "monitoring"],
      stateThresholds: { environmental: { min: 70 } },
    },
    dynamicElements: {
      requirements: {
        base: { resources: 15, public: 60 },
        scaling: { resources: 5 },
      },
    },
    baseRewards: { water: 25, environmental: 30, public: 20 },
    basePenalties: { resources: -10 },
    complexity: 2,
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
  })

  const [messages, setMessages] = useState<GameMessage[]>([
    {
      id: "1",
      message:
        "Welcome to the Water Diplomacy Simulation. A severe drought has hit the region, and water levels are critically low.",
      type: "event",
      timestamp: new Date(),
    },
  ])

  const [actionHistory, setActionHistory] = useState<ActionHistory[]>([])
  const [activeChallenges, setActiveChallenges] = useState<DynamicChallenge[]>([])
  const [showAIRecommendations, setShowAIRecommendations] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])

  // Dynamic Challenge Generation Engine
  const generateDynamicChallenges = useCallback(() => {
    const newChallenges: DynamicChallenge[] = []
    const recentActions = actionHistory.slice(-5) // Last 5 actions
    const currentTurn = gameState.turn

    challengeTemplates.forEach((template) => {
      // Check if template conditions are met
      let shouldTrigger = false

      // Check action-based triggers
      if (template.triggerConditions.actions) {
        const hasRequiredActions = template.triggerConditions.actions.some((action) =>
          recentActions.some((ah) => ah.actionKey === action),
        )
        if (hasRequiredActions) shouldTrigger = true
      }

      // Check role-based triggers
      if (template.triggerConditions.roles && shouldTrigger) {
        const hasRequiredRole = template.triggerConditions.roles.includes(gameState.currentRole)
        if (!hasRequiredRole) shouldTrigger = false
      }

      // Check state thresholds
      if (template.triggerConditions.stateThresholds && shouldTrigger) {
        const thresholds = template.triggerConditions.stateThresholds
        for (const [key, threshold] of Object.entries(thresholds)) {
          const stateValue = gameState[key as keyof GameState] as number
          if (threshold.min && stateValue < threshold.min) shouldTrigger = false
          if (threshold.max && stateValue > threshold.max) shouldTrigger = false
        }
      }

      // Check action count requirements
      if (template.triggerConditions.actionCount && shouldTrigger) {
        const relevantActions = recentActions.filter((ah) => template.triggerConditions.actions?.includes(ah.actionKey))
        if (relevantActions.length < template.triggerConditions.actionCount) shouldTrigger = false
      }

      // Check turn range
      if (template.triggerConditions.turnRange && shouldTrigger) {
        const { min, max } = template.triggerConditions.turnRange
        if (currentTurn < min || currentTurn > max) shouldTrigger = false
      }

      // Avoid duplicate challenges
      const existingChallenge = activeChallenges.find((c) => c.id.startsWith(template.id))
      if (existingChallenge) shouldTrigger = false

      if (shouldTrigger && Math.random() < 0.7) {
        // 70% chance to actually trigger
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
  }, [actionHistory, gameState, activeChallenges])

  const createChallengeFromTemplate = (
    template: ChallengeTemplate,
    recentActions: ActionHistory[],
    currentTurn: number,
  ): DynamicChallenge => {
    const challengeId = `${template.id}_${Date.now()}`
    const complexity = Math.min(template.complexity + Math.floor(currentTurn / 10), 5)

    // Calculate dynamic requirements
    const requirements = { turns: 3, conditions: {} as Record<string, number> }
    if (template.dynamicElements.requirements) {
      const { base, scaling } = template.dynamicElements.requirements
      for (const [key, baseValue] of Object.entries(base)) {
        const scaledValue = baseValue + (scaling[key] || 0) * complexity
        requirements.conditions[key] = scaledValue
      }
    }

    // Calculate rewards and penalties based on complexity
    const rewards = Object.fromEntries(
      Object.entries(template.baseRewards).map(([key, value]) => [key, value * (1 + complexity * 0.2)]),
    )
    const penalties = Object.fromEntries(
      Object.entries(template.basePenalties).map(([key, value]) => [key, value * (1 + complexity * 0.3)]),
    )

    // Set deadline for time-sensitive challenges
    let deadline: number | undefined
    if (template.type === "immediate") {
      deadline = currentTurn + 2
    } else if (template.type === "crisis") {
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

  const takeAction = (actionKey: string) => {
    const currentRoleActions = actions[gameState.currentRole as keyof typeof actions]
    const action = currentRoleActions?.find((a) => a.key === actionKey)

    if (!action || gameState.resources < action.cost) {
      addMessage("Insufficient resources to take this action!", "crisis")
      return
    }

    // Record action in history
    const actionRecord: ActionHistory = {
      actionKey,
      role: gameState.currentRole,
      turn: gameState.turn,
      impact: action.impact,
      timestamp: new Date(),
    }

    setActionHistory((prev) => [...prev, actionRecord])

    // Apply action effects
    setGameState((prev) => ({
      ...prev,
      waterLevel: Math.max(0, Math.min(100, prev.waterLevel + (action.impact.water || 0))),
      publicSupport: Math.max(0, Math.min(100, prev.publicSupport + (action.impact.public || 0))),
      economicHealth: Math.max(0, Math.min(100, prev.economicHealth + (action.impact.economic || 0))),
      environmentalHealth: Math.max(0, Math.min(100, prev.environmentalHealth + (action.impact.environmental || 0))),
      diplomaticRelations: Math.max(0, Math.min(100, prev.diplomaticRelations + (action.impact.diplomatic || 0))),
      resources: prev.resources - action.cost + (action.impact.resources || 0),
      turn: prev.turn + 1,
    }))

    addMessage(`Action taken: ${action.name}`, "action")
    generateRandomEvent()
  }

  const completeChallenge = (challengeId: string, success: boolean) => {
    const challenge = activeChallenges.find((c) => c.id === challengeId)
    if (!challenge) return

    if (success) {
      // Apply rewards
      setGameState((prev) => ({
        ...prev,
        waterLevel: Math.max(0, Math.min(100, prev.waterLevel + (challenge.rewards.water || 0))),
        publicSupport: Math.max(0, Math.min(100, prev.publicSupport + (challenge.rewards.public || 0))),
        economicHealth: Math.max(0, Math.min(100, prev.economicHealth + (challenge.rewards.economic || 0))),
        environmentalHealth: Math.max(
          0,
          Math.min(100, prev.environmentalHealth + (challenge.rewards.environmental || 0)),
        ),
        diplomaticRelations: Math.max(0, Math.min(100, prev.diplomaticRelations + (challenge.rewards.diplomatic || 0))),
        resources: prev.resources + (challenge.rewards.resources || 0),
      }))
      addMessage(`✅ Challenge Completed: ${challenge.title}`, "success")
    } else {
      // Apply penalties
      setGameState((prev) => ({
        ...prev,
        waterLevel: Math.max(0, Math.min(100, prev.waterLevel + (challenge.penalties.water || 0))),
        publicSupport: Math.max(0, Math.min(100, prev.publicSupport + (challenge.penalties.public || 0))),
        economicHealth: Math.max(0, Math.min(100, prev.economicHealth + (challenge.penalties.economic || 0))),
        environmentalHealth: Math.max(
          0,
          Math.min(100, prev.environmentalHealth + (challenge.penalties.environmental || 0)),
        ),
        diplomaticRelations: Math.max(
          0,
          Math.min(100, prev.diplomaticRelations + (challenge.penalties.diplomatic || 0)),
        ),
        resources: prev.resources + (challenge.penalties.resources || 0),
      }))
      addMessage(`❌ Challenge Failed: ${challenge.title}`, "crisis")
    }

    // Update challenge status
    setActiveChallenges((prev) =>
      prev.map((c) => (c.id === challengeId ? { ...c, status: success ? "completed" : "failed" } : c)),
    )
  }

  const checkChallengeCompletion = useCallback(() => {
    activeChallenges.forEach((challenge) => {
      if (challenge.status !== "active") return

      // Check if deadline passed
      if (challenge.deadline && gameState.turn > challenge.deadline) {
        completeChallenge(challenge.id, false)
        return
      }

      // Check if requirements are met
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
  }, [activeChallenges, gameState])

  const switchRole = (newRole: string, reason: string) => {
    setGameState((prev) => ({ ...prev, currentRole: newRole }))
    addMessage(`Switched to ${roles.find((r) => r.id === newRole)?.name}: ${reason}`, "event")
  }

  const addMessage = (message: string, type: GameMessage["type"]) => {
    const newMessage: GameMessage = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
    }
    setMessages((prev) => [newMessage, ...prev])
  }

  const generateAIRecommendations = () => {
    const recommendations: AIRecommendation[] = []

    // Challenge-based recommendations
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

    // Water crisis recommendations
    if (gameState.waterLevel < 30) {
      recommendations.push({
        id: "water_crisis",
        actionKey: "water_rationing",
        title: "Immediate Water Rationing",
        description: "Water levels are critically low. Implement emergency rationing to prevent complete depletion.",
        impact: "high",
        urgency: "high",
      })
    }

    // Role switch recommendations based on challenges
    const governmentChallenges = activeChallenges.filter((c) => c.triggerRoles.includes("government"))
    if (governmentChallenges.length > 0 && gameState.currentRole !== "government") {
      recommendations.push({
        id: "role_government",
        roleSwitch: "government",
        title: "Switch to Government Role",
        description: "Active challenges require government intervention and policy decisions.",
        impact: "medium",
        urgency: "medium",
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

  const generateRandomEvent = () => {
    const events = [
      { message: "Heavy rainfall increases water reserves by 10%", effect: { water: 10 } },
      { message: "Industrial accident contaminates water supply", effect: { water: -15, environmental: -10 } },
      { message: "Public protests demand better water management", effect: { public: -20 } },
      { message: "International aid package approved", effect: { resources: 30, diplomatic: 10 } },
      { message: "New water-efficient technology discovered", effect: { water: 5, economic: 5 } },
    ]

    if (Math.random() < 0.3) {
      const event = events[Math.floor(Math.random() * events.length)]
      addMessage(event.message, "event")

      setGameState((prev) => ({
        ...prev,
        waterLevel: Math.max(0, Math.min(100, prev.waterLevel + (event.effect.water || 0))),
        publicSupport: Math.max(0, Math.min(100, prev.publicSupport + (event.effect.public || 0))),
        economicHealth: Math.max(0, Math.min(100, prev.economicHealth + (event.effect.economic || 0))),
        environmentalHealth: Math.max(0, Math.min(100, prev.environmentalHealth + (event.effect.environmental || 0))),
        diplomaticRelations: Math.max(0, Math.min(100, prev.diplomaticRelations + (event.effect.diplomatic || 0))),
        resources: prev.resources + (event.effect.resources || 0),
      }))
    }
  }

  // Effect hooks for dynamic systems
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
      default:
        return <Target className="h-4 w-4" />
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
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
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
                  Choose your strategy to address the water crisis and active challenges
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
