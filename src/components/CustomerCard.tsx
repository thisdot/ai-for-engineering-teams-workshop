'use client'

import { Customer } from '@/data/mock-customers'

interface CustomerCardProps {
  customer: Customer
  onClick?: (customerId: string) => void
}

/**
 * Helper function to determine health score color classes based on score range
 * Red (0-30): Critical health
 * Yellow (31-70): Moderate health
 * Green (71-100): Good health
 */
function getHealthScoreColor(score: number): string {
  if (score <= 30) return 'bg-red-100 text-red-600'
  if (score <= 70) return 'bg-yellow-100 text-yellow-600'
  return 'bg-green-100 text-green-600'
}

/**
 * CustomerCard component displays individual customer information in a card format
 * Shows customer name, company, health score, and domain information
 */
export default function CustomerCard({ customer, onClick }: CustomerCardProps) {
  const handleClick = () => {
    onClick?.(customer.id)
  }

  // Format domain display based on number of domains
  const renderDomains = () => {
    if (!customer.domains || customer.domains.length === 0) {
      return null
    }

    if (customer.domains.length === 1) {
      return (
        <div className="text-xs text-gray-500 mt-2">
          {customer.domains[0]}
        </div>
      )
    }

    // Multiple domains: show first domain + count
    const additionalCount = customer.domains.length - 1
    return (
      <div className="text-xs text-gray-500 mt-2">
        {customer.domains[0]} +{additionalCount} more
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      className={`
        bg-white rounded-lg shadow border border-gray-200 p-4
        min-h-[120px]
        hover:shadow-lg transition-shadow
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Card Header: Customer Name and Health Score */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {customer.name}
          </h3>
          <p className="text-sm text-gray-600 mt-0.5">
            {customer.company}
          </p>
        </div>

        {/* Health Score Badge */}
        <div
          className={`
            ${getHealthScoreColor(customer.healthScore)}
            px-2.5 py-1 rounded-full text-sm font-semibold
            flex-shrink-0
          `}
        >
          {customer.healthScore}
        </div>
      </div>

      {/* Domain Information */}
      {renderDomains()}
    </div>
  )
}
