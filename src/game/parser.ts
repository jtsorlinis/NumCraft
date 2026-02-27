import type { AstNode, BinaryNode, Operator, ParseResult } from './types';

interface Token {
  kind: 'number' | 'operator' | 'leftParen' | 'rightParen' | 'eof';
  value?: string;
  position: number;
}

class ParserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParserError';
  }
}

const isDigit = (value: string): boolean => value >= '0' && value <= '9';

const tokenize = (input: string): Token[] => {
  const tokens: Token[] = [];
  let index = 0;

  while (index < input.length) {
    const char = input[index];

    if (char.trim() === '') {
      index += 1;
      continue;
    }

    if (isDigit(char)) {
      let end = index + 1;
      while (end < input.length && isDigit(input[end])) {
        end += 1;
      }

      tokens.push({
        kind: 'number',
        value: input.slice(index, end),
        position: index
      });
      index = end;
      continue;
    }

    if (char === '+' || char === '-' || char === '*' || char === '/') {
      tokens.push({
        kind: 'operator',
        value: char,
        position: index
      });
      index += 1;
      continue;
    }

    if (char === '(') {
      tokens.push({ kind: 'leftParen', position: index });
      index += 1;
      continue;
    }

    if (char === ')') {
      tokens.push({ kind: 'rightParen', position: index });
      index += 1;
      continue;
    }

    throw new ParserError(`Unexpected character "${char}" at position ${index + 1}.`);
  }

  tokens.push({ kind: 'eof', position: input.length });
  return tokens;
};

class Parser {
  private readonly tokens: Token[];

  private index = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): AstNode {
    const expression = this.parseExpression();
    const token = this.current();
    if (token.kind !== 'eof') {
      throw new ParserError(`Unexpected token at position ${token.position + 1}.`);
    }
    return expression;
  }

  private parseExpression(): AstNode {
    // Classic recursive-descent precedence:
    // expression handles + and -, term handles * and /, factor handles literals/grouping.
    let node = this.parseTerm();

    while (this.current().kind === 'operator') {
      const operatorToken = this.current();
      const op = operatorToken.value as Operator;
      if (op !== '+' && op !== '-') {
        break;
      }

      this.advance();
      const right = this.parseTerm();
      const binaryNode: BinaryNode = { kind: 'binary', op, left: node, right };
      node = binaryNode;
    }

    return node;
  }

  private parseTerm(): AstNode {
    let node = this.parseFactor();

    while (this.current().kind === 'operator') {
      const operatorToken = this.current();
      const op = operatorToken.value as Operator;
      if (op !== '*' && op !== '/') {
        break;
      }

      this.advance();
      const right = this.parseFactor();
      const binaryNode: BinaryNode = { kind: 'binary', op, left: node, right };
      node = binaryNode;
    }

    return node;
  }

  private parseFactor(): AstNode {
    const token = this.current();

    if (token.kind === 'number') {
      this.advance();
      return { kind: 'number', value: Number(token.value) };
    }

    if (token.kind === 'leftParen') {
      this.advance();
      const expression = this.parseExpression();
      if (this.current().kind !== 'rightParen') {
        throw new ParserError(`Expected closing parenthesis at position ${this.current().position + 1}.`);
      }
      this.advance();
      return expression;
    }

    throw new ParserError(`Unexpected token at position ${token.position + 1}.`);
  }

  private current(): Token {
    return this.tokens[this.index];
  }

  private advance(): void {
    this.index += 1;
  }
}

export const parseExpression = (input: string): ParseResult => {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      ok: false,
      errorCode: 'EMPTY_EXPRESSION',
      message: 'Enter an expression before submitting.'
    };
  }

  try {
    const tokens = tokenize(trimmed);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    return {
      ok: true,
      ast
    };
  } catch (error) {
    return {
      ok: false,
      errorCode: 'INVALID_SYNTAX',
      message: error instanceof Error ? error.message : 'Invalid syntax.'
    };
  }
};
