'use client';

import { Suspense } from 'react';

// Dynamic component imports with error boundaries
const CustomerCardDemo = () => {
  try {
    // Try to import CustomerCard - this will work after Exercise 3
    const CustomerCard = require('../components/CustomerCard')?.default;
    const mockCustomers = require('../data/mock-customers')?.mockCustomers;
    
    if (CustomerCard && mockCustomers?.[0]) {
      return (
        <div className="space-y-4">
          <p className="text-green-600 text-sm font-medium">✅ CustomerCard implemented!</p>
          <div className="flex flex-wrap gap-4">
            <CustomerCard customer={mockCustomers[0]} />
            <CustomerCard customer={mockCustomers[1]} />
          </div>
        </div>
      );
    }
  } catch {
    // Component doesn't exist yet
  }

  return (
    <div className="text-gray-500 text-sm">
      After Exercise 3, your CustomerCard components will appear here showing customer information with health scores.
    </div>
  );
};

const CustomerHealthDemo = () => {
  try {
    // Try to import CustomerHealthDisplay - this will work after implementation
    const CustomerHealthDisplay = require('../components/CustomerHealthDisplay')?.default;
    const mockCustomers = require('../data/mock-customers')?.mockCustomers;

    if (CustomerHealthDisplay && mockCustomers?.[0]) {
      return (
        <div className="space-y-4">
          <p className="text-green-600 text-sm font-medium">✅ Health Score Calculator implemented!</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Show health scores for first 3 customers */}
            {mockCustomers.slice(0, 3).map((customer: any) => (
              customer.healthData ? (
                <CustomerHealthDisplay key={customer.id} customerId={customer.id} />
              ) : null
            ))}
          </div>
        </div>
      );
    }
  } catch {
    // Component doesn't exist yet
  }

  return (
    <div className="text-gray-500 text-sm">
      Health Score Calculator will appear here showing customer health metrics with expandable factor breakdowns.
    </div>
  );
};

const MarketIntelligenceDemo = () => {
  try {
    // Try to import MarketIntelligenceWidget
    const MarketIntelligenceWidget = require('../components/MarketIntelligenceWidget')?.default;
    const mockCustomers = require('../data/mock-customers')?.mockCustomers;

    if (MarketIntelligenceWidget && mockCustomers?.[0]) {
      return (
        <div className="space-y-4">
          <p className="text-green-600 text-sm font-medium">✅ Market Intelligence Widget implemented!</p>
          <p className="text-sm text-gray-600 mb-4">
            Real-time market sentiment and news analysis for customer companies.
          </p>
          <MarketIntelligenceWidget companyName={mockCustomers[0].company} />
        </div>
      );
    }
  } catch {
    // Component doesn't exist yet
  }

  return (
    <div className="text-gray-500 text-sm">
      Market Intelligence Widget will appear here showing market sentiment and recent news headlines.
    </div>
  );
};

const DashboardWidgetDemo = ({ widgetName, exerciseNumber }: { widgetName: string, exerciseNumber: number }) => {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center text-gray-500 text-sm">
      {widgetName}
      <br />
      <span className="text-xs">Exercise {exerciseNumber}</span>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Customer Intelligence Dashboard
        </h1>
        <p className="text-gray-600">
          AI for Engineering Teams Workshop - Your Progress
        </p>
      </header>

      {/* Progress Indicator */}
      <div className="mb-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Workshop Progress</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>✅ Setup Complete - Next.js app is running</p>
          <p>✅ Health Score Calculator - Multi-factor customer health scoring implemented</p>
          <p className="text-gray-400">⏳ Exercise 3: CustomerCard component (implement to see here)</p>
          <p className="text-gray-400">⏳ Exercise 4: CustomerSelector integration</p>
          <p className="text-gray-400">⏳ Exercise 5: Domain Health widget</p>
          <p className="text-gray-400">⏳ Exercise 9: Production-ready features</p>
        </div>
      </div>

      {/* Component Showcase Area */}
      <div className="space-y-8">
        {/* CustomerCard Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">CustomerCard Component</h3>
          <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
            <CustomerCardDemo />
          </Suspense>
        </section>

        {/* Health Score Calculator Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Health Score Calculator</h3>
          <p className="text-sm text-gray-600 mb-4">
            Multi-factor customer health scoring: Payment (40%), Engagement (30%), Contract (20%), Support (10%)
          </p>
          <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
            <CustomerHealthDemo />
          </Suspense>
        </section>

        {/* Market Intelligence Widget Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Market Intelligence Widget</h3>
          <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
            <MarketIntelligenceDemo />
          </Suspense>
        </section>

        {/* Dashboard Widgets Section */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Dashboard Widgets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardWidgetDemo widgetName="Domain Health Widget" exerciseNumber={5} />
            <DashboardWidgetDemo widgetName="Predictive Alerts" exerciseNumber={8} />
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Start Building?</h3>
          <p className="text-blue-800 mb-4">
            Follow along with the workshop exercises to see this dashboard come to life with AI-generated components.
          </p>
          <div className="text-sm text-blue-700">
            <p className="mb-1"><strong>Next:</strong> Exercise 1 - Create your first specification</p>
            <p className="mb-1"><strong>Then:</strong> Exercise 3 - Generate your first component</p>
            <p className="text-xs text-blue-600">💡 Tip: Refresh this page after completing exercises to see your progress!</p>
          </div>
        </section>
      </div>
    </div>
  );
}
