"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Droplet,
  AlertTriangle,
  Factory,
  Tractor,
  Building2,
  FlaskRoundIcon as Flask,
  FileText,
  Scale,
  Microscope,
  ArrowRight,
} from "lucide-react"
import type { WaterQualityState } from "./pollution-indicator"

interface PollutionDetailsProps {
  waterQuality: WaterQualityState
  selectedCountry: {
    id: string
    name: string
    type: "source" | "downstream"
  }
  neighboringCountries: Array<{
    id: string
    name: string
    type: "source" | "downstream"
  }>
  onTakeAction?: (actionType: string) => void
}

export function PollutionDetails({
  waterQuality,
  selectedCountry,
  neighboringCountries,
  onTakeAction,
}: PollutionDetailsProps) {
  const [activeTab, setActiveTab] = useState("sources")

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

  const getSourceSeverityColor = (severity: number) => {
    if (severity < 20) return "bg-green-100 text-green-800"
    if (severity < 40) return "bg-lime-100 text-lime-800"
    if (severity < 60) return "bg-yellow-100 text-yellow-800"
    if (severity < 80) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const getSourceSeverityLabel = (severity: number) => {
    if (severity < 20) return "Low"
    if (severity < 40) return "Moderate"
    if (severity < 60) return "Significant"
    if (severity < 80) return "High"
    return "Severe"
  }

  const localSources = waterQuality.contaminationSources.filter((source) => source.origin === selectedCountry.id)
  const foreignSources = waterQuality.contaminationSources.filter((source) => source.origin !== selectedCountry.id)

  const getCountryById = (id: string) => {
    if (id === selectedCountry.id) return selectedCountry
    return neighboringCountries.find((country) => country.id === id) || { id, name: "Unknown", type: "source" as const }
  }

  const getDisputeDescription = (level: string) => {
    switch (level) {
      case "none":
        return "No active water quality disputes with neighboring countries."
      case "minor":
        return "Minor concerns raised about water quality in diplomatic communications."
      case "moderate":
        return "Formal complaints filed regarding cross-border pollution incidents."
      case "severe":
        return "Serious diplomatic tensions over persistent water contamination issues."
      case "critical":
        return "International crisis with potential for legal action and sanctions."
      default:
        return "Unknown dispute status."
    }
  }

  const getHealthImpactDescription = (level: number) => {
    if (level < 20) return "Minimal health concerns from water quality."
    if (level < 40) return "Some reports of waterborne illness in vulnerable populations."
    if (level < 60) return "Significant health issues affecting multiple communities."
    if (level < 80) return "Widespread health crisis with serious medical consequences."
    return "Public health emergency with severe impacts across the population."
  }

  const getEnvironmentalImpactDescription = (level: number) => {
    if (level < 20) return "Minimal ecosystem disruption from water pollution."
    if (level < 40) return "Some damage to sensitive aquatic species and habitats."
    if (level < 60) return "Significant biodiversity loss and ecosystem degradation."
    if (level < 80) return "Severe environmental damage with long-term recovery needed."
    return "Ecological collapse in affected water systems with potentially irreversible damage."
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-600" />
          Water Quality & Pollution Management
        </CardTitle>
        <CardDescription>
          Monitor pollution sources, manage water treatment, and address cross-border water quality disputes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="sources" className="flex items-center gap-1">
              <Factory className="h-4 w-4" />
              <span>Pollution Sources</span>
            </TabsTrigger>
            <TabsTrigger value="impacts" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span>Impacts</span>
            </TabsTrigger>
            <TabsTrigger value="disputes" className="flex items-center gap-1">
              <Scale className="h-4 w-4" />
              <span>Disputes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Contamination Sources</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Microscope className="h-3 w-3" />
                Monitoring: {waterQuality.monitoringEfficiency}%
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Domestic Sources</h4>
              {localSources.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No significant local pollution sources detected.</p>
              ) : (
                <ScrollArea className="h-32 border rounded-md p-2">
                  {localSources.map((source) => (
                    <div key={source.id} className="flex items-start gap-2 py-2">
                      {getSourceIcon(source.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{source.name}</span>
                          <Badge className={getSourceSeverityColor(source.severity)}>
                            {getSourceSeverityLabel(source.severity)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{source.description}</p>
                        <div className="text-xs mt-1">Location: {source.location}</div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Cross-Border Sources</h4>
              {foreignSources.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No cross-border pollution sources detected.</p>
              ) : (
                <ScrollArea className="h-32 border rounded-md p-2">
                  {foreignSources.map((source) => (
                    <div key={source.id} className="flex items-start gap-2 py-2">
                      {getSourceIcon(source.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">{source.name}</span>
                          <Badge className={getSourceSeverityColor(source.severity)}>
                            {getSourceSeverityLabel(source.severity)}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{source.description}</p>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <span>Origin: {getCountryById(source.origin).name}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{selectedCountry.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-sm font-medium">Water Treatment Capacity</h4>
                <p className="text-xs text-muted-foreground">Current capacity to process and clean water</p>
              </div>
              <div className="text-right">
                <span className="font-medium">{waterQuality.waterTreatmentCapacity}%</span>
              </div>
            </div>
            <Progress value={waterQuality.waterTreatmentCapacity} className="h-2" />

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => onTakeAction?.("monitor_pollution")}>
                <Microscope className="h-4 w-4 mr-1" />
                Monitor Sources
              </Button>
              <Button size="sm" onClick={() => onTakeAction?.("improve_treatment")}>
                <Flask className="h-4 w-4 mr-1" />
                Improve Treatment
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="impacts" className="space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Public Health Impacts</h3>
                  <Badge
                    variant={waterQuality.healthImpacts > 50 ? "destructive" : "outline"}
                    className="flex items-center gap-1"
                  >
                    Impact: {waterQuality.healthImpacts}%
                  </Badge>
                </div>
                <Progress
                  value={100 - waterQuality.healthImpacts}
                  className={`h-2 mt-2 ${
                    waterQuality.healthImpacts > 70
                      ? "bg-red-500"
                      : waterQuality.healthImpacts > 40
                        ? "bg-orange-500"
                        : "bg-green-500"
                  }`}
                />
                <p className="text-sm mt-2">{getHealthImpactDescription(waterQuality.healthImpacts)}</p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Environmental Damage</h3>
                  <Badge
                    variant={waterQuality.environmentalDamage > 50 ? "destructive" : "outline"}
                    className="flex items-center gap-1"
                  >
                    Damage: {waterQuality.environmentalDamage}%
                  </Badge>
                </div>
                <Progress
                  value={100 - waterQuality.environmentalDamage}
                  className={`h-2 mt-2 ${
                    waterQuality.environmentalDamage > 70
                      ? "bg-red-500"
                      : waterQuality.environmentalDamage > 40
                        ? "bg-orange-500"
                        : "bg-green-500"
                  }`}
                />
                <p className="text-sm mt-2">{getEnvironmentalImpactDescription(waterQuality.environmentalDamage)}</p>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium">Economic Consequences</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-md p-3">
                    <div className="text-sm font-medium">Tourism Impact</div>
                    <div className="text-xs text-muted-foreground">
                      {waterQuality.pollutionLevel > 60
                        ? "Severe reduction in tourism revenue"
                        : waterQuality.pollutionLevel > 40
                          ? "Moderate impact on tourism sector"
                          : "Minimal effect on tourism"}
                    </div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm font-medium">Fisheries Impact</div>
                    <div className="text-xs text-muted-foreground">
                      {waterQuality.pollutionLevel > 50
                        ? "Significant decline in fish stocks"
                        : waterQuality.pollutionLevel > 30
                          ? "Some reduction in fishery productivity"
                          : "Healthy aquatic ecosystem"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => onTakeAction?.("health_measures")}>
                  Address Health Issues
                </Button>
                <Button size="sm" onClick={() => onTakeAction?.("ecosystem_restoration")}>
                  Restore Ecosystems
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">International Water Quality Disputes</h3>
              <Badge
                variant={
                  waterQuality.disputeLevel === "severe" || waterQuality.disputeLevel === "critical"
                    ? "destructive"
                    : "outline"
                }
              >
                Status: {waterQuality.disputeLevel}
              </Badge>
            </div>

            <div className="border rounded-md p-4 bg-muted/30">
              <p className="text-sm">{getDisputeDescription(waterQuality.disputeLevel)}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">International Standards Compliance</h4>
              <div className="flex items-center gap-2">
                <Badge variant={waterQuality.internationalStandards ? "default" : "destructive"}>
                  {waterQuality.internationalStandards ? "Compliant" : "Non-compliant"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {waterQuality.internationalStandards
                    ? "Your water quality meets international standards"
                    : "Your water quality fails to meet international standards"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Affected Relations</h4>
              {foreignSources.length > 0 ? (
                <div className="space-y-2">
                  {Array.from(new Set(foreignSources.map((s) => s.origin))).map((countryId) => {
                    const country = getCountryById(countryId)
                    const sources = foreignSources.filter((s) => s.origin === countryId)
                    return (
                      <div key={countryId} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center gap-2">
                          <span>{country.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {country.type}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          {sources.length} pollution source{sources.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No cross-border pollution disputes detected.</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => onTakeAction?.("diplomatic_protest")}>
                <Scale className="h-4 w-4 mr-1" />
                File Diplomatic Protest
              </Button>
              <Button size="sm" onClick={() => onTakeAction?.("water_quality_agreement")}>
                <FileText className="h-4 w-4 mr-1" />
                Propose Quality Agreement
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
