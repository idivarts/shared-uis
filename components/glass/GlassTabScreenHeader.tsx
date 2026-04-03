import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { getHeaderTitle } from "@react-navigation/elements";
import { useTheme } from "@react-navigation/native";
import React from "react";

import GlassAppBar from "./GlassAppBar";

const GlassTabScreenHeader = ({ options, route }: BottomTabHeaderProps) => {
    const theme = useTheme();
    const title = getHeaderTitle(options, route.name);
    const trailing = options.headerRight?.({ tintColor: theme.colors.text, canGoBack: true });

    return (
        <GlassAppBar applyTopSafeArea title={title} trailing={trailing} />
    );
};

export default GlassTabScreenHeader;
