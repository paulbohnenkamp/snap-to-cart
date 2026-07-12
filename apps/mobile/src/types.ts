export type ProductCandidate = { id: string; brand: string; name: string; variant?: string; size?: string; confidence: number; upc?: string; price?: number; imageUrl?: string; selected?: boolean; quantity?: number };
export type ScanResult = { scanId: string; demoMode: boolean; products: ProductCandidate[] };
