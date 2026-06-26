import { Document } from 'mongoose';
export type DetectionDocument = Detection & Document;
export declare class Detection {
    user_id: string;
    text: string;
    image_url: string;
    url: string;
    label: string;
    confidence: number;
    explanation: string;
    created_at: string;
}
export declare const DetectionSchema: import("mongoose").Schema<Detection, import("mongoose").Model<Detection, any, any, any, Document<unknown, any, Detection, any, {}> & Detection & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Detection, Document<unknown, {}, import("mongoose").FlatRecord<Detection>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Detection> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
