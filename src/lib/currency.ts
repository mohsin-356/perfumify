export const formatPrice = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return "£0.00";
    return `£${amount.toFixed(2)}`;
};
