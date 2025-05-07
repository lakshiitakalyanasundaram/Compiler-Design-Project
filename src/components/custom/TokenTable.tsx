'use client';

import type { Token } from '@/lib/tokenizer';
import { TokenType } from '@/lib/tokenizer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TokenTableProps {
  tokens: Token[];
}

export function TokenTable({ tokens }: TokenTableProps) {
  const getTokenTypeString = (tokenType: TokenType): string => {
    return TokenType[tokenType];
  };

  const getTokenTypeVariant = (tokenType: TokenType): "default" | "secondary" | "destructive" | "outline" => {
    switch (tokenType) {
      case TokenType.KEYWORD:
        return "default";
      case TokenType.IDENTIFIER:
        return "secondary";
      case TokenType.STRING:
        return "outline";
      case TokenType.COMMENT:
        return "secondary";
      case TokenType.OPERATOR:
        return "default";
      case TokenType.NUMBER:
        return "outline";
      case TokenType.WHITESPACE:
        return "secondary";
      case TokenType.UNKNOWN:
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTokenTypeBadgeClass = (tokenType: TokenType): string => {
    switch (tokenType) {
      case TokenType.KEYWORD:
        return 'bg-black text-blue-400 border-blue-400';
      case TokenType.IDENTIFIER:
        return 'bg-black text-pink-400 border-pink-400';
      case TokenType.STRING:
        return 'bg-black text-emerald-400 border-emerald-400';
      case TokenType.COMMENT:
        return 'bg-black text-yellow-400 border-yellow-400';
      case TokenType.OPERATOR:
        return 'bg-black text-orange-400 border-orange-400';
      case TokenType.NUMBER:
        return 'bg-black text-purple-400 border-purple-400';
      case TokenType.WHITESPACE:
        return 'bg-black text-gray-400 border-gray-400';
      case TokenType.UNKNOWN:
        return 'bg-black text-red-400 border-red-400';
      default:
        return 'bg-black text-gray-200 border-gray-200';
    }
  };

  return (
    <ScrollArea className="rounded-md border border-gray-700 bg-gray-900 shadow-sm">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="w-[150px] text-gray-200">Token Type</TableHead>
            <TableHead className="text-gray-200">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => (
            <TableRow key={index} className="border-gray-700">
              <TableCell>
                <Badge variant={getTokenTypeVariant(token.type)} className={getTokenTypeBadgeClass(token.type)}>
                  {getTokenTypeString(token.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <pre className="whitespace-pre-wrap break-all text-sm font-mono text-gray-200">
                  {token.type === TokenType.WHITESPACE ? JSON.stringify(token.value) : token.value}
                </pre>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
