export const getFormattedNumber = (value: number): string => {
    if (value >= 1000000) {
        const formatted = value / 1000000;
        return formatted % 1 === 0 ? formatted.toFixed(0) + 'M' : formatted.toFixed(1) + 'M';
    } else if (value >= 1000) {
        const formatted = value / 1000;
        return formatted % 1 === 0 ? formatted.toFixed(0) + 'K' : formatted.toFixed(1) + 'K';
    } else {
        return value.toString();
    }
};
  