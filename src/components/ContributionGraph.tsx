import { JournalEntry } from '../types';

interface ContributionGraphProps {
  journals: JournalEntry[];
  onCellClick?: (evaluation: any, dateStr?: string) => void;
}

export default function ContributionGraph({ journals, onCellClick }: ContributionGraphProps) {
  // Generate the last 105 days sorted chronologically
  const daysCount = 105;
  const dates = Array.from({ length: daysCount }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (daysCount - 1 - i));
    return d.toISOString().split('T')[0];
  });

  // Map dates to journal scores
  const scoreMap = new Map<string, number>();
  journals.forEach(j => {
    if (j.score !== null) {
      scoreMap.set(j.date, j.score);
    }
  });

  // Get color depending on the score
  const getShadeClass = (dateStr: string) => {
    const score = scoreMap.get(dateStr);
    if (score === undefined) return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    if (score <= 60) return 'bg-emerald-100 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900';
    if (score <= 80) return 'bg-emerald-300 dark:bg-emerald-800 border-emerald-400 dark:border-emerald-700';
    if (score <= 90) return 'bg-emerald-500 dark:bg-emerald-600 border-emerald-600 dark:border-emerald-500';
    return 'bg-emerald-700 dark:bg-emerald-400 border-emerald-800 dark:border-emerald-300';
  };

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Reflection Grid
        </h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-200" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-300 dark:bg-emerald-800 border border-emerald-400" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-500 border border-emerald-600" />
          <div className="w-2.5 h-2.5 rounded bg-emerald-700 border border-emerald-800" />
          <span>More</span>
        </div>
      </div>

      {/* Grid rendering (7 rows for Sunday-Saturday, 15 columns) */}
      <div className="grid grid-flow-col gap-1 overflow-x-auto py-1" style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}>
        {dates.map(dateStr => {
          const score = scoreMap.get(dateStr);
          const entry = journals.find(j => j.date === dateStr);
          const hasEvaluation = entry && entry.evaluation;
          const formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          
          return (
            <div
              key={dateStr}
              onClick={() => {
                if (onCellClick) {
                  onCellClick(entry?.evaluation || null, dateStr);
                }
              }}
              className={`w-3 h-3 rounded-sm border transition-all duration-200 hover:scale-125 relative group ${getShadeClass(dateStr)} cursor-pointer hover:border-violet-500`}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 bg-slate-800 text-white text-[10px] py-1 px-2 rounded shadow whitespace-nowrap">
                {formattedDate} {score !== undefined ? `• Score: ${score}` : '• No reflection'}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
        <span>~3 Months Ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
export type { ContributionGraphProps };
