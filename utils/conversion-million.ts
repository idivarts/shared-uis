export const convertToMUnits = (num: number) => {
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(1)}M`;
    }
    return num;
};
