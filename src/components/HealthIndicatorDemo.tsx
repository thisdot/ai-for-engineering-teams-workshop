'use client'

import HealthIndicator from '@/components/HealthIndicator'

/**
 * Demo component to showcase HealthIndicator variants and edge cases
 * This demonstrates all acceptance criteria from the specification
 */
export default function HealthIndicatorDemo() {
  return (
    <div className="space-y-8 p-6 bg-gray-50 rounded-lg">
      <div>
        <h3 className="text-lg font-semibold mb-4">Badge Variant (Default)</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Small</p>
            <div className="flex gap-2">
              <HealthIndicator score={0} size="sm" />
              <HealthIndicator score={30} size="sm" />
              <HealthIndicator score={31} size="sm" />
              <HealthIndicator score={70} size="sm" />
              <HealthIndicator score={71} size="sm" />
              <HealthIndicator score={100} size="sm" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Medium (Default)</p>
            <div className="flex gap-2">
              <HealthIndicator score={0} />
              <HealthIndicator score={30} />
              <HealthIndicator score={31} />
              <HealthIndicator score={70} />
              <HealthIndicator score={71} />
              <HealthIndicator score={100} />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Large</p>
            <div className="flex gap-2">
              <HealthIndicator score={0} size="lg" />
              <HealthIndicator score={30} size="lg" />
              <HealthIndicator score={31} size="lg" />
              <HealthIndicator score={70} size="lg" />
              <HealthIndicator score={71} size="lg" />
              <HealthIndicator score={100} size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Dot Variant</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Small</p>
            <div className="flex gap-3 items-center">
              <HealthIndicator score={0} variant="dot" size="sm" />
              <HealthIndicator score={30} variant="dot" size="sm" />
              <HealthIndicator score={31} variant="dot" size="sm" />
              <HealthIndicator score={70} variant="dot" size="sm" />
              <HealthIndicator score={71} variant="dot" size="sm" />
              <HealthIndicator score={100} variant="dot" size="sm" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Medium</p>
            <div className="flex gap-3 items-center">
              <HealthIndicator score={0} variant="dot" />
              <HealthIndicator score={30} variant="dot" />
              <HealthIndicator score={31} variant="dot" />
              <HealthIndicator score={70} variant="dot" />
              <HealthIndicator score={71} variant="dot" />
              <HealthIndicator score={100} variant="dot" />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-600">Large</p>
            <div className="flex gap-3 items-center">
              <HealthIndicator score={0} variant="dot" size="lg" />
              <HealthIndicator score={30} variant="dot" size="lg" />
              <HealthIndicator score={31} variant="dot" size="lg" />
              <HealthIndicator score={70} variant="dot" size="lg" />
              <HealthIndicator score={71} variant="dot" size="lg" />
              <HealthIndicator score={100} variant="dot" size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Full Variant</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-600 mb-2">With Label</p>
            <div className="space-y-2">
              <HealthIndicator score={0} variant="full" label="Critical" size="sm" />
              <HealthIndicator score={30} variant="full" label="Needs Attention" />
              <HealthIndicator score={50} variant="full" label="Health Score" />
              <HealthIndicator score={85} variant="full" label="Excellent" size="lg" />
              <HealthIndicator score={100} variant="full" label="Perfect Health" />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-2">Without Label</p>
            <div className="space-y-2">
              <HealthIndicator score={15} variant="full" size="sm" />
              <HealthIndicator score={50} variant="full" />
              <HealthIndicator score={90} variant="full" size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Boundary Value Edge Cases</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <HealthIndicator score={0} />
            <span className="text-sm text-gray-600">Score 0 → Red</span>
          </div>
          <div className="flex items-center gap-2">
            <HealthIndicator score={30} />
            <span className="text-sm text-gray-600">Score 30 → Red (boundary)</span>
          </div>
          <div className="flex items-center gap-2">
            <HealthIndicator score={31} />
            <span className="text-sm text-gray-600">Score 31 → Yellow (boundary)</span>
          </div>
          <div className="flex items-center gap-2">
            <HealthIndicator score={70} />
            <span className="text-sm text-gray-600">Score 70 → Yellow (boundary)</span>
          </div>
          <div className="flex items-center gap-2">
            <HealthIndicator score={71} />
            <span className="text-sm text-gray-600">Score 71 → Green (boundary)</span>
          </div>
          <div className="flex items-center gap-2">
            <HealthIndicator score={100} />
            <span className="text-sm text-gray-600">Score 100 → Green</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Custom ClassName</h3>
        <div className="flex gap-2 items-center">
          <HealthIndicator score={85} className="shadow-lg" />
          <HealthIndicator score={85} variant="dot" className="ring-2 ring-offset-2 ring-green-400" />
          <HealthIndicator score={85} variant="full" label="Custom Styled" className="font-mono" />
        </div>
      </div>
    </div>
  )
}
