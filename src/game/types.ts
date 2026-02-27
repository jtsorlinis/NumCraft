export type Operator = '+' | '-' | '*' | '/';

export interface NumberNode {
  kind: 'number';
  value: number;
}

export interface BinaryNode {
  kind: 'binary';
  op: Operator;
  left: AstNode;
  right: AstNode;
}

export type AstNode = NumberNode | BinaryNode;

export type ParseErrorCode = 'EMPTY_EXPRESSION' | 'INVALID_SYNTAX';

export interface ParseSuccess {
  ok: true;
  ast: AstNode;
}

export interface ParseFailure {
  ok: false;
  errorCode: ParseErrorCode;
  message: string;
}

export type ParseResult = ParseSuccess | ParseFailure;

export type ValidationErrorCode =
  | 'EMPTY_EXPRESSION'
  | 'INVALID_SYNTAX'
  | 'NUMBER_NOT_AVAILABLE'
  | 'NUMBER_USED_TOO_MANY_TIMES'
  | 'DIVISION_BY_ZERO'
  | 'NON_INTEGER_DIVISION'
  | 'NEUTRAL_OPERATION'
  | 'NON_POSITIVE_INTERMEDIATE'
  | 'NOT_EXACT';

export interface ValidationResult {
  isValidExpression: boolean;
  isExact: boolean;
  consumesAttempt: boolean;
  operatorCount: number;
  numbersUsedCount: number;
  score: number | null;
  value: number | null;
  errorCode?: ValidationErrorCode;
  errorMessage?: string;
  ast?: AstNode;
}

export interface DailyPuzzle {
  id: string;
  puzzleNumber: number;
  dateKey: string;
  seed: string;
  target: number;
  numbers: number[];
  isPractice: boolean;
}

export type AttemptStatus = 'exact' | 'fail';

export interface AttemptOutcome {
  status: AttemptStatus;
  expression: string;
  value: number;
  operatorCount: number;
  score: number | null;
}

export interface DailyProgress {
  puzzleId: string;
  puzzleNumber: number;
  dateKey: string;
  attempts: AttemptOutcome[];
  finished: boolean;
  bestScore: number | null;
  statsRecorded: boolean;
}

export interface DailyHistoryEntry {
  puzzleNumber: number;
  dateKey: string;
  rows: string[];
  bestScore: number | null;
  won: boolean;
}

export interface GameStats {
  version: 1;
  totalPlayed: number;
  totalWins: number;
  currentStreak: number;
  maxStreak: number;
  averageBestScore: number;
  winScoreSum: number;
  lastPlayedPuzzle?: number;
  lastPlayedWon?: boolean;
  history: DailyHistoryEntry[];
}
