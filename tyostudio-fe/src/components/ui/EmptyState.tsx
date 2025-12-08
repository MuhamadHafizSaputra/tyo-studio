import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, className, action }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200", className)}>
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Icon size={32} />
        </div>
      )}
      <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  );
}
