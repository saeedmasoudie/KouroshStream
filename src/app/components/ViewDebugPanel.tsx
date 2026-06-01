import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, X } from 'lucide-react';

interface ViewDebugPanelProps {
  mediaId: string;
  currentViews: number;
}

export const ViewDebugPanel: React.FC<ViewDebugPanelProps> = ({ mediaId, currentViews }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  // Fetch view data from your database (you'll need to add this endpoint to your worker)
  const fetchViewData = async () => {
    setLoading(true);
    try {
      // This would call a debug endpoint on your worker
      const response = await fetch(`https://cinestream-media-detail.ericluck.workers.dev/debug-views?media_id=${mediaId}`);
      const data = await response.json();
      setViewData(data);
    } catch (error) {
      console.error('Failed to fetch view data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test the view tracking
  const testViewTracking = async () => {
    setTestResult('Testing...');
    try {
      const response = await fetch('https://cinestream-media-detail.ericluck.workers.dev/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ media_id: mediaId }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setTestResult('✅ View tracked successfully! Refresh to see updated count.');
        // Refresh view data
        setTimeout(() => fetchViewData(), 500);
      } else {
        setTestResult(`❌ Error: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      setTestResult(`❌ Failed: ${error}`);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchViewData();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 text-sm font-bold"
      >
        <Eye className="w-4 h-4" />
        View Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 border border-white/20 rounded-xl shadow-2xl p-4 w-96 z-50 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Eye className="w-5 h-5 text-emerald-500" />
          View Tracking Debug
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Current Stats */}
      <div className="bg-white/5 rounded-lg p-3 mb-4">
        <p className="text-gray-400 text-xs uppercase mb-1">Current View Count</p>
        <p className="text-white text-2xl font-bold">{currentViews}</p>
        <p className="text-gray-500 text-xs mt-1">Media ID: {mediaId}</p>
      </div>

      {/* Test Button */}
      <button
        onClick={testViewTracking}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 mb-2 font-bold text-sm"
      >
        Test View Tracking
      </button>

      {testResult && (
        <div className="bg-white/5 rounded-lg p-3 mb-4">
          <p className="text-white text-sm">{testResult}</p>
        </div>
      )}

      {/* Refresh Button */}
      <button
        onClick={fetchViewData}
        disabled={loading}
        className="w-full bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 mb-4 text-sm"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh Data
      </button>

      {/* View Data */}
      {loading && (
        <div className="text-center text-gray-400 py-4">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          Loading...
        </div>
      )}

      {viewData && (
        <div className="space-y-3">
          {/* Your IP Status */}
          {viewData.yourIp && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase mb-2">Your IP Status</p>
              <p className="text-white text-sm font-mono mb-1">{viewData.yourIp}</p>
              {viewData.hasViewed ? (
                <p className="text-yellow-500 text-xs">✓ Already viewed (within 24h)</p>
              ) : (
                <p className="text-green-500 text-xs">✓ New view will be counted</p>
              )}
              {viewData.lastViewTime && (
                <p className="text-gray-500 text-xs mt-1">
                  Last viewed: {new Date(viewData.lastViewTime).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Recent Views */}
          {viewData.recentViews && viewData.recentViews.length > 0 && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase mb-2">
                Recent Views (Last 24h): {viewData.recentViews.length}
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {viewData.recentViews.slice(0, 10).map((view: any, idx: number) => (
                  <div key={idx} className="text-xs">
                    <p className="text-white font-mono">{view.ip_address}</p>
                    <p className="text-gray-500">
                      {new Date(view.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Total Unique Views */}
          {viewData.totalUniqueViews !== undefined && (
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-gray-400 text-xs uppercase mb-1">Total Unique Views (24h)</p>
              <p className="text-white text-xl font-bold">{viewData.totalUniqueViews}</p>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
        <p className="text-blue-400 text-xs font-bold mb-1">How it works:</p>
        <ul className="text-gray-400 text-xs space-y-1 list-disc list-inside">
          <li>Views from the same IP are counted once per 24 hours</li>
          <li>Click "Test View Tracking" to simulate a view</li>
          <li>Refresh the page to see the updated view count</li>
          <li>Try from different devices/IPs to see multiple views</li>
        </ul>
      </div>
    </div>
  );
};
