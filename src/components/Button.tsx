'use client'

import React from 'react'

export interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

export default function Button({
  label,
  onClick,
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading

  const handleClick = () => {
    if (isDisabled) return
    onClick()
  }

  // Base classes applied to all variants
  const baseClasses = `
    inline-flex items-center justify-center
    px-3 py-2
    rounded-md
    text-sm font-medium
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    min-h-[40px]
  `.replace(/\s+/g, ' ').trim()

  // Variant-specific classes
  const variantClasses = {
    primary: `
      bg-blue-600 text-white
      hover:bg-blue-700
      focus:ring-blue-500
      disabled:bg-blue-300 disabled:cursor-not-allowed disabled:hover:bg-blue-300
    `,
    secondary: `
      bg-gray-200 text-gray-800 border border-gray-300
      hover:bg-gray-300
      focus:ring-gray-500
      disabled:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-gray-100
    `,
    danger: `
      bg-red-600 text-white
      hover:bg-red-700
      focus:ring-red-500
      disabled:bg-red-300 disabled:cursor-not-allowed disabled:hover:bg-red-300
    `,
  }

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : 'max-w-[200px]'

  // Opacity for disabled state
  const opacityClasses = isDisabled ? 'opacity-60' : ''

  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${widthClasses}
    ${opacityClasses}
  `.replace(/\s+/g, ' ').trim()

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={buttonClasses}
      aria-busy={loading}
      aria-disabled={isDisabled}
    >
      {loading && (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"
          role="status"
          aria-label="Loading"
        />
      )}
      <span>{label}</span>
    </button>
  )
}
