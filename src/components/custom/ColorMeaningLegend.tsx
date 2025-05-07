
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
  return (
    <div className={cn("p-4 border rounded-md shadow-sm bg-card", className)} {...props}>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center text-sm">
            <span
              className={cn(
                'inline-block w-28 shrink-0 mr-3 py-1 px-2 rounded-sm bg-muted/30 text-center font-mono text-xs',
                item.className
              )}
              aria-hidden="true" // Sample text is decorative for the legend item
            >
              {item.sampleText}
            </span>
            <span className="text-foreground">{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
