import fs from 'fs';
import path from 'path';

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    tags: string[];
}

export interface ServiceFAQ {
    serviceId: string;
    serviceName: string;
    faqs: FAQ[];
}

let cachedFaqs: ServiceFAQ[] | null = null;

export function getAllFaqs(): ServiceFAQ[] {
    if (cachedFaqs) return cachedFaqs;

    try {
        const faqsDir = path.join(process.cwd(), 'src', 'content', 'faqs');
        const files = fs.readdirSync(faqsDir);
        const all: ServiceFAQ[] = [];

        for (const file of files) {
            if (file.endsWith('.json')) {
                const content = fs.readFileSync(path.join(faqsDir, file), 'utf-8');
                const parsed = JSON.parse(content) as ServiceFAQ;
                if (parsed.faqs && Array.isArray(parsed.faqs)) {
                    all.push(parsed);
                }
            }
        }
        cachedFaqs = all;
        return all;
    } catch (e) {
        console.error('[faq-rag] Failed to load FAQs:', e);
        return [];
    }
}

export function retrieveTopFaqs(userMessage: string, topK: number = 3): { faq: FAQ; serviceName: string; score: number }[] {
    const allServices = getAllFaqs();
    const query = userMessage.toLowerCase();
    const queryTokens = query.split(/\W+/).filter(t => t.length > 2);

    const scoredFaqs: { faq: FAQ; serviceName: string; score: number }[] = [];

    for (const service of allServices) {
        for (const faq of service.faqs) {
            let score = 0;

            // Score against question
            const qTokens = faq.question.toLowerCase().split(/\W+/);
            for (const qt of qTokens) {
                if (queryTokens.includes(qt)) score += 2;
            }

            // Score against tags (higher weight)
            for (const tag of faq.tags) {
                if (query.includes(tag.toLowerCase())) {
                    score += 5;
                }
            }

            // Score against service name
            const sNameLower = service.serviceName.toLowerCase();
            if (query.includes(sNameLower.split(' ')[0])) {
                score += 1; // minor boost if they mention the service name broadly
            }

            if (score > 0) {
                scoredFaqs.push({ faq, serviceName: service.serviceName, score });
            }
        }
    }

    // Sort descending by score
    scoredFaqs.sort((a, b) => b.score - a.score);

    return scoredFaqs.slice(0, topK);
}
