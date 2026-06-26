import { Model } from 'mongoose';
import { DashboardItemDocument } from '../schemas/dashboard-item.schema';
export declare class DashboardItemsService {
    private dashboardItemModel;
    constructor(dashboardItemModel: Model<DashboardItemDocument>);
    findAll(activeOnly?: boolean): Promise<{
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
    findOne(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        url: string;
        source: string;
        tags: string[];
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }>;
    create(createData: {
        title: string;
        description?: string;
        url?: string;
        source?: string;
        tags?: string[];
        is_active?: boolean;
    }): Promise<{
        id: string;
        title: string;
        description: string;
        url: string;
        source: string;
        tags: string[];
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }>;
    update(id: string, updateData: {
        title?: string;
        description?: string;
        url?: string;
        source?: string;
        tags?: string[];
        is_active?: boolean;
    }): Promise<{
        id: string;
        title: string;
        description: string;
        url: string;
        source: string;
        tags: string[];
        is_active: boolean;
        created_at: string;
        updated_at: string;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
