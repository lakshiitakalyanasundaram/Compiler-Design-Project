'use client';

import { useState, useEffect } from 'react';
import type { Token, Language } from '@/lib/tokenizer';
import { tokenize } from '@/lib/tokenizer';
import { HighlightedCode } from '@/components/custom/HighlightedCode';
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

const initialCodeC = `// Welcome to C-like Code Highlighter!
#include <stdio.h>

/*
  This is a
  multi-line comment.
*/
int main() {
  char* message = "Hello, World!";
  for (int i = 0; i < 5; i++) {
    printf("%s - Count: %d\\n", message, i);
  }
  return 0; // Exit success
}`;

const initialCodePython = `# Welcome to Python Code Highlighter!
import os

def greet(name: str = "World"):
  """
  This is a docstring,
  which is also a multi-line string.
  """
  message = f"Hello, {name}!"
  print(message)
  # Loop a few times
  for i in range(3):
    print(f"Count: {i}")
  return os.getenv("USER", "User")

if __name__ == "__main__":
  greet()
`;


export default function HomePage() {
  const [code, setCode] = useState<string>(initialCodeC);
  const [language, setLanguage] = useState<Language>('c-like');
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    const newTokens = tokenize(code, language);
    setTokens(newTokens);
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
      <Card className="w-full max-w-3xl shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Code Highlighter</CardTitle>
          <CardDescription className="text-muted-foreground">
            Real-time syntax highlighting for C-like and Python code.
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

          <div className="space-y-2">
            <Label htmlFor="code-input" className="text-sm font-medium">Enter your code:</Label>
            <Textarea
              id="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter your code here..."
              className="w-full h-64 p-4 font-mono text-sm bg-white dark:bg-neutral-800 border-input rounded-md shadow-sm focus:ring-primary focus:border-primary"
              aria-label="Code input area"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Highlighted Output:</Label>
            <HighlightedCode tokens={tokens} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
