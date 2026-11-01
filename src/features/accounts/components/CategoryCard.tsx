import React from 'react'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Edit2, Trash2 } from 'lucide-react'
import { getCategoryIcon } from './categoryIcons'
import type { Category } from '@/types'

export interface CategoryCardProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const isIncome = category.type === 'income'
  const CategoryIcon = getCategoryIcon(category.icon)

  return (
    <Card className="p-3.5 hover:border-[#94a3b8] transition-colors flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[#d2d9e4] bg-[#f4f6f9]"
          title={`Category color: ${category.color}`}
          style={{ borderBottomColor: category.color, borderBottomWidth: 3 }}
        >
          {React.createElement(CategoryIcon, {
            className: 'h-4 w-4 text-[#161d26]',
            'aria-hidden': true,
          })}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-semibold text-[#161d26] leading-tight">
              {category.name}
            </h4>
            <Badge variant={isIncome ? 'inflow' : 'neutral'} size="sm" className="text-[10px]">
              {isIncome ? 'INFLOW' : 'OUTFLOW'}
            </Badge>
          </div>
          {category.userId === null && (
            <span className="text-[10px] text-[#94a3b8] font-mono">System Default</span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onEdit(category)}
          aria-label={`Edit ${category.name}`}
          className="p-1 rounded-[3px] text-[#64748b] hover:text-[#161d26] hover:bg-[#e2e8f0] transition-colors cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        {category.userId !== null && (
          <button
            onClick={() => onDelete(category.id)}
            aria-label={`Delete ${category.name}`}
            className="p-1 rounded-[3px] text-[#64748b] hover:text-[#dc2626] hover:bg-[#fee2e2] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </Card>
  )
}
