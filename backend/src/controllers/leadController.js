"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportLeadsCsv = exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeadById = exports.getLeads = void 0;
const express_1 = require("express");
const Lead_1 = __importDefault(require("../models/Lead"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const json2csv_1 = require("json2csv");
const getLeads = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const { status, source, search, sort } = req.query;
        let query = {};
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
        let sortOption = { createdAt: -1 }; // Default Latest
        if (sort === 'Oldest') {
            sortOption = { createdAt: 1 };
        }
        const total = await Lead_1.default.countDocuments(query);
        const leads = await Lead_1.default.find(query)
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
    }
    catch (error) {
        next(error);
    }
};
exports.getLeads = getLeads;
const getLeadById = async (req, res, next) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id).populate('createdBy', 'name email');
        if (lead) {
            res.json(lead);
        }
        else {
            res.status(404);
            throw new Error('Lead not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getLeadById = getLeadById;
const createLead = async (req, res, next) => {
    try {
        const { name, email, status, source } = req.body;
        const lead = new Lead_1.default({
            name,
            email,
            status: status || 'New',
            source,
            createdBy: req.user._id,
        });
        const createdLead = await lead.save();
        res.status(201).json(createdLead);
    }
    catch (error) {
        next(error);
    }
};
exports.createLead = createLead;
const updateLead = async (req, res, next) => {
    try {
        const { name, email, status, source } = req.body;
        const lead = await Lead_1.default.findById(req.params.id);
        if (lead) {
            lead.name = name || lead.name;
            lead.email = email || lead.email;
            lead.status = status || lead.status;
            lead.source = source || lead.source;
            const updatedLead = await lead.save();
            res.json(updatedLead);
        }
        else {
            res.status(404);
            throw new Error('Lead not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead_1.default.findById(req.params.id);
        if (lead) {
            await lead.deleteOne();
            res.json({ message: 'Lead removed' });
        }
        else {
            res.status(404);
            throw new Error('Lead not found');
        }
    }
    catch (error) {
        next(error);
    }
};
exports.deleteLead = deleteLead;
const exportLeadsCsv = async (req, res, next) => {
    try {
        const { status, source, search, sort } = req.query;
        let query = {};
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
        let sortOption = { createdAt: -1 };
        if (sort === 'Oldest') {
            sortOption = { createdAt: 1 };
        }
        const leads = await Lead_1.default.find(query).sort(sortOption).populate('createdBy', 'name email');
        const fields = ['_id', 'name', 'email', 'status', 'source', 'createdAt'];
        const opts = { fields };
        const csv = await (0, json2csv_1.parseAsync)(leads, opts);
        res.header('Content-Type', 'text/csv');
        res.attachment('leads.csv');
        return res.send(csv);
    }
    catch (error) {
        next(error);
    }
};
exports.exportLeadsCsv = exportLeadsCsv;
//# sourceMappingURL=leadController.js.map