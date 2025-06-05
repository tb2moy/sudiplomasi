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
import { getTranslation, type Language } from "@/lib/translations"

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
  language: Language
}

export function PollutionDetails({
  waterQuality,
  selectedCountry,
  neighboringCountries,
  onTakeAction,
  language,
}: PollutionDetailsProps) {
  const [activeTab, setActiveTab] = useState("sources")
  const t = getTranslation(language)

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
        return t.pollutionDetails.disputeLevel.none
      case "minor":
        return t.pollutionDetails.disputeLevel.minor
      case "moderate":
        return t.pollutionDetails.disputeLevel.moderate
      case "severe":
        return t.pollutionDetails.disputeLevel.severe
      case "critical":
        return t.pollutionDetails.disputeLevel.critical
      default:
        return t.pollutionDetails.disputeLevel.unknown
    }
  }

  const getHealthImpactDescription = (level: number) => {
    if (level < 20) return t.pollutionDetails.healthImpact.minimal
    if (level < 40) return t.pollutionDetails.healthImpact.some
    if (level < 60) return t.pollutionDetails.healthImpact.significant
    if (level < 80) return t.pollutionDetails.healthImpact.widespread
    return t.pollutionDetails.healthImpact.publicEmergency
  }

  const getEnvironmentalImpactDescription = (level: number) => {
    if (level < 20) return t.pollutionDetails.environmentalImpact.minimal
    if (level < 40) return t.pollutionDetails.environmentalImpact.some
    if (level < 60) return t.pollutionDetails.environmentalImpact.significant
    if (level < 80) return t.pollutionDetails.environmentalImpact.severe
    return t.pollutionDetails.environmentalImpact.ecologicalCollapse
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-blue-600" />
          {t.pollutionDetails.cardTitle}
        </CardTitle>
        <CardDescription>{t.pollutionDetails.cardDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="sources" className="flex items-center gap-1">
              <Factory className="h-4 w-4" />
              <span>{t.pollutionDetails.tabs.sources}</span>
            </TabsTrigger>
            <TabsTrigger value="impacts" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              <span>{t.pollutionDetails.tabs.impacts}</span>
            </TabsTrigger>
            <TabsTrigger value="disputes" className="flex items-center gap-1">
              <Scale className="h-4 w-4" />
              <span>{t.pollutionDetails.tabs.disputes}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{t.pollutionDetails.contaminationSources}</h3>
              <Badge variant="outline" className="flex items-center gap-1">
                <Microscope className="h-3 w-3" />
                {t.pollutionDetails.monitoring}: {waterQuality.monitoringEfficiency}%
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{t.pollutionDetails.domesticSources}</h4>
              {localSources.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">{t.pollutionDetails.noLocalSources}</p>
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
                        <div className="text-xs mt-1">
                          {t.pollutionDetails.location}: {source.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{t.pollutionDetails.crossBorderSources}</h4>
              {foreignSources.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">{t.pollutionDetails.noCrossBorderSources}</p>
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
                          <span>
                            {t.pollutionDetails.origin}: {getCountryById(source.origin).name}
                          </span>
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
                <h4 className="text-sm font-medium">{t.pollutionDetails.waterTreatmentCapacity}</h4>
                <p className="text-xs text-muted-foreground">{t.pollutionDetails.waterTreatmentDescription}</p>
              </div>
              <div className="text-right">
                <span className="font-medium">{waterQuality.waterTreatmentCapacity}%</span>
              </div>
            </div>
            <Progress value={waterQuality.waterTreatmentCapacity} className="h-2" />

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => onTakeAction?.("monitor_pollution")}>
                <Microscope className="h-4 w-4 mr-1" />
                {t.pollutionDetails.monitorSources}
              </Button>
              <Button size="sm" onClick={() => onTakeAction?.("improve_treatment")}>
                <Flask className="h-4 w-4 mr-1" />
                {t.pollutionDetails.improveTreatment}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="impacts" className="space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{t.pollutionDetails.publicHealthImpacts}</h3>
                  <Badge
                    variant={waterQuality.healthImpacts > 50 ? "destructive" : "outline"}
                    className="flex items-center gap-1"
                  >
                    {t.pollutionDetails.impact}: {waterQuality.healthImpacts}%
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
                  <h3 className="text-sm font-medium">{t.pollutionDetails.environmentalDamage}</h3>
                  <Badge
                    variant={waterQuality.environmentalDamage > 50 ? "destructive" : "outline"}
                    className="flex items-center gap-1"
                  >
                    {t.pollutionDetails.damage}: {waterQuality.environmentalDamage}%
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
                <h3 className="text-sm font-medium">{t.pollutionDetails.economicConsequences}</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-md p-3">
                    <div className="text-sm font-medium">{t.pollutionDetails.tourismImpact}</div>
                    <div className="text-xs text-muted-foreground">
                      {waterQuality.pollutionLevel > 60
                        ? t.pollutionDetails.tourismImpactSevere
                        : waterQuality.pollutionLevel > 40
                          ? t.pollutionDetails.tourismImpactModerate
                          : t.pollutionDetails.tourismImpactMinimal}
                    </div>
                  </div>
                  <div className="border rounded-md p-3">
                    <div className="text-sm font-medium">{t.pollutionDetails.fisheriesImpact}</div>
                    <div className="text-xs text-muted-foreground">
                      {waterQuality.pollutionLevel > 50
                        ? t.pollutionDetails.fisheriesImpactSignificant
                        : waterQuality.pollutionLevel > 30
                          ? t.pollutionDetails.fisheriesImpactSome
                          : t.pollutionDetails.fisheriesImpactHealthy}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" onClick={() => onTakeAction?.("health_measures")}>
                  {t.pollutionDetails.addressHealthIssues}
                </Button>
                <Button size="sm" onClick={() => onTakeAction?.("ecosystem_restoration")}>
                  {t.pollutionDetails.restoreEcosystems}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="disputes" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{t.pollutionDetails.internationalWaterQualityDisputes}</h3>
              <Badge
                variant={
                  waterQuality.disputeLevel === "severe" || waterQuality.disputeLevel === "critical"
                    ? "destructive"
                    : "outline"
                }
              >
                {t.pollutionDetails.status}: {waterQuality.disputeLevel}
              </Badge>
            </div>

            <div className="border rounded-md p-4 bg-muted/30">
              <p className="text-sm">{getDisputeDescription(waterQuality.disputeLevel)}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t.pollutionDetails.internationalStandardsCompliance}</h4>
              <div className="flex items-center gap-2">
                <Badge variant={waterQuality.internationalStandards ? "default" : "destructive"}>
                  {waterQuality.internationalStandards ? t.pollutionDetails.compliant : t.pollutionDetails.nonCompliant}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {waterQuality.internationalStandards
                    ? t.pollutionDetails.meetsInternationalStandards
                    : t.pollutionDetails.failsInternationalStandards}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t.pollutionDetails.affectedRelations}</h4>
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
                          {sources.length} {t.pollutionDetails.pollutionSource}
                          {sources.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">{t.pollutionDetails.noCrossBorderDisputes}</p>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={() => onTakeAction?.("diplomatic_protest")}>
                <Scale className="h-4 w-4 mr-1" />
                {t.pollutionDetails.fileDiplomaticProtest}
              </Button>
              <Button size="sm" onClick={() => onTakeAction?.("water_quality_agreement")}>
                <FileText className="h-4 w-4 mr-1" />
                {t.pollutionDetails.proposeQualityAgreement}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
