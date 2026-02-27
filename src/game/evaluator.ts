import type { AstNode, ValidationErrorCode } from './types';

interface EvaluationSuccess {
  ok: true;
  value: number;
  operatorCount: number;
}

interface EvaluationFailure {
  ok: false;
  errorCode: ValidationErrorCode;
  errorMessage: string;
}

export type EvaluationResult = EvaluationSuccess | EvaluationFailure;

const fail = (errorCode: ValidationErrorCode, errorMessage: string): EvaluationFailure => ({
  ok: false,
  errorCode,
  errorMessage
});

export const evaluateAst = (node: AstNode): EvaluationResult => {
  if (node.kind === 'number') {
    return {
      ok: true,
      value: node.value,
      operatorCount: 0
    };
  }

  const left = evaluateAst(node.left);
  if (!left.ok) {
    return left;
  }

  const right = evaluateAst(node.right);
  if (!right.ok) {
    return right;
  }

  const leftValue = left.value;
  const rightValue = right.value;
  let result: number;

  switch (node.op) {
    case '+':
      if (leftValue === 0 || rightValue === 0) {
        return fail('NEUTRAL_OPERATION', 'Neutral operation not allowed: +0.');
      }
      result = leftValue + rightValue;
      break;
    case '-':
      if (rightValue === 0) {
        return fail('NEUTRAL_OPERATION', 'Neutral operation not allowed: -0.');
      }
      result = leftValue - rightValue;
      break;
    case '*':
      if (leftValue === 1 || rightValue === 1) {
        return fail('NEUTRAL_OPERATION', 'Neutral operation not allowed: *1.');
      }
      result = leftValue * rightValue;
      break;
    case '/':
      if (rightValue === 0) {
        return fail('DIVISION_BY_ZERO', 'Division by zero is not allowed.');
      }
      if (rightValue === 1) {
        return fail('NEUTRAL_OPERATION', 'Neutral operation not allowed: /1.');
      }
      // Integer-only arithmetic: every division must divide exactly.
      if (leftValue % rightValue !== 0) {
        return fail('NON_INTEGER_DIVISION', `Division must stay integer: ${leftValue} / ${rightValue}.`);
      }
      result = leftValue / rightValue;
      break;
    default:
      return fail('INVALID_SYNTAX', 'Unknown operator.');
  }

  if (!Number.isInteger(result)) {
    return fail('NON_INTEGER_DIVISION', 'All intermediate results must be integers.');
  }

  // Keep all intermediates positive to avoid degenerate expression trees.
  if (result <= 0) {
    return fail(
      'NON_POSITIVE_INTERMEDIATE',
      `Intermediate result must stay positive (> 0), received ${result}.`
    );
  }

  return {
    ok: true,
    value: result,
    operatorCount: left.operatorCount + right.operatorCount + 1
  };
};
