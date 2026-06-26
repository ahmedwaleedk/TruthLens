import { Model } from 'mongoose';
import { DetectionDocument } from '../schemas/detection.schema';
import { CreateDetectionDto } from './dto/create-detection.dto';
import { UpdateDetectionDto } from './dto/update-detection.dto';
export declare class DetectionsService {
    private detectionModel;
    constructor(detectionModel: Model<DetectionDocument>);
    private isAdmin;
    create(createDto: CreateDetectionDto, userId: string): Promise<DetectionDocument>;
    findAll(userId: string): Promise<DetectionDocument[]>;
    findOne(id: string, userId: string): Promise<DetectionDocument>;
    update(id: string, updateDto: UpdateDetectionDto, userId: string): Promise<DetectionDocument>;
    remove(id: string, userId: string): Promise<void>;
    getStats(userId: string): Promise<{
        total_detections: number;
        fake_count: number;
        real_count: number;
        average_confidence: number;
        recent_detections: {
            id: string;
            label: string;
            confidence: number;
            created_at: string;
            text_snippet: string;
        }[];
    }>;
}
