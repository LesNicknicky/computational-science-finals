import { useEffect, useState } from "react"
import {
  Check,
  CloudRain,
  Copy,
  Database,
  Droplets,
  Info,
  Layers,
  MapPin,
  ScrollText,
  Sprout,
  TriangleAlert,
  TreePine,
} from "lucide-react"
import { GlassCard } from "@/components/glass-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

/* =====================================================================
   DATA
   Everything on this page is plain data at the top of the file.
   Values mirror backend/simulation/constants.py and data/*.json.
   If a backend number changes, change it here too.
   ===================================================================== */

/* ---------- references ---------- */

interface Reference {
  id: string
  citation: string
  /** Shown as an amber "Check" tag until you have verified the citation. */
  check?: string
}

// Same order and numbering as the References list in the paper ([1] to [43]).
// Add new references at the END so existing numbers don't shift.
const REFERENCES: Reference[] = [
  {
    id: "fao",
    citation:
      "Food and Agriculture Organization of the United Nations, Global Forest Resources Assessment 2025. Rome, Italy: FAO, 2025.",
  },
  {
    id: "bruijnzeel",
    citation:
      "L. A. Bruijnzeel, “Hydrological functions of tropical forests: Not seeing the soil for the trees?,” Agriculture, Ecosystems & Environment, vol. 104, no. 1, pp. 185-228, 2004, doi: 10.1016/j.agee.2004.01.015.",
  },
  {
    id: "neh630",
    citation:
      "U.S. Department of Agriculture, Natural Resources Conservation Service, National Engineering Handbook, Part 630: Hydrology, Chapter 10: Estimation of Direct Runoff, 2004.",
    check: "Pick one source for the 0.2 value (this or TR-55)",
  },
  {
    id: "denr-fmb",
    citation:
      "Forest Management Bureau, Department of Environment and Natural Resources, “Forestry Sector Report,” 2023. [Online]. Available: https://forestry.denr.gov.ph/fmb_web/wp-content/uploads/2023/05/ForestrySectorReport_2023.pdf",
  },
  {
    id: "garen",
    citation:
      "D. C. Garen and D. S. Moore, “Curve number hydrology in water quality modeling: Uses, abuses, and future directions,” Journal of the American Water Resources Association, vol. 41, no. 2, pp. 377-388, 2005, doi: 10.1111/j.1752-1688.2005.tb03742.x.",
  },
  {
    id: "bieger",
    citation:
      "K. Bieger et al., “Introduction to SWAT+, a completely restructured version of the Soil and Water Assessment Tool,” Journal of the American Water Resources Association, vol. 53, no. 1, pp. 115-130, 2017, doi: 10.1111/1752-1688.12482.",
  },
  {
    id: "richards",
    citation:
      "F. J. Richards, “A flexible growth function for empirical use,” Journal of Experimental Botany, vol. 10, no. 2, pp. 290-301, 1959, doi: 10.1093/jxb/10.2.290.",
  },
  {
    id: "shifley",
    citation:
      "S. R. Shifley and G. J. Brand, “Chapman-Richards growth function constrained for maximum tree size,” Forest Science, vol. 30, no. 4, pp. 1066-1070, 1984.",
  },
  {
    id: "tr55",
    citation:
      "U.S. Department of Agriculture, Soil Conservation Service, Urban Hydrology for Small Watersheds, Technical Release 55 (TR-55), 1986.",
    check: "Page numbers for the cited formulas still to add",
  },
  {
    id: "denr-dmo",
    citation:
      "Department of Environment and Natural Resources, “DENR Memorandum Order No. 2012-02: Establishing a Uniform Replacement Ratio for Cut or Relocated Trees,” 2012. [Online]. Available: https://forestry.denr.gov.ph/fmb_web/wp-content/uploads/2023/06/dmo-2012-02.pdf",
  },
  {
    id: "uriarte",
    citation:
      "M. T. Uriarte and A. A. Piñol, “Tree volume, yield prediction and economic rotation of Albizia falcataria in Mindanao, Philippines,” Journal of Tropical Forest Science, vol. 8, no. 3, pp. 289-299, 1996.",
  },
  {
    id: "thom",
    citation:
      "H. C. S. Thom, “A note on the gamma distribution,” Monthly Weather Review, vol. 86, no. 4, pp. 117-122, 1958, doi: 10.1175/1520-0493(1958)086<0117:ANOTGD>2.0.CO;2.",
  },
  {
    id: "bermudez",
    citation:
      "V. A. B. Bermudez, A. B. B. Abilgos, D. C. N. Cuaresma, and J. F. Rabajante, “Probability distribution of Philippine daily rainfall data,” Preprints.org, 2017, doi: 10.20944/preprints201712.0150.v1.",
  },
  {
    id: "pagasa",
    citation:
      "Philippine Atmospheric, Geophysical and Astronomical Services Administration, “Climatological normals (1991-2020): Butuan City, Infanta, Laoag, Mactan, and Malaybalay stations,” n.d. [Online]. Available: https://pubfiles.pagasa.dost.gov.ph/pagasaweb/files/cad/CLIMATOLOGICAL%20NORMALS%20(1991-2020)/ (files BUTUAN CITY.pdf, INFANTA.pdf, LAOAG.pdf, MACTAN.pdf, MALAYBALAY.pdf)",
  },
  {
    id: "green-ampt",
    citation:
      "H. A. Green and G. A. Ampt, “Studies on soil physics: Part I. The flow of air and water through soils,” Journal of Agricultural Science, vol. 4, no. 1, pp. 1-24, 1911, doi: 10.1017/S0021859600001441.",
  },
  {
    id: "wsdot",
    citation:
      "Washington State Department of Transportation, “Hydraulics Manual, Appendix 4B: TR-55 Curve Number Tables.” [Online]. Available: https://www.wsdot.wa.gov/publications/fulltext/Hydraulics/HRM/App4B_2014.pdf",
  },
  {
    id: "rawls",
    citation:
      "W. J. Rawls, D. L. Brakensiek, and K. E. Saxton, “Infiltration and soil water movement,” in Handbook of Hydrology, D. R. Maidment, Ed. New York, NY, USA: McGraw-Hill, 1993.",
    check: "Authors differ from your notes (Rawls, Ahuja, Brakensiek, Shirmohammadi); pages unverified (notes say 5.1–5.51)",
  },
  {
    id: "txdot",
    citation:
      "Texas Department of Transportation, “Green and Ampt loss model,” Hydraulic Design Manual, Table 4-27. [Online]. Available: https://www.txdot.gov/content/dam/txdotoms/des/hyd/hyd.pdf",
    check: "Add year and date accessed",
  },
  {
    id: "coa",
    citation:
      "Commission on Audit, “National Greening Program audit report,” 2019-01. [Online]. Available: https://www.coa.gov.ph/wpfd_file/national-greening-program-pao-2019-01/",
    check: "Confirm title, year and report number",
  },
  {
    id: "marryanna",
    citation:
      "L. Marryanna, W. A. Wan Mohd Shukri, J. Avelinah, and M. R. Sheriza, “Estimation of sap flow rate in Hopea odorata and Khaya ivorensis,” FRIM Technical Information, no. 88, 2023.",
  },
  {
    id: "quimio",
    citation:
      "M. Quimio, “Floral composition and timber stock of forest in the Samar Island Natural Park,” Annals of Tropical Research, vol. 38, no. 2, pp. 30-51, 2016, doi: 10.32945/atr3823.2016.",
  },
  {
    id: "noah",
    citation:
      "Project NOAH, UP DREAM Phil-LiDAR Program, and Department of Science and Technology, “Malate, Metropolitan Manila 25 year flood hazard map,” LiPAD, 2017. [Online]. Available: https://lipad-fmc.dream.upd.edu.ph/layers/geonode:ph133910000_fh25yr_10m",
  },
  {
    id: "luce",
    citation:
      "C. H. Luce, “Effectiveness of road ripping in restoring infiltration capacity of forest roads,” Restoration Ecology, vol. 5, no. 3, pp. 265–270, 1997, doi: 10.1046/j.1526-100X.1997.09731.x.",
  },
  {
    id: "trzebiatowski",
    citation:
      "B. D. Trzebiatowski and C. H. Benson, “Saturated hydraulic conductivity of compacted recycled asphalt pavement,” Geotechnical Testing Journal, vol. 28, no. 5, pp. 514-519, 2005, doi: 10.1520/GTJ12698.",
  },
  {
    id: "alcober",
    citation:
      "A. Alcober and J. Macuha, “Development and analysis of a GIS-based curve number map of the Philippines,” ASEAN Engineering Journal, vol. 14, no. 2, pp. 173-181, 2024, doi: 10.11113/aej.V14.21013.",
  },
  {
    id: "castillo",
    citation:
      "L. A. Castillo et al., “Tree composition, diversity, and stand structure of mid-montane forest in Sipit watershed, Mount Makiling Forest Reserve ASEAN Heritage Park, Philippines,” Philippine Journal of Science, vol. 150, no. S1, pp. 257–269, 2021, doi: 10.56899/150.S1.17.",
  },
  {
    id: "alipon",
    citation:
      "M. A. Alipon, P. L. Alcachupas, E. O. Bondad, and E. C. Cortiguerra, “Assessing the utilization of 4–8 year-old falcata [Paraserianthes falcataria (L.) Nielsen] for lumber production,” Philippine Journal of Science, vol. 145, no. 3, pp. 225–235, 2016.",
  },
  {
    id: "lasco",
    citation:
      "R. D. Lasco, K. G. MacDicken, F. B. Pulhin, I. Q. Guillermo, R. F. Sales, and R. V. O. Cruz, “Carbon stocks assessment of a selectively logged dipterocarp forest and wood processing mill in the Philippines,” Journal of Tropical Forest Science, vol. 18, no. 4, pp. 212–221, 2006.",
  },
  {
    id: "saxton",
    citation:
      "K. E. Saxton and W. J. Rawls, “Soil water characteristic estimates by texture and organic matter for hydrologic solutions,” Soil Science Society of America Journal, vol. 70, no. 5, pp. 1569–1578, Sep. 2006, doi: 10.2136/sssaj2005.0117.",
  },
  {
    id: "zhang",
    citation:
      "L. Zhang, W. R. Dawes, and G. R. Walker, “Response of mean annual evapotranspiration to vegetation changes at catchment scale,” Water Resources Research, vol. 37, no. 3, pp. 701–708, Mar. 2001, doi: 10.1029/2000WR900325.",
  },
  {
    id: "brown",
    citation:
      "N. Brown, Estimating Biomass and Biomass Change of Tropical Forests: A Primer, FAO Forestry Paper 134. Rome, Italy: FAO, 1997.",
  },
  {
    id: "asce",
    citation:
      "American Society of Civil Engineers, Design and Construction of Urban Stormwater Management Systems. New York, NY, USA: ASCE, 1992.",
  },
  {
    id: "rawls-ga",
    citation:
      "W. J. Rawls, D. L. Brakensiek, and N. Miller, “Green-Ampt infiltration parameters from soils data,” Journal of Hydraulic Engineering, vol. 109, no. 1, pp. 62-70, 1983, doi: 10.1061/(ASCE)0733-9429(1983)109:1(62).",
  },
  {
    id: "jordan",
    citation:
      "C. Jordan and J. Kline, “Transpiration of trees in a tropical rainforest,” Journal of Applied Ecology, 1977.",
    check: "Volume and pages needed",
  },
  {
    id: "bureau-forestry",
    citation:
      "Bureau of Forestry, Handbook of Selective Logging, 1970.",
    check: "Verify publisher and details",
  },
  {
    id: "basilan",
    citation:
      "[Author(s) to be verified], “Some useful derivation and application of diameter growth of commercial dipterocarps in the Basilan working circle,” Forestry Leaves, no. 65, 1956.",
    check: "Author(s) to be verified",
  },
  {
    id: "adb",
    citation:
      "Asian Development Bank, Project Document ADB-48271-001. [Online]. Available: https://ewsdata.rightsindevelopment.org/files/documents/01/ADB-48271-001_UoF3Hk7.pdf",
  },
  {
    id: "pids",
    citation:
      "Philippine Institute for Development Studies, “Publications concerning survival rates under the National Greening Program.”",
    check: "Add title, year and link",
  },
  {
    id: "seo",
    citation:
      "Senate Economic Planning Office, “Forest-related report.”",
    check: "Add title, year and link",
  },
  {
    id: "dierick",
    citation:
      "D. Dierick and D. Hölscher, “Species-specific tree water use characteristics in reforestation stands in the Philippines,” Agricultural and Forest Meteorology, vol. 149, no. 8, pp. 1317–1326, 2009, doi: 10.1016/j.agrformet.2009.03.003.",
  },
  {
    id: "li-sewer",
    citation:
      "D. Li, J. Hou, R. Shen, B. Li, Y. Tong, and T. Wang, “Approximation method for the sewer drainage effect for urban flood modeling in areas without drainage-pipe data,” Frontiers in Environmental Science, vol. 11, Art. no. 1134985, 2023, doi: 10.3389/fenvs.2023.1134985.",
  },
  {
    id: "li-urban",
    citation:
      "D. Li et al., “An efficient method for approximately simulating drainage capability for urban flood,” Frontiers in Earth Science, vol. 8, Art. no. 159, 2020, doi: 10.3389/feart.2020.00159.",
  },
  {
    id: "chin",
    citation:
      "D. A. Chin, “The curve number method in the 21st century,” Journal of Irrigation and Drainage Engineering, vol. 149, no. 6, 2023, doi: 10.1061/JIDEDH.IRENG-10108.",
  },
]

/* ---------- data sources ---------- */

interface DataSource {
  name: string
  icon: React.ElementType
  gives: string
  usedFor: string
  goodToKnow?: string
  refIds: string[]
}

const SOURCES: DataSource[] = [
  {
    name: "Log production (DENR-FMB)",
    icon: TreePine,
    gives: "How many cubic meters of logs each region produced in 2023.",
    usedFor: "Picks the five regions and sets how many trees each one has.",
    goodToKnow:
      "Covers only the first months of 2023, so it is not a full year.",
    refIds: ["denr-fmb"],
  },
  {
    name: "Rainfall normals (PAGASA)",
    icon: CloudRain,
    gives: "Monthly rain totals and rainy days at weather stations, 1991–2020.",
    usedFor:
      "Makes the simulated rain: how often it rains and how hard, month by month.",
    goodToKnow: "One weather station stands in for each whole region.",
    refIds: ["pagasa"],
  },
  {
    name: "Runoff numbers (SCS Curve Number)",
    icon: Layers,
    gives: "How much rain runs off each kind of ground instead of soaking in.",
    usedFor: "Sets the runoff for sand, loam, clay, gravel and pavement.",
    refIds: ["tr55", "neh630"],
  },
  {
    name: "Soil soak-in speed (Rawls)",
    icon: Droplets,
    gives: "How fast water soaks into sand, loam and clay.",
    usedFor: "Sets how quickly standing water drains away.",
    goodToKnow: "Read through the Texas DOT table, not the original book.",
    refIds: ["rawls", "txdot"],
  },
  {
    name: "Replacement rule (DENR order)",
    icon: ScrollText,
    gives: "How many seedlings must be planted for each tree cut.",
    usedFor: "Sets the number of saplings to plant: 100 for every tree cut.",
    goodToKnow: "We only use the rule for naturally growing trees.",
    refIds: ["denr-dmo"],
  },
  {
    name: "Tree growth and water use",
    icon: Sprout,
    gives:
      "How fast a tree grows, how much water it takes up, and how many survive.",
    usedFor: "Sets how long saplings need before they replace an old tree.",
    goodToKnow:
      "Growth numbers come from falcata, a fast-growing plantation tree.",
    refIds: ["uriarte", "richards", "marryanna", "alipon", "coa", "pids", "seo"],
  },
]

/* ---------- logs by region ---------- */

const NATIONAL_TOTAL_M3 = 117368.16

const TOP_REGIONS = [
  { name: "Caraga (XIII)", m3: 83565.6 },
  { name: "Calabarzon", m3: 13218.68 },
  { name: "Northern Mindanao", m3: 5169.79 },
  { name: "Central Visayas", m3: 2695.03 },
  { name: "Ilocos", m3: 2683.35 },
]

/* ---------- rain stations ---------- */

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]

interface RainStation {
  region: string
  station: string | null
  /** Monthly rain total in mm, Jan to Dec. null = not on this page yet. */
  monthly: number[] | null
  note?: string
}

const RAIN_STATIONS: RainStation[] = [
  {
    region: "Caraga",
    station: "Butuan City",
    monthly: [
      326.4, 234.5, 148.9, 116.9, 111.4, 174.3, 152.4, 114.4, 126.5, 170.4,
      197.8, 251.8,
    ],
    note: "Wettest in January, driest in May.",
  },
  {
    region: "Calabarzon",
    station: "Infanta, Quezon",
    monthly: [
      348.9, 289.0, 220.7, 175.0, 203.7, 233.4, 265.6, 193.0, 251.1, 498.6,
      561.8, 746.3,
    ],
    note: "Most Calabarzon logs come from Quezon.",
  },
  {
    region: "Northern Mindanao",
    station: "Malaybalay, Bukidnon",
    monthly: [
      174.8, 112.8, 104.1, 118.3, 240.1, 319.5, 350.2, 300.7, 290.8, 292.1,
      177.6, 160.9,
    ],
    note: "A highland station (689.5 m), so it may be wetter than the coast.",
  },
  {
    region: "Central Visayas",
    station: "Mactan International Airport, Cebu",
    monthly: [
      135.1, 88.9, 60.9, 55.6, 94.4, 180.7, 210.6, 157.9, 190.4, 207.6,
      131.0, 171.9,
    ],
    note: "Monthly values still need a double-check against the PAGASA table.",
  },
  {
    region: "Ilocos",
    station: "Laoag City, Ilocos Norte",
    monthly: [
      6.1, 3.0, 5.3, 21.8, 218.8, 286.5, 478.9, 593.7, 412.9, 117.2, 36.6, 6.2,
    ],
    note: "Most Ilocos logs come from Pangasinan, which is not covered.",
  },
]

/* ---------- constants ---------- */

type Kind = "source" | "derived" | "assumption" | "todo"

const KIND: Record<
  Kind,
  { label: string; meaning: string; badge: string; bar: string }
> = {
  source: {
    label: "From a source",
    meaning: "Taken directly from a published study or report.",
    badge: "bg-emerald-100 text-emerald-800",
    bar: "bg-emerald-500",
  },
  derived: {
    label: "Worked out",
    meaning: "Calculated by us from published numbers.",
    badge: "bg-lime-100 text-lime-800",
    bar: "bg-lime-500",
  },
  assumption: {
    label: "Our assumption",
    meaning: "A modeling choice we made, not a measured value.",
    badge: "bg-amber-100 text-amber-800",
    bar: "bg-amber-400",
  },
  todo: {
    label: "Still checking",
    meaning: "Not final yet, or not switched on in the simulator.",
    badge: "bg-stone-200 text-stone-700",
    bar: "bg-stone-400",
  },
}

interface Constant {
  name: string
  meaning: string
  value: string
  kind: Kind
  refIds?: string[]
  note?: string
}

interface ConstantGroup {
  title: string
  icon: React.ElementType
  items: Constant[]
}

const CONSTANT_GROUPS: ConstantGroup[] = [
  {
    title: "Trees and planting",
    icon: Sprout,
    items: [
      {
        name: "Saplings per tree cut",
        meaning: "How many new trees make up for one cut tree.",
        value: "100 (1 : 100)",
        kind: "source",
        refIds: ["denr-dmo"],
        note: "Naturally growing trees only. The 1 : 50 rule and the plantation exemption are not used.",
      },
      {
        name: "Sapling survival rate",
        meaning: "Share of planted saplings that survive.",
        value: "68% (range 61–85%)",
        kind: "source",
        refIds: ["coa", "pids", "seo"],
        note: "We picked the audited 68%. The 85% is a program target, not a measurement.",
      },
      {
        name: "Time to full size",
        meaning: "How long a tree takes to reach full water uptake.",
        value: "10 years (range 8–12)",
        kind: "assumption",
        refIds: ["alipon"],
        note: "The midpoint of the cited range.",
      },
      {
        name: "Growth curve shape",
        meaning: "How the sapling's uptake builds up over its life.",
        value: "Chapman-Richards curve",
        kind: "derived",
        refIds: ["uriarte", "richards"],
        note: "We fitted the curve to a published falcata height-age curve (error about 0.03).",
      },
      {
        name: "Water a full-grown tree takes up",
        meaning: "Cubic meters of water per tree per day.",
        value: "0.046 m³ / day",
        kind: "source",
        refIds: ["marryanna", "jordan"],
        note: "Published values range widely, from 0.0027 to 1.18.",
      },
      {
        name: "Trees per hectare",
        meaning: "Sets how much land the old trees cover.",
        value: "877 stems / ha",
        kind: "source",
        refIds: ["quimio"],
        note: "Measured at one site in Samar and used for every region.",
      },
      {
        name: "Volume per tree",
        meaning: "Turns cubic meters of logs into a tree count.",
        value: "Not switched on yet",
        kind: "todo",
        refIds: ["uriarte"],
        note: "The units of the volume equation still need checking.",
      },
      {
        name: "Cutting cycle",
        meaning: "Years between cuts, and how much is removed and regrown.",
        value: "35 years · 50% removed · 70% regrown",
        kind: "source",
        refIds: ["lasco"],
        note: "From a dipterocarp forest. Stored, but the limit on how much you may cut is not switched on yet.",
      },
    ],
  },
  {
    title: "Rain",
    icon: CloudRain,
    items: [
      {
        name: "Rainy days and rain per rainy day",
        meaning: "How often it rains and how much, for each month.",
        value: "Different for each region and month",
        kind: "derived",
        refIds: ["pagasa"],
        note: "A rainy day is a day with at least 1 mm. We worked out the chance and average from the monthly normals.",
      },
      {
        name: "Spread of daily rain",
        meaning: "How uneven day-to-day rain is.",
        value: "Shape 1.0",
        kind: "assumption",
        note: "Placeholder. The normals do not include day-by-day spread. To be tested in the sensitivity analysis.",
      },
    ],
  },
  {
    title: "Flood warning",
    icon: TriangleAlert,
    items: [
      {
        name: "Be careful starts at",
        meaning: "Share of the flood limit where Safe turns to Be careful.",
        value: "0.5 of the limit",
        kind: "assumption",
        note: "Project-defined (proposal Section 5.4).",
      },
      {
        name: "Danger starts at",
        meaning: "Share of the flood limit where Be careful turns to Danger.",
        value: "1.0 of the limit",
        kind: "assumption",
        note: "Project-defined (proposal Section 5.4).",
      },
      {
        name: "Water the ground can hold",
        meaning: "Standing water depth used as the flood limit.",
        value: "100 mm",
        kind: "assumption",
        note: "Placeholder. Will be tuned by sensitivity analysis.",
      },
      {
        name: "Fastest safe rise",
        meaning: "How fast runoff can build up day to day.",
        value: "50 mm / day",
        kind: "assumption",
        note: "Placeholder. Project-defined.",
      },
    ],
  },
  {
    title: "Ground",
    icon: Layers,
    items: [
      {
        name: "Early rain that never runs off",
        meaning: "Share of the storage that fills before runoff begins.",
        value: "0.2",
        kind: "source",
        refIds: ["neh630", "tr55"],
        note: "The standard value in the curve-number method.",
      },
    ],
  },
]

const ALL_CONSTANTS = CONSTANT_GROUPS.flatMap((g) => g.items)

/* ---------- ground types ---------- */

interface GroundRow {
  name: string
  cn: number
  cnNote?: string
  soak: string
  soakKind: Kind
  note?: string
  refIds: string[]
}

const GROUND: GroundRow[] = [
  {
    name: "Sand",
    cn: 39,
    soak: "235.7 mm/hr",
    soakKind: "source",
    note: "Soil group A.",
    refIds: ["tr55", "rawls", "txdot"],
  },
  {
    name: "Loam",
    cn: 61,
    soak: "13.2 mm/hr",
    soakKind: "source",
    note: "Soil group B.",
    refIds: ["tr55", "rawls", "txdot"],
  },
  {
    name: "Clay",
    cn: 80,
    soak: "0.5 mm/hr",
    soakKind: "source",
    note: "Soil group D.",
    refIds: ["tr55", "rawls", "txdot"],
  },
  {
    name: "Gravel or dirt",
    cn: 89,
    soak: "2 mm/hr (range 0–4)",
    soakKind: "assumption",
    note: "Soak-in is the midpoint of a forest-road range from the literature.",
    refIds: ["tr55", "luce"],
  },
  {
    name: "Partial pavement",
    cn: 79.5,
    soak: "Mix of loam and pavement",
    soakKind: "derived",
    note: "Half loam, half pavement (our choice), averaged by area.",
    refIds: ["tr55"],
  },
  {
    name: "Full pavement",
    cn: 98,
    soak: "No sourced value yet",
    soakKind: "todo",
    note: "Pavement holds about 1.27 mm before runoff starts (typical; range 0.6–2.5). That is storage, not drainage speed.",
    refIds: ["tr55"],
  },
]

/* ---------- limits ---------- */

const LIMITS: string[] = [
  "The log data covers only the first months of 2023, not a full year.",
  "Only the five biggest log-producing regions are included.",
  "One tree density, measured at one site in Samar, is used for every region.",
  "Growth and water-use numbers come from falcata, a fast plantation tree. The cutting-cycle numbers come from a different forest type.",
  "Each region uses one weather station, and day-to-day rain spread is assumed.",
  "Only the 1 : 100 rule for naturally growing trees is modeled.",
  "Full pavement has no sourced drainage speed, so how long it floods is not modeled yet.",
  "Storm drains and gutters are not modeled.",
  "Several flood thresholds are placeholders until the sensitivity analysis is done.",
]

/* ---------- navigation ---------- */

const NAV = [
  { id: "sources", label: "Data sources" },
  { id: "regions", label: "Where the logs come from" },
  { id: "rain", label: "Where the rain data comes from" },
  { id: "constants", label: "The numbers we use" },
  { id: "ground", label: "Ground types" },
  { id: "limits", label: "What this does not cover" },
  { id: "references", label: "References" },
]
const NAV_IDS = NAV.map((n) => n.id)

/* =====================================================================
   SMALL PIECES
   ===================================================================== */

function refNumber(id: string) {
  return REFERENCES.findIndex((r) => r.id === id) + 1
}

function Refs({ ids }: { ids?: string[] }) {
  if (!ids || ids.length === 0) {
    return <span className="text-xs text-muted-foreground">None</span>
  }
  return (
    <span className="inline-flex flex-wrap gap-1">
      {ids.map((id) => {
        const n = refNumber(id)
        if (n === 0) return null
        return (
          <a
            key={id}
            href={`#ref-${id}`}
            className="clay-sm clay-press rounded-full! px-2 py-0.5 text-xs font-bold text-emerald-800"
          >
            [{n}]
          </a>
        )
      })}
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable, ignore */
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={copy} className="shrink-0">
      {copied ? (
        <Check className="mr-1 size-4" />
      ) : (
        <Copy className="mr-1 size-4" />
      )}
      {copied ? "Copied" : "Copy"}
    </Button>
  )
}

function SectionTitle({
  icon: Icon,
  title,
  blurb,
}: {
  icon: React.ElementType
  title: string
  blurb?: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <span className="clay-green grid size-9 place-items-center rounded-2xl">
          <Icon className="size-4" aria-hidden />
        </span>
        {title}
      </h3>
      {blurb && <p className="mt-1.5 text-sm text-muted-foreground">{blurb}</p>}
    </div>
  )
}

function KindBadge({ kind }: { kind: Kind }) {
  return <Badge className={KIND[kind].badge}>{KIND[kind].label}</Badge>
}

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0]
        if (top) setActive(top.target.id)
      },
      { rootMargin: "-10% 0px -70% 0px" }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [ids])
  return active
}

/* =====================================================================
   PAGE
   ===================================================================== */

export default function ResearchPage() {
  const [filter, setFilter] = useState<Kind | "all">("all")
  const active = useActiveSection(NAV_IDS)

  const counts = (Object.keys(KIND) as Kind[]).map((k) => ({
    kind: k,
    n: ALL_CONSTANTS.filter((c) => c.kind === k).length,
  }))
  const total = ALL_CONSTANTS.length
  const needCheck = REFERENCES.filter((r) => r.check).length

  return (
    <div className="app-bg relative min-h-svh p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl">
        {/* ---------- header + trust meter ---------- */}
        <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-stretch">
          <div className="flex flex-col justify-center">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-medium text-emerald-800">
              <Database className="size-4" aria-hidden /> Sources
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              Where our numbers come from
            </h2>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Every number in the simulator is listed here, with where it came
              from and how solid it is.
            </p>
          </div>

          <GlassCard className="p-5">
            <p className="mb-3 flex items-center gap-1.5 text-[13px] font-semibold text-muted-foreground">
              <Info className="size-4 text-emerald-700" aria-hidden /> How solid
              are our numbers?
            </p>
            <div
              className="clay-track flex h-4 overflow-hidden"
              role="img"
              aria-label={counts
                .map((c) => `${c.n} ${KIND[c.kind].label}`)
                .join(", ")}
            >
              {counts.map((c) => (
                <div
                  key={c.kind}
                  className={cn(KIND[c.kind].bar, "transition-all")}
                  style={{ width: `${(c.n / total) * 100}%` }}
                />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-4">
              {counts.map((c) => (
                <button
                  key={c.kind}
                  type="button"
                  onClick={() => {
                    setFilter(c.kind)
                    document
                      .getElementById("constants")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="clay-sm clay-press p-2.5 text-left"
                >
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className={cn("size-2 rounded-full", KIND[c.kind].bar)}
                    />
                    {KIND[c.kind].label}
                  </span>
                  <span className="text-xl font-semibold">{c.n}</span>
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {needCheck} of {REFERENCES.length} references still need a detail
              confirmed before submission.
            </p>
          </GlassCard>
        </div>

        <div className="grid gap-5 xl:grid-cols-[210px_minmax(0,1fr)] xl:items-start">
          {/* ---------- nav ---------- */}
          <nav className="hidden xl:sticky xl:top-6 xl:block">
            <p className="mb-2 text-sm font-medium">On this page</p>
            <ul className="space-y-0.5 border-l border-emerald-800/20 text-sm">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className={cn(
                      "-ml-px block border-l-2 py-1 pl-3 transition-colors",
                      active === n.id
                        ? "border-emerald-700 font-medium text-emerald-900"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-4xl min-w-0 space-y-5">
            {/* ---------- data sources ---------- */}
            <GlassCard id="sources" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={Database}
                title="Data sources"
                blurb="The reports and datasets behind the simulator."
              />
              <div className="grid gap-3 md:grid-cols-2">
                {SOURCES.map((s) => (
                  <div key={s.name} className="clay-sm space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex items-center gap-2 font-medium">
                        <s.icon
                          className="size-4 shrink-0 text-emerald-700"
                          aria-hidden
                        />
                        {s.name}
                      </p>
                      <Refs ids={s.refIds} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        What it gives us
                      </p>
                      <p className="text-sm">{s.gives}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Where we use it
                      </p>
                      <p className="text-sm">{s.usedFor}</p>
                    </div>
                    {s.goodToKnow && (
                      <p className="clay-sm clay-tint-amber flex items-start gap-1.5 px-3 py-2 text-xs text-amber-900">
                        <Info
                          className="mt-0.5 size-3.5 shrink-0"
                          aria-hidden
                        />
                        {s.goodToKnow}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* ---------- logs by region ---------- */}
            <GlassCard id="regions" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={MapPin}
                title="Where the logs come from"
                blurb={
                  <>
                    The five regions with the most logs, as a share of the
                    national total of{" "}
                    {NATIONAL_TOTAL_M3.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{" "}
                    m³ (early 2023). <Refs ids={["denr-fmb"]} />
                  </>
                }
              />
              <div className="space-y-4">
                {TOP_REGIONS.map((r, i) => {
                  const share = (r.m3 / NATIONAL_TOTAL_M3) * 100
                  return (
                    <div key={r.name} className="space-y-1.5">
                      <div className="flex justify-between gap-2 text-sm">
                        <span className="font-medium">
                          <span className="mr-2 text-muted-foreground">
                            {i + 1}
                          </span>
                          {r.name}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round(r.m3).toLocaleString()} m³ ·{" "}
                          {share.toFixed(1)}%
                        </span>
                      </div>
                      <div className="clay-track h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 shadow-[inset_1px_2px_3px_rgba(255,255,255,0.5)]"
                          style={{ width: `${Math.max(share, 1.5)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Caraga alone produced about 7 of every 10 logs.
              </p>
            </GlassCard>

            {/* ---------- rain stations ---------- */}
            <GlassCard id="rain" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={CloudRain}
                title="Where the rain data comes from"
                blurb={
                  <>
                    One PAGASA weather station per region, using 1991–2020
                    averages. Bars show the rain total for each month.{" "}
                    <Refs ids={["pagasa"]} />
                  </>
                }
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {RAIN_STATIONS.map((s) => {
                  const max = s.monthly ? Math.max(...s.monthly) : 0
                  const year = s.monthly
                    ? s.monthly.reduce((a, b) => a + b, 0)
                    : null
                  return (
                    <div key={s.region} className="clay-sm p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{s.region}</p>
                          <p className="text-xs text-muted-foreground">
                            {s.station ?? "Station to be confirmed"}
                          </p>
                        </div>
                        {year !== null && (
                          <p className="text-right text-sm font-semibold text-emerald-800">
                            {Math.round(year).toLocaleString()} mm
                            <span className="block text-xs font-normal text-muted-foreground">
                              per year
                            </span>
                          </p>
                        )}
                      </div>
                      {s.monthly ? (
                        <div
                          className="mt-3 flex h-16 items-end gap-1"
                          role="img"
                          aria-label={`Monthly rain at ${s.station}`}
                        >
                          {s.monthly.map((v, i) => (
                            <div
                              key={i}
                              className="flex h-full flex-1 flex-col justify-end gap-1"
                              title={`${v} mm`}
                            >
                              <div
                                className="rounded-md bg-emerald-500/80 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5)]"
                                style={{ height: `${(v / max) * 100}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="clay-inset mt-3 grid h-16 place-items-center rounded-lg border-0 text-xs text-muted-foreground">
                          No chart yet
                        </div>
                      )}
                      {s.monthly && (
                        <div className="mt-1 flex gap-1 text-[10px] text-muted-foreground">
                          {MONTHS.map((m, i) => (
                            <span key={i} className="flex-1 text-center">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                      {s.note && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          {s.note}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </GlassCard>

            {/* ---------- constants ---------- */}
            <GlassCard id="constants" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={Layers}
                title="The numbers we use"
                blurb="Tap a label to show only that kind of number."
              />

              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filter === "all"
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-emerald-800/20 bg-white/50 hover:bg-white/80"
                  )}
                >
                  All ({total})
                </button>
                {(Object.keys(KIND) as Kind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setFilter(k)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      filter === k
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-emerald-800/20 bg-white/50 hover:bg-white/80"
                    )}
                  >
                    <span className={cn("size-2 rounded-full", KIND[k].bar)} />
                    {KIND[k].label}
                  </button>
                ))}
              </div>

              {filter !== "all" && (
                <p className="mb-3 text-sm text-muted-foreground">
                  {KIND[filter].meaning}
                </p>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>What it is</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>How solid</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {CONSTANT_GROUPS.map((g) => {
                    const rows = g.items.filter(
                      (c) => filter === "all" || c.kind === filter
                    )
                    if (rows.length === 0) return null
                    return [
                      <TableRow
                        key={g.title}
                        className="bg-emerald-600/10 hover:bg-emerald-600/10"
                      >
                        <TableCell
                          colSpan={4}
                          className="text-xs font-semibold text-emerald-900"
                        >
                          <span className="flex items-center gap-1.5">
                            <g.icon className="size-3.5" aria-hidden />
                            {g.title}
                          </span>
                        </TableCell>
                      </TableRow>,
                      ...rows.map((c) => (
                        <TableRow key={c.name}>
                          <TableCell className="max-w-64 whitespace-normal">
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {c.meaning}
                            </p>
                            {c.note && (
                              <p className="mt-1 text-xs text-stone-600">
                                {c.note}
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="font-medium whitespace-normal">
                            {c.value}
                          </TableCell>
                          <TableCell>
                            <KindBadge kind={c.kind} />
                          </TableCell>
                          <TableCell>
                            <Refs ids={c.refIds} />
                          </TableCell>
                        </TableRow>
                      )),
                    ]
                  })}
                </TableBody>
              </Table>
            </GlassCard>

            {/* ---------- ground types ---------- */}
            <GlassCard id="ground" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={Layers}
                title="Ground types"
                blurb="Runoff number: the higher it is, the more rain runs off instead of soaking in. Soak-in speed: how fast standing water drains away."
              />
              <div className="space-y-3">
                {GROUND.map((g) => (
                  <div
                    key={g.name}
                    className="clay-sm grid gap-x-4 gap-y-2 p-4 md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1fr)]"
                  >
                    <div>
                      <p className="font-medium">{g.name}</p>
                      <Refs ids={g.refIds} />
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Runoff number
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="clay-track h-3 flex-1 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-emerald-300 to-emerald-600 shadow-[inset_1px_2px_3px_rgba(255,255,255,0.5)]"
                            style={{ width: `${g.cn}%` }}
                          />
                        </div>
                        <span className="w-9 text-right text-sm font-semibold">
                          {g.cn}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Soak-in speed
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold">{g.soak}</span>
                        <KindBadge kind={g.soakKind} />
                      </div>
                    </div>

                    {g.note && (
                      <p className="text-xs text-muted-foreground md:col-span-3">
                        {g.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Soak-in speeds for sand, loam and clay come from Rawls et al.
                (1993) through the Texas DOT table.
              </p>
            </GlassCard>

            {/* ---------- limits ---------- */}
            <GlassCard id="limits" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={TriangleAlert}
                title="What this does not cover"
                blurb="Good to keep in mind when reading the results."
              />
              <ul className="grid gap-2 sm:grid-cols-2">
                {LIMITS.map((l) => (
                  <li
                    key={l}
                    className="clay-sm flex items-start gap-2 p-3 text-sm"
                  >
                    <TriangleAlert
                      className="mt-0.5 size-4 shrink-0 text-amber-600"
                      aria-hidden
                    />
                    {l}
                  </li>
                ))}
              </ul>
            </GlassCard>

            {/* ---------- references ---------- */}
            <GlassCard id="references" className="scroll-mt-6 p-5">
              <SectionTitle
                icon={ScrollText}
                title="References"
                blurb="All 43 references from the paper, numbered the same way. Items tagged Check still need a detail confirmed."
              />
              <ol className="space-y-3 text-sm">
                {REFERENCES.map((r, i) => (
                  <li
                    key={r.id}
                    id={`ref-${r.id}`}
                    className="flex scroll-mt-6 items-start justify-between gap-2"
                  >
                    <span>
                      <span className="mr-2 text-muted-foreground">
                        [{i + 1}]
                      </span>
                      {r.citation}
                      {r.check && (
                        <Badge className="ml-2 bg-amber-100 text-amber-800">
                          Check: {r.check}
                        </Badge>
                      )}
                    </span>
                    <CopyButton text={r.citation} />
                  </li>
                ))}
              </ol>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}