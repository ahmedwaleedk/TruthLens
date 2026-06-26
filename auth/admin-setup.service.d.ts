import { OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
export declare class AdminSetupService implements OnModuleInit {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    onModuleInit(): Promise<void>;
    private setupDefaultAdmin;
}
