type HealthIndicatorVariant = 'badge' | 'dot' | 'full'
type HealthIndicatorSize = 'sm' | 'md' | 'lg'

interface HealthIndicatorProps {
  score: number; // 0-100
  variant?: HealthIndicatorVariant; // default: 'badge'
  size?: HealthIndicatorSize; // default: 'md'
  label?: string; // optional label text
  className?: string; // additional CSS classes
}

/**
 * Get color classes based on health score and variant
 * Color thresholds: 0-30 (red), 31-70 (yellow), 71-100 (green)
 */
function getHealthColorClasses(score: number, variant: HealthIndicatorVariant): string {
  // Red zone: 0-30 (critical)
  if (score <= 30) {
    if (variant === 'badge') return 'bg-red-100 text-red-700 border-red-200'
    if (variant === 'dot') return 'bg-red-500'
    return 'text-red-600'
  }

  // Yellow zone: 31-70 (warning)
  if (score <= 70) {
    if (variant === 'badge') return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (variant === 'dot') return 'bg-yellow-500'
    return 'text-yellow-600'
  }

  // Green zone: 71-100 (healthy)
  if (variant === 'badge') return 'bg-green-100 text-green-700 border-green-200'
  if (variant === 'dot') return 'bg-green-500'
  return 'text-green-600'
}

/**
 * Get size classes based on variant and size
 */
function getSizeClasses(variant: HealthIndicatorVariant, size: HealthIndicatorSize): string {
  if (variant === 'badge') {
    if (size === 'sm') return 'text-xs px-2 py-0.5'
    if (size === 'lg') return 'text-base px-3 py-1.5'
    return 'text-sm px-2.5 py-1' // md default
  }

  if (variant === 'dot') {
    if (size === 'sm') return 'w-2 h-2'
    if (size === 'lg') return 'w-4 h-4'
    return 'w-3 h-3' // md default
  }

  // full variant
  if (size === 'sm') return 'text-xs'
  if (size === 'lg') return 'text-base'
  return 'text-sm' // md default
}

/**
 * HealthIndicator - Displays health scores (0-100) with color-coded styling
 *
 * @param score - Health score from 0-100 (required)
 * @param variant - Display style: 'badge' (default), 'dot', or 'full'
 * @param size - Size: 'sm', 'md' (default), or 'lg'
 * @param label - Optional label text for full variant
 * @param className - Additional CSS classes
 */
export default function HealthIndicator({
  score,
  variant = 'badge',
  size = 'md',
  label,
  className = ''
}: HealthIndicatorProps) {
  const colorClasses = getHealthColorClasses(score, variant)
  const sizeClasses = getSizeClasses(variant, size)

  // Badge variant: pill-shaped with colored background
  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full font-semibold border ${colorClasses} ${sizeClasses} ${className}`}
      >
        {score}
      </span>
    )
  }

  // Dot variant: small colored circle indicator
  if (variant === 'dot') {
    return (
      <span
        className={`inline-block rounded-full ${colorClasses} ${sizeClasses} ${className}`}
        aria-label={`Health score: ${score}`}
      />
    )
  }

  // Full variant: score with optional label
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`font-bold ${colorClasses} ${sizeClasses}`}>
        {score}
      </span>
      {label && (
        <span className={`font-normal text-gray-600 ${sizeClasses}`}>
          {label}
        </span>
      )}
    </div>
  )
}
