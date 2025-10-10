/**
 * Market Intelligence API Route Handler
 * GET /api/market-intelligence/[company]
 * Returns market sentiment and news data for a specified company
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  MarketIntelligenceService,
  MarketIntelligenceError
} from '@/lib/services/marketIntelligenceService';

/**
 * GET handler for market intelligence data
 * @param request - Next.js request object
 * @param params - Route parameters containing company name (Promise in Next.js 15)
 * @returns JSON response with market intelligence data or error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ company: string }> }
) {
  try {
    const { company } = await params;

    // Simulate realistic API delay (500-1000ms)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Fetch market intelligence data
    const data = await MarketIntelligenceService.getMarketIntelligence(company);

    // Return successful response
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=300'
      }
    });

  } catch (error) {
    // Handle known MarketIntelligenceError
    if (error instanceof MarketIntelligenceError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code
        },
        { status: error.statusCode }
      );
    }

    // Handle unknown errors
    console.error('Unexpected error in market intelligence API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}
