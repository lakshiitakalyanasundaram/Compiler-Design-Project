
'use client';

import type { SymbolTable } from '@/lib/tokenizer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface SymbolTableDisplayProps {
  symbolTable: SymbolTable;
}

export function SymbolTableDisplay({ symbolTable }: SymbolTableDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">Functions</CardTitle>
        </CardHeader>
        <CardContent>
          {symbolTable.functions.length > 0 ? (
            <ScrollArea className="h-48 rounded-md border p-2 bg-muted/20">
              <ul className="space-y-1">
                {symbolTable.functions.map((func, index) => (
                  <li key={index}>
                    <Badge variant="secondary" className="text-sm font-mono">{func}</Badge>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">No functions identified.</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-primary">Variables</CardTitle>
        </CardHeader>
        <CardContent>
          {symbolTable.variables.length > 0 ? (
            <ScrollArea className="h-48 rounded-md border p-2 bg-muted/20">
              <ul className="space-y-1">
                {symbolTable.variables.map((variable, index) => (
                  <li key={index}>
                     <Badge variant="outline" className="text-sm font-mono">{variable}</Badge>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          ) : (
            <p className="text-sm text-muted-foreground">No variables identified.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
