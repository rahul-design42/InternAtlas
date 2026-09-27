import { Router } from 'express';
import { getOpportunities, getOpportunityBySlug, getCategories, getSkills, getSitemap } from '../controllers/publicController';

const router = Router();

router.get('/sitemap.xml', getSitemap);
router.get('/opportunities', getOpportunities);
router.get('/opportunities/:slug', getOpportunityBySlug);
router.get('/categories', getCategories);
router.get('/skills', getSkills);

export default router;
