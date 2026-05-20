import { IBrands } from "@/shared-libs/firestore/trendly-pro/models/brands";
import React, { createContext, useContext } from "react";

export interface DiscoverConfig {
    managerId: string | null;
    isAdmin?: boolean;
    selectedBrand: IBrands | null;
    updateBrand: (brandId: string, updates: Partial<IBrands>) => Promise<void>;
    isOnFreeTrial: boolean;
    isProfileLocked: (influencerId: string) => boolean;
    niches: string[];
    searchNiches: (query: string) => Promise<string[]>;
    getAllNiches: () => string[];
    isLoadingNiches: boolean;
    demoLink?: string;
    components: {
        AppLayout: React.ComponentType<{ safeAreaEdges?: string[]; children: React.ReactNode }>;
        PageHeader: React.ComponentType<any>;
        InfluencerCard: React.ComponentType<any>;
        InviteToCampaignButton: React.ComponentType<any>;
        BottomSheetScrollContainer: React.ComponentType<any>;
    };
}

const DiscoverConfigContext = createContext<DiscoverConfig>({} as DiscoverConfig);
export const useDiscoverConfig = () => useContext(DiscoverConfigContext);
export const DiscoverConfigProvider = DiscoverConfigContext.Provider;
