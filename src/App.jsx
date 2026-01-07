import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { OverviewView } from './components/OverviewView';
import { ClusterView } from './components/ClusterView';

function App() {
  const [activeView, setActiveView] = useState('overview');

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {activeView === 'overview' ? (
        <OverviewView />
      ) : (
        <ClusterView clusterName={activeView} />
      )}
    </DashboardLayout>
  );
}

export default App;
