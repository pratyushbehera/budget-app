import React from 'react';
import ReactMarkdown from 'react-markdown';

export function InsightsTab({ generateInsight, insight, isLoading }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
            <h3 className="text-lg font-semibold">Budget Insights (AI-Powered)</h3>
            <p className="text-gray-700">
                Click the button below to generate a detailed insight into your planning vs. spending for the current month, powered by AI.
            </p>
            <button
                onClick={generateInsight}
                disabled={isLoading}
                className={`px-4 py-2 rounded shadow-sm text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isLoading ? 'Generating Insights...' : 'Generate Insights'}
            </button>

            {insight && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h4 className="font-medium text-gray-800">AI-Generated Insight:</h4>
                    <div className="mt-2 prose prose-indigo max-w-none text-gray-700">
                        <ReactMarkdown>{insight}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
