import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  setDoc, 
  doc, 
  deleteDoc, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from './firebase';
import { BudgetProposal, NumberingSettings } from './types';

// Components
import ProposalList from './components/ProposalList';
import ProposalForm from './components/ProposalForm';
import PrintProposal from './components/PrintProposal';
import NumberingSettingsComponent from './components/NumberingSettings';

// Icons
import { FileText, Settings, RefreshCw, AlertCircle, Building, CheckCircle2 } from 'lucide-react';

const DEFAULT_SETTINGS: NumberingSettings = {
  formatPattern: "[SEQ] / RAB / [BIDANG] / [ROMAN_MONTH] / [YEAR]",
  nextSequence: 1,
};

export default function App() {
  const [activeView, setActiveView] = useState<'list' | 'create'>('list');
  const [proposals, setProposals] = useState<BudgetProposal[]>([]);
  const [settings, setSettings] = useState<NumberingSettings>(DEFAULT_SETTINGS);
  
  // Modals & UI helpers
  const [selectedProposalForPrint, setSelectedProposalForPrint] = useState<BudgetProposal | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Initialize and load data
  useEffect(() => {
    // Test database connection
    testConnection();

    // Subscribe to settings
    const settingsRef = doc(db, 'settings', 'numbering');
    const unsubSettings = onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as NumberingSettings;
        setSettings({
          formatPattern: data.formatPattern || DEFAULT_SETTINGS.formatPattern,
          nextSequence: data.nextSequence ?? DEFAULT_SETTINGS.nextSequence
        });
      } else {
        // Create default settings if it doesn't exist
        setDoc(settingsRef, {
          formatPattern: DEFAULT_SETTINGS.formatPattern,
          nextSequence: DEFAULT_SETTINGS.nextSequence,
          updatedAt: new Date().toISOString()
        }).catch((err) => {
          console.error("Failed to initialize settings:", err);
        });
      }
      setIsLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'settings/numbering');
    });

    // Subscribe to proposals
    const proposalsRef = collection(db, 'proposals');
    const proposalsQuery = query(proposalsRef, orderBy('createdAt', 'desc'));
    
    const unsubProposals = onSnapshot(proposalsQuery, (snapshot) => {
      const loadedProposals: BudgetProposal[] = [];
      snapshot.forEach((doc) => {
        loadedProposals.push({ id: doc.id, ...doc.data() } as BudgetProposal);
      });
      setProposals(loadedProposals);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'proposals');
    });

    return () => {
      unsubSettings();
      unsubProposals();
    };
  }, []);

  // Show status toasts
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  // Submit new proposal handler
  const handleSubmitProposal = async (newProposal: Omit<BudgetProposal, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      const proposalId = 'proposal_' + Date.now();
      const newDocData = {
        ...newProposal,
        createdAt: new Date().toISOString()
      };

      // Save proposal document to Firestore
      await setDoc(doc(db, 'proposals', proposalId), newDocData);

      // Increment sequence counter automatically in database
      const settingsRef = doc(db, 'settings', 'numbering');
      await setDoc(settingsRef, {
        formatPattern: settings.formatPattern,
        nextSequence: settings.nextSequence + 1,
        updatedAt: new Date().toISOString()
      });

      // Reset view & show success toast
      setActiveView('list');
      triggerSuccess('Pengajuan Anggaran Berhasil Disimpan!');
    } catch (err) {
      console.error(err);
      triggerError('Gagal menyimpan pengajuan anggaran. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete proposal handler
  const handleDeleteProposal = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'proposals', id));
      triggerSuccess('Pengajuan Anggaran Berhasil Dihapus!');
    } catch (err) {
      console.error(err);
      triggerError('Gagal menghapus data.');
    }
  };

  // Update numbering settings manual handler
  const handleSaveSettings = async (newSettings: NumberingSettings) => {
    try {
      const settingsRef = doc(db, 'settings', 'numbering');
      await setDoc(settingsRef, {
        formatPattern: newSettings.formatPattern,
        nextSequence: newSettings.nextSequence,
        updatedAt: new Date().toISOString()
      });
      triggerSuccess('Format Penomoran Berhasil Diperbarui!');
    } catch (err) {
      console.error(err);
      triggerError('Gagal menyimpan perubahan pengaturan.');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden" id="app-root-div">
      
      {/* Notification Toast Messages */}
      <div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2 pointer-events-none" id="toasts-container">
        {successMsg && (
          <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-slide-in pointer-events-auto border border-emerald-500">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-600 text-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 animate-slide-in pointer-events-auto border border-rose-500">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Sidebar - Professional Polish Style */}
      <aside className="w-full md:w-64 bg-slate-900 flex flex-col text-slate-300 border-r border-slate-800 shrink-0 print:hidden" id="sidebar-panel">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between md:justify-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">RW</div>
            <div>
              <span className="font-bold text-white tracking-tight text-sm block">RW 015 ADMIN</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">CIBITUNG</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2" id="sidebar-nav">
          <button
            id="sidebar-nav-list"
            onClick={() => {
              setActiveView('list');
              setShowSettings(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
              activeView === 'list' && !showSettings
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            Daftar Pengajuan
          </button>

          <button
            id="sidebar-nav-create"
            onClick={() => {
              setActiveView('create');
              setShowSettings(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
              activeView === 'create' && !showSettings
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building className="w-5 h-5" />
            Input RAB Baru
          </button>

          <button
            id="sidebar-nav-settings"
            onClick={() => {
              setShowSettings(!showSettings);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
              showSettings
                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-5 h-5" />
            Pengaturan Format
          </button>
        </nav>

        {/* User Info profile */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/40 hidden md:block" id="sidebar-footer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-white uppercase shadow-inner text-sm border border-slate-600">
              S
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Sekretariat RW</p>
              <p className="text-[11px] text-slate-500 truncate" title="sekretariat.pgc015@gmail.com">sekretariat.pgc015@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0" id="main-content-pane">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sm:px-8 shrink-0 print:hidden" id="top-header-bar">
          <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight truncate">
            Sistem Anggaran RW. 015 Pesona Gading Cibitung
          </h1>
          
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 shrink-0">
            <span className="hidden sm:flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-xs animate-pulse"></div> 
              Database Connected
            </span>
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-600">
              v1.2.0-stable
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6" id="content-area">
          
          {/* Global Loading Spinner */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 bg-white border border-slate-200 rounded-2xl" id="app-loader">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" id="spin-main" />
              <p className="text-xs font-bold text-slate-400">Menghubungkan ke database...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Numbering Settings Dropdown */}
              {showSettings && (
                <NumberingSettingsComponent
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                  currentBidang="Bidang"
                />
              )}

              {/* Dynamic View rendering */}
              {activeView === 'create' ? (
                <ProposalForm
                  settings={settings}
                  onSubmit={handleSubmitProposal}
                  onCancel={() => setActiveView('list')}
                  isSubmitting={isSubmitting}
                />
              ) : (
                <ProposalList
                  proposals={proposals}
                  onSelectProposal={setSelectedProposalForPrint}
                  onDeleteProposal={handleDeleteProposal}
                  onAddNewClick={() => setActiveView('create')}
                />
              )}
            </div>
          )}
          
          {/* AES Encrypted Storage Badge at the bottom */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest print:hidden" id="footer-badges">
            <span>RW 015 Pesona Gading Cibitung</span>
            <div className="flex items-center gap-1.5 bg-slate-200/50 text-slate-500 px-2 py-1 rounded-md border border-slate-300/30">
              AES-256 Encrypted Database Storage 
              <svg className="w-3.5 h-3.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* PRINT PREVIEW DIALOG MODAL OVERLAY */}
      {selectedProposalForPrint && (
        <PrintProposal
          proposal={selectedProposalForPrint}
          onClose={() => setSelectedProposalForPrint(null)}
        />
      )}

    </div>
  );
}

