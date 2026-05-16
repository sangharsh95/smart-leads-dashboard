import { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../middlewares/authMiddleware';
import { parseAsync } from 'json2csv';

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { status, source, search, sort } = req.query;

    let query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption: any = { createdAt: -1 }; // Default Latest
    if (sort === 'Oldest') {
      sortOption = { createdAt: 1 };
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email');

    res.json({
      leads,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (lead) {
      res.json(lead);
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, status, source } = req.body;

    const lead = new Lead({
      name,
      email,
      status: status || 'New',
      source,
      createdBy: req.user!._id,
    });

    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name, email, status, source } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.name = name || lead.name;
      lead.email = email || lead.email;
      lead.status = status || lead.status;
      lead.source = source || lead.source;

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await lead.deleteOne();
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

export const exportLeadsCsv = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status, source, search, sort } = req.query;

    let query: any = {};

    if (status) {
      query.status = status;
    }

    if (source) {
      query.source = source;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'Oldest') {
      sortOption = { createdAt: 1 };
    }

    const leads = await Lead.find(query).sort(sortOption).populate('createdBy', 'name email');

    const fields = ['_id', 'name', 'email', 'status', 'source', 'createdAt'];
    const opts = { fields };

    const csv = await parseAsync(leads, opts);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
