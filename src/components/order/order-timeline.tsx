import React from "react";

type HistoryItem = { status: string; date: string | Date };

export default function OrderTimeline({
  trackingId,
  currentStatus,
  history,
}: {
  trackingId?: string;
  currentStatus?: string;
  history?: HistoryItem[];
}) {
  const items = Array.isArray(history)
    ? [...history].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Order Tracking</h3>
        {trackingId ? (
          <span className="text-xs font-mono px-2 py-1 rounded bg-gray-100 text-gray-700">
            {trackingId}
          </span>
        ) : null}
      </div>
      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-gray-600">No history yet.</p>
        ) : (
          <ol className="relative border-s border-gray-200 ms-2">
            {items.map((h, idx) => (
              <li key={idx} className="mb-6 ms-4">
                <div className="absolute w-3 h-3 bg-indigo-500 rounded-full mt-1.5 -start-1.5 border border-white" />
                <time className="mb-1 text-xs font-normal leading-none text-gray-400">
                  {new Date(h.date).toLocaleString()}
                </time>
                <div className="text-sm font-medium text-gray-900">{h.status}</div>
              </li>
            ))}
          </ol>
        )}
        {currentStatus ? (
          <div className="text-sm text-gray-700">
            Current status: <span className="font-semibold">{currentStatus}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
