const makeStateKey = (values: number[]): string => {
  return values.slice().sort((a, b) => a - b).join(',');
};

interface ExpressionState {
  value: number;
  expression: string;
}

export interface ExactSolution {
  expression: string;
  numbersUsed: number;
  value: number;
}

const getCandidates = (a: number, b: number): number[] => {
  const candidates = new Set<number>();

  candidates.add(a + b);

  const subAB = a - b;
  if (subAB > 0) {
    candidates.add(subAB);
  }

  const subBA = b - a;
  if (subBA > 0) {
    candidates.add(subBA);
  }

  if (a !== 1 && b !== 1) {
    candidates.add(a * b);
  }

  if (b !== 1 && b !== 0 && a % b === 0) {
    const divAB = a / b;
    if (divAB > 0) {
      candidates.add(divAB);
    }
  }

  if (a !== 1 && a !== 0 && b % a === 0) {
    const divBA = b / a;
    if (divBA > 0) {
      candidates.add(divBA);
    }
  }

  return [...candidates];
};

const getExpressionCandidates = (a: ExpressionState, b: ExpressionState): ExpressionState[] => {
  const candidates: ExpressionState[] = [];
  const push = (value: number, expression: string): void => {
    if (value > 0) {
      candidates.push({ value, expression });
    }
  };

  if (a.value !== 0 && b.value !== 0) {
    push(a.value + b.value, `(${a.expression} + ${b.expression})`);
  }

  if (b.value !== 0 && a.value - b.value > 0) {
    push(a.value - b.value, `(${a.expression} - ${b.expression})`);
  }

  if (a.value !== 0 && b.value - a.value > 0) {
    push(b.value - a.value, `(${b.expression} - ${a.expression})`);
  }

  if (a.value !== 1 && b.value !== 1) {
    push(a.value * b.value, `(${a.expression} * ${b.expression})`);
  }

  if (b.value !== 1 && b.value !== 0 && a.value % b.value === 0) {
    push(a.value / b.value, `(${a.expression} / ${b.expression})`);
  }

  if (a.value !== 1 && a.value !== 0 && b.value % a.value === 0) {
    push(b.value / a.value, `(${b.expression} / ${a.expression})`);
  }

  return candidates;
};

const canMakeTargetWithAllNumbers = (numbers: number[], target: number): boolean => {
  const memo = new Map<string, boolean>();

  const search = (values: number[]): boolean => {
    const key = makeStateKey(values);
    const cached = memo.get(key);
    if (cached !== undefined) {
      return cached;
    }

    if (values.length === 1) {
      const isMatch = values[0] === target;
      memo.set(key, isMatch);
      return isMatch;
    }

    for (let i = 0; i < values.length; i += 1) {
      for (let j = i + 1; j < values.length; j += 1) {
        const a = values[i];
        const b = values[j];
        const rest = values.filter((_, index) => index !== i && index !== j);
        const candidates = getCandidates(a, b);

        for (const candidate of candidates) {
          const next = [...rest, candidate];
          if (search(next)) {
            memo.set(key, true);
            return true;
          }
        }
      }
    }

    memo.set(key, false);
    return false;
  };

  return search(numbers);
};

const findExpressionWithAllNumbers = (numbers: number[], target: number): string | null => {
  const memo = new Map<string, string | null>();

  const search = (states: ExpressionState[]): string | null => {
    const key = makeStateKey(states.map((state) => state.value));
    const cached = memo.get(key);
    if (cached !== undefined) {
      return cached;
    }

    if (states.length === 1) {
      const result = states[0].value === target ? states[0].expression : null;
      memo.set(key, result);
      return result;
    }

    for (let i = 0; i < states.length; i += 1) {
      for (let j = i + 1; j < states.length; j += 1) {
        const a = states[i];
        const b = states[j];
        const rest = states.filter((_, index) => index !== i && index !== j);
        const candidates = getExpressionCandidates(a, b);

        for (const candidate of candidates) {
          const solution = search([...rest, candidate]);
          if (solution !== null) {
            memo.set(key, solution);
            return solution;
          }
        }
      }
    }

    memo.set(key, null);
    return null;
  };

  const initialStates: ExpressionState[] = numbers.map((value) => ({
    value,
    expression: String(value)
  }));

  return search(initialStates);
};

const allNonEmptySubsets = (numbers: number[]): number[][] => {
  const subsets: number[][] = [];
  const subsetCount = 1 << numbers.length;

  for (let mask = 1; mask < subsetCount; mask += 1) {
    const subset: number[] = [];
    for (let index = 0; index < numbers.length; index += 1) {
      if ((mask & (1 << index)) !== 0) {
        subset.push(numbers[index]);
      }
    }
    subsets.push(subset);
  }

  subsets.sort((a, b) => b.length - a.length);
  return subsets;
};

const hasExactSolutionUsingNumberCountFromSubsets = (
  subsets: number[][],
  target: number,
  numbersUsed: number
): boolean => {
  for (const subset of subsets) {
    if (subset.length !== numbersUsed) {
      continue;
    }

    if (canMakeTargetWithAllNumbers(subset, target)) {
      return true;
    }
  }

  return false;
};

export const findBestExactOperatorCount = (numbers: number[], target: number): number | null => {
  const subsets = allNonEmptySubsets(numbers);

  for (const subset of subsets) {
    if (subset.length === 1) {
      if (subset[0] === target) {
        return 0;
      }
      continue;
    }

    if (canMakeTargetWithAllNumbers(subset, target)) {
      return subset.length - 1;
    }
  }

  return null;
};

const stripOuterParens = (expression: string): string => {
  if (expression.startsWith('(') && expression.endsWith(')')) {
    return expression.slice(1, -1);
  }

  return expression;
};

export const findBestExactSolution = (numbers: number[], target: number): ExactSolution | null => {
  const subsets = allNonEmptySubsets(numbers);

  for (const subset of subsets) {
    const expression = findExpressionWithAllNumbers(subset, target);
    if (expression === null) {
      continue;
    }

    return {
      expression: stripOuterParens(expression),
      numbersUsed: subset.length,
      value: target
    };
  }

  return null;
};

export const hasExactSolution = (numbers: number[], target: number): boolean => {
  return findBestExactOperatorCount(numbers, target) !== null;
};

export const hasExactSolutionUsingNumberCount = (
  numbers: number[],
  target: number,
  numbersUsed: number
): boolean => {
  if (numbersUsed < 1 || numbersUsed > numbers.length) {
    return false;
  }

  const subsets = allNonEmptySubsets(numbers);
  return hasExactSolutionUsingNumberCountFromSubsets(subsets, target, numbersUsed);
};

export const hasExactSolutionForEveryNumberCount = (
  numbers: number[],
  target: number,
  minNumbersUsed: number,
  maxNumbersUsed: number
): boolean => {
  if (numbers.length === 0) {
    return false;
  }

  const lower = Math.max(1, minNumbersUsed);
  const upper = Math.min(numbers.length, maxNumbersUsed);
  if (lower > upper) {
    return false;
  }

  const subsets = allNonEmptySubsets(numbers);
  for (let count = lower; count <= upper; count += 1) {
    if (!hasExactSolutionUsingNumberCountFromSubsets(subsets, target, count)) {
      return false;
    }
  }

  return true;
};
