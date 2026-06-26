import { Document } from 'mongoose';
export type DashboardItemDocument = DashboardItem & Document;
export declare class DashboardItem {
    title: string;
    description: string;
    url: string;
    source: string;
    tags: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}
export declare const DashboardItemSchema: import("mongoose").Schema<DashboardItem, import("mongoose").Model<DashboardItem, any, any, any, Document<unknown, any, DashboardItem, any, {}> & DashboardItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DashboardItem, Document<unknown, {}, import("mongoose").FlatRecord<DashboardItem>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<DashboardItem> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
