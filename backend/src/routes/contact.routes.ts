import express from 'express';
import { sendContactForm } from '../controllers/contact.controller';

const router = express.Router();

/**
 * POST /api/v1/contact/send
 * Submit contact form
 */
router.post('/send', sendContactForm);

export default router;
