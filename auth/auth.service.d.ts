import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../schemas/user.schema';
import { AuditLogDocument } from '../schemas/audit-log.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private userModel;
    private auditLogModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, auditLogModel: Model<AuditLogDocument>, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto, ipAddress?: string): Promise<{
        access_token: string;
        username: string;
        role: string;
    }>;
    private logAudit;
    validateUser(username: string): Promise<UserDocument | null>;
}
