import type { ReactElement } from 'react';

export type ActiveTab = 'timer' | 'calendar' | 'history' | 'settings';

interface TabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  goalCount?: number;
  historyCount?: number;
}

export function TabBar({ activeTab, onTabChange, goalCount, historyCount }: TabBarProps): ReactElement {
  const tabs: { id: ActiveTab; label: string; icon: string; badge?: number }[] = [
    { id: 'timer', label: 'Timer', icon: '⏱️', badge: goalCount && goalCount > 0 ? goalCount : undefined },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'history', label: 'History', icon: '📜', badge: historyCount && historyCount > 0 ? historyCount : undefined },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="tab-bar" aria-label="Main Navigation">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`tab-item${isActive ? ' tab-item--active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-selected={isActive}
            role="tab"
          >
            <span className="tab-icon" aria-hidden="true">
              {tab.icon}
            </span>
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
