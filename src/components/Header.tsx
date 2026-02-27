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
        <button type="button" onClick={onOpenResult} className="ghost-btn">
          Result
        </button>
        <button type="button" onClick={onOpenStats} className="ghost-btn">
          Stats
        </button>
        <button type="button" onClick={onOpenHelp} className="ghost-btn">
          How to Play
        </button>
        <button type="button" onClick={onToggleTheme} className="ghost-btn">
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </div>
    </header>
  );
};
