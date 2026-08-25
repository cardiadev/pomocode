import type { ReactElement } from 'react';
import type { StatsSnapshot } from '../../../shared/protocol';

interface StatsSummaryProps {
  stats: StatsSnapshot;
}

export function StatsSummary({ stats }: StatsSummaryProps): ReactElement {
  return (
    <div className="stats-summary">
      <h2 className="section-title">Stats</h2>
      <div className="stats-grid">
        <div className="stat-tile">
          <span className="stat-value">{stats.todayCount}</span>
          <span className="stat-label">Today</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{stats.weekCount}</span>
          <span className="stat-label">This week</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{stats.allTimeCount}</span>
          <span className="stat-label">All time</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{stats.todayMinutes}m</span>
          <span className="stat-label">Focused today</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{stats.weekMinutes}m</span>
          <span className="stat-label">Focused this week</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{stats.allTimeMinutes}m</span>
          <span className="stat-label">Focused all time</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{stats.roundsCompletedToday}</span>
          <span className="stat-label">Rounds today</span>
        </div>
        <div className="stat-tile">
          <span className="stat-value">{stats.roundsCompletedAllTime}</span>
          <span className="stat-label">Rounds all time</span>
        </div>
      </div>
    </div>
  );
}
