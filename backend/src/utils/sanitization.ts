/**
 * Content sanitization utilities
 * Removes/escapes potentially dangerous content from user inputs
 */

/**
 * Sanitize HTML content - removes script tags and dangerous attributes
 */
export function sanitizeHtml(input: string): string {
    if (!input) return '';

    // Remove script tags
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers (onclick, onerror, etc.)
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*\S+/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove data: protocol (except for safe data URLs)
    sanitized = sanitized.replace(/data:(?!image\/)/gi, '');

    return sanitized.trim();
}

/**
 * Sanitize message content
 */
export function sanitizeMessage(content: string): string {
    if (!content) return '';

    // Basic HTML sanitization
    let sanitized = sanitizeHtml(content);

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Limit consecutive newlines
    sanitized = sanitized.replace(/\n{4,}/g, '\n\n\n');

    return sanitized.trim();
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
    if (!url) return null;

    try {
        const urlObj = new URL(url);

        // Only allow http and https protocols
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return null;
        }

        return urlObj.href;
    } catch {
        // Invalid URL
        return null;
    }
}

/**
 * Check for profanity or inappropriate content (basic)
 * In production, use a proper content moderation service
 */
const PROFANITY_PATTERNS: (string | RegExp)[] = [
    // Add patterns as needed, this is just a placeholder
    // In production, use a library like 'bad-words' or a service like AWS Comprehend
];

export function containsProfanity(text: string): boolean {
    const lowerText = text.toLowerCase();

    return PROFANITY_PATTERNS.some(pattern => {
        if (typeof pattern === 'string') {
            return lowerText.includes(pattern);
        }
        return pattern.test(lowerText);
    });
}

/**
 * Check for spam patterns
 */
export function isSpam(text: string): boolean {
    const lowerText = text.toLowerCase();

    // Check for excessive repetition
    const words = lowerText.split(/\s+/);
    const uniqueWords = new Set(words);
    if (words.length > 20 && uniqueWords.size < words.length * 0.3) {
        return true; // More than 70% repeated words
    }

    // Check for excessive caps
    const capsCount = (text.match(/[A-Z]/g) || []).length;
    if (text.length > 10 && capsCount / text.length > 0.7) {
        return true; // More than 70% caps
    }

    // Check for excessive URLs
    const urlMatches = text.match(/https?:\/\/[^\s]+/g) || [];
    if (urlMatches.length > 3) {
        return true; // More than 3 URLs
    }

    return false;
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFilename(filename: string): string {
    if (!filename) return 'unnamed';

    // Remove path traversal attempts
    let sanitized = filename.replace(/[\/\\]/g, '');

    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>:"|?*\x00-\x1f]/g, '');

    // Limit length
    if (sanitized.length > 255) {
        const ext = sanitized.split('.').pop();
        const name = sanitized.substring(0, 250 - (ext?.length || 0));
        sanitized = ext ? `${name}.${ext}` : name;
    }

    return sanitized || 'unnamed';
}

/**
 * Escape special characters for safe display
 */
export function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, m => map[m]);
}
