/** Shared chrome for floating glass tab bar + headers (aligned margins and radius). */
export const GLASS_CHROME_RADIUS = 24;
/** Horizontal inset for floating pill from screen edges */
export const GLASS_CHROME_MARGIN_H = 10;
export const GLASS_CHROME_BLUR_INTENSITY = 80;

/** Inner bar height (row + vertical padding target) */
export const GLASS_BAR_MIN_HEIGHT = 50;
/** Space between safe-area top and glass pill start (tab header only) */
export const GLASS_APP_BAR_TOP_GAP = 4;
/** Space below glass pill before scene content */
export const GLASS_APP_BAR_BOTTOM_GAP = 4;

export const GLASS_TAB_BAR_HEIGHT = 64;
/** Gap from physical bottom to tab pill */
export const GLASS_TAB_BAR_MARGIN_BOTTOM = 10;

/** Bottom padding for scroll areas so last items clear the floating tab bar + home indicator. */
export function glassTabBarBottomReserve(bottomInset: number): number {
    return GLASS_TAB_BAR_HEIGHT + GLASS_TAB_BAR_MARGIN_BOTTOM + bottomInset + 8;
}

/**
 * Extra top padding when SafeAreaView already applied `top` inset — clears overlay glass header.
 */
export function floatingGlassHeaderContentPad(): number {
    return (
        GLASS_APP_BAR_TOP_GAP +
        GLASS_BAR_MIN_HEIGHT +
        GLASS_APP_BAR_BOTTOM_GAP +
        2
    );
}
