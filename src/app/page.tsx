'use client';

import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Dynamic component imports with error boundaries
const CustomerCardDemo = () => {
  try {
    // Try to import CustomerCard - this will work after Exercise 3
    const CustomerCard = require('../components/CustomerCard')?.default;
    const mockCustomers = require('../data/mock-customers')?.mockCustomers;

    if (CustomerCard && mockCustomers?.[0]) {
      return (
        <div className="space-y-4">
          <p className="text-sm font-medium text-green-600 dark:text-green-500">
            ✅ CustomerCard implemented!
          </p>
          <div className="flex flex-wrap gap-4">
            <CustomerCard customer={mockCustomers[0]} />
            <CustomerCard customer={mockCustomers[1]} />
          </div>
        </div>
      );
    }
  } catch (error) {
    // Component doesn't exist yet
  }

  return (
    <div className="text-sm text-muted-foreground">
      After Exercise 3, your CustomerCard components will appear here showing customer information with health scores.
    </div>
  );
};

const DashboardWidgetDemo = ({ widgetName, exerciseNumber }: { widgetName: string, exerciseNumber: number }) => {
  return (
    <div className="rounded-lg border-2 border-dashed border-border p-4 text-center text-sm text-muted-foreground">
      {widgetName}
      <br />
      <span className="text-xs">Exercise {exerciseNumber}</span>
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <header className="mb-8">
        <h1 className="mb-2 font-heading text-4xl font-bold text-foreground">
          Customer Intelligence Dashboard
        </h1>
        <p className="text-muted-foreground">
          AI for Engineering Teams Workshop - Your Progress
        </p>
      </header>

      {/* Progress Indicator */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Workshop Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p className="text-foreground">✅ Setup Complete - Next.js app is running</p>
          <p>⏳ Exercise 3: CustomerCard component (implement to see here)</p>
          <p>⏳ Exercise 4: CustomerSelector integration</p>
          <p>⏳ Exercise 5: Domain Health widget</p>
          <p>⏳ Exercise 9: Production-ready features</p>
        </CardContent>
      </Card>

      {/* Component Showcase Area */}
      <div className="space-y-8">
        {/* CustomerCard Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">CustomerCard Component</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
              <CustomerCardDemo />
            </Suspense>
          </CardContent>
        </Card>

        {/* Dashboard Widgets Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dashboard Widgets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DashboardWidgetDemo widgetName="Domain Health Widget" exerciseNumber={5} />
              <DashboardWidgetDemo widgetName="Market Intelligence" exerciseNumber={6} />
              <DashboardWidgetDemo widgetName="Predictive Alerts" exerciseNumber={8} />
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <Card className="bg-accent text-accent-foreground">
          <CardHeader>
            <CardTitle className="text-lg">Ready to Start Building?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Follow along with the workshop exercises to see this dashboard come to life with AI-generated components.
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="mb-1"><strong className="text-foreground">Next:</strong> Exercise 1 - Create your first specification</p>
              <p className="mb-1"><strong className="text-foreground">Then:</strong> Exercise 3 - Generate your first component</p>
              <p className="text-xs">💡 Tip: Refresh this page after completing exercises to see your progress!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
