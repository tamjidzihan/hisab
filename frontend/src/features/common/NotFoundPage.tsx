import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { AlertCircle } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center p-8 space-y-4">
        <div className="w-12 h-12 rounded-[4px] bg-[#fef2f2] border border-[#fecaca] mx-auto flex items-center justify-center text-[#dc2626]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-[#161d26]">Ledger Page Not Found</h2>
        <p className="text-xs text-[#64748b]">
          The route you are attempting to inspect does not exist in the Hisab accounting registry.
        </p>
        <div>
          <Link to="/">
            <Button size="sm" variant="primary">
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

