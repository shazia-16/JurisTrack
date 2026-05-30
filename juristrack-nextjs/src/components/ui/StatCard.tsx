import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, className }: StatCardProps) {
  const changeColors = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className={cn('stat-card', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-gradient-to-br from-primary-100 to-blue-100 rounded-xl">
          {icon}
        </div>
        {change && (
          <span className={cn('text-sm font-medium', changeColors[changeType])}>
            {change}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  )
}
