import { Model } from 'mongoose';
import { DashboardItemDocument } from '../schemas/dashboard-item.schema';
export declare class DashboardItemsController {
    private dashboardItemModel;
    constructor(dashboardItemModel: Model<DashboardItemDocument>);
    getActiveItems(): Promise<{
        id: string;
        title: string;
        description: string;
        url: string;
        source: string;
        tags: string[];
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }[]>;
}
