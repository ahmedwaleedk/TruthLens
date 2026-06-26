import { Document } from 'mongoose';
export type NewsSyncMetaDocument = NewsSyncMeta & Document;
export declare class NewsSyncMeta {
    feed_id: string;
    last_success_at: string | null;
    last_attempt_at: string | null;
    last_error: string | null;
    article_count: number;
}
export declare const NewsSyncMetaSchema: import("mongoose").Schema<NewsSyncMeta, import("mongoose").Model<NewsSyncMeta, any, any, any, Document<unknown, any, NewsSyncMeta, any, {}> & NewsSyncMeta & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NewsSyncMeta, Document<unknown, {}, import("mongoose").FlatRecord<NewsSyncMeta>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<NewsSyncMeta> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
