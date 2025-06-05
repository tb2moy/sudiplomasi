export type Language = "en" | "tr"

export interface Translations {
  // Header
  gameTitle: string
  gameDescription: string
  turn: string
  resources: string
  aiAdvisor: string
  help: string

  // Country Selection
  chooseNation: string
  chooseNationDescription: string
  sourceCountries: string
  sourceCountriesDescription: string
  downstreamCountries: string
  downstreamCountriesDescription: string
  source: string
  downstream: string
  playAs: string
  backToSelection: string
  startingStatistics: string
  strategicOverview: string
  advantages: string
  challenges: string
  waterResources: string
  waterSources: string
  dependencies: string
  diplomaticCapabilities: string
  specialActions: string
  diplomaticOptions: string
  neighboringCountries: string

  // Game Interface
  currentRole: string
  availableActions: string
  availableActionsDescription: string
  takeAction: string
  insufficientResources: string
  actionTaken: string
  switchedTo: string
  manualRoleSwitch: string

  // Roles
  governmentOfficial: string
  industryRepresentative: string
  environmentalAdvocate: string
  internationalMediator: string

  // Actions
  implementWaterRationing: string
  buildWaterInfrastructure: string
  constructStrategicDam: string
  controlWaterReleases: string
  formDownstreamCoalition: string
  seekInternationalArbitration: string
  improveWaterEfficiency: string
  expandHydroelectricPower: string
  expandDesalinationCapacity: string
  establishWaterImportSystem: string
  launchConservationCampaign: string
  glacierProtectionInitiative: string
  deltaEcosystemRestoration: string
  biodiversityProtectionInitiative: string
  regionalWaterCooperation: string
  implementWaterPricing: string
  demandUpstreamCompensation: string
  technologySharingAgreement: string
  enforcePollutionRegulations: string
  implementWaterQualityStandards: string
  buildTreatmentFacilities: string
  implementCleanProduction: string
  industrialDischargeMonitoring: string
  industrialWastewaterTreatment: string
  waterQualityMonitoringNetwork: string
  aquaticEcosystemRestoration: string
  pollutionLitigationCampaign: string
  waterQualityTreaty: string
  crossBorderPollutionMediation: string
  fileDiplomaticProtest: string

  // Status Indicators
  regionalStatus: string
  waterLevel: string
  publicSupport: string
  economicHealth: string
  environmentalHealth: string
  diplomaticRelations: string
  waterControl: string
  geopoliticalPower: string
  climateResilience: string
  adaptationLevel: string

  // Water Quality
  waterQualityStatus: string
  waterQuality: string
  showDetails: string
  hideDetails: string
  pollutionSources: string
  impacts: string
  disputes: string
  contaminationSources: string
  monitoring: string
  domesticSources: string
  crossBorderSources: string
  noDomesticSources: string
  noCrossBorderSources: string
  waterTreatmentCapacity: string
  waterTreatmentCapacityDescription: string
  monitorSources: string
  improveTreatment: string
  publicHealthImpacts: string
  environmentalDamage: string
  economicConsequences: string
  tourismImpact: string
  fisheriesImpact: string
  addressHealthIssues: string
  restoreEcosystems: string
  internationalWaterQualityDisputes: string
  status: string
  internationalStandardsCompliance: string
  compliant: string
  nonCompliant: string
  affectedRelations: string
  noDisputesDetected: string
  pollutionSource: string
  pollutionSources2: string

  // Pollution Levels
  excellent: string
  good: string
  fair: string
  poor: string
  critical: string
  low: string
  moderate: string
  significant: string
  high: string
  severe: string

  // Dispute Levels
  none: string
  minor: string
  critical2: string

  // Game Log
  gameLog: string
  welcomeMessage: string
  downstreamWelcome: string
  sourceWelcome: string

  // AI Recommendations
  aiAdvisorRecommendations: string
  dismissRecommendations: string
  impact: string
  urgency: string
  apply: string

  // Quick Help
  quickTips: string
  monitorWaterLevels: string
  switchRolesStrategically: string
  prepareForClimateEvents: string
  useAiAdvisor: string
  clickHelpButton: string

  // Countries
  countries: {
    alpinia: {
      name: string
      region: string
      description: string
      advantages: string[]
      challenges: string[]
    }
    highland_federation: {
      name: string
      region: string
      description: string
      advantages: string[]
      challenges: string[]
    }
    riverlandia: {
      name: string
      region: string
      description: string
      advantages: string[]
      challenges: string[]
    }
    deltopia: {
      name: string
      region: string
      description: string
      advantages: string[]
      challenges: string[]
    }
    desert_emirates: {
      name: string
      region: string
      description: string
      advantages: string[]
      challenges: string[]
    }
  }

  // Events and Messages
  events: {
    heavyRainfall: string
    industrialAccident: string
    publicProtests: string
    internationalAid: string
    newTechnology: string
    climateResearch: string
    industrialDischarge: string
    agriculturalRunoff: string
    crossBorderComplaint: string
    urbanSewageOverflow: string
  }

  // Pollution Events
  pollutionEvents: {
    industrialDischargeIncident: string
    agriculturalRunoffSurge: string
    crossBorderPollutionComplaint: string
    urbanSewageOverflow: string
  }

  // Tags
  tags: {
    regulation: string
    emergency: string
    publicPolicy: string
    infrastructure: string
    longTerm: string
    investment: string
    control: string
    diplomatic: string
    sourceOnly: string
    coalition: string
    downstreamOnly: string
    legal: string
    international: string
    efficiency: string
    technology: string
    sustainable: string
    energy: string
    adaptation: string
    trade: string
    dependency: string
    conservation: string
    awareness: string
    public: string
    climate: string
    protection: string
    restoration: string
    ecosystem: string
    biodiversity: string
    cooperation: string
    regional: string
    economic: string
    pricing: string
    compensation: string
    wealthyOnly: string
    pollution: string
    enforcement: string
    standards: string
    quality: string
    treatment: string
    health: string
    industry: string
    monitoring: string
    treaty: string
    mediation: string
    protest: string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    gameTitle: "Water Diplomacy Simulation",
    gameDescription: "Managing water resources and quality through diplomatic solutions",
    turn: "Turn",
    resources: "Resources",
    aiAdvisor: "AI Advisor",
    help: "Help",

    // Country Selection
    chooseNation: "Choose Your Nation",
    chooseNationDescription:
      "Select a country to experience the hydro-political simulation from different perspectives",
    sourceCountries: "Source Countries (Upstream)",
    sourceCountriesDescription:
      "Control water sources and have strong negotiating positions, but face environmental pressures",
    downstreamCountries: "Downstream Countries",
    downstreamCountriesDescription:
      "Depend on upstream water flows but may have other economic or strategic advantages",
    source: "Source",
    downstream: "Downstream",
    playAs: "Play as",
    backToSelection: "Back to Selection",
    startingStatistics: "Starting Statistics",
    strategicOverview: "Strategic Overview",
    advantages: "Advantages",
    challenges: "Challenges",
    waterResources: "Water Resources",
    waterSources: "Water Sources",
    dependencies: "Dependencies",
    diplomaticCapabilities: "Diplomatic Capabilities",
    specialActions: "Special Actions",
    diplomaticOptions: "Diplomatic Options",
    neighboringCountries: "Neighboring Countries",

    // Game Interface
    currentRole: "Current Role",
    availableActions: "Available Actions",
    availableActionsDescription: "Choose your strategy to address water crisis, pollution, and diplomatic challenges",
    takeAction: "Take Action",
    insufficientResources: "Insufficient resources to take this action!",
    actionTaken: "Action taken",
    switchedTo: "Switched to",
    manualRoleSwitch: "Manual role switch",

    // Roles
    governmentOfficial: "Government Official",
    industryRepresentative: "Industry Representative",
    environmentalAdvocate: "Environmental Advocate",
    internationalMediator: "International Mediator",

    // Actions
    implementWaterRationing: "Implement Water Rationing",
    buildWaterInfrastructure: "Build Water Infrastructure",
    constructStrategicDam: "Construct Strategic Dam",
    controlWaterReleases: "Control Water Releases",
    formDownstreamCoalition: "Form Downstream Coalition",
    seekInternationalArbitration: "Seek International Arbitration",
    improveWaterEfficiency: "Improve Water Efficiency",
    expandHydroelectricPower: "Expand Hydroelectric Power",
    expandDesalinationCapacity: "Expand Desalination Capacity",
    establishWaterImportSystem: "Establish Water Import System",
    launchConservationCampaign: "Launch Conservation Campaign",
    glacierProtectionInitiative: "Glacier Protection Initiative",
    deltaEcosystemRestoration: "Delta Ecosystem Restoration",
    biodiversityProtectionInitiative: "Biodiversity Protection Initiative",
    regionalWaterCooperation: "Regional Water Cooperation",
    implementWaterPricing: "Implement Water Pricing",
    demandUpstreamCompensation: "Demand Upstream Compensation",
    technologySharingAgreement: "Technology Sharing Agreement",
    enforcePollutionRegulations: "Enforce Pollution Regulations",
    implementWaterQualityStandards: "Implement Water Quality Standards",
    buildTreatmentFacilities: "Build Treatment Facilities",
    implementCleanProduction: "Implement Clean Production",
    industrialDischargeMonitoring: "Industrial Discharge Monitoring",
    industrialWastewaterTreatment: "Industrial Wastewater Treatment",
    waterQualityMonitoringNetwork: "Water Quality Monitoring Network",
    aquaticEcosystemRestoration: "Aquatic Ecosystem Restoration",
    pollutionLitigationCampaign: "Pollution Litigation Campaign",
    waterQualityTreaty: "Water Quality Treaty",
    crossBorderPollutionMediation: "Cross-Border Pollution Mediation",
    fileDiplomaticProtest: "File Diplomatic Protest",

    // Status Indicators
    regionalStatus: "Regional Status",
    waterLevel: "Water Level",
    publicSupport: "Public Support",
    economicHealth: "Economic Health",
    environmentalHealth: "Environmental Health",
    diplomaticRelations: "Diplomatic Relations",
    waterControl: "Water Control",
    geopoliticalPower: "Geopolitical Power",
    climateResilience: "Climate Resilience",
    adaptationLevel: "Adaptation Level",

    // Water Quality
    waterQualityStatus: "Water Quality Status",
    waterQuality: "Water Quality",
    showDetails: "Show Details",
    hideDetails: "Hide Details",
    pollutionSources: "Pollution Sources",
    impacts: "Impacts",
    disputes: "Disputes",
    contaminationSources: "Contamination Sources",
    monitoring: "Monitoring",
    domesticSources: "Domestic Sources",
    crossBorderSources: "Cross-Border Sources",
    noDomesticSources: "No significant local pollution sources detected.",
    noCrossBorderSources: "No cross-border pollution sources detected.",
    waterTreatmentCapacity: "Water Treatment Capacity",
    waterTreatmentCapacityDescription: "Current capacity to process and clean water",
    monitorSources: "Monitor Sources",
    improveTreatment: "Improve Treatment",
    publicHealthImpacts: "Public Health Impacts",
    environmentalDamage: "Environmental Damage",
    economicConsequences: "Economic Consequences",
    tourismImpact: "Tourism Impact",
    fisheriesImpact: "Fisheries Impact",
    addressHealthIssues: "Address Health Issues",
    restoreEcosystems: "Restore Ecosystems",
    internationalWaterQualityDisputes: "International Water Quality Disputes",
    status: "Status",
    internationalStandardsCompliance: "International Standards Compliance",
    compliant: "Compliant",
    nonCompliant: "Non-compliant",
    affectedRelations: "Affected Relations",
    noDisputesDetected: "No cross-border pollution disputes detected.",
    pollutionSource: "pollution source",
    pollutionSources2: "pollution sources",

    // Pollution Levels
    excellent: "Excellent",
    good: "Good",
    fair: "Fair",
    poor: "Poor",
    critical: "Critical",
    low: "Low",
    moderate: "Moderate",
    significant: "Significant",
    high: "High",
    severe: "Severe",

    // Dispute Levels
    none: "none",
    minor: "minor",
    critical2: "critical",

    // Game Log
    gameLog: "Game Log",
    welcomeMessage: "You are now leading this",
    downstreamWelcome:
      "As a downstream country, you're receiving water that may be polluted by upstream activities. Monitor water quality closely.",
    sourceWelcome:
      "As a source country, your activities can affect downstream water quality. Be mindful of potential diplomatic consequences.",

    // AI Recommendations
    aiAdvisorRecommendations: "AI Advisor Recommendations",
    dismissRecommendations: "Dismiss Recommendations",
    impact: "Impact",
    urgency: "Urgency",
    apply: "Apply",

    // Quick Help
    quickTips: "Quick Tips",
    monitorWaterLevels: "Monitor your water levels closely - they affect all other metrics",
    switchRolesStrategically: "Switch roles strategically to access different actions",
    prepareForClimateEvents: "Prepare for climate events by investing in resilience",
    useAiAdvisor: "Use the AI Advisor when you're unsure about your next move",
    clickHelpButton: "Click the help button for detailed game information",

    // Countries
    countries: {
      alpinia: {
        name: "Alpinia",
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
      },
      highland_federation: {
        name: "Highland Federation",
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
      },
      riverlandia: {
        name: "Riverlandia",
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
      },
      deltopia: {
        name: "Deltopia",
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
      },
      desert_emirates: {
        name: "Desert Emirates",
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
      },
    },

    // Events and Messages
    events: {
      heavyRainfall: "Heavy rainfall increases water reserves by 10%",
      industrialAccident: "Industrial accident contaminates water supply",
      publicProtests: "Public protests demand better water management",
      internationalAid: "International aid package approved",
      newTechnology: "New water-efficient technology discovered",
      climateResearch: "Climate research breakthrough improves adaptation",
      industrialDischarge: "A factory has illegally discharged untreated wastewater into the river system.",
      agriculturalRunoff: "Heavy rains have washed fertilizers and pesticides from farmlands into water sources.",
      crossBorderComplaint:
        "A neighboring country has filed a formal complaint about water pollution from your territory.",
      urbanSewageOverflow: "Heavy rainfall has caused urban sewage systems to overflow into water sources.",
    },

    // Pollution Events
    pollutionEvents: {
      industrialDischargeIncident: "Industrial Discharge Incident",
      agriculturalRunoffSurge: "Agricultural Runoff Surge",
      crossBorderPollutionComplaint: "Cross-Border Pollution Complaint",
      urbanSewageOverflow: "Urban Sewage Overflow",
    },

    // Tags
    tags: {
      regulation: "regulation",
      emergency: "emergency",
      publicPolicy: "public policy",
      infrastructure: "infrastructure",
      longTerm: "long term",
      investment: "investment",
      control: "control",
      diplomatic: "diplomatic",
      sourceOnly: "source only",
      coalition: "coalition",
      downstreamOnly: "downstream only",
      legal: "legal",
      international: "international",
      efficiency: "efficiency",
      technology: "technology",
      sustainable: "sustainable",
      energy: "energy",
      adaptation: "adaptation",
      trade: "trade",
      dependency: "dependency",
      conservation: "conservation",
      awareness: "awareness",
      public: "public",
      climate: "climate",
      protection: "protection",
      restoration: "restoration",
      ecosystem: "ecosystem",
      biodiversity: "biodiversity",
      cooperation: "cooperation",
      regional: "regional",
      economic: "economic",
      pricing: "pricing",
      compensation: "compensation",
      wealthyOnly: "wealthy only",
      pollution: "pollution",
      enforcement: "enforcement",
      standards: "standards",
      quality: "quality",
      treatment: "treatment",
      health: "health",
      industry: "industry",
      monitoring: "monitoring",
      treaty: "treaty",
      mediation: "mediation",
      protest: "protest",
    },
  },
  tr: {
    // Header
    gameTitle: "Su Diplomasisi Simülasyonu",
    gameDescription: "Su kaynaklarını ve kalitesini diplomatik çözümlerle yönetme",
    turn: "Tur",
    resources: "Kaynaklar",
    aiAdvisor: "AI Danışman",
    help: "Yardım",

    // Country Selection
    chooseNation: "Ülkenizi Seçin",
    chooseNationDescription: "Hidro-politik simülasyonu farklı perspektiflerden deneyimlemek için bir ülke seçin",
    sourceCountries: "Kaynak Ülkeler (Yukarı Akım)",
    sourceCountriesDescription:
      "Su kaynaklarını kontrol eder ve güçlü müzakere pozisyonlarına sahiptir, ancak çevresel baskılarla karşı karşıyadır",
    downstreamCountries: "Aşağı Akım Ülkeleri",
    downstreamCountriesDescription:
      "Yukarı akım su akışlarına bağımlıdır ancak diğer ekonomik veya stratejik avantajlara sahip olabilir",
    source: "Kaynak",
    downstream: "Aşağı Akım",
    playAs: "Olarak Oyna",
    backToSelection: "Seçime Geri Dön",
    startingStatistics: "Başlangıç İstatistikleri",
    strategicOverview: "Stratejik Genel Bakış",
    advantages: "Avantajlar",
    challenges: "Zorluklar",
    waterResources: "Su Kaynakları",
    waterSources: "Su Kaynakları",
    dependencies: "Bağımlılıklar",
    diplomaticCapabilities: "Diplomatik Yetenekler",
    specialActions: "Özel Eylemler",
    diplomaticOptions: "Diplomatik Seçenekler",
    neighboringCountries: "Komşu Ülkeler",

    // Game Interface
    currentRole: "Mevcut Rol",
    availableActions: "Mevcut Eylemler",
    availableActionsDescription: "Su krizi, kirlilik ve diplomatik zorluklarla başa çıkmak için stratejinizi seçin",
    takeAction: "Eylem Al",
    insufficientResources: "Bu eylemi gerçekleştirmek için yeterli kaynak yok!",
    actionTaken: "Eylem alındı",
    switchedTo: "Şuna geçildi",
    manualRoleSwitch: "Manuel rol değişimi",

    // Roles
    governmentOfficial: "Hükümet Yetkilisi",
    industryRepresentative: "Endüstri Temsilcisi",
    environmentalAdvocate: "Çevre Savunucusu",
    internationalMediator: "Uluslararası Arabulucu",

    // Actions
    implementWaterRationing: "Su Kısıtlaması Uygula",
    buildWaterInfrastructure: "Su Altyapısı İnşa Et",
    constructStrategicDam: "Stratejik Baraj İnşa Et",
    controlWaterReleases: "Su Salınımını Kontrol Et",
    formDownstreamCoalition: "Aşağı Akım Koalisyonu Oluştur",
    seekInternationalArbitration: "Uluslararası Tahkim Ara",
    improveWaterEfficiency: "Su Verimliliğini Artır",
    expandHydroelectricPower: "Hidroelektrik Gücünü Genişlet",
    expandDesalinationCapacity: "Tuzdan Arındırma Kapasitesini Genişlet",
    establishWaterImportSystem: "Su İthalat Sistemi Kur",
    launchConservationCampaign: "Koruma Kampanyası Başlat",
    glacierProtectionInitiative: "Buzul Koruma Girişimi",
    deltaEcosystemRestoration: "Delta Ekosistem Restorasyonu",
    biodiversityProtectionInitiative: "Biyoçeşitlilik Koruma Girişimi",
    regionalWaterCooperation: "Bölgesel Su İşbirliği",
    implementWaterPricing: "Su Fiyatlandırması Uygula",
    demandUpstreamCompensation: "Yukarı Akım Tazminatı Talep Et",
    technologySharingAgreement: "Teknoloji Paylaşım Anlaşması",
    enforcePollutionRegulations: "Kirlilik Düzenlemelerini Uygula",
    implementWaterQualityStandards: "Su Kalitesi Standartları Uygula",
    buildTreatmentFacilities: "Arıtma Tesisleri İnşa Et",
    implementCleanProduction: "Temiz Üretim Uygula",
    industrialDischargeMonitoring: "Endüstriyel Deşarj İzleme",
    industrialWastewaterTreatment: "Endüstriyel Atık Su Arıtma",
    waterQualityMonitoringNetwork: "Su Kalitesi İzleme Ağı",
    aquaticEcosystemRestoration: "Sucul Ekosistem Restorasyonu",
    pollutionLitigationCampaign: "Kirlilik Dava Kampanyası",
    waterQualityTreaty: "Su Kalitesi Anlaşması",
    crossBorderPollutionMediation: "Sınır Ötesi Kirlilik Arabuluculuğu",
    fileDiplomaticProtest: "Diplomatik Protesto Başvurusu",

    // Status Indicators
    regionalStatus: "Bölgesel Durum",
    waterLevel: "Su Seviyesi",
    publicSupport: "Halk Desteği",
    economicHealth: "Ekonomik Sağlık",
    environmentalHealth: "Çevresel Sağlık",
    diplomaticRelations: "Diplomatik İlişkiler",
    waterControl: "Su Kontrolü",
    geopoliticalPower: "Jeopolitik Güç",
    climateResilience: "İklim Direnci",
    adaptationLevel: "Adaptasyon Seviyesi",

    // Water Quality
    waterQualityStatus: "Su Kalitesi Durumu",
    waterQuality: "Su Kalitesi",
    showDetails: "Detayları Göster",
    hideDetails: "Detayları Gizle",
    pollutionSources: "Kirlilik Kaynakları",
    impacts: "Etkiler",
    disputes: "Anlaşmazlıklar",
    contaminationSources: "Kontaminasyon Kaynakları",
    monitoring: "İzleme",
    domesticSources: "Yerel Kaynaklar",
    crossBorderSources: "Sınır Ötesi Kaynaklar",
    noDomesticSources: "Önemli yerel kirlilik kaynağı tespit edilmedi.",
    noCrossBorderSources: "Sınır ötesi kirlilik kaynağı tespit edilmedi.",
    waterTreatmentCapacity: "Su Arıtma Kapasitesi",
    waterTreatmentCapacityDescription: "Suyu işleme ve temizleme mevcut kapasitesi",
    monitorSources: "Kaynakları İzle",
    improveTreatment: "Arıtmayı İyileştir",
    publicHealthImpacts: "Halk Sağlığı Etkileri",
    environmentalDamage: "Çevresel Hasar",
    economicConsequences: "Ekonomik Sonuçlar",
    tourismImpact: "Turizm Etkisi",
    fisheriesImpact: "Balıkçılık Etkisi",
    addressHealthIssues: "Sağlık Sorunlarını Ele Al",
    restoreEcosystems: "Ekosistemleri Restore Et",
    internationalWaterQualityDisputes: "Uluslararası Su Kalitesi Anlaşmazlıkları",
    status: "Durum",
    internationalStandardsCompliance: "Uluslararası Standartlara Uyum",
    compliant: "Uyumlu",
    nonCompliant: "Uyumsuz",
    affectedRelations: "Etkilenen İlişkiler",
    noDisputesDetected: "Sınır ötesi kirlilik anlaşmazlığı tespit edilmedi.",
    pollutionSource: "kirlilik kaynağı",
    pollutionSources2: "kirlilik kaynağı",

    // Pollution Levels
    excellent: "Mükemmel",
    good: "İyi",
    fair: "Orta",
    poor: "Kötü",
    critical: "Kritik",
    low: "Düşük",
    moderate: "Orta",
    significant: "Önemli",
    high: "Yüksek",
    severe: "Şiddetli",

    // Dispute Levels
    none: "yok",
    minor: "küçük",
    critical2: "kritik",

    // Game Log
    gameLog: "Oyun Günlüğü",
    welcomeMessage: "artık bu",
    downstreamWelcome:
      "Aşağı akım ülkesi olarak, yukarı akım faaliyetleri tarafından kirletilmiş olabilecek su alıyorsunuz. Su kalitesini yakından izleyin.",
    sourceWelcome:
      "Kaynak ülke olarak, faaliyetleriniz aşağı akım su kalitesini etkileyebilir. Potansiyel diplomatik sonuçlara dikkat edin.",

    // AI Recommendations
    aiAdvisorRecommendations: "AI Danışman Önerileri",
    dismissRecommendations: "Önerileri Kapat",
    impact: "Etki",
    urgency: "Aciliyet",
    apply: "Uygula",

    // Quick Help
    quickTips: "Hızlı İpuçları",
    monitorWaterLevels: "Su seviyelerinizi yakından izleyin - diğer tüm metrikleri etkiler",
    switchRolesStrategically: "Farklı eylemlere erişmek için stratejik olarak rol değiştirin",
    prepareForClimateEvents: "Dirençlilik yatırımı yaparak iklim olaylarına hazırlanın",
    useAiAdvisor: "Bir sonraki hamlenizden emin olmadığınızda AI Danışmanı kullanın",
    clickHelpButton: "Detaylı oyun bilgisi için yardım butonuna tıklayın",

    // Countries
    countries: {
      alpinia: {
        name: "Alpinia",
        region: "Dağlık Yaylalar",
        description:
          "Üç büyük nehir sisteminin su kaynaklarını kontrol eden dağlık bir ülke. Tatlı su kaynaklarında zengin ancak iklim kaynaklı buzul erimesiyle karşı karşıya.",
        advantages: [
          "Büyük nehir kaynaklarını kontrol eder",
          "Bol tatlı su rezervleri",
          "Hidroelektrik potansiyeli",
          "Güçlü müzakere pozisyonu",
          "Bozulmamış doğadan turizm geliri",
        ],
        challenges: [
          "İklim değişikliğinin buzulları etkilemesi",
          "Su paylaşımı için uluslararası baskı",
          "Sınırlı tarım arazisi",
          "Mevsimsel su akış değişimleri",
          "Çevre koruma maliyetleri",
        ],
      },
      highland_federation: {
        name: "Yayla Federasyonu",
        region: "Kuzey Platosu",
        description:
          "Geniş yayla havzalarını kontrol eden federal bir devlet. Su ihracat gelirlerini yerel ihtiyaçlar ve çevre koruma ile dengeler.",
        advantages: [
          "Çoklu nehir sistemi kontrolü",
          "Su ihracat gelirleri",
          "Güçlü federal kurumlar",
          "Gelişmiş su yönetimi",
          "Bölgesel etki",
        ],
        challenges: [
          "Federal ve eyalet su hakları",
          "Aşağı akım diplomatik baskısı",
          "Altyapı bakım maliyetleri",
          "Çevresel bozulma",
          "İklim adaptasyon ihtiyaçları",
        ],
      },
      riverlandia: {
        name: "Nehirland",
        region: "Merkezi Nehir Vadisi",
        description:
          "Yukarı akım su akışlarına bağımlı tarımsal bir güç. Yukarı akım gelişimi ve iklim değişikliği nedeniyle artan su stresiyle karşı karşıya.",
        advantages: [
          "Verimli tarım arazileri",
          "Kurulu sulama sistemleri",
          "Gıda ihracat yetenekleri",
          "Stratejik nehir konumu",
          "Güçlü tarım ekonomisi",
        ],
        challenges: [
          "Yukarı akım su bağımlılığı",
          "Mevsimsel akış değişimleri",
          "Tarımsal su talepleri",
          "Sel ve kuraklık döngüleri",
          "Sınırlı su depolama",
        ],
      },
      deltopia: {
        name: "Deltopia",
        region: "Nehir Deltası",
        description:
          "Nehir ağzında yoğun nüfuslu bir delta ülkesi. Hem su kıtlığına hem de sele karşı son derece savunmasız, önemli ekonomik ve çevresel zorluklarla.",
        advantages: [
          "Stratejik kıyı konumu",
          "Büyük liman tesisleri",
          "Balıkçılık endüstrisi",
          "Delta tarımı",
          "Uluslararası ticaret merkezi",
        ],
        challenges: [
          "Aşırı su savunmasızlığı",
          "Deniz seviyesi yükselme tehditleri",
          "Tuzlu su sızması",
          "Yoğun nüfus baskısı",
          "Sınırlı tatlı su kaynakları",
        ],
      },
      desert_emirates: {
        name: "Çöl Emirlikleri",
        region: "Kurak Ovalar",
        description:
          "Su kaynaklarını güvence altına almak için teknoloji ve diplomasiye dayanan zengin ama su kıt bir ülke. Su altyapısını finanse etmek için petrol zenginliğini kullanır.",
        advantages: [
          "Su projeleri için petrol zenginliği",
          "Gelişmiş tuzdan arındırma teknolojisi",
          "Güçlü uluslararası ilişkiler",
          "Verimli su kullanım sistemleri",
          "İnovasyona yatırım",
        ],
        challenges: [
          "Aşırı su kıtlığı",
          "Yüksek altyapı maliyetleri",
          "Enerji yoğun su üretimi",
          "Sınırlı doğal su kaynakları",
          "İklim savunmasızlığı",
        ],
      },
    },

    // Events and Messages
    events: {
      heavyRainfall: "Şiddetli yağmur su rezervlerini %10 artırıyor",
      industrialAccident: "Endüstriyel kaza su kaynağını kirletiyor",
      publicProtests: "Halk protestoları daha iyi su yönetimi talep ediyor",
      internationalAid: "Uluslararası yardım paketi onaylandı",
      newTechnology: "Yeni su verimli teknoloji keşfedildi",
      climateResearch: "İklim araştırması atılımı adaptasyonu geliştiriyor",
      industrialDischarge: "Bir fabrika nehir sistemine arıtılmamış atık su yasadışı olarak deşarj etti.",
      agriculturalRunoff: "Şiddetli yağmurlar tarım arazilerinden gübre ve pestisitleri su kaynaklarına taşıdı.",
      crossBorderComplaint:
        "Komşu bir ülke topraklarınızdan kaynaklanan su kirliliği hakkında resmi şikayette bulundu.",
      urbanSewageOverflow: "Şiddetli yağmur kentsel kanalizasyon sistemlerinin su kaynaklarına taşmasına neden oldu.",
    },

    // Pollution Events
    pollutionEvents: {
      industrialDischargeIncident: "Endüstriyel Deşarj Olayı",
      agriculturalRunoffSurge: "Tarımsal Akış Artışı",
      crossBorderPollutionComplaint: "Sınır Ötesi Kirlilik Şikayeti",
      urbanSewageOverflow: "Kentsel Kanalizasyon Taşması",
    },

    // Tags
    tags: {
      regulation: "düzenleme",
      emergency: "acil durum",
      publicPolicy: "kamu politikası",
      infrastructure: "altyapı",
      longTerm: "uzun vadeli",
      investment: "yatırım",
      control: "kontrol",
      diplomatic: "diplomatik",
      sourceOnly: "sadece kaynak",
      coalition: "koalisyon",
      downstreamOnly: "sadece aşağı akım",
      legal: "hukuki",
      international: "uluslararası",
      efficiency: "verimlilik",
      technology: "teknoloji",
      sustainable: "sürdürülebilir",
      energy: "enerji",
      adaptation: "adaptasyon",
      trade: "ticaret",
      dependency: "bağımlılık",
      conservation: "koruma",
      awareness: "farkındalık",
      public: "kamu",
      climate: "iklim",
      protection: "koruma",
      restoration: "restorasyon",
      ecosystem: "ekosistem",
      biodiversity: "biyoçeşitlilik",
      cooperation: "işbirliği",
      regional: "bölgesel",
      economic: "ekonomik",
      pricing: "fiyatlandırma",
      compensation: "tazminat",
      wealthyOnly: "sadece zengin",
      pollution: "kirlilik",
      enforcement: "uygulama",
      standards: "standartlar",
      quality: "kalite",
      treatment: "arıtma",
      health: "sağlık",
      industry: "endüstri",
      monitoring: "izleme",
      treaty: "anlaşma",
      mediation: "arabuluculuk",
      protest: "protesto",
    },
  },
}

export function getTranslation(language: Language): Translations {
  return translations[language]
}
