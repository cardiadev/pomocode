import type { ReactElement } from 'react';

export type ActiveTab = 'timer' | 'calendar' | 'history' | 'settings';

interface TabBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  goalCount?: number;
  historyCount?: number;
}

export function TabBar({ activeTab, onTabChange }: TabBarProps): ReactElement {
  const tabs: { id: ActiveTab; label: string }[] = [
    { id: 'timer', label: 'Timer' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'history', label: 'History' },
    { id: 'settings', label: 'Settings' },
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
            <span className="tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
