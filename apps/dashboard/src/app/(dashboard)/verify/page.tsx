'use client';

import { useState } from 'react';
import { Activity, CheckCircle2, XCircle, Clock, ChevronDown, ChevronRight, Play } from 'lucide-react';
import { useRunVerification } from '@/lib/hooks';

interface VerificationResult {
  testName: string;
  category: string;
  passed: boolean;
  details: string;
  duration: number;
}

interface VerificationReport {
  runId: string;
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  results: VerificationResult[];
}

export default function VerifyPage() {
  const runMutation = useRunVerification();
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const handleRun = async () => {
    const data = await runMutation.mutateAsync();
    setReport(data);
    // Auto-expand categories with failures
    const failedCategories = new Set(
      data.results.filter((r: VerificationResult) => !r.passed).map((r: VerificationResult) => r.category),
    );
    setExpandedCategories(failedCategories);
  };

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  };

  // Group results by category
  const categories = report
    ? Array.from(new Set(report.results.map((r) => r.category))).map((cat) => ({
        name: cat,
        results: report.results.filter((r) => r.category === cat),
      }))
    : [];

  const passRate = report ? Math.round((report.passed / report.totalTests) * 100) : 0;
  const allPassed = report ? report.failed === 0 : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-charcoal">
            System Verification
          </h1>
          <p className="mt-1 text-sm text-charcoal-light">
            Run data integrity and consistency checks across the PalliCare system
          </p>
        </div>
        <button
          onClick={handleRun}
          disabled={runMutation.isPending}
          className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
        >
          {runMutation.isPending ? (
            <>
              <Clock className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run All Tests
            </>
          )}
        </button>
      </div>

      {/* Summary Cards */}
      {report && (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-xl border border-sage-light/30 bg-white p-4">
              <p className="text-xs font-medium uppercase text-charcoal-light">Total Tests</p>
              <p className="mt-1 text-2xl font-bold text-charcoal">{report.totalTests}</p>
            </div>
            <div className="rounded-xl border border-sage-light/30 bg-white p-4">
              <p className="text-xs font-medium uppercase text-charcoal-light">Passed</p>
              <p className="mt-1 text-2xl font-bold text-teal">{report.passed}</p>
            </div>
            <div className="rounded-xl border border-sage-light/30 bg-white p-4">
              <p className="text-xs font-medium uppercase text-charcoal-light">Failed</p>
              <p className="mt-1 text-2xl font-bold text-alert-critical">{report.failed}</p>
            </div>
            <div className="rounded-xl border border-sage-light/30 bg-white p-4">
              <p className="text-xs font-medium uppercase text-charcoal-light">Pass Rate</p>
              <p className="mt-1 text-2xl font-bold text-charcoal">{passRate}%</p>
            </div>
          </div>

          {/* Overall Status Banner */}
          <div
            className={`rounded-xl p-4 text-sm font-medium ${
              allPassed
                ? 'bg-teal/10 text-teal'
                : 'bg-alert-critical/10 text-alert-critical'
            }`}
          >
            {allPassed
              ? 'All verification checks passed. System data integrity is healthy.'
              : `${report.failed} test(s) failed. Review the details below.`}
          </div>

          {/* Category Accordion */}
          <div className="space-y-3">
            {categories.map((cat) => {
              const catPassed = cat.results.filter((r) => r.passed).length;
              const catTotal = cat.results.length;
              const isExpanded = expandedCategories.has(cat.name);
              const hasFails = catPassed < catTotal;

              return (
                <div
                  key={cat.name}
                  className="overflow-hidden rounded-xl border border-sage-light/30 bg-white"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-cream/50"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-charcoal-light" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-charcoal-light" />
                      )}
                      <span className="text-sm font-semibold text-charcoal">
                        {cat.name}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        hasFails
                          ? 'bg-alert-critical/10 text-alert-critical'
                          : 'bg-teal/10 text-teal'
                      }`}
                    >
                      {catPassed}/{catTotal} passed
                    </span>
                  </button>

                  {/* Test Rows */}
                  {isExpanded && (
                    <div className="border-t border-sage-light/20">
                      {cat.results.map((result, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 border-b border-sage-light/10 px-5 py-2.5 last:border-b-0"
                        >
                          {result.passed ? (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-teal" />
                          ) : (
                            <XCircle className="h-4 w-4 flex-shrink-0 text-alert-critical" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-charcoal">{result.testName}</p>
                            <p className="text-xs text-charcoal-light">{result.details}</p>
                          </div>
                          <span className="text-xs text-charcoal-light">
                            {result.duration}ms
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Run Metadata */}
          <p className="text-xs text-charcoal-light">
            Run ID: {report.runId} | {new Date(report.timestamp).toLocaleString()}
          </p>
        </>
      )}

      {/* Empty State */}
      {!report && !runMutation.isPending && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sage-light/50 py-16">
          <Activity className="h-10 w-10 text-sage-light" />
          <p className="mt-3 text-sm text-charcoal-light">
            Click &quot;Run All Tests&quot; to start verification
          </p>
        </div>
      )}
    </div>
  );
}
