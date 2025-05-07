
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
        return 'text-primary font-semibold'; // Use primary color from theme
      case TokenType.IDENTIFIER:
        return 'text-foreground'; // Use foreground color from theme
      case TokenType.STRING:
        return 'text-green-600 dark:text-green-400'; // Keeping specific color for strings for now
      case TokenType.COMMENT:
        return 'text-muted-foreground italic'; // Use muted foreground from theme
      case TokenType.OPERATOR:
        return 'text-accent-foreground'; // Use accent foreground for operators
      case TokenType.NUMBER:
        return 'text-purple-600 dark:text-purple-400'; // Keeping specific color for numbers
      case TokenType.WHITESPACE:
        return ''; // Whitespace will be rendered as is
      case TokenType.UNKNOWN:
        return 'text-destructive'; // Use destructive color from theme
      default:
        return 'text-foreground';
    }
  };

  return (
    <pre
      className="p-4 bg-card rounded-md shadow-sm overflow-auto font-mono text-sm border border-input"
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

