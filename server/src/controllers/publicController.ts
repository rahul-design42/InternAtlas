import { Request, Response } from 'express';
import { Opportunity, Category, Skill } from '../models';

export const getOpportunities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, page = 1, limit = 10, search, category, location, workMode, duration, skills, minStipend } = req.query;

    const query: any = { status: 'PUBLISHED' };

    if (type) query.type = type;
    if (category) query.categoryId = category;
    if (location) query.location = { $regex: new RegExp(location as string, 'i') };
    
    if (workMode) {
      if (Array.isArray(workMode)) {
        query.workMode = { $in: workMode };
      } else {
        query.workMode = workMode;
      }
    }

    if (duration) {
      if (Array.isArray(duration)) {
        query.duration = { $in: duration.map(d => new RegExp(String(d).replace(/[^a-zA-Z0-9- ]/g, ''), 'i')) };
      } else {
        query.duration = { $regex: new RegExp(String(duration).replace(/[^a-zA-Z0-9- ]/g, ''), 'i') };
      }
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      const skillDocs = await Skill.find({ name: { $in: skillsArray.map((s: any) => new RegExp('^' + String(s).trim() + '$', 'i')) } });
      if (skillDocs.length > 0) {
        query.skills = { $in: skillDocs.map(s => s._id) };
      }
    }

    if (minStipend && !isNaN(Number(minStipend))) {
      // In MongoDB, stipend is a string e.g. "₹35,000 / month". 
      // We will do a post-fetch filter for this to preserve DB simplicity, or rely on frontend.
    }

    let projection: any = {};
    let sortObj: any = { publishedAt: -1, createdAt: -1 };

    if (search) {
      query.$text = { $search: search as string };
      projection = { score: { $meta: 'textScore' } };
      sortObj = { score: { $meta: 'textScore' } };
    }

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const opportunities = await Opportunity.find(query, projection)
      .populate('organizationId', 'name logo isVerified slug verificationStatus')
      .populate('categoryId', 'name')
      .populate('skills', 'name')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNumber);

    const total = await Opportunity.countDocuments(query);

    res.status(200).json({
      success: true,
      data: opportunities,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOpportunityBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const opportunity = await Opportunity.findOne({ slug, status: 'PUBLISHED' })
      .populate('organizationId', 'name logo isVerified slug description website industry companySize location verificationStatus socialLinks')
      .populate('categoryId', 'name')
      .populate('skills', 'name');

    if (!opportunity) {
      res.status(404).json({ success: false, message: 'Opportunity not found' });
      return;
    }

    // Increment views async
    Opportunity.findByIdAndUpdate(opportunity._id, { $inc: { views: 1 } }).exec();

    res.status(200).json({ success: true, data: opportunity });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: categories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const skills = await Skill.find().sort({ name: 1 });
    res.status(200).json({ success: true, data: skills });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSitemap = async (req: Request, res: Response): Promise<void> => {
  try {
    const opportunities = await Opportunity.find({ status: 'PUBLISHED' }).select('slug updatedAt').sort({ updatedAt: -1 }).limit(1000);
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://internatlas.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    opportunities.forEach(opp => {
      xml += `<url>
    <loc>https://internatlas.com/opportunities/\${opp.slug}</loc>
    <lastmod>\${opp.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error: any) {
    res.status(500).send('Error generating sitemap');
  }
};
