import { Document } from 'mongoose';
export type TrustedNewsDocument = TrustedNews & Document;
export declare class TrustedNews {
    link: string;
    title: string;
    summary: string;
    image_url: string | null;
    published_at: string;
    source: string;
    synced_at: string;
}
export declare const TrustedNewsSchema: import("mongoose").Schema<TrustedNews, import("mongoose").Model<TrustedNews, any, any, any, Document<unknown, any, TrustedNews, any, {}> & TrustedNews & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TrustedNews, Document<unknown, {}, import("mongoose").FlatRecord<TrustedNews>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<TrustedNews> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
