import { evaluateAst } from './evaluator';
import { parseExpression } from './parser';
import { scoreFromNumbersUsed } from './scoring';
import type { AstNode, DailyPuzzle, ValidationResult } from './types';

const collectNumbers = (node: AstNode, values: number[] = []): number[] => {
  if (node.kind === 'number') {
    values.push(node.value);
    return values;
  }

  collectNumbers(node.left, values);
  collectNumbers(node.right, values);
  return values;
};

const checkNumberUsage = (numbersUsed: number[], availableNumbers: number[]): ValidationResult | null => {
  const availableCount = new Map<number, number>();

  for (const number of availableNumbers) {
    availableCount.set(number, (availableCount.get(number) ?? 0) + 1);
  }

  // Multiset matching: each literal must exist in the puzzle pool and cannot exceed its count.
  const usedCount = new Map<number, number>();

  for (const number of numbersUsed) {
    if (!availableCount.has(number)) {
      return {
        isValidExpression: false,
        isExact: false,
        consumesAttempt: false,
        operatorCount: 0,
        numbersUsedCount: 0,
        score: null,
        value: null,
        errorCode: 'NUMBER_NOT_AVAILABLE',
        errorMessage: `${number} is not in today's numbers.`
      };
    }

    const nextUsed = (usedCount.get(number) ?? 0) + 1;
    usedCount.set(number, nextUsed);

    if (nextUsed > (availableCount.get(number) ?? 0)) {
      return {
        isValidExpression: false,
        isExact: false,
        consumesAttempt: false,
        operatorCount: 0,
        numbersUsedCount: 0,
        score: null,
        value: null,
        errorCode: 'NUMBER_USED_TOO_MANY_TIMES',
        errorMessage: `${number} is used too many times.`
      };
    }
  }

  return null;
};

export const validateExpression = (
  expression: string,
  puzzle: Pick<DailyPuzzle, 'numbers' | 'target'>
): ValidationResult => {
  const parsed = parseExpression(expression);

  if (!parsed.ok) {
    return {
      isValidExpression: false,
      isExact: false,
      consumesAttempt: false,
      operatorCount: 0,
      numbersUsedCount: 0,
      score: null,
      value: null,
      errorCode: parsed.errorCode,
      errorMessage: parsed.message
    };
  }

  const numbersUsed = collectNumbers(parsed.ast);
  const numberUsageError = checkNumberUsage(numbersUsed, puzzle.numbers);
  if (numberUsageError) {
    return numberUsageError;
  }

  const evaluated = evaluateAst(parsed.ast);
  if (!evaluated.ok) {
    return {
      isValidExpression: false,
      isExact: false,
      consumesAttempt: false,
      operatorCount: 0,
      numbersUsedCount: 0,
      score: null,
      value: null,
      errorCode: evaluated.errorCode,
      errorMessage: evaluated.errorMessage,
      ast: parsed.ast
    };
  }

  const isExact = evaluated.value === puzzle.target;
  const numbersUsedCount = numbersUsed.length;

  if (!isExact) {
    return {
      isValidExpression: true,
      isExact: false,
      consumesAttempt: true,
      operatorCount: evaluated.operatorCount,
      numbersUsedCount,
      score: null,
      value: evaluated.value,
      errorCode: 'NOT_EXACT',
      errorMessage: `Expression equals ${evaluated.value}, not ${puzzle.target}.`,
      ast: parsed.ast
    };
  }

  return {
    isValidExpression: true,
    isExact: true,
    consumesAttempt: true,
    operatorCount: evaluated.operatorCount,
    numbersUsedCount,
    score: scoreFromNumbersUsed(numbersUsedCount),
    value: evaluated.value,
    ast: parsed.ast
  };
};
