"use client";
import { useEffect, useState } from "react";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [unanswered, setUnanswered] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewRes, unansweredRes] = await Promise.all([
        fetch(`/api/analytics/overview?days=${selectedPeriod}`),
        fetch('/api/analytics/unanswered?includeNeedsImprovement=true&limit=50')
      ]);

      const overviewData = await overviewRes.json();
      const unansweredData = await unansweredRes.json();

      if (overviewData.success) setAnalytics(overviewData.data);
      if (unansweredData.success) setUnanswered(unansweredData.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      const response = await fetch(`/api/analytics/export?format=${format}&includeAll=true`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `unanswered-questions.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">📊 Analytics Dashboard</h1>
            <p className="text-gray-600">Monitor unanswered questions and improve your knowledge base</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => exportData('json')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Export JSON
            </button>
            <button
              onClick={() => exportData('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex gap-2">
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setSelectedPeriod(days)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedPeriod === days
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Last {days} days
            </button>
          ))}
        </div>

        {/* Overview Metrics */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {analytics.metrics.totalQueries}
              </div>
              <div className="text-gray-600 text-sm">Total Queries</div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {analytics.metrics.unansweredQueries}
              </div>
              <div className="text-gray-600 text-sm">Unanswered Questions</div>
              <div className="text-xs text-gray-500 mt-1">
                {(100 - analytics.metrics.answerRate).toFixed(1)}% of total
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {analytics.metrics.answerRate.toFixed(1)}%
              </div>
              <div className="text-gray-600 text-sm">Answer Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                Avg confidence: {(analytics.metrics.avgConfidence * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {analytics.feedback.satisfactionRate.toFixed(1)}%
              </div>
              <div className="text-gray-600 text-sm">Satisfaction Rate</div>
              <div className="text-xs text-gray-500 mt-1">
                {analytics.feedback.helpful} helpful / {analytics.feedback.totalWithFeedback} total
              </div>
            </div>
          </div>
        )}

        {/* Unanswered Questions Patterns */}
        {unanswered && unanswered.patterns && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Common Question Patterns</h2>
            <p className="text-gray-600 mb-4">Questions grouped by similarity - use this to identify knowledge gaps</p>
            
            <div className="space-y-4">
              {unanswered.patterns.slice(0, 10).map((pattern, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-gray-800">
                      Pattern: "{pattern.pattern}..."
                    </div>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                      {pattern.count} occurrences
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {pattern.examples.map((example, i) => (
                      <div key={i} className="pl-4 border-l-2 border-gray-300">
                        • {example.question}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Unanswered Questions */}
        {analytics && analytics.topIssues && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">❗ Recent Unanswered Questions</h2>
            <p className="text-gray-600 mb-4">Latest questions that couldn't be answered - prioritize these for knowledge base updates</p>
            
            <div className="space-y-3">
              {analytics.topIssues.recentUnanswered.map((query) => (
                <div key={query.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 mb-1">{query.question}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(query.createdAt).toLocaleString()} • 
                        Confidence: {(query.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs">
                      Unanswered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Recommended Actions</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">1.</span>
              <span>Review the common question patterns above and create new document chunks to address them</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">2.</span>
              <span>Export unanswered questions as CSV and use them as a guide for content creation</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">3.</span>
              <span>Focus on questions with multiple occurrences first - they represent common user needs</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">4.</span>
              <span>Monitor the satisfaction rate and address unhelpful responses</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
