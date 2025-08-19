import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from 'react';

export interface AuctionCardProps {
  id: string;
  tagText: string;
  tagColor: string;
  title: string;
  subtitle: string;
  price: string;
  mileage: string;
  endsIn: string;
  bids: string;
  type?: 'sale' | 'auction' | string;
  viewMode?: 'list' | 'grid';
}
export interface SpecItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
}

export type ViewMode = 'grid' | 'list';

export interface AuctionControlsProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}
export interface FeaturedAuctionsProps {
  data: AuctionCardProps[];
}
export interface AuctionHeaderProps {
  onFilterPress: () => void;
}
export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface AuctionItem {
  id: string;
  tagText: string;
  tagColor: string;
  title: string;
  subtitle: string;
  price: string;
  mileage: string;
  endsIn: string;
  bids: string;
  type: 'auction' | 'sale';
  details: AuctionDetail;
}
export interface VehicleSpec {
  label: string;
  value: string;
  icon: IconName;
}
export interface PerformanceSpec {
  label: string;
  value: string;
  subValue?: string;
}

export interface HistoryEvent {
  title: string;
  date: string;
  details: string;
  statusTag: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export interface Bid {
  user: string;
  amount: string;
  time: string;
}

export interface Seller {
  name: string;
  avatarUrl: string; // URL to the seller's image
  rating: number;
  reviews: number;
  description: string;
  carsSold: number;
  positiveFeedback: string;
}

export interface AuctionStatus {
  auctionId: string;
  currentBid: number;
  bidCount: number;
  bidHistory: BidHistoryItem[];
  reserveMet: boolean;
  ends: string;
  location: string;
  shipping: string;
}

// This is the main interface for the entire detail object
export interface AuctionDetail {
  id: string;
  title: string;
  tags: string[];
  images: string[];
  vehicleSpecs: VehicleSpec[];
  performanceSpecs: PerformanceSpec[];
  exteriorFeatures: string[];
  interiorFeatures: string[];
  vehicleHistory: VehicleHistoryItem[];
  sellerInfo: SellerInfo;
  auctionStatus: AuctionStatus;
  buyNowPrice: number;
}
export interface Auction {
  id: string;
  tagText: string;
  tagColor: string;
  title: string;
  subtitle: string;
  price: string;
  mileage: string;
  endsIn: string;
  bids: string;
  type: 'sale' | 'auction' | string;
  details?: AuctionDetail; 
}


// Base type for icons used in the app
export type IconName = ComponentProps<typeof Ionicons>['name'];

// Interfaces from your mockData file
export interface BaseAuction {
  id: string;
  tagText: string;
  tagColor: string;
  title: string;
  subtitle: string;
  price: string;
  mileage: string;
  endsIn: string;
  bids: string;
  type: string;
}

export interface AuctionItem extends BaseAuction {
  details: DetailedAuctionDetails;
}

export interface DetailedAuctionDetails {
  id: string;
  title: string;
  tags: string[];
  images: string[];
  vehicleSpecs: VehicleSpec[];
  performanceSpecs: PerformanceSpec[];
  exteriorFeatures: string[];
  interiorFeatures: string[];
  vehicleHistory: VehicleHistoryItem[];
  sellerInfo: SellerInfo;
  auctionStatus: AuctionStatus;
  buyNowPrice: number;
}

export interface VehicleSpec {
  label: string;
  value: string;
  icon: IconName;
}

export interface PerformanceSpec {
  label:string;
  value: string;
  subValue?: string;
}

export interface VehicleHistoryItem {
  title: string;
  date: string;
  details: string;
  statusTag: string;
  icon: IconName;
}
export interface SellerInfo {
  name: string;
  avatarUrl: string;
  rating: number;
  reviews: number;
  description: string;
  carsSold: number;
  positiveFeedback: string;
}

export interface AuctionStatus {
  auctionId: string;
  currentBid: number;
  bidCount: number;
  bidHistory: BidHistoryItem[];
  reserveMet: boolean;
  ends: string;
  location: string;
  shipping: string;
}

export interface BidHistoryItem {
  user: string;
  amount: string;
  time: string;
}