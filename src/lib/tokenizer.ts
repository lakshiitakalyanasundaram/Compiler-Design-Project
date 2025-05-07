
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

export interface SymbolTable {
  functions: string[];
  variables: string[];
}

const cTypeSpecifiers = new Set(['char', 'double', 'float', 'int', 'long', 'short', 'signed', 'struct', 'union', 'unsigned', 'void', 'const', 'volatile', 'auto']);

export function buildSymbolTable(tokens: Token[], language: Language): SymbolTable {
  const functions = new Set<string>();
  const variables = new Set<string>();

  for (let i = 0; i < tokens.length; i++) {
    const currentToken = tokens[i];

    if (language === 'c-like') {
      // Rule 1: Function definition/declaration: IDENTIFIER (
      if (currentToken.type === TokenType.IDENTIFIER) {
        let k = i + 1;
        while (k < tokens.length && tokens[k].type === TokenType.WHITESPACE) k++;
        if (k < tokens.length && tokens[k].type === TokenType.OPERATOR && tokens[k].value === '(') {
          functions.add(currentToken.value);
        }
      }

      // Rule 2: Variable declaration: type_specifier [*] IDENTIFIER
      // Catches: int x; int *ptr; const char name;
      if (currentToken.type === TokenType.KEYWORD && cTypeSpecifiers.has(currentToken.value)) {
        let k = i + 1;
        // Skip whitespace and pointers to find the identifier
        while (k < tokens.length) {
          if (tokens[k].type === TokenType.WHITESPACE) {
            k++; continue;
          }
          if (tokens[k].type === TokenType.OPERATOR && tokens[k].value === '*') { // Pointer
            k++; continue;
          }
          // Found the identifier
          if (tokens[k].type === TokenType.IDENTIFIER) {
            variables.add(tokens[k].value);
            // Simplified: does not handle complex multi-declarations like "int a, b, *c;" beyond the first variable.
            // "a" would be added. "b" and "c" would be IDENTIFIER tokens later.
            // If "b" or "c" are assigned later (e.g. b = 10;), they might be caught by Rule 3.
          }
          break; // Done with this type specifier, whether identifier found or not
        }
      }

      // Rule 3: Variable assignment or array usage: IDENTIFIER = ... or IDENTIFIER [...]
      // (Helps for vars declared on one line and used/assigned on another)
      if (currentToken.type === TokenType.IDENTIFIER && !functions.has(currentToken.value)) {
        let k = i + 1;
        while (k < tokens.length && tokens[k].type === TokenType.WHITESPACE) k++;
        if (k < tokens.length && tokens[k].type === TokenType.OPERATOR && 
            (tokens[k].value === '=' || tokens[k].value === '[')) {
          variables.add(currentToken.value);
        }
      }

    } else if (language === 'python') {
      // Rule 1: Function definition: def IDENTIFIER (
      if (currentToken.type === TokenType.KEYWORD && currentToken.value === 'def') {
        let k = i + 1;
        while (k < tokens.length && tokens[k].type === TokenType.WHITESPACE) k++;
        if (k < tokens.length && tokens[k].type === TokenType.IDENTIFIER) {
          functions.add(tokens[k].value);
        }
      }
      // Rule 2: Variable assignment: IDENTIFIER = 
      // Also catches class members like self.var =
      if (currentToken.type === TokenType.IDENTIFIER) {
        let k = i + 1;
        while (k < tokens.length && tokens[k].type === TokenType.WHITESPACE) k++;
        if (k < tokens.length && tokens[k].type === TokenType.OPERATOR && tokens[k].value === '=') {
          // Avoid adding elements of an assignment like `obj.attr = val` as `obj.attr` if `obj` is already a var.
          // For simplicity, adding the full IDENTIFIER value (e.g. "self.x")
          if (!functions.has(currentToken.value)) { // basic check to avoid function names if assigned
             variables.add(currentToken.value);
          }
        }
      }
    }
  }

  return {
    functions: Array.from(functions).sort(),
    variables: Array.from(variables).sort(),
  };
}
