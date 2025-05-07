
'use client';

import { useState, useEffect } from 'react';
import type { Token, Language, SymbolTable } from '@/lib/tokenizer';
import { tokenize, buildSymbolTable } from '@/lib/tokenizer';
import { HighlightedCode } from '@/components/custom/HighlightedCode';
import { TokenTable } from '@/components/custom/TokenTable';
import { SymbolTableDisplay } from '@/components/custom/SymbolTableDisplay';
import { ColorMeaningLegend } from '@/components/custom/ColorMeaningLegend';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const initialCodeC = `// Welcome to C-like Code Highlighter!
#include <stdio.h>

/*
  This is a
  multi-line comment.
*/
int main() {
  char* message = "Hello, World!";
  float pi_val = 3.14;
  for (int i = 0; i < 5; i++) {
    printf("%s - Count: %d\\n", message, i);
  }
  return 0; // Exit success
}

void another_function(int param1, char param2) {
    int local_var;
    local_var = param1;
    if (param2 == 'a') {
        printf("Param2 is 'a'\\n");
    }
}`;

const initialCodePython = `# Welcome to Python Code Highlighter!
import os

GLOBAL_VAR = 100

class MyClass:
  def __init__(self, value):
    self.instance_var = value

  def get_value(self):
    return self.instance_var

def greet(name: str = "World"):
  """
  This is a docstring,
  which is also a multi-line string.
  """
  message = f"Hello, {name}!"
  local_count = 0
  print(message)
  # Loop a few times
  for i in range(3):
    print(f"Count: {i}")
    local_count += 1
  return os.getenv("USER", "User")

if __name__ == "__main__":
  mc = MyClass(10)
  user = greet()
  print(f"User: {user}, Global: {GLOBAL_VAR}, Instance: {mc.get_value()}")
`;

const legendItems = [
  { label: 'Keyword', className: 'text-primary font-semibold', sampleText: 'keyword' },
  { label: 'Identifier / Default', className: 'text-foreground', sampleText: 'identifier' },
  { label: 'String', className: 'text-green-600 dark:text-green-400', sampleText: '"string"' },
  { label: 'Comment', className: 'text-muted-foreground italic', sampleText: '// comment' },
  { label: 'Operator', className: 'text-accent-foreground', sampleText: '+' },
  { label: 'Number', className: 'text-purple-600 dark:text-purple-400', sampleText: '123' },
  { label: 'Unknown', className: 'text-destructive', sampleText: '?' },
];

export default function HomePage() {
  const [code, setCode] = useState<string>(initialCodeC);
  const [language, setLanguage] = useState<Language>('c-like');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [symbolTable, setSymbolTable] = useState<SymbolTable>({ functions: [], variables: [] });

  useEffect(() => {
    const newTokens = tokenize(code, language);
    setTokens(newTokens);
    const newSymbolTable = buildSymbolTable(newTokens, language);
    setSymbolTable(newSymbolTable);
  }, [code, language]);

  const handleLanguageChange = (value: string) => {
    const newLang = value as Language;
    setLanguage(newLang);
    if (newLang === 'c-like') {
      setCode(initialCodeC);
    } else {
      setCode(initialCodePython);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-4xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Code Analyzer</CardTitle>
          <CardDescription className="text-muted-foreground">
            Real-time syntax highlighting, tokenization, and symbol table generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="language-select" className="text-sm font-medium">Select Language:</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select" className="w-full md:w-1/3">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="c-like">C-like (e.g., C, C++, Java)</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="code-input" className="text-sm font-medium">Enter your code:</Label>
              <Textarea
                id="code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code here..."
                className="w-full h-96 p-4 font-mono text-sm bg-card border-input rounded-md shadow-sm focus:ring-primary focus:border-primary"
                aria-label="Code input area"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Highlighted Output:</Label>
              <div className="h-96 overflow-y-auto">
                <HighlightedCode tokens={tokens} />
              </div>
            </div>
          </div>

          <Accordion type="multiple" className="w-full">
            <AccordionItem value="token-table">
              <AccordionTrigger>Token Table</AccordionTrigger>
              <AccordionContent>
                <div className="max-h-96 overflow-y-auto">
                  <TokenTable tokens={tokens} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="symbol-table">
              <AccordionTrigger>Symbol Table</AccordionTrigger>
              <AccordionContent>
                <div className="max-h-96 overflow-y-auto">
                  <SymbolTableDisplay symbolTable={symbolTable} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="color-legend">
              <AccordionTrigger>Syntax Highlighting Legend</AccordionTrigger>
              <AccordionContent>
                <ColorMeaningLegend items={legendItems} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </CardContent>
      </Card>
    </div>
  );
}
