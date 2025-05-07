'use client';

import type { Token } from '@/lib/tokenizer';
import { TokenType } from '@/lib/tokenizer';
import { cn } from '@/lib/utils';

interface HighlightedCodeProps {
  tokens: Token[];
}

export function HighlightedCode({ tokens }: HighlightedCodeProps) {
  const getTokenClass = (tokenType: TokenType): string => {
    switch (tokenType) {
      case TokenType.KEYWORD:
        return 'text-blue-600 dark:text-blue-400 font-semibold';
      case TokenType.IDENTIFIER:
        return 'text-neutral-800 dark:text-neutral-200';
      case TokenType.STRING:
        return 'text-green-600 dark:text-green-400';
      case TokenType.COMMENT:
        return 'text-gray-500 dark:text-gray-400 italic';
      case TokenType.OPERATOR:
        return 'text-orange-600 dark:text-orange-400';
      case TokenType.NUMBER:
        return 'text-purple-600 dark:text-purple-400';
      case TokenType.WHITESPACE:
        return ''; // Whitespace will be rendered as is
      case TokenType.UNKNOWN:
        return 'text-red-500 dark:text-red-400';
      default:
        return 'text-neutral-800 dark:text-neutral-200';
    }
  };

  return (
    <pre
      className="p-4 bg-white dark:bg-neutral-800 rounded-md shadow-sm overflow-auto font-mono text-sm border border-input"
      aria-live="polite"
    >
      {tokens.map((token, index) => (
        <span key={index} className={cn(getTokenClass(token.type))}>
          {token.value}
        </span>
      ))}
    </pre>
  );
}
