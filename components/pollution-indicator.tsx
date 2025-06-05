"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Droplet, AlertTriangle, Factory, Tractor, Building2, FlaskRoundIcon as Flask } from "lucide-react"

export interface PollutionSource {
  id: string
  name: string
  type: "industrial" | "agricultural" | "urban" | "natural"
  severity: number // 0-100
  location: string
  description: string
  origin: string // country ID
  crossBorder: boolean
}

export interface WaterQualityState {
  pollutionLevel: number // 0-100, higher is worse
  contaminationSources: PollutionSource[]
  waterTreatmentCapacity: number // 0-100
  monitoringEfficiency: number // 0-100
  healthImpacts: number // 0-100, higher is worse
  environmentalDamage: number // 0-100, higher is worse
  internationalStandards: boolean
  disputeLevel: "none" | "minor" | "moderate" | "severe" | "critical"
}

interface PollutionIndicatorProps {
  waterQuality: WaterQualityState
  isDownstream: boolean
}

export function PollutionIndicator({ waterQuality, isDownstream }: PollutionIndicatorProps) {
  const getPollutionColor = (level: number) => {
    if (level < 20) return "bg-green-500"
    if (level < 40) return "bg-lime-500"
    if (level < 60) return "bg-yellow-500"
    if (level < 80) return "bg-orange-500"
    return "bg-red-500"
  }

  const getPollutionTextColor = (level: number) => {
    if (level < 20) return "text-green-600"
    if (level < 40) return "text-lime-600"
    if (level < 60) return "text-yellow-600"
    if (level < 80) return "text-orange-600"
    return "text-red-600"
  }

  const getPollutionLabel = (level: number) => {
    if (level < 20) return "Excellent"
    if (level < 40) return "Good"
    if (level < 60) return "Fair"
    if (level < 80) return "Poor"
    return "Critical"
  }

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "industrial":
        return <Factory className="h-4 w-4 text-gray-600" />
      case "agricultural":
        return <Tractor className="h-4 w-4 text-green-600" />
      case "urban":
        return <Building2 className="h-4 w-4 text-blue-600" />
      case "natural":
        return <Droplet className="h-4 w-4 text-cyan-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getDisputeColor = (level: string) => {
    switch (level) {
      case "none":
        return "bg-green-100 text-green-800 border-green-300"
      case "minor":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "severe":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const crossBorderSources = waterQuality.contaminationSources.filter((source) => source.crossBorder)
  const hasCrossBorderPollution = crossBorderSources.length > 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Droplet className={`h-5 w-5 ${getPollutionTextColor(waterQuality.pollutionLevel)}`} />
          <span className="font-medium">Water Quality</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getPollutionTextColor(waterQuality.pollutionLevel)}`}>
            {getPollutionLabel(waterQuality.pollutionLevel)}
          </span>
          <span className="text-sm text-muted-foreground">({100 - waterQuality.pollutionLevel}% pure)</span>
        </div>
      </div>

      <Progress
        value={100 - waterQuality.pollutionLevel}
        className={`h-2 ${getPollutionColor(waterQuality.pollutionLevel)}`}
      />

      {isDownstream && hasCrossBorderPollution && (
        <div className="flex items-center gap-2 mt-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          <span className="text-sm text-orange-700">
            Receiving cross-border pollution from {crossBorderSources.length} upstream source
            {crossBorderSources.length > 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1">
                <Flask className="h-3 w-3" />
                Treatment: {waterQuality.waterTreatmentCapacity}%
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Water treatment capacity affects your ability to clean polluted water</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Health Impact: {waterQuality.healthImpacts}%
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Higher health impacts reduce public support and increase costs</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Badge className={`border ${getDisputeColor(waterQuality.disputeLevel)}`}>
          Disputes: {waterQuality.disputeLevel}
        </Badge>
      </div>
    </div>
  )
}
