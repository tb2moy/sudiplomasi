"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Mountain, Waves, Users, Zap, Leaf, Globe, Droplets, Shield, TrendingUp, MapPin } from "lucide-react"
import { LanguageSelector, type Language } from "@/components/language-selector"
import { getTranslation } from "@/lib/translations"

export interface Country {
  id: string
  name: string
  type: "source" | "downstream"
  region: string
  description: string
  advantages: string[]
  challenges: string[]
  startingStats: {
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
  }
  specialActions: string[]
  diplomaticOptions: string[]
  waterSources: string[]
  dependencies: string[]
  neighbors: string[]
  flag: string
}

export const countries: Country[] = [
  // Source Countries
  {
    id: "alpinia",
    name: "Alpinia",
    type: "source",
    region: "Mountain Highlands",
    description:
      "A mountainous nation controlling the headwaters of three major river systems. Rich in freshwater resources but facing climate-induced glacial melt.",
    advantages: [
      "Controls major river headwaters",
      "Abundant freshwater reserves",
      "Hydroelectric potential",
      "Strong negotiating position",
      "Tourism revenue from pristine nature",
    ],
    challenges: [
      "Climate change affecting glaciers",
      "International pressure for water sharing",
      "Limited agricultural land",
      "Seasonal water flow variations",
      "Environmental protection costs",
    ],
    startingStats: {
      waterLevel: 85,
      publicSupport: 75,
      economicHealth: 60,
      environmentalHealth: 80,
      diplomaticRelations: 55,
      resources: 120,
      climateResilience: 45,
      adaptationLevel: 35,
      waterControl: 90,
      geopoliticalPower: 70,
    },
    specialActions: ["dam_construction", "water_release_control", "hydroelectric_expansion", "glacier_protection"],
    diplomaticOptions: ["water_pricing", "flow_agreements", "upstream_cooperation", "environmental_treaties"],
    waterSources: ["Glacial melt", "Mountain springs", "Seasonal snowpack"],
    dependencies: ["Food imports", "Technology imports", "Tourism revenue"],
    neighbors: ["Riverlandia", "Deltopia", "Midstream Republic"],
    flag: "🏔️",
  },
  {
    id: "highland_federation",
    name: "Highland Federation",
    type: "source",
    region: "Northern Plateau",
    description:
      "A federal state controlling vast highland watersheds. Balances water export revenues with domestic needs and environmental conservation.",
    advantages: [
      "Multiple river system control",
      "Water export revenues",
      "Strong federal institutions",
      "Advanced water management",
      "Regional influence",
    ],
    challenges: [
      "Federal vs state water rights",
      "Downstream diplomatic pressure",
      "Infrastructure maintenance costs",
      "Environmental degradation",
      "Climate adaptation needs",
    ],
    startingStats: {
      waterLevel: 80,
      publicSupport: 70,
      economicHealth: 75,
      environmentalHealth: 65,
      diplomaticRelations: 60,
      resources: 140,
      climateResilience: 50,
      adaptationLevel: 45,
      waterControl: 85,
      geopoliticalPower: 75,
    },
    specialActions: ["federal_water_policy", "interstate_compacts", "water_infrastructure", "export_agreements"],
    diplomaticOptions: ["multilateral_treaties", "water_trade", "technical_assistance", "joint_projects"],
    waterSources: ["Highland lakes", "Forest watersheds", "Groundwater aquifers"],
    dependencies: ["Manufacturing imports", "Energy imports", "International markets"],
    neighbors: ["Coastal Republic", "Desert Emirates", "Plains Confederation"],
    flag: "⛰️",
  },

  // Downstream Countries
  {
    id: "riverlandia",
    name: "Riverlandia",
    type: "downstream",
    region: "Central River Valley",
    description:
      "An agricultural powerhouse dependent on upstream water flows. Faces increasing water stress due to upstream development and climate change.",
    advantages: [
      "Fertile agricultural lands",
      "Established irrigation systems",
      "Food export capabilities",
      "Strategic river location",
      "Strong agricultural economy",
    ],
    challenges: [
      "Upstream water dependency",
      "Seasonal flow variations",
      "Agricultural water demands",
      "Flood and drought cycles",
      "Limited water storage",
    ],
    startingStats: {
      waterLevel: 55,
      publicSupport: 65,
      economicHealth: 70,
      environmentalHealth: 50,
      diplomaticRelations: 50,
      resources: 100,
      climateResilience: 40,
      adaptationLevel: 30,
      waterControl: 30,
      geopoliticalPower: 45,
    },
    specialActions: ["irrigation_efficiency", "water_storage", "crop_adaptation", "downstream_coalition"],
    diplomaticOptions: [
      "water_rights_advocacy",
      "compensation_claims",
      "regional_cooperation",
      "international_arbitration",
    ],
    waterSources: ["River flows", "Irrigation canals", "Limited groundwater"],
    dependencies: ["Upstream water flows", "Technology imports", "International food markets"],
    neighbors: ["Alpinia", "Deltopia", "Midstream Republic"],
    flag: "🌾",
  },
  {
    id: "deltopia",
    name: "Deltopia",
    type: "downstream",
    region: "River Delta",
    description:
      "A densely populated delta nation at the river mouth. Highly vulnerable to both water scarcity and flooding, with significant economic and environmental challenges.",
    advantages: [
      "Strategic coastal location",
      "Major port facilities",
      "Fishing industry",
      "Delta agriculture",
      "International trade hub",
    ],
    challenges: [
      "Extreme water vulnerability",
      "Sea level rise threats",
      "Saltwater intrusion",
      "Dense population pressure",
      "Limited freshwater sources",
    ],
    startingStats: {
      waterLevel: 40,
      publicSupport: 60,
      economicHealth: 65,
      environmentalHealth: 35,
      diplomaticRelations: 45,
      resources: 90,
      climateResilience: 25,
      adaptationLevel: 20,
      waterControl: 15,
      geopoliticalPower: 35,
    },
    specialActions: ["desalination", "flood_protection", "delta_restoration", "emergency_reserves"],
    diplomaticOptions: ["crisis_diplomacy", "humanitarian_appeals", "international_aid", "legal_action"],
    waterSources: ["River mouth flows", "Coastal aquifers", "Desalination plants"],
    dependencies: ["All upstream water", "Food imports", "International aid", "Technology"],
    neighbors: ["Riverlandia", "Coastal Republic", "Island Nations"],
    flag: "🏝️",
  },
  {
    id: "desert_emirates",
    name: "Desert Emirates",
    type: "downstream",
    region: "Arid Lowlands",
    description:
      "A wealthy but water-scarce nation relying on technology and diplomacy to secure water resources. Uses oil wealth to fund water infrastructure.",
    advantages: [
      "Oil wealth for water projects",
      "Advanced desalination technology",
      "Strong international relations",
      "Efficient water use systems",
      "Investment in innovation",
    ],
    challenges: [
      "Extreme water scarcity",
      "High infrastructure costs",
      "Energy-intensive water production",
      "Limited natural water sources",
      "Climate vulnerability",
    ],
    startingStats: {
      waterLevel: 30,
      publicSupport: 70,
      economicHealth: 85,
      environmentalHealth: 40,
      diplomaticRelations: 75,
      resources: 160,
      climateResilience: 35,
      adaptationLevel: 60,
      waterControl: 20,
      geopoliticalPower: 65,
    },
    specialActions: ["desalination_expansion", "water_imports", "technology_investment", "diplomatic_pressure"],
    diplomaticOptions: ["economic_incentives", "technology_sharing", "investment_deals", "strategic_partnerships"],
    waterSources: ["Desalination", "Water imports", "Deep aquifers"],
    dependencies: ["Water imports", "Technology", "International partnerships"],
    neighbors: ["Highland Federation", "Coastal Republic", "Mountain States"],
    flag: "🏜️",
  },
]

interface CountrySelectionProps {
  onCountrySelect: (country: Country) => void
  language: Language
}

export function CountrySelection({ onCountrySelect, language }: CountrySelectionProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const t = getTranslation(language)

  const sourceCountries = countries.filter((c) => c.type === "source")
  const downstreamCountries = countries.filter((c) => c.type === "downstream")

  const handleCountryClick = (country: Country) => {
    setSelectedCountry(country)
    setShowDetails(true)
  }

  const handleConfirmSelection = () => {
    if (selectedCountry) {
      onCountrySelect(selectedCountry)
    }
  }

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case "waterLevel":
        return <Droplets className="h-4 w-4 text-blue-500" />
      case "publicSupport":
        return <Users className="h-4 w-4 text-green-500" />
      case "economicHealth":
        return <Zap className="h-4 w-4 text-yellow-500" />
      case "environmentalHealth":
        return <Leaf className="h-4 w-4 text-green-600" />
      case "diplomaticRelations":
        return <Globe className="h-4 w-4 text-purple-500" />
      case "climateResilience":
        return <Shield className="h-4 w-4 text-blue-600" />
      case "waterControl":
        return <Mountain className="h-4 w-4 text-gray-600" />
      case "geopoliticalPower":
        return <TrendingUp className="h-4 w-4 text-red-500" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }

  const getStatColor = (value: number) => {
    if (value >= 70) return "text-green-600"
    if (value >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const getStatName = (stat: string) => {
    const statNames: Record<string, keyof typeof t> = {
      waterLevel: "waterLevel",
      publicSupport: "publicSupport",
      economicHealth: "economicHealth",
      environmentalHealth: "environmentalHealth",
      diplomaticRelations: "diplomaticRelations",
      climateResilience: "climateResilience",
      adaptationLevel: "adaptationLevel",
      waterControl: "waterControl",
      geopoliticalPower: "geopoliticalPower",
    }
    return t[statNames[stat]] || stat
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1" />
              <div className="flex-1 text-center">
                <CardTitle className="text-3xl font-bold text-blue-800">{t.chooseNation}</CardTitle>
              </div>
              <div className="flex-1 flex justify-end">
                <LanguageSelector currentLanguage={language} onLanguageChange={() => {}} />
              </div>
            </div>
            <CardDescription className="text-lg">{t.chooseNationDescription}</CardDescription>
          </CardHeader>
        </Card>

        {/* Source Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-6 w-6 text-blue-600" />
              {t.sourceCountries}
            </CardTitle>
            <CardDescription>{t.sourceCountriesDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {sourceCountries.map((country) => (
                <Card
                  key={country.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                  onClick={() => handleCountryClick(country)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{country.flag}</span>
                      {t.countries[country.id as keyof typeof t.countries].name}
                      <Badge variant="outline" className="ml-auto">
                        {t.source}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{t.countries[country.id as keyof typeof t.countries].region}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{t.countries[country.id as keyof typeof t.countries].description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-500" />
                          <span>
                            {t.waterLevel}: {country.startingStats.waterLevel}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mountain className="h-3 w-3 text-gray-600" />
                          <span>
                            {t.waterControl}: {country.startingStats.waterControl}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-red-500" />
                          <span>
                            {t.geopoliticalPower}: {country.startingStats.geopoliticalPower}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span>
                            {t.economicHealth}: {country.startingStats.economicHealth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Downstream Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="h-6 w-6 text-green-600" />
              {t.downstreamCountries}
            </CardTitle>
            <CardDescription>{t.downstreamCountriesDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {downstreamCountries.map((country) => (
                <Card
                  key={country.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
                  onClick={() => handleCountryClick(country)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{country.flag}</span>
                      {t.countries[country.id as keyof typeof t.countries].name}
                      <Badge variant="outline" className="ml-auto">
                        {t.downstream}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{t.countries[country.id as keyof typeof t.countries].region}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{t.countries[country.id as keyof typeof t.countries].description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-500" />
                          <span>
                            {t.waterLevel}: {country.startingStats.waterLevel}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mountain className="h-3 w-3 text-gray-600" />
                          <span>
                            {t.waterControl}: {country.startingStats.waterControl}%
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-red-500" />
                          <span>
                            {t.geopoliticalPower}: {country.startingStats.geopoliticalPower}%
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-yellow-500" />
                          <span>
                            {t.economicHealth}: {country.startingStats.economicHealth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Country Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedCountry && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <span className="text-3xl">{selectedCountry.flag}</span>
                    {t.countries[selectedCountry.id as keyof typeof t.countries].name}
                    <Badge variant={selectedCountry.type === "source" ? "default" : "secondary"}>
                      {selectedCountry.type === "source" ? t.source : t.downstream}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-lg">
                    {t.countries[selectedCountry.id as keyof typeof t.countries].region} •{" "}
                    {t.countries[selectedCountry.id as keyof typeof t.countries].description}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Starting Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t.startingStatistics}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(selectedCountry.startingStats).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-sm">
                            {getStatIcon(key)}
                            {getStatName(key)}
                          </span>
                          <span className={`font-semibold ${getStatColor(value)}`}>
                            {key === "resources" ? value : `${value}%`}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Strategic Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{t.strategicOverview}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-green-600 mb-2">{t.advantages}</h4>
                        <ul className="text-sm space-y-1">
                          {t.countries[selectedCountry.id as keyof typeof t.countries].advantages.map(
                            (advantage, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                {advantage}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold text-red-600 mb-2">{t.challenges}</h4>
                        <ul className="text-sm space-y-1">
                          {t.countries[selectedCountry.id as keyof typeof t.countries].challenges.map(
                            (challenge, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                {challenge}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Water Resources */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Droplets className="h-5 w-5 text-blue-500" />
                        {t.waterResources}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">{t.waterSources}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCountry.waterSources.map((source, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t.dependencies}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCountry.dependencies.map((dependency, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {dependency}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Diplomatic Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5 text-purple-500" />
                        {t.diplomaticCapabilities}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-2">{t.specialActions}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCountry.specialActions.map((action, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              {action.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t.diplomaticOptions}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCountry.diplomaticOptions.map((option, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {option.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">{t.neighboringCountries}</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCountry.neighbors.map((neighbor, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {neighbor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button variant="outline" onClick={() => setShowDetails(false)}>
                    {t.backToSelection}
                  </Button>
                  <Button onClick={handleConfirmSelection} className="bg-blue-600 hover:bg-blue-700">
                    {t.playAs} {t.countries[selectedCountry.id as keyof typeof t.countries].name}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
