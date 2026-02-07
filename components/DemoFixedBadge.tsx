import React from 'react';
import { useLocation } from 'react-router-dom';

const DemoFixedBadge: React.FC = () => {
  const location = useLocation();
  const isDemo = location.pathname === '/demo' || location.pathname === '/admin-demo';
  if (!isDemo) return null;

  return (
    <div className="fixed top-[92px] right-4 z-[70] rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-xs font-bold tracking-wide text-amber-100 shadow-lg">
      Demonstração
    </div>
  );
};

export default DemoFixedBadge;
