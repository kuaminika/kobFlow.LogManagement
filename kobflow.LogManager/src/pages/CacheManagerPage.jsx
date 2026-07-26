import { useState, useEffect, useCallback } from "react";
import { Trash2, RefreshCw, AlertTriangle, Database } from "lucide-react";
 
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
 
function formatExpiry(expiry, expired) {
  if (expiry === null) return "No expiration";
  if (expired) return "Expired";
  const msLeft = expiry - Date.now();
  const minsLeft = Math.round(msLeft / 60000);
  if (minsLeft < 1) return "Expires in <1 min";
  if (minsLeft < 60) return `Expires in ${minsLeft} min`;
  const hrsLeft = Math.round(minsLeft / 60);
  return `Expires in ${hrsLeft} hr`;
}
export default function CacheManagerPage({cacher}) {
  const [entries, setEntries] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lastAction, setLastAction] = useState(null);
 
  const refresh = useCallback(() => {
    setEntries(cacher.listEntries());
  }, []);
 
  useEffect(() => {
    refresh();
  }, [refresh]);
 
  const handleClearAll = () => {
    cacher.clearCache();
    refresh();
    setConfirmOpen(false);
    setLastAction("Cache cleared");
    setTimeout(() => setLastAction(null), 2500);
  };
 
  const handleRemoveOne = (key) => {
    cacher.remove(key);
    refresh();
    setLastAction(`Removed "${key}"`);
    setTimeout(() => setLastAction(null), 2500);
  };
 
  const totalBytes = entries.reduce((sum, e) => sum + e.sizeBytes, 0);
  const expiredCount = entries.filter((e) => e.expired).length;
 
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-mono">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-emerald-400" strokeWidth={2} />
            <h1 className="text-lg tracking-tight text-slate-100">
              Cache Manager
            </h1>
          </div>
          <button
            onClick={refresh}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2.5 py-1.5 rounded-md hover:bg-slate-900"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
 
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-px bg-slate-800 rounded-lg overflow-hidden mb-6 border border-slate-800">
          <div className="bg-slate-950 px-4 py-3">
            <div className="text-xs text-slate-500 mb-1">Entries</div>
            <div className="text-xl text-slate-100">{entries.length}</div>
          </div>
          <div className="bg-slate-950 px-4 py-3">
            <div className="text-xs text-slate-500 mb-1">Size</div>
            <div className="text-xl text-slate-100">{formatBytes(totalBytes)}</div>
          </div>
          <div className="bg-slate-950 px-4 py-3">
            <div className="text-xs text-slate-500 mb-1">Expired</div>
            <div className={`text-xl ${expiredCount > 0 ? "text-amber-400" : "text-slate-100"}`}>
              {expiredCount}
            </div>
          </div>
        </div>
 
        {/* Entry list */}
        <div className="border border-slate-800 rounded-lg overflow-hidden mb-6">
          {entries.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-500">
              Nothing cached right now.
            </div>
          ) : (
            entries.map((entry, i) => (
              <div
                key={entry.key}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  i !== entries.length - 1 ? "border-b border-slate-800" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-slate-200 truncate">{entry.key}</div>
                  <div
                    className={`text-xs mt-0.5 ${
                      entry.expired ? "text-amber-400" : "text-slate-500"
                    }`}
                  >
                    {formatExpiry(entry.expiry, entry.expired)} · {formatBytes(entry.sizeBytes)}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveOne(entry.key)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-slate-900 shrink-0"
                  aria-label={`Remove ${entry.key}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
 
        {/* Clear all */}
        {!confirmOpen ? (
          <button
            onClick={() => setConfirmOpen(true)}
            disabled={entries.length === 0}
            className="w-full flex items-center justify-center gap-2 text-sm py-3 rounded-lg border border-slate-800 text-slate-300 hover:border-red-900 hover:text-red-400 hover:bg-red-950/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-800 disabled:hover:text-slate-300 disabled:hover:bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
            Clear all cache
          </button>
        ) : (
          <div className="border border-amber-900/50 bg-amber-950/20 rounded-lg px-4 py-4">
            <div className="flex items-start gap-2.5 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200">
                This removes {entries.length} cached {entries.length === 1 ? "entry" : "entries"}.
                This can't be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleClearAll}
                className="flex-1 text-sm py-2 rounded-md bg-red-600 hover:bg-red-500 text-white transition-colors"
              >
                Clear it
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                className="flex-1 text-sm py-2 rounded-md border border-slate-700 text-slate-300 hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
 
        {/* Toast */}
        {lastAction && (
          <div className="mt-4 text-xs text-emerald-400 text-center">{lastAction}</div>
        )}
      </div>
    </div>
  );
}

 