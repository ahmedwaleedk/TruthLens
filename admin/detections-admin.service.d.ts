import { Model } from 'mongoose';
import { DetectionDocument } from '../schemas/detection.schema';
export declare class DetectionsAdminService {
    private detectionModel;
    constructor(detectionModel: Model<DetectionDocument>);
    findAll(filters: {
        user?: string;
        label?: string;
        startDate?: string;
        endDate?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        detections: {
            id: string;
            user_id: string;
            text: string;
            image_url: string;
            url: string;
            label: string;
            confidence: number;
            explanation: string;
            created_at: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        user_id: string;
        text: string;
        image_url: string;
        url: string;
        label: string;
        confidence: number;
        explanation: string;
        created_at: string;
    }>;
    update(id: string, updateData: {
        label?: string;
        confidence?: number;
        explanation?: string;
        text?: string;
        url?: string;
        image_url?: string;
    }): Promise<{
        id: string;
        user_id: string;
        text: string;
        image_url: string;
        url: string;
        label: string;
        confidence: number;
        explanation: string;
        created_at: string;
    }>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
