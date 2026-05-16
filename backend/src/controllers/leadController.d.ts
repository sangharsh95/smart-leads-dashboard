import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
export declare const getLeads: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getLeadById: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const createLead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateLead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteLead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const exportLeadsCsv: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=leadController.d.ts.map