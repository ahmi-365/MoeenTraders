// src/data/data.ts

import {
  AuctionItem,
  AuctionDetail,
  VehicleSpec,
  PerformanceSpec,
} from "../../types/types";

type AuctionTemplate = Omit<AuctionDetail, "id" | "title" | "buyNowPrice">;

// --- TEMPLATES FOR CAR DETAILS ---

const supercarDetailTemplate: AuctionTemplate = {
  tags: ["LUXURY", "SPORTS CAR", "CERTIFIED"],
  images: [
    "https://i.imgur.com/k2E4Y7G.png",
    "https://i.imgur.com/eE1x4Lh.png",
    "https://i.imgur.com/gK6kY9P.png",
    "https://i.imgur.com/wV2eQ7R.png",
    "https://i.imgur.com/rN4Uf9E.png",
  ],
  vehicleSpecs: [
    { label: "Year", value: "2023", icon: "calendar-outline" },
    { label: "Mileage", value: "2,450 m", icon: "speedometer-outline" },
    {
      label: "Transmission",
      value: "8-Speed PDK",
      icon: "git-compare-outline",
    },
    { label: "Fuel Type", value: "Premium Gasoline", icon: "water-outline" },
    { label: "Drivetrain", value: "AWD", icon: "car-sport-outline" },
    {
      label: "Color",
      value: "GT Silver Metallic",
      icon: "color-palette-outline",
    },
  ],
  performanceSpecs: [
    { label: "Engine", value: "3.8L Twin-Turbo Flat-6" },
    { label: "0-60 mph", value: "2.6 seconds" },
    { label: "Horsepower", value: "640 HP", subValue: "@ 6,750 RPM" },
    { label: "Top Speed", value: "205 mph" },
    { label: "Torque", value: "590 lb-ft", subValue: "@ 2,500 RPM" },
    { label: "Quarter Mile", value: "10.5 seconds" },
  ],
  exteriorFeatures: [
    "LED Headlights",
    "Carbon Fiber Roof",
    "Sport Exhaust",
    '20" Wheels',
    "Ceramic Brakes",
  ],
  interiorFeatures: [
    "Power Sport Seats",
    "Alcantara Interior",
    '10.9" Touchscreen',
    "Bose Sound",
    "Sport Chrono",
  ],
  vehicleHistory: [
    {
      title: "Vehicle Purchased New",
      date: "March 2023",
      details: "Porsche Beverly Hills",
      statusTag: "Original Owner",
      icon: "cart-outline",
    },
    {
      title: "First Service",
      date: "September 2023",
      details: "1,200 m",
      statusTag: "Authorized Dealer",
      icon: "build-outline",
    },
  ],
  sellerInfo: {
    name: "Michael Thompson",
    avatarUrl: "https://i.imgur.com/4YjWJjM.png",
    rating: 4.9,
    reviews: 127,
    description: "Premium car collector with 15+ years of experience.",
    carsSold: 47,
    positiveFeedback: "100%",
  },
  auctionStatus: {
    auctionId: "",
    currentBid: 0,
    bidCount: 0,
    bidHistory: [],
    reserveMet: false,
    ends: "",
    location: "",
    shipping: "",
  },
};

const suvDetailTemplate: AuctionTemplate = {
  ...supercarDetailTemplate,
  tags: ["LUXURY", "SUV", "4X4"],
  vehicleSpecs: [
    { label: "Year", value: "2022", icon: "calendar-outline" },
    { label: "Mileage", value: "1,200 m", icon: "speedometer-outline" },
    {
      label: "Transmission",
      value: "9-Speed Automatic",
      icon: "git-compare-outline",
    },
    { label: "Fuel Type", value: "Premium Gasoline", icon: "water-outline" },
    { label: "Drivetrain", value: "4MATIC AWD", icon: "car-sport-outline" },
    { label: "Color", value: "Obsidian Black", icon: "color-palette-outline" },
  ],
  performanceSpecs: [
    { label: "Engine", value: "4.0L V8 Bi-Turbo" },
    { label: "Horsepower", value: "577 HP" },
  ],
  exteriorFeatures: [
    "MULTIBEAM LED",
    "Panoramic Roof",
    "AMG Sport Exhaust",
    '22" Forged Wheels',
    "Brush Guard",
  ],
  interiorFeatures: [
    "Nappa Leather Seats",
    "Burmester Sound",
    'Dual 12.3" Screens',
    "64-Color Ambient Lighting",
    "Carbon Fiber Trim",
  ],
};

const classicCarDetailTemplate: AuctionTemplate = {
  ...supercarDetailTemplate,
  tags: ["CLASSIC", "V8", "AMERICAN MUSCLE"],
  vehicleSpecs: [
    { label: "Year", value: "1969", icon: "calendar-outline" },
    { label: "Mileage", value: "58,000 m", icon: "speedometer-outline" },
    {
      label: "Transmission",
      value: "4-Speed Manual",
      icon: "git-compare-outline",
    },
    { label: "Fuel Type", value: "Gasoline", icon: "water-outline" },
    { label: "Drivetrain", value: "RWD", icon: "car-sport-outline" },
    { label: "Color", value: "Candy Apple Red", icon: "color-palette-outline" },
  ],
  performanceSpecs: [
    { label: "Engine", value: "428ci Cobra Jet V8" },
    { label: "Horsepower", value: "335 HP (rated)" },
  ],
  exteriorFeatures: [
    "Shaker Hood Scoop",
    "Chrome Bumpers",
    "Magnum 500 Wheels",
    "Rear Spoiler",
  ],
  interiorFeatures: [
    "Vinyl Bucket Seats",
    "Woodgrain Trim",
    "AM Radio",
    "Hurst Shifter",
  ],
};

interface BaseAuctionData {
  id: string;
  tagText: string;
  tagColor: string;
  title: string;
  subtitle: string;
  price: string;
  mileage: string;
  endsIn: string;
  bids: string;
  type: "auction" | "sale";
}
const baseAuctionData: BaseAuctionData[] = [
  {
    id: "porsche-911-turbo-s-2023",
    tagText: "RESERVE MET",
    tagColor: "#43A047",
    title: "PORSCHE 911",
    subtitle: "2023 Porsche 911 Turbo S",
    price: "AED 185,500",
    mileage: "2,450 m",
    endsIn: "2d",
    bids: "23 bids",
    type: "auction",
  },
  {
    id: "range-rover-velar-2021",
    tagText: "HOT BID",
    tagColor: "#E53935",
    title: "RANGE ROVER",
    subtitle: "Jeep Wrangler Rubicon",
    price: "AED 78,000",
    mileage: "290 m",
    endsIn: "1d",
    bids: "9 bids",
    type: "auction",
  },
  {
    id: "g63-amg-2022",
    tagText: "NEW LISTING",
    tagColor: "#1E88E5",
    title: "MERCEDES-AMG",
    subtitle: "2022 Mercedes-AMG G63",
    price: "AED 240,000",
    mileage: "7,800 m",
    endsIn: "6d",
    bids: "5 bids",
    type: "auction",
  },
  {
    id: "mclaren-720s-2019",
    tagText: "HOT BID",
    tagColor: "#00897B",
    title: "MCLAREN 720S",
    subtitle: "2019 McLaren 720S Performance",
    price: "AED 215,000",
    mileage: "9,200 m",
    endsIn: "3d",
    bids: "31 bids",
    type: "auction",
  },
  {
    id: "mustang-mach1-1969",
    tagText: "CLASSIC",
    tagColor: "#546E7A",
    title: "FORD MUSTANG",
    subtitle: "1969 Ford Mustang Mach 1",
    price: "AED 65,000",
    mileage: "58,000 m",
    endsIn: "1d 4h",
    bids: "14 bids",
    type: "auction",
  },
  {
    id: "tesla-plaid-2023",
    tagText: "HOT BID",
    tagColor: "#F4511E",
    title: "TESLA MODEL S",
    subtitle: "2023 Tesla Model S Plaid",
    price: "AED 92,000",
    mileage: "4,100 m",
    endsIn: "2d 8h",
    bids: "19 bids",
    type: "auction",
  },
];

const baseFeaturedAuctionsData: BaseAuctionData[] = [
  {
    id: "bmw-m4-2022",
    tagText: "HOT BID",
    tagColor: "#D9534F",
    title: "BMW M4",
    subtitle: "2022 BMW M4 Competition",
    price: "AED 178,000",
    mileage: "12,300 m",
    endsIn: "Ends in 1d",
    bids: "9 bids",
    type: "auction",
  },
  {
    id: "mclaren-720s-2019",
    tagText: "NO RESERVE",
    tagColor: "#00897B",
    title: "MCLAREN 720S",
    subtitle: "2019 McLaren 720S Performance",
    price: "AED 215,000",
    mileage: "9,200 m",
    endsIn: "Ends in 3d",
    bids: "31 bids",
    type: "auction",
  },
];


const baseFeaturedForSaleData: BaseAuctionData[] = [
  {
    id: "ferrari-f8-2020",
    tagText: "HOT DEAL", // updated
    tagColor: "#D32F2F",
    title: "FERRARI F8",
    subtitle: "2020 Ferrari F8 Tributo",
    price: "AED 340,000",
    mileage: "4,000 m",
    endsIn: "N/A",
    bids: "For Sale",
    type: "sale",
  },
  {
    id: "cullinan-2021",
    tagText: "HOT DEAL", // updated
    tagColor: "#1E88E5",
    title: "ROLLS-ROYCE",
    subtitle: "2021 Rolls-Royce Cullinan",
    price: "AED 410,000",
    mileage: "11,500 m",
    endsIn: "N/A",
    bids: "For Sale",
    type: "sale",
  },
  {
    id: "defender-110-2023",
    tagText: "HOT DEAL", // updated
    tagColor: "#43A047",
    title: "LAND ROVER",
    subtitle: "2023 Land Rover Defender 110",
    price: "AED 95,000",
    mileage: "3,200 m",
    endsIn: "N/A",
    bids: "For Sale",
    type: "sale",
  },
  {
    id: "corvette-z06-2023",
    tagText: "PERFORMANCE", // updated
    tagColor: "#FB8C00",
    title: "CHEVROLET",
    subtitle: "2023 Chevrolet Corvette Z06",
    price: "AED 165,000",
    mileage: "1,100 m",
    endsIn: "N/A",
    bids: "For Sale",
    type: "sale",
  },
  {
    id: "rivian-r1t-2022",
    tagText: "ELECTRIC", // updated
    tagColor: "#00ACC1",
    title: "RIVIAN R1T",
    subtitle: "2022 Rivian R1T Launch Edition",
    price: "AED 79,000",
    mileage: "15,000 m",
    endsIn: "N/A",
    bids: "For Sale",
    type: "sale",
  },
  {
    id: "porsche-gt3-2022",
    tagText: "TRACK READY", // updated
    tagColor: "#8E24AA",
    title: "PORSCHE 911 GT3",
    subtitle: "2022 Porsche 911 GT3 Touring",
    price: "AED 255,000",
    mileage: "2,900 m",
    endsIn: "N/A",
    bids: "For Sale",
    type: "sale",
  },
];



const createDetailedAuction = (
  base: BaseAuctionData,
  template: AuctionTemplate
): AuctionItem => {
  const parsePrice = (priceString: string): number =>
    parseInt(priceString.replace(/[^0-9]/g, ""), 10) || 0;
  const currentBid = parsePrice(base.price);

  return {
    ...base,
    details: {
      ...template,
      id: base.id,
      title: base.subtitle,
      auctionStatus: {
        ...template.auctionStatus,
        auctionId: `#AU-${new Date().getFullYear()}-${Math.floor(
          Math.random() * 10000
        )}`,
        currentBid,
        bidCount: parseInt(base.bids.replace(/[^0-9]/g, ""), 10) || 0,
        reserveMet: base.tagText === "RESERVE MET",
        ends:
          base.type === "auction"
            ? `Ends in ${base.endsIn}`
            : "Available for Immediate Purchase",
        location: "Beverly Hills, CA",
        shipping: "Buyer Arranges",
      },
      vehicleSpecs: template.vehicleSpecs.map((spec: VehicleSpec) =>
        spec.label === "Mileage" ? { ...spec, value: base.mileage } : spec
      ),
      buyNowPrice:
        base.type === "sale"
          ? currentBid
          : Math.round((currentBid * 1.25) / 1000) * 1000,
    },
  };
};

// --- LOGIC TO SELECT THE CORRECT TEMPLATE FOR EACH CAR ---

const getTemplateForCar = (id: string): AuctionTemplate => {
  if (
    id.includes("g63") ||
    id.includes("range-rover") ||
    id.includes("cullinan") ||
    id.includes("defender") ||
    id.includes("rivian")
  ) {
    return suvDetailTemplate;
  }
  if (id.includes("mustang")) {
    return classicCarDetailTemplate;
  }
  return supercarDetailTemplate;
};

// --- EXPORTED DATA ARRAYS ---

export const auctionData: AuctionItem[] = baseAuctionData.map((car) => {
  return createDetailedAuction(car, getTemplateForCar(car.id));
});

export const featuredAuctionsData: AuctionItem[] = baseFeaturedAuctionsData.map(
  (car) => {
    return createDetailedAuction(car, getTemplateForCar(car.id));
  }
);

export const featuredForSaleData: AuctionItem[] = baseFeaturedForSaleData.map(
  (car) => {
    return createDetailedAuction(car, getTemplateForCar(car.id));
  }
);
export const hotDealForSaleData: AuctionItem[] = baseFeaturedForSaleData
  .filter((car) => car.tagText === "HOT DEAL")
  .map((car) => createDetailedAuction(car, getTemplateForCar(car.id)));

export const hotBidAuctionsData: AuctionItem[] = baseAuctionData
  .filter((car) => car.tagText === "HOT BID")
  .map((car) => createDetailedAuction(car, getTemplateForCar(car.id)));

export const findAuctionById = (id: string): AuctionItem | undefined => {
  const allItems = [
    ...auctionData,
    ...featuredAuctionsData,
    ...featuredForSaleData,
  ];
  // Remove duplicates that might exist between featured and regular lists
  const uniqueItems = allItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );
  return uniqueItems.find((item) => item.id === id);
};
export const forSaleCarsData: AuctionItem[] = baseFeaturedForSaleData
  .filter((car) => car.type === "sale")
  .map((car) => createDetailedAuction(car, getTemplateForCar(car.id)));

