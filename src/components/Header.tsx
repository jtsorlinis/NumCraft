interface HeaderProps {
  puzzleNumber: number;
  isPractice: boolean;
  theme: 'light' | 'dark';
  onOpenStats: () => void;
  onOpenHelp: () => void;
  onToggleTheme: () => void;
  onOpenResult: () => void;
}

export const Header = ({
  puzzleNumber,
  isPractice,
  theme,
  onOpenStats,
  onOpenHelp,
  onToggleTheme,
  onOpenResult
}: HeaderProps): JSX.Element => {
  return (
    <header className="header">
      <div>
        <h1>NumCraft</h1>
        <p>
          {isPractice ? `Practice #${puzzleNumber}` : `Daily #${puzzleNumber}`}
        </p>
      </div>
      <div className="header-actions">
        <button
          type="button"
          onClick={onOpenResult}
          className="ghost-btn header-icon-btn"
          aria-label="Open result"
          title="Result"
        >
          <span className="header-icon-glyph" aria-hidden="true">🏁</span>
        </button>
        <button
          type="button"
          onClick={onOpenStats}
          className="ghost-btn header-icon-btn"
          aria-label="Open stats"
          title="Stats"
        >
          <span className="header-icon-glyph" aria-hidden="true">📊</span>
        </button>
        <button
          type="button"
          onClick={onOpenHelp}
          className="ghost-btn header-icon-btn"
          aria-label="Open help"
          title="How to Play"
        >
          <span className="header-icon-glyph" aria-hidden="true">❓</span>
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="ghost-btn header-icon-btn"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
        >
          <span className="header-icon-glyph" aria-hidden="true">{theme === 'dark' ? '☀️' : '🌙'}</span>
        </button>
      </div>
    </header>
  );
};
