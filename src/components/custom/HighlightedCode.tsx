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
        return 'text-blue-400 font-semibold'; // Bright blue for keywords
      case TokenType.IDENTIFIER:
        return 'text-gray-200'; // Light gray for identifiers
      case TokenType.STRING:
        return 'text-emerald-400'; // Bright green for strings
      case TokenType.COMMENT:
        return 'text-gray-500 italic'; // Darker gray for comments
      case TokenType.OPERATOR:
        return 'text-orange-400'; // Orange for operators
      case TokenType.NUMBER:
        return 'text-purple-400'; // Bright purple for numbers
      case TokenType.WHITESPACE:
        return ''; // Whitespace will be rendered as is
      case TokenType.UNKNOWN:
        return 'text-red-400'; // Bright red for unknown tokens
      default:
        return 'text-gray-200';
    }
  };

  return (
    <pre
      className="p-4 bg-gray-900 rounded-md shadow-sm overflow-auto font-mono text-sm border border-gray-700"
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

