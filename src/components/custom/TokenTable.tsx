
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
        return "outline"; // Using outline for strings for better visual distinction
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

  return (
    <ScrollArea className="rounded-md border bg-card shadow-sm">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Token Type</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token, index) => (
            <TableRow key={index}>
              <TableCell>
                <Badge variant={getTokenTypeVariant(token.type)}>
                  {getTokenTypeString(token.type)}
                </Badge>
              </TableCell>
              <TableCell>
                <pre className="whitespace-pre-wrap break-all text-sm font-mono">
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
