'use client'

import { useState, useMemo } from 'react'
import { mockCustomers } from '@/data/mock-customers'
import CustomerCard from './CustomerCard'

interface CustomerSelectorProps {
  onCustomerSelect: (customerId: string) => void
  selectedCustomerId?: string
}

/**
 * CustomerSelector component provides a searchable interface for browsing and selecting customers
 *
 * Features:
 * - Real-time search/filter by customer name or company name
 * - Visual highlight for selected customer
 * - Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
 * - Scrollable list with sticky search input
 * - Empty state when no customers match search
 */
export default function CustomerSelector({
  onCustomerSelect,
  selectedCustomerId
}: CustomerSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter customers based on search query (name or company, case-insensitive)
  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockCustomers
    }

    const query = searchQuery.toLowerCase()
    return mockCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.company.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleCustomerClick = (customerId: string) => {
    onCustomerSelect(customerId)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Input - Sticky at top */}
      <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search customers by name or company..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="mt-2 text-sm text-gray-600">
          {filteredCustomers.length} {filteredCustomers.length === 1 ? 'customer' : 'customers'} found
        </div>
      </div>

      {/* Customer List - Scrollable */}
      <div className="flex-1 overflow-y-auto pt-4" style={{ maxHeight: '600px' }}>
        {filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`
                  rounded-lg transition-all
                  ${
                    selectedCustomerId === customer.id
                      ? 'ring-2 ring-blue-500 ring-offset-2'
                      : ''
                  }
                `}
              >
                <CustomerCard
                  customer={customer}
                  onClick={handleCustomerClick}
                />
              </div>
            ))}
          </div>
        ) : (
          // Empty state when no customers match search
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No customers found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Try adjusting your search terms or{' '}
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-700 underline"
              >
                clear the search
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
