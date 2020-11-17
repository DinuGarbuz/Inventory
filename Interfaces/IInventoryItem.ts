export interface IInventoryItem
{
    id: string;
    name: string;
    description: string;
    user: string;
    location: string;
    inventoryNumber: number;
    createdAt: Date;
    modifiedAt: Date;
    active: boolean;
}