import { useEffect, useMemo, useState } from "react";
import { ExpressionInput } from "./components/ExpressionInput";
import { Header } from "./components/Header";
import { HelpModal } from "./components/HelpModal";
import { NumberChips } from "./components/NumberChips";
import { PuzzleHeader } from "./components/PuzzleHeader";
import { ResultModal } from "./components/ResultModal";
import { StatsModal } from "./components/StatsModal";
import { Toast } from "./components/Toast";
import { evaluateAst } from "./game/evaluator";
import { parseExpression } from "./game/parser";
import { createPracticePuzzle, getTodayDailyPuzzle } from "./game/puzzle";
import { buildShareText } from "./game/share";
import { findAllExactSolutions } from "./game/solver";
import {
  hasSeenHelpModal,
  loadDailyProgress,
  loadStats,
  loadTheme,
  markHelpModalSeen,
  saveDailyProgress,
  saveStats,
  saveTheme,
} from "./game/storage";
import { applyFinishedDayToStats, createHistoryEntry } from "./game/stats";
import type {
  AttemptOutcome,
  DailyProgress,
  DailyPuzzle,
  Operator,
} from "./game/types";
import { validateExpression } from "./game/validator";

const MAX_ATTEMPTS = 1;

type ExpressionTokenKind = "number" | "operator" | "leftParen" | "rightParen";

interface ExpressionToken {
  kind: ExpressionTokenKind;
  text: string;
  sourceIndex?: number;
}

const createInitialProgress = (puzzle: DailyPuzzle): DailyProgress => ({
  puzzleId: puzzle.id,
  puzzleNumber: puzzle.puzzleNumber,
  dateKey: puzzle.dateKey,
  attempts: [],
  finished: false,
  bestScore: null,
  statsRecorded: puzzle.isPractice,
});

const normalizeProgress = (
  puzzle: DailyPuzzle,
  raw: DailyProgress | null,
): DailyProgress => {
  if (!raw) {
    return createInitialProgress(puzzle);
  }

  const attempts = raw.attempts.map((attempt) => {
    if (attempt.status === "exact") {
      return {
        ...attempt,
        score: attempt.score ?? Math.max(1, attempt.operatorCount + 1),
      };
    }

    return {
      ...attempt,
      score: null,
    };
  });

  return {
    ...createInitialProgress(puzzle),
    ...raw,
    attempts,
    puzzleId: puzzle.id,
    puzzleNumber: puzzle.puzzleNumber,
    dateKey: puzzle.dateKey,
    statsRecorded: puzzle.isPractice ? true : raw.statsRecorded,
  };
};

const copyText = async (value: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

export default function App(): JSX.Element {
  const practiceSeed = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("practice");
  }, []);

  const puzzle = useMemo(() => {
    if (practiceSeed) {
      return createPracticePuzzle(practiceSeed);
    }
    return getTodayDailyPuzzle();
  }, [practiceSeed]);

  const [progress, setProgress] = useState<DailyProgress>(() => {
    return normalizeProgress(puzzle, loadDailyProgress(puzzle.id));
  });
  const [stats, setStats] = useState(() => loadStats());
  const [theme, setTheme] = useState<"light" | "dark">(() => loadTheme());
  const [expressionTokens, setExpressionTokens] = useState<ExpressionToken[]>(
    [],
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  const attemptsRemaining = Math.max(
    0,
    MAX_ATTEMPTS - progress.attempts.length,
  );
  const inputDisabled = progress.finished || attemptsRemaining === 0;
  const shareText = buildShareText(puzzle.puzzleNumber, progress.attempts);
  const allSolutions = useMemo(
    () => findAllExactSolutions(puzzle.numbers, puzzle.target),
    [puzzle.numbers, puzzle.target],
  );
  const latestAttempt = progress.attempts[progress.attempts.length - 1] ?? null;

  const expressionText = useMemo(() => {
    return expressionTokens.map((token) => token.text).join(" ");
  }, [expressionTokens]);
  const currentValue = useMemo(() => {
    if (expressionTokens.length === 0) {
      return null;
    }

    const parsed = parseExpression(expressionText);
    if (!parsed.ok) {
      return null;
    }

    const evaluated = evaluateAst(parsed.ast);
    if (!evaluated.ok) {
      return null;
    }

    return evaluated.value;
  }, [expressionText, expressionTokens.length]);

  const usedNumberIndices = useMemo(() => {
    const indices = new Set<number>();
    for (const token of expressionTokens) {
      if (token.kind === "number" && token.sourceIndex !== undefined) {
        indices.add(token.sourceIndex);
      }
    }
    return indices;
  }, [expressionTokens]);

  const lastToken = expressionTokens[expressionTokens.length - 1];

  const canInsertNumber =
    !inputDisabled &&
    (expressionTokens.length === 0 ||
      lastToken.kind === "operator" ||
      lastToken.kind === "leftParen");

  const canInsertOperator =
    !inputDisabled &&
    expressionTokens.length > 0 &&
    (lastToken.kind === "number" || lastToken.kind === "rightParen");

  const openParenCount = useMemo(() => {
    let openCount = 0;
    for (const token of expressionTokens) {
      if (token.kind === "leftParen") {
        openCount += 1;
      }
      if (token.kind === "rightParen") {
        openCount -= 1;
      }
    }
    return openCount;
  }, [expressionTokens]);

  const canInsertLeftParen =
    !inputDisabled &&
    (expressionTokens.length === 0 ||
      lastToken.kind === "operator" ||
      lastToken.kind === "leftParen");

  const canInsertRightParen =
    !inputDisabled &&
    openParenCount > 0 &&
    expressionTokens.length > 0 &&
    (lastToken.kind === "number" || lastToken.kind === "rightParen");

  const canBackspace = !inputDisabled && expressionTokens.length > 0;

  useEffect(() => {
    saveDailyProgress(progress);
  }, [progress]);

  useEffect(() => {
    if (toastMessage === null) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastMessage(null);
    }, 2400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toastMessage]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (hasSeenHelpModal()) {
      return;
    }

    markHelpModalSeen();
    setHelpOpen(true);
  }, []);

  useEffect(() => {
    if (progress.finished) {
      setResultOpen(true);
    }
  }, [progress.finished]);

  useEffect(() => {
    if (puzzle.isPractice || !progress.finished || progress.statsRecorded) {
      return;
    }

    const currentStats = loadStats();
    const entry = createHistoryEntry(progress);
    const nextStats = applyFinishedDayToStats(currentStats, entry);
    saveStats(nextStats);
    setStats(nextStats);

    setProgress((previous) => {
      if (previous.statsRecorded) {
        return previous;
      }

      return {
        ...previous,
        statsRecorded: true,
      };
    });
  }, [progress, puzzle.isPractice]);

  const appendToken = (token: ExpressionToken): void => {
    setExpressionTokens((previous) => [...previous, token]);
  };

  const handleSelectNumber = (index: number, value: number): void => {
    if (!canInsertNumber || usedNumberIndices.has(index)) {
      return;
    }

    appendToken({
      kind: "number",
      text: String(value),
      sourceIndex: index,
    });
  };

  const handleInsertOperator = (operator: Operator): void => {
    if (!canInsertOperator) {
      return;
    }

    appendToken({ kind: "operator", text: operator });
  };

  const handleInsertLeftParen = (): void => {
    if (!canInsertLeftParen) {
      return;
    }

    appendToken({ kind: "leftParen", text: "(" });
  };

  const handleInsertRightParen = (): void => {
    if (!canInsertRightParen) {
      return;
    }

    appendToken({ kind: "rightParen", text: ")" });
  };

  const handleSubmit = (): void => {
    if (inputDisabled) {
      return;
    }

    const validation = validateExpression(expressionText, puzzle);

    if (!validation.consumesAttempt) {
      return;
    }

    if (!validation.isExact) {
      const shouldSubmit = window.confirm(
        `Your answer equals ${validation.value ?? "?"}, not ${puzzle.target}. Submit anyway?`,
      );
      if (!shouldSubmit) {
        return;
      }
    }

    const attempt: AttemptOutcome = {
      status: validation.isExact ? "exact" : "fail",
      expression: expressionText,
      value: validation.value ?? 0,
      operatorCount: validation.operatorCount,
      score: validation.score,
    };

    setProgress((previous) => {
      const attempts = [...previous.attempts, attempt];
      const bestScore = validation.isExact
        ? Math.max(
            previous.bestScore ?? 0,
            validation.score ?? validation.numbersUsedCount,
          )
        : previous.bestScore;

      return {
        ...previous,
        attempts,
        bestScore,
        finished: attempts.length >= MAX_ATTEMPTS,
      };
    });

    setExpressionTokens([]);
  };

  const handleBackspace = (): void => {
    if (!canBackspace) {
      return;
    }

    setExpressionTokens((previous) => previous.slice(0, previous.length - 1));
  };

  const handleFinishEarly = (): void => {
    setProgress((previous) => ({
      ...previous,
      finished: true,
    }));
  };

  const handleShare = async (): Promise<void> => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          text: shareText,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await copyText(shareText);
      setToastMessage("Share copied to clipboard.");
    } catch {
      setToastMessage("Unable to copy share text.");
    }
  };

  return (
    <div className="app-shell">
      <Header
        puzzleNumber={puzzle.puzzleNumber}
        isPractice={puzzle.isPractice}
        theme={theme}
        onOpenStats={() => setStatsOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onToggleTheme={() =>
          setTheme((previous) => (previous === "dark" ? "light" : "dark"))
        }
        onOpenResult={() => setResultOpen(true)}
      />

      <main className="layout">
        <section className="main-column">
          <PuzzleHeader target={puzzle.target} currentValue={currentValue} />
          <section className="panel">
            <p className="eyebrow">Expression</p>
            <div className="expression-display" aria-live="polite">
              {expressionText.replace(/\*/g, "×").replace(/\//g, "÷") ||
                "Tap numbers and operators below."}
            </div>
          </section>

          {!progress.finished && progress.attempts.length > 0 ? (
            <div className="finish-wrap">
              <button
                type="button"
                className="ghost-btn"
                onClick={handleFinishEarly}
              >
                Finish
              </button>
            </div>
          ) : null}
        </section>
      </main>

      <div className="keyboard-dock">
        <div className="keyboard-inner">
          <NumberChips
            numbers={puzzle.numbers}
            usedIndices={usedNumberIndices}
            disabled={inputDisabled}
            canSelectNumber={canInsertNumber}
            onSelect={handleSelectNumber}
          />
          <ExpressionInput
            disabled={inputDisabled}
            canInsertOperator={canInsertOperator}
            canInsertLeftParen={canInsertLeftParen}
            canInsertRightParen={canInsertRightParen}
            canBackspace={canBackspace}
            onSubmit={handleSubmit}
            onInsertOperator={handleInsertOperator}
            onInsertLeftParen={handleInsertLeftParen}
            onInsertRightParen={handleInsertRightParen}
            onBackspace={handleBackspace}
          />
        </div>
      </div>

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
      <StatsModal
        open={statsOpen}
        isPractice={puzzle.isPractice}
        stats={stats}
        onClose={() => setStatsOpen(false)}
      />
      <ResultModal
        open={resultOpen}
        isFinished={progress.finished}
        bestScore={progress.bestScore}
        latestAttempt={latestAttempt}
        solutions={allSolutions}
        puzzleNumber={puzzle.puzzleNumber}
        isPractice={puzzle.isPractice}
        onShare={handleShare}
        onClose={() => setResultOpen(false)}
      />
      <Toast message={toastMessage} />
    </div>
  );
}
