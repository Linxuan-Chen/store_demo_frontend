export const getInventoryMsgMap = (inventory: number) => [
    'Out of stock',
    `Only ${inventory} left in stock`,
    'In stock',
];
export const INVENTORY_COLOR_MAP: Array<'error' | 'warning' | 'success'> = [
    'error',
    'warning',
    'success',
];
