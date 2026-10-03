// src/App.tsx
import React from 'react';
import { AppProvider, useApp } from './app/state/AppContext';
import { Shell } from './app/Shell';
import { Wonder } from './phases/Wonder';
import { Story } from './phases/Story';
import { Simulate } from './phases/Simulate';
import { Practice } from './phases/Practice';
import { Boss } from './phases/Boss';
import { Finale } from './phases/Finale';

const PhaseRouter: React.FC = () => {
  const { state } = useApp();
  const { phase, view } = state.nav;

  if (view === 'finale') {
    return <Finale />;
  }

  switch (phase) {
    case 'wonder':
      return <Wonder />;
    case 'story':
      return <Story />;
    case 'simulate':
      return <Simulate />;
    case 'practice':
      return <Practice />;
    case 'boss':
      return <Boss />;
    default:
      return <Wonder />;
  }
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Shell>
        <PhaseRouter />
      </Shell>
    </AppProvider>
  );
};

export default App;
