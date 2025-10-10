/**
 * Market Intelligence Service
 * Provides market sentiment and news analysis for companies with caching
 */

export type MarketSentiment = 'positive' | 'neutral' | 'negative';

export interface NewsHeadline {
  title: string;
  source: string;
  publishedAt: string; // ISO 8601
  url?: string;
}

export interface MarketIntelligenceData {
  company: string;
  sentiment: MarketSentiment;
  newsCount: number;
  headlines: NewsHeadline[];
  lastUpdated: string; // ISO 8601
  cached: boolean;
}

export class MarketIntelligenceError extends Error {
  constructor(
    message: string,
    public code: 'VALIDATION_ERROR' | 'SERVICE_ERROR' | 'UNKNOWN_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'MarketIntelligenceError';
  }
}

interface CacheEntry {
  data: MarketIntelligenceData;
  timestamp: number;
}

export class MarketIntelligenceService {
  private static cache = new Map<string, CacheEntry>();
  private static readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes
  private static readonly MAX_COMPANY_LENGTH = 100;

  /**
   * Retrieves market intelligence data for a company
   * Uses caching with 10-minute TTL
   * @param company - Company name
   * @returns Market intelligence data
   * @throws MarketIntelligenceError for validation or service failures
   */
  static async getMarketIntelligence(company: string): Promise<MarketIntelligenceData> {
    // Validate company input
    this.validateCompany(company);

    // Check cache first
    const cacheKey = company.toLowerCase().trim();
    const cachedEntry = this.cache.get(cacheKey);

    if (cachedEntry && this.isCacheValid(cachedEntry)) {
      return {
        ...cachedEntry.data,
        cached: true
      };
    }

    // Generate new mock data
    const data = this.generateMockData(company);

    // Store in cache
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  /**
   * Validates company name input
   * @param company - Company name to validate
   * @throws MarketIntelligenceError for invalid input
   */
  private static validateCompany(company: string): void {
    if (!company || typeof company !== 'string') {
      throw new MarketIntelligenceError(
        'Company name is required',
        'VALIDATION_ERROR',
        400
      );
    }

    const trimmed = company.trim();
    if (trimmed.length === 0) {
      throw new MarketIntelligenceError(
        'Company name cannot be empty',
        'VALIDATION_ERROR',
        400
      );
    }

    if (trimmed.length > this.MAX_COMPANY_LENGTH) {
      throw new MarketIntelligenceError(
        `Company name cannot exceed ${this.MAX_COMPANY_LENGTH} characters`,
        'VALIDATION_ERROR',
        400
      );
    }

    // Sanitize: allow alphanumeric, spaces, hyphens, and common punctuation
    const validPattern = /^[a-zA-Z0-9\s\-.,&'()]+$/;
    if (!validPattern.test(trimmed)) {
      throw new MarketIntelligenceError(
        'Company name contains invalid characters',
        'VALIDATION_ERROR',
        400
      );
    }
  }

  /**
   * Generates realistic mock market intelligence data
   * @param company - Company name
   * @returns Mock market intelligence data
   */
  private static generateMockData(company: string): MarketIntelligenceData {
    const trimmedCompany = company.trim();

    // Use company name to seed consistent sentiment
    const sentimentScore = this.hashString(trimmedCompany) % 3;
    const sentiment: MarketSentiment =
      sentimentScore === 0 ? 'positive' :
      sentimentScore === 1 ? 'neutral' : 'negative';

    // Generate 5-10 headlines
    const newsCount = 5 + (this.hashString(trimmedCompany) % 6);
    const headlines = this.generateHeadlines(trimmedCompany, newsCount);

    return {
      company: trimmedCompany,
      sentiment,
      newsCount,
      headlines: headlines.slice(0, 3), // Return top 3
      lastUpdated: new Date().toISOString(),
      cached: false
    };
  }

  /**
   * Generates realistic news headlines for a company
   * @param company - Company name
   * @param count - Number of headlines to generate
   * @returns Array of news headlines
   */
  private static generateHeadlines(company: string, count: number): NewsHeadline[] {
    const sources = [
      'TechCrunch',
      'Reuters',
      'Bloomberg',
      'Wall Street Journal',
      'Forbes',
      'Financial Times',
      'Business Insider',
      'The Verge'
    ];

    const templates = [
      `${company} announces new product initiative to expand market reach`,
      `${company} reports quarterly earnings that exceed analyst expectations`,
      `Market analysis: ${company}'s growth strategy shows promising results`,
      `${company} expands into new international markets with strategic partnerships`,
      `Industry experts weigh in on ${company}'s future prospects`,
      `${company} invests heavily in research and development for next-gen products`,
      `${company}'s CEO discusses company vision in exclusive interview`,
      `${company} acquires startup to strengthen technology portfolio`,
      `Analysts upgrade ${company} stock following strong performance`,
      `${company} launches innovative platform to transform customer experience`
    ];

    return Array.from({ length: count }, (_, i) => {
      // Use hash to determine which template and source to use
      const templateIndex = (this.hashString(company) + i) % templates.length;
      const sourceIndex = (this.hashString(company) + i * 2) % sources.length;

      return {
        title: templates[templateIndex],
        source: sources[sourceIndex],
        publishedAt: this.getRandomRecentDate(i),
        url: undefined // Optional for mock data
      };
    });
  }

  /**
   * Generates a random date within the last 7 days
   * @param seed - Seed for consistent randomization
   * @returns ISO 8601 date string
   */
  private static getRandomRecentDate(seed: number): string {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Use seed for consistent dates
    const randomFactor = Math.sin(seed) * 0.5 + 0.5; // Normalize to 0-1
    const randomTime = sevenDaysAgo + randomFactor * (now - sevenDaysAgo);

    return new Date(randomTime).toISOString();
  }

  /**
   * Simple string hash function for consistent pseudo-randomization
   * @param str - String to hash
   * @returns Hash value
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Checks if a cache entry is still valid
   * @param entry - Cache entry to check
   * @returns true if cache is valid, false otherwise
   */
  private static isCacheValid(entry: CacheEntry): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < this.CACHE_TTL;
  }

  /**
   * Clears the entire cache (useful for testing)
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Gets cache statistics (useful for monitoring)
   */
  static getCacheStats(): { size: number; ttl: number } {
    return {
      size: this.cache.size,
      ttl: this.CACHE_TTL
    };
  }
}
