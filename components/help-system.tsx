"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  HelpCircle,
  Search,
  BookOpen,
  Users,
  Target,
  BarChart,
  CloudRain,
  Zap,
  Droplets,
  Crown,
  AlertTriangle,
  Bot,
} from "lucide-react"

import { getTranslation, type Language } from "@/lib/i18n"

interface HelpTopic {
  id: string
  title: string
  content: string
  tags: string[]
  category: "basics" | "roles" | "mechanics" | "challenges" | "climate" | "interface"
}

const helpTopics: HelpTopic[] = [
  // Game Basics
  {
    id: "game-overview",
    title: "Game Overview",
    content:
      "Water Diplomacy Simulation is a strategic game where you manage water resources through diplomatic solutions. You'll take on different roles, make strategic decisions, and face dynamic challenges in a world affected by climate change and resource scarcity.",
    tags: ["overview", "introduction", "basics"],
    category: "basics",
  },
  {
    id: "objective",
    title: "Game Objective",
    content:
      "Your goal is to maintain a sustainable balance between water resources, economic health, environmental protection, and diplomatic relations. Success requires strategic thinking, adaptation to changing conditions, and effective management of multiple stakeholders' interests.",
    tags: ["goal", "objective", "winning"],
    category: "basics",
  },
  {
    id: "turn-structure",
    title: "Turn Structure",
    content:
      "Each turn represents a period of time in which you can take one action. After taking an action, random events may occur, challenges may be triggered, and climate conditions may change. The game progresses through these turns as you make decisions and respond to changing circumstances.",
    tags: ["turns", "rounds", "gameplay"],
    category: "basics",
  },
  // Country System
  {
    id: "country-selection",
    title: "Country Selection",
    content:
      "Choose between source countries (upstream) that control water resources, or downstream countries that depend on water flows. Each country type offers unique advantages, challenges, and strategic options that fundamentally change your gameplay experience.",
    tags: ["countries", "selection", "upstream", "downstream"],
    category: "basics",
  },
  {
    id: "source-countries",
    title: "Source Countries",
    content:
      "Source countries control river headwaters and have strong negotiating positions. They can build dams, control water releases, and charge for water access. However, they face international pressure for water sharing and environmental protection responsibilities.",
    tags: ["source", "upstream", "control", "dams"],
    category: "basics",
  },
  {
    id: "downstream-countries",
    title: "Downstream Countries",
    content:
      "Downstream countries depend on upstream water flows but may have other advantages like agricultural productivity, coastal access, or economic wealth. They can form coalitions, seek international arbitration, and invest in alternative water sources.",
    tags: ["downstream", "dependency", "coalition", "arbitration"],
    category: "basics",
  },

  // Roles
  {
    id: "roles-overview",
    title: "Roles Overview",
    content:
      "The game features four distinct roles, each with unique actions and perspectives: Government Official, Industry Representative, Environmental Advocate, and International Mediator. You can switch between roles to access different strategic options.",
    tags: ["roles", "characters", "positions"],
    category: "roles",
  },
  {
    id: "government-role",
    title: "Government Official",
    content:
      "As a Government Official, you focus on policy, regulation, and infrastructure. Your actions can significantly impact water management through rationing, infrastructure projects, regulations, and subsidies. You balance public support with effective resource management.",
    tags: ["government", "official", "policy", "regulation"],
    category: "roles",
  },
  {
    id: "industry-role",
    title: "Industry Representative",
    content:
      "The Industry Representative focuses on economic growth, technological innovation, and efficient resource use. Your actions include improving efficiency, implementing recycling programs, investing in technology, and forming partnerships to balance profit with sustainability.",
    tags: ["industry", "business", "economy", "technology"],
    category: "roles",
  },
  {
    id: "environmental-role",
    title: "Environmental Advocate",
    content:
      "As an Environmental Advocate, you champion conservation, ecosystem health, and sustainable practices. Your actions include launching conservation campaigns, ecosystem restoration, monitoring water quality, and using litigation to protect natural resources.",
    tags: ["environmental", "conservation", "ecology", "protection"],
    category: "roles",
  },
  {
    id: "international-role",
    title: "International Mediator",
    content:
      "The International Mediator works across borders to foster cooperation and resolve conflicts. Your actions focus on regional cooperation, conflict mediation, securing international funding, and establishing treaties to ensure equitable water sharing.",
    tags: ["international", "diplomatic", "mediator", "cooperation"],
    category: "roles",
  },

  // Game Mechanics
  {
    id: "resources",
    title: "Resources",
    content:
      "Resources represent your capacity to implement actions. Each action costs a specific amount of resources. You can gain resources through certain actions, successful challenges, and random events. Managing your resources effectively is crucial for long-term success.",
    tags: ["resources", "currency", "points", "economy"],
    category: "mechanics",
  },
  {
    id: "water-level",
    title: "Water Level",
    content:
      "Water Level represents the availability of water resources in your region. It's affected by your actions, climate events, and challenges. If water levels become too low, it triggers crises and affects other metrics. Maintaining adequate water levels is a primary concern.",
    tags: ["water", "resources", "level", "availability"],
    category: "mechanics",
  },
  {
    id: "public-support",
    title: "Public Support",
    content:
      "Public Support reflects how the population views your management. High support makes implementing policies easier, while low support can trigger protests and resistance. Actions that restrict access to resources often decrease support, while those that improve quality of life increase it.",
    tags: ["public", "support", "approval", "population"],
    category: "mechanics",
  },
  {
    id: "economic-health",
    title: "Economic Health",
    content:
      "Economic Health measures the prosperity and stability of the region's economy. Strong economic health provides more resources and options, while poor economic conditions limit your capabilities and can trigger social unrest.",
    tags: ["economy", "economic", "prosperity", "business"],
    category: "mechanics",
  },
  {
    id: "environmental-health",
    title: "Environmental Health",
    content:
      "Environmental Health tracks ecosystem integrity and natural resource sustainability. Poor environmental conditions affect water quality, trigger environmental challenges, and can lead to long-term resource depletion.",
    tags: ["environment", "ecosystem", "nature", "sustainability"],
    category: "mechanics",
  },
  {
    id: "diplomatic-relations",
    title: "Diplomatic Relations",
    content:
      "Diplomatic Relations represent your standing with neighboring regions and international bodies. Strong diplomatic ties enable cooperation on shared resources, while poor relations can lead to conflicts over water rights and reduced international support.",
    tags: ["diplomatic", "relations", "international", "cooperation"],
    category: "mechanics",
  },
  {
    id: "climate-resilience",
    title: "Climate Resilience",
    content:
      "Climate Resilience measures your region's ability to withstand and recover from climate events. Higher resilience reduces the impact of extreme weather and provides more options for adaptation to changing climate conditions.",
    tags: ["climate", "resilience", "adaptation", "weather"],
    category: "mechanics",
  },
  {
    id: "adaptation-level",
    title: "Adaptation Level",
    content:
      "Adaptation Level represents how well your infrastructure and policies are prepared for climate change. Higher adaptation levels provide bonuses when taking climate-related actions and reduce the negative impacts of climate events.",
    tags: ["adaptation", "climate", "preparation", "infrastructure"],
    category: "mechanics",
  },
  {
    id: "water-control",
    title: "Water Control",
    content:
      "Water Control represents your ability to influence regional water flows. Source countries start with high control through dams and infrastructure, while downstream countries have limited control but can increase it through cooperation and technology.",
    tags: ["control", "influence", "infrastructure", "cooperation"],
    category: "mechanics",
  },
  {
    id: "geopolitical-power",
    title: "Geopolitical Power",
    content:
      "Geopolitical Power measures your influence in regional and international affairs. It affects diplomatic success rates, ability to form coalitions, and resistance to external pressure. Power comes from economic strength, strategic resources, and alliances.",
    tags: ["power", "influence", "diplomacy", "alliances"],
    category: "mechanics",
  },
  {
    id: "hydro-diplomacy",
    title: "Hydro-Diplomacy",
    content:
      "Water resources create complex diplomatic relationships. Source countries can use water as leverage, while downstream countries may seek legal remedies or form coalitions. Success requires balancing national interests with regional cooperation.",
    tags: ["diplomacy", "leverage", "cooperation", "conflict"],
    category: "mechanics",
  },
  {
    id: "pollution-overview",
    title: "Pollution & Water Quality",
    content:
      "Water pollution is a major source of conflict between countries sharing water resources. Pollution can come from industrial discharge, agricultural runoff, urban sewage, and natural sources. Poor water quality affects public health, environmental integrity, and diplomatic relations.",
    tags: ["pollution", "quality", "contamination", "health"],
    category: "mechanics",
  },
  {
    id: "pollution-sources",
    title: "Pollution Sources",
    content:
      "Pollution sources are categorized as industrial (factories, mining), agricultural (fertilizers, pesticides), urban (sewage, runoff), or natural (erosion, algae). Each source has a severity level and may affect multiple countries if located near borders or upstream.",
    tags: ["sources", "industrial", "agricultural", "urban"],
    category: "mechanics",
  },
  {
    id: "cross-border-pollution",
    title: "Cross-Border Pollution",
    content:
      "Downstream countries often receive pollution from upstream activities. This creates diplomatic tensions and can lead to formal complaints, international arbitration, or economic sanctions. Source countries must balance economic development with environmental responsibility.",
    tags: ["cross-border", "diplomatic", "upstream", "downstream"],
    category: "mechanics",
  },
  {
    id: "water-treatment",
    title: "Water Treatment Capacity",
    content:
      "Water treatment capacity represents your ability to clean polluted water before it reaches consumers or the environment. Higher treatment capacity reduces health impacts and environmental damage but requires significant investment and ongoing costs.",
    tags: ["treatment", "capacity", "infrastructure", "health"],
    category: "mechanics",
  },
  {
    id: "pollution-disputes",
    title: "Water Quality Disputes",
    content:
      "Water quality disputes range from minor diplomatic concerns to critical international crises. Disputes can be resolved through mediation, treaties, compensation agreements, or legal action. Unresolved disputes damage diplomatic relations and can trigger sanctions.",
    tags: ["disputes", "diplomatic", "treaties", "legal"],
    category: "mechanics",
  },
  {
    id: "health-impacts",
    title: "Health Impacts of Pollution",
    content:
      "Water pollution causes health problems ranging from minor illness to serious medical emergencies. High health impacts reduce public support, increase healthcare costs, and can trigger international humanitarian concerns. Treatment facilities and pollution prevention are key solutions.",
    tags: ["health", "impacts", "medical", "public"],
    category: "mechanics",
  },
  {
    id: "environmental-damage",
    title: "Environmental Damage",
    content:
      "Pollution damages aquatic ecosystems, reduces biodiversity, and affects fisheries and tourism. Environmental damage has long-term economic consequences and can trigger international environmental protection measures. Ecosystem restoration can help reverse damage.",
    tags: ["environmental", "damage", "ecosystem", "biodiversity"],
    category: "mechanics",
  },
  {
    id: "pollution-actions",
    title: "Pollution Control Actions",
    content:
      "Each role has specific actions to address pollution: Government can enforce regulations and build treatment facilities, Industry can implement clean production, Environmental advocates can monitor and litigate, International mediators can negotiate treaties and resolve disputes.",
    tags: ["actions", "control", "regulations", "treaties"],
    category: "mechanics",
  },

  // Challenges
  {
    id: "challenges-overview",
    title: "Challenges Overview",
    content:
      "Challenges are dynamic events triggered by your actions, game conditions, or climate events. They present both risks and opportunities, requiring specific conditions to be met to succeed. Challenges have deadlines, complexity levels, and both rewards and penalties.",
    tags: ["challenges", "events", "missions", "tasks"],
    category: "challenges",
  },
  {
    id: "challenge-types",
    title: "Challenge Types",
    content:
      "There are five types of challenges: Immediate (urgent, short-term), Cascading (trigger follow-up events), Strategic (long-term planning), Crisis (high-stakes emergencies), and Climate (weather and climate-related). Each type requires different approaches and timeframes.",
    tags: ["challenge", "types", "categories", "varieties"],
    category: "challenges",
  },
  {
    id: "challenge-requirements",
    title: "Challenge Requirements",
    content:
      "Each challenge has specific requirements that must be met for successful completion. These may include reaching certain levels in game metrics (like water level or public support) or accumulating specific resources. Requirements scale with challenge complexity.",
    tags: ["requirements", "conditions", "success", "completion"],
    category: "challenges",
  },
  {
    id: "challenge-rewards",
    title: "Challenge Rewards & Penalties",
    content:
      "Successfully completing challenges provides rewards such as improved metrics or additional resources. Failing challenges results in penalties that can significantly impact your game state. More complex challenges offer greater rewards but also carry more severe penalties.",
    tags: ["rewards", "penalties", "consequences", "benefits"],
    category: "challenges",
  },

  // Climate System
  {
    id: "climate-overview",
    title: "Climate System Overview",
    content:
      "The climate system simulates changing weather patterns and long-term climate trends. It includes seasonal variations, extreme weather events, and gradual climate change that affects water availability, economic conditions, and environmental health.",
    tags: ["climate", "weather", "system", "environment"],
    category: "climate",
  },
  {
    id: "climate-events",
    title: "Climate Events",
    content:
      "Climate events include droughts, floods, heatwaves, storms, and wildfires. Each has different severity levels (minor, moderate, severe, extreme) and affects game metrics differently. Events have immediate effects, ongoing impacts during their duration, and long-term consequences.",
    tags: ["events", "weather", "disasters", "extreme"],
    category: "climate",
  },
  {
    id: "climate-trends",
    title: "Climate Trends",
    content:
      "Climate trends represent long-term changes in climate patterns. These include global warming, changing precipitation patterns, sea level rise, and ecosystem disruption. As trends progress, they reach thresholds that trigger permanent changes to game conditions.",
    tags: ["trends", "patterns", "long-term", "change"],
    category: "climate",
  },
  {
    id: "seasons",
    title: "Seasonal Effects",
    content:
      "The game cycles through four seasons (spring, summer, autumn, winter), each affecting temperature, precipitation, and other climate factors. Seasonal variations influence water availability and the likelihood of certain climate events.",
    tags: ["seasons", "cycle", "weather", "patterns"],
    category: "climate",
  },

  // Interface
  {
    id: "main-interface",
    title: "Main Interface",
    content:
      "The main interface displays your current role, resources, active challenges, and climate events. The header shows game turn information and provides access to the AI Advisor. The main area displays challenges and available actions, while the sidebar shows status indicators and logs.",
    tags: ["interface", "screen", "display", "layout"],
    category: "interface",
  },
  {
    id: "climate-status",
    title: "Climate Status Bar",
    content:
      "The Climate Status Bar displays current climate conditions including season, temperature, precipitation, climate stability, extreme weather risk, and global warming. These indicators help you anticipate climate events and plan adaptation strategies.",
    tags: ["climate", "status", "indicators", "weather"],
    category: "interface",
  },
  {
    id: "role-selection",
    title: "Role Selection",
    content:
      "The Role Selection panel allows you to switch between the four available roles. Each role provides access to different actions and strategies. You can switch roles at any time, but consider how role changes affect your ability to address active challenges.",
    tags: ["roles", "selection", "change", "switch"],
    category: "interface",
  },
  {
    id: "actions-panel",
    title: "Actions Panel",
    content:
      "The Actions Panel displays available actions for your current role. Each action shows its resource cost, tags indicating its focus areas, and expected impacts. Click 'Take Action' to implement the selected strategy and advance the game turn.",
    tags: ["actions", "decisions", "choices", "options"],
    category: "interface",
  },
  {
    id: "status-indicators",
    title: "Status Indicators",
    content:
      "Status Indicators in the sidebar display your current levels for Water, Public Support, Economic Health, Environmental Health, Diplomatic Relations, Climate Resilience, and Adaptation Level. Colors indicate status: green (good), yellow (caution), red (critical).",
    tags: ["status", "indicators", "metrics", "levels"],
    category: "interface",
  },
  {
    id: "game-log",
    title: "Game Log",
    content:
      "The Game Log records all significant events, actions, and developments in your game. Different message types are color-coded: actions (green), events (gray), AI recommendations (blue), crises (red), challenges (amber), successes (emerald), and climate events (orange).",
    tags: ["log", "history", "record", "messages"],
    category: "interface",
  },
  {
    id: "ai-advisor",
    title: "AI Advisor",
    content:
      "The AI Advisor provides strategic recommendations based on your current game state. It suggests actions to address challenges, respond to climate events, or improve critical metrics. Each recommendation includes impact and urgency ratings to help prioritize your decisions.",
    tags: ["advisor", "ai", "recommendations", "help"],
    category: "interface",
  },
]

interface HelpButtonProps {
  language: Language
}

export function HelpButton({ language }: HelpButtonProps) {
  const [open, setOpen] = useState(false)
  const t = getTranslation(language)

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setOpen(true)} className="relative" aria-label="Help">
        <HelpCircle className="h-5 w-5" />
      </Button>

      <HelpDialog open={open} setOpen={setOpen} language={language} />
    </>
  )
}

interface HelpDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  language: Language
}

function HelpDialog({ open, setOpen, language }: HelpDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTopics, setFilteredTopics] = useState<HelpTopic[]>(helpTopics)
  const [activeCategory, setActiveCategory] = useState("basics")
  const t = getTranslation(language)

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredTopics(helpTopics)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = helpTopics.filter(
        (topic) =>
          topic.title.toLowerCase().includes(query) ||
          topic.content.toLowerCase().includes(query) ||
          topic.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
      setFilteredTopics(filtered)
    }
  }, [searchQuery])

  const getCategoryTopics = (category: string) => {
    if (searchQuery.trim() === "") {
      return helpTopics.filter((topic) => topic.category === category)
    }
    return filteredTopics.filter((topic) => topic.category === category)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "basics":
        return <BookOpen className="h-4 w-4" />
      case "roles":
        return <Users className="h-4 w-4" />
      case "mechanics":
        return <BarChart className="h-4 w-4" />
      case "challenges":
        return <Target className="h-4 w-4" />
      case "climate":
        return <CloudRain className="h-4 w-4" />
      case "interface":
        return <Zap className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6" />
            {t("help.title")}
          </DialogTitle>
          <DialogDescription>{t("help.description")}</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("help.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-6">
            <TabsTrigger value="basics" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">{t("help.basics")}</span>
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">{t("help.roles")}</span>
            </TabsTrigger>
            <TabsTrigger value="mechanics" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span className="hidden sm:inline">{t("help.mechanics")}</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">{t("help.challenges")}</span>
            </TabsTrigger>
            <TabsTrigger value="climate" className="flex items-center gap-1">
              <CloudRain className="h-4 w-4" />
              <span className="hidden sm:inline">{t("help.climate")}</span>
            </TabsTrigger>
            <TabsTrigger value="interface" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">{t("help.interface")}</span>
            </TabsTrigger>
          </TabsList>

          {["basics", "roles", "mechanics", "challenges", "climate", "interface"].map((category) => (
            <TabsContent key={category} value={category} className="flex-1 overflow-hidden">
              <ScrollArea className="h-[60vh]">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <h2 className="text-xl font-semibold capitalize">{category}</h2>
                  </div>

                  {searchQuery && getCategoryTopics(category).length === 0 ? (
                    <p className="text-muted-foreground italic">{t("help.noTopics")}</p>
                  ) : (
                    <Accordion type="single" collapsible className="w-full">
                      {getCategoryTopics(category).map((topic) => (
                        <AccordionItem key={topic.id} value={topic.id}>
                          <AccordionTrigger>{topic.title}</AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm mb-4">{topic.content}</p>
                            <div className="flex flex-wrap gap-2">
                              {topic.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {filteredTopics.length} {t("help.topicsAvailable")}
          </div>
          <Button onClick={() => setOpen(false)}>{t("help.close")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface QuickHelpTipsProps {
  language: Language
}

export function QuickHelpTips({ language }: QuickHelpTipsProps) {
  const t = getTranslation(language)
  return (
    <div className="space-y-3 p-4 border rounded-lg bg-blue-50 border-blue-200">
      <h3 className="font-semibold flex items-center gap-2">
        <HelpCircle className="h-4 w-4" />
        {t("quickTips.title")}
      </h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <Droplets className="h-4 w-4 text-blue-500 mt-0.5" />
          <span>{t("quickTips.tip1")}</span>
        </li>
        <li className="flex items-start gap-2">
          <Crown className="h-4 w-4 text-blue-500 mt-0.5" />
          <span>{t("quickTips.tip2")}</span>
        </li>
        <li className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
          <span>{t("quickTips.tip3")}</span>
        </li>
        <li className="flex items-start gap-2">
          <Bot className="h-4 w-4 text-purple-500 mt-0.5" />
          <span>{t("quickTips.tip4")}</span>
        </li>
      </ul>
      <Separator />
      <p className="text-xs text-muted-foreground">{t("quickTips.footer")}</p>
    </div>
  )
}
