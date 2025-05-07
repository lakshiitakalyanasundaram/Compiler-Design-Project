'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface LegendItem {
  label: string;
  className: string;
  sampleText: string;
}

interface ColorMeaningLegendProps extends HTMLAttributes<HTMLDivElement> {
  items: LegendItem[];
}

export function ColorMeaningLegend({ items, className, ...props }: ColorMeaningLegendProps) {
  // Map label to color for funky, visible sample text
  const getSampleTextClass = (label: string): string => {
    switch (label.toLowerCase()) {
      case 'keyword':
        return 'text-blue-400';
      case 'identifier / default':
        return 'text-pink-400';
      case 'string':
        return 'text-emerald-400';
      case 'comment':
        return 'text-yellow-400';
      case 'operator':
        return 'text-orange-400';
      case 'number':
        return 'text-purple-400';
      case 'unknown':
        return 'text-red-400';
      default:
        return 'text-gray-200';
    }
  };

  return (
    <div className={cn("p-4 border border-gray-700 rounded-md shadow-sm bg-gray-900", className)} {...props}>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center text-sm">
            <span
              className={cn(
                'inline-block w-28 shrink-0 mr-3 py-1 px-2 rounded-sm bg-black text-center font-mono text-xs',
                getSampleTextClass(item.label)
              )}
              aria-hidden="true"
            >
              {item.sampleText}
            </span>
            <span className="text-gray-200">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
