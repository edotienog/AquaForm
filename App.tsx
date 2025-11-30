import React, { useState } from 'react';
import { LayoutDashboard, Beaker, BookOpen, Settings, Fish } from 'lucide-react';
import { AppView, Species, SelectedIngredient } from './types';
import SpeciesSelector from './components/SpeciesSelector';
import FormulaEditor from './components/FormulaEditor';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);

  const handleSpeciesSelect = (species: Species) => {
    setSelectedSpecies(species);
    setCurrentView(AppView.FORMULATOR);
  };

  const handleSaveFormula = (name: string, ingredients: SelectedIngredient[]) => {
    console.log('Saved:', { name, ingredients });
    alert(`Formula "${name}" saved successfully!`);
    // In a real app, this would save to backend
    setCurrentView(AppView.DASHBOARD);
    setSelectedSpecies(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in duration-500">
             <div className="text-center space-y-4">
                 <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl mb-4">
                    <Fish className="w-16 h-16 text-white" />
                 </div>
                 <h1 className="text-5xl font-bold text-slate-800">AquaForm AI</h1>
                 <p className="text-xl text-slate-500 max-w-2xl">
                     Next-generation precision nutrition for aquaculture. <br/>
                     Formulate, optimize, and analyze feeds with AI assistance.
                 </p>
             </div>
             
             <div className="flex gap-4">
                 <button 
                    onClick={() => setCurrentView(AppView.ENCYCLOPEDIA)}
                    className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex items-center gap-2"
                 >
                    <BookOpen className="w-5 h-5"/> Browse Species
                 </button>
                 <button 
                    onClick={() => setCurrentView(AppView.ENCYCLOPEDIA)} // Reusing species selector as "Encyclopedia" for this demo
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition-all flex items-center gap-2"
                 >
                    <Beaker className="w-5 h-5"/> New Formulation
                 </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
                 <FeatureCard 
                    title="AI Optimization" 
                    desc="Uses Gemini 2.5 Flash to suggest optimal ingredient ratios."
                 />
                 <FeatureCard 
                    title="Real-time Visualization" 
                    desc="Dynamic radar charts powered by Recharts for instant feedback."
                 />
                 <FeatureCard 
                    title="Cost Analysis" 
                    desc="Immediate pricing estimation based on market ingredient rates."
                 />
             </div>
          </div>
        );
      case AppView.ENCYCLOPEDIA:
        return <SpeciesSelector onSelect={handleSpeciesSelect} />;
      case AppView.FORMULATOR:
        if (!selectedSpecies) return <SpeciesSelector onSelect={handleSpeciesSelect} />;
        return <FormulaEditor species={selectedSpecies} onSave={handleSaveFormula} />;
      default:
        return <div className="p-10">Section under construction</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
            <Fish className="w-8 h-8 text-blue-400" />
            <span className="ml-3 font-bold text-white text-lg hidden lg:block tracking-wide">AquaForm</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
            <NavItem 
                icon={<LayoutDashboard />} 
                label="Dashboard" 
                active={currentView === AppView.DASHBOARD} 
                onClick={() => { setSelectedSpecies(null); setCurrentView(AppView.DASHBOARD); }}
            />
            <NavItem 
                icon={<Beaker />} 
                label="Formulator" 
                active={currentView === AppView.FORMULATOR} 
                onClick={() => { if(!selectedSpecies) setCurrentView(AppView.ENCYCLOPEDIA); else setCurrentView(AppView.FORMULATOR); }}
            />
            <NavItem 
                icon={<BookOpen />} 
                label="Species Library" 
                active={currentView === AppView.ENCYCLOPEDIA} 
                onClick={() => { setSelectedSpecies(null); setCurrentView(AppView.ENCYCLOPEDIA); }}
            />
            <NavItem 
                icon={<Settings />} 
                label="Settings" 
                active={currentView === AppView.SETTINGS} 
                onClick={() => setCurrentView(AppView.SETTINGS)}
            />
        </nav>

        <div className="p-4 border-t border-slate-800 hidden lg:block">
            <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">API Status</p>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${process.env.API_KEY ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-mono">{process.env.API_KEY ? 'Connected' : 'Missing Key'}</span>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10">
            <h2 className="text-lg font-semibold text-gray-700">
                {currentView === AppView.DASHBOARD && 'Overview'}
                {currentView === AppView.ENCYCLOPEDIA && 'Species Library'}
                {currentView === AppView.FORMULATOR && 'Feed Formulation Workbench'}
            </h2>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Dr. Research User</span>
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">DR</div>
            </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto scroll-smooth">
            {renderContent()}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'hover:bg-slate-800 hover:text-white'}`}
    >
        <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
            {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
        </div>
        <span className="hidden lg:block font-medium text-sm">{label}</span>
    </button>
);

const FeatureCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export default App;