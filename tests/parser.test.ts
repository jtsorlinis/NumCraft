import { describe, expect, it } from 'vitest';
import { evaluateAst } from '../src/game/evaluator';
import { parseExpression } from '../src/game/parser';

describe('parser and evaluator', () => {
  it('respects operator precedence', () => {
    const parsed = parseExpression('3 + 4 * 5');
    expect(parsed.ok).toBe(true);

    if (!parsed.ok) {
      return;
    }

    const result = evaluateAst(parsed.ast);
    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value).toBe(23);
    expect(result.operatorCount).toBe(2);
  });

  it('handles parentheses correctly', () => {
    const parsed = parseExpression('(3 + 4) * 5');
    expect(parsed.ok).toBe(true);

    if (!parsed.ok) {
      return;
    }

    const result = evaluateAst(parsed.ast);
    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.value).toBe(35);
    expect(result.operatorCount).toBe(2);
  });
});
