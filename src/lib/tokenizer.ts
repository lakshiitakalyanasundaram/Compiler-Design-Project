
export enum TokenType {
  KEYWORD,
  IDENTIFIER,
  STRING,
  COMMENT,
  OPERATOR,
  NUMBER,
  WHITESPACE,
  UNKNOWN,
}

export interface Token {
  type: TokenType;
  value: string;
}

export type Language = 'c-like' | 'python';

const cKeywords = new Set(['auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while']);
const pythonKeywords = new Set(['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield']);

// Order of rules is important
const commonRules: Array<{ type: TokenType; regex: RegExp; forLanguage?: Language[] }> = [
  { type: TokenType.WHITESPACE, regex: /^\s+/ },
  // C-like comments
  { type: TokenType.COMMENT, regex: /^\/\/[^\n]*|^\/\*[\s\S]*?\*\//, forLanguage: ['c-like'] },
  // Python comments
  { type: TokenType.COMMENT, regex: /^#[^\n]*/, forLanguage: ['python'] },
  // Strings
  { type: TokenType.STRING, regex: /^"(?:\\.|[^"\\])*?"|^'(?:\\.|[^'\\])*?'/, forLanguage: ['c-like'] },
  { type: TokenType.STRING, regex: /^"""[\s\S]*?"""|^'''[\s\S]*?'''|^"(?:\\.|[^"\\])*?"|^'(?:\\.|[^'\\])*?'/, forLanguage: ['python']},
  // Numbers (integer and float)
  { type: TokenType.NUMBER, regex: /^\b\d+(\.\d+)?\b/ },
  // Operators (longest match first)
  { type: TokenType.OPERATOR, regex: /^(->|\+\+|--|&&|\|\||==|!=|<=|>=|\+=|-=|\*=|\/=|%=|[+\-*/%=&|<>!^~,.;:?(){}\[\]])/ },
  // Identifiers
  { type: TokenType.IDENTIFIER, regex: /^\b[a-zA-Z_][a-zA-Z0-9_]*\b/ },
];

export function tokenize(code: string, language: Language): Token[] {
  const tokens: Token[] = [];
  let remainingCode = code;
  const keywords = language === 'c-like' ? cKeywords : pythonKeywords;

  while (remainingCode.length > 0) {
    let matched = false;
    for (const rule of commonRules) {
      if (rule.forLanguage && !rule.forLanguage.includes(language)) {
        continue;
      }

      const match = rule.regex.exec(remainingCode);
      if (match && match[0]) {
        const value = match[0];
        let type = rule.type;

        if (type === TokenType.IDENTIFIER && keywords.has(value)) {
          type = TokenType.KEYWORD;
        }
        
        tokens.push({ type, value });
        remainingCode = remainingCode.substring(value.length);
        matched = true;
        break;
      }
    }

    if (!matched) {
      // If no rule matches, consume one character as UNKNOWN to prevent infinite loop
      tokens.push({ type: TokenType.UNKNOWN, value: remainingCode[0] });
      remainingCode = remainingCode.substring(1);
    }
  }
  return tokens;
}
