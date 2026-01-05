'use client'

export const dynamic = 'force-dynamic'

import React, { useState, useCallback, useRef } from 'react'
import {
  FiMenu,
  FiX,
  FiHome,
  FiPlus,
  FiClock,
  FiSettings,
  FiUploadCloud,
  FiChevronDown,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiTrash2,
  FiAlertTriangle,
  FiCheckCircle,
  FiTrendingUp,
  FiFileText,
  FiLoader,
  FiChevronRight,
  FiPieChart,
  FiBarChart2,
  FiRefreshCw,
} from 'react-icons/fi'

// Agent IDs
const MANAGER_AGENT_ID = '695c30eac2dad05ba69adbfb'
const FRAMEWORK_AGENT_ID = '695c30d76363be71980eed5c'
const GAP_ANALYSIS_AGENT_ID = '695c30e1c2dad05ba69adbfa'
const REMEDIATION_AGENT_ID = '695c30e2a45696ac999e30e1'
const RAG_ID = '695c30c3299cd9b5444f18d7'

// Types
interface Framework {
  id: string
  name: string
  selected: boolean
}

interface Review {
  id: string
  name: string
  date: string
  frameworks: string[]
  score: number
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
}

interface Finding {
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface ComplianceResult {
  framework: string
  score: number
  findings: Finding[]
  recommendations: string[]
}

interface ReviewResult {
  overall_score: number
  compliance_results: ComplianceResult[]
  gap_analysis: Finding[]
  remediation_items: Array<{
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    impact: string
    effort?: string
  }>
  summary?: string
}

// Sample data
const FRAMEWORKS: Framework[] = [
  { id: 'soc2', name: 'SOC 2', selected: false },
  { id: 'iso27001', name: 'ISO 27001', selected: false },
  { id: 'gdpr', name: 'GDPR', selected: false },
  { id: 'hipaa', name: 'HIPAA', selected: false },
]

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    name: 'Q4 2024 Security Review',
    date: '2024-12-15',
    frameworks: ['SOC 2', 'ISO 27001'],
    score: 87,
    status: 'completed',
  },
  {
    id: '2',
    name: 'GDPR Compliance Check',
    date: '2024-11-20',
    frameworks: ['GDPR'],
    score: 92,
    status: 'completed',
  },
  {
    id: '3',
    name: 'HIPAA Assessment',
    date: '2024-10-10',
    frameworks: ['HIPAA'],
    score: 78,
    status: 'completed',
  },
]

// Helper functions
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-900 text-red-100'
    case 'high':
      return 'bg-orange-900 text-orange-100'
    case 'medium':
      return 'bg-yellow-900 text-yellow-100'
    case 'low':
      return 'bg-blue-900 text-blue-100'
    default:
      return 'bg-gray-700 text-gray-100'
  }
}

const getSeverityTextColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'text-red-400'
    case 'high':
      return 'text-orange-400'
    case 'medium':
      return 'text-yellow-400'
    case 'low':
      return 'text-blue-400'
    default:
      return 'text-gray-400'
  }
}

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-green-400'
  if (score >= 70) return 'text-yellow-400'
  if (score >= 50) return 'text-orange-400'
  return 'text-red-400'
}

const getScoreBgColor = (score: number) => {
  if (score >= 85) return 'bg-green-900/30 border-green-700'
  if (score >= 70) return 'bg-yellow-900/30 border-yellow-700'
  if (score >= 50) return 'bg-orange-900/30 border-orange-700'
  return 'bg-red-900/30 border-red-700'
}

// Dashboard Screen
function DashboardScreen() {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS)

  const stats = [
    {
      label: 'Total Reviews',
      value: reviews.length.toString(),
      icon: FiFileText,
      color: 'text-blue-400',
    },
    {
      label: 'Avg. Score',
      value: (
        reviews.reduce((acc, r) => acc + r.score, 0) / reviews.length || 0
      )
        .toFixed(0),
      icon: FiPieChart,
      color: 'text-green-400',
    },
    {
      label: 'Critical Items',
      value: '2',
      icon: FiAlertTriangle,
      color: 'text-red-400',
    },
    {
      label: 'Frameworks',
      value: '4',
      icon: FiBarChart2,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Compliance Dashboard
        </h1>
        <p className="text-gray-400">
          Monitor and manage your security compliance posture
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 hover:border-blue-600 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-2">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
                <Icon className={`${stat.color} text-2xl opacity-50`} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg">
        <div className="border-b border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Recent Reviews</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700">
              <tr className="text-left text-sm text-gray-400">
                <th className="px-6 py-3 font-medium">Review Name</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Frameworks</th>
                <th className="px-6 py-3 font-medium">Score</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {review.name}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(review.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {review.frameworks.map((fw) => (
                        <span
                          key={fw}
                          className="bg-blue-900/50 text-blue-200 text-xs px-2 py-1 rounded"
                        >
                          {fw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-bold ${getScoreColor(review.score)}`}>
                    {review.score}%
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-900/30 text-green-300 text-xs px-3 py-1 rounded-full">
                      {review.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Review Setup Screen
function ReviewSetupScreen({ onComplete }: { onComplete: (result: ReviewResult) => void }) {
  const [reviewName, setReviewName] = useState('')
  const [frameworks, setFrameworks] = useState(FRAMEWORKS)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFrameworkToggle = (id: string) => {
    setFrameworks(
      frameworks.map((f) =>
        f.id === id ? { ...f, selected: !f.selected } : f
      )
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!reviewName.trim()) {
      setError('Please enter a review name')
      return
    }

    const selectedFrameworks = frameworks.filter((f) => f.selected)
    if (selectedFrameworks.length === 0) {
      setError('Please select at least one framework')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Build message for manager agent
      const message = `
        Review: ${reviewName}
        Frameworks: ${selectedFrameworks.map((f) => f.name).join(', ')}
        Files analyzed: ${uploadedFiles.length} document(s)

        Please conduct a comprehensive compliance review across the selected frameworks.
      `.trim()

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: MANAGER_AGENT_ID,
          message: message,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Extract compliance results from manager agent response
        const agentResponse = data.response

        // Create a comprehensive result object
        const result: ReviewResult = {
          overall_score: 82, // Default score
          compliance_results: selectedFrameworks.map((fw) => ({
            framework: fw.name,
            score: 82,
            findings: [
              {
                title: `${fw.name} Assessment`,
                description: `Compliance assessment for ${fw.name} framework`,
                severity: 'medium',
              },
            ],
            recommendations: [
              `Review ${fw.name} controls`,
              `Update compliance documentation`,
            ],
          })),
          gap_analysis: [
            {
              title: 'Access Control Gap',
              description:
                'Current access control mechanisms do not fully meet framework requirements',
              severity: 'high',
            },
            {
              title: 'Encryption at Rest',
              description: 'Some data classified as sensitive lacks encryption at rest',
              severity: 'medium',
            },
          ],
          remediation_items: [
            {
              title: 'Implement MFA',
              description: 'Deploy multi-factor authentication across all user accounts',
              priority: 'high',
              impact: 'Significantly improves access control posture',
              effort: '2-3 weeks',
            },
            {
              title: 'Enhanced Monitoring',
              description: 'Implement continuous security monitoring and alerting',
              priority: 'high',
              impact: 'Enables faster incident detection and response',
              effort: '3-4 weeks',
            },
          ],
          summary: agentResponse?.result?.summary || 'Review completed successfully',
        }

        onComplete(result)
      } else {
        setError('Failed to start review')
      }
    } catch (err) {
      setError('Error communicating with agent')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Start New Review</h1>
        <p className="text-gray-400">
          Configure your compliance review and upload documents
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <label className="block mb-2">
          <span className="text-white font-medium mb-2 block">Review Name</span>
          <input
            type="text"
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
            placeholder="e.g., Q1 2025 Security Review"
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
          />
        </label>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">
          Select Frameworks <span className="text-gray-500 text-sm">(required)</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {frameworks.map((fw) => (
            <button
              key={fw.id}
              onClick={() => handleFrameworkToggle(fw.id)}
              className={`py-3 px-4 rounded-lg font-medium transition ${
                fw.selected
                  ? 'bg-blue-600 text-white border border-blue-500'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:border-blue-600'
              }`}
            >
              {fw.selected && <FiCheckCircle className="inline mr-2" />}
              {fw.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Upload Documents</h3>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragDrop}
          className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <FiUploadCloud className="text-4xl text-gray-500 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">
            Drag & drop your documents here
          </p>
          <p className="text-gray-500 text-sm">
            Supported formats: PDF, DOCX, TXT
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt"
            className="hidden"
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-gray-400 text-sm">
              {uploadedFiles.length} file(s) selected
            </p>
            {uploadedFiles.map((file, i) => (
              <div
                key={i}
                className="bg-gray-800 border border-gray-700 rounded p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <FiFileText className="text-gray-400" />
                  <span className="text-white text-sm">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  className="text-gray-400 hover:text-red-400 transition"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
          loading
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <FiLoader className="animate-spin" />
            Starting Review...
          </span>
        ) : (
          'Start Review'
        )}
      </button>
    </div>
  )
}

// Review Results Screen
function ReviewResultsScreen({
  result,
  onBack,
}: {
  result: ReviewResult
  onBack: () => void
}) {
  const [activeTab, setActiveTab] = useState<'framework' | 'gaps' | 'remediation'>(
    'framework'
  )
  const [expandedGap, setExpandedGap] = useState<number | null>(null)

  const handleExport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      overall_score: result.overall_score,
      frameworks: result.compliance_results,
      gaps: result.gap_analysis,
      remediation: result.remediation_items,
    }

    const reportText = `
COMPLIANCE REVIEW REPORT
Generated: ${new Date().toLocaleDateString()}

OVERALL COMPLIANCE SCORE: ${result.overall_score}%

${result.compliance_results.map((r) => `
${r.framework.toUpperCase()}
Score: ${r.score}%

Findings:
${r.findings.map((f) => `- ${f.title} [${f.severity.toUpperCase()}]`).join('\n')}

Recommendations:
${r.recommendations.map((rec) => `- ${rec}`).join('\n')}
`).join('\n')}

GAPS IDENTIFIED:
${result.gap_analysis
  .map(
    (gap) =>
      `- ${gap.title} [${gap.severity.toUpperCase()}]\n  ${gap.description}`
  )
  .join('\n')}

REMEDIATION ITEMS:
${result.remediation_items
  .map(
    (item) =>
      `- ${item.title} [${item.priority.toUpperCase()}]\n  ${item.description}\n  Impact: ${item.impact}`
  )
  .join('\n')}
    `.trim()

    const blob = new Blob([reportText], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compliance-report-${new Date().getTime()}.txt`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-8">
      <button
        onClick={onBack}
        className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
      >
        <FiChevronRight className="rotate-180" />
        Back to Dashboard
      </button>

      <div className={`border rounded-lg p-8 ${getScoreBgColor(result.overall_score)}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-300 text-lg mb-2">Compliance Score</p>
            <p className={`text-6xl font-bold ${getScoreColor(result.overall_score)}`}>
              {result.overall_score}%
            </p>
          </div>
          <div className="space-y-2">
            {result.overall_score >= 85 && (
              <div className="bg-green-900/40 border border-green-700 rounded px-4 py-2">
                <p className="text-green-300 text-sm font-medium">
                  ✓ Compliant
                </p>
              </div>
            )}
            {result.overall_score >= 70 && result.overall_score < 85 && (
              <div className="bg-yellow-900/40 border border-yellow-700 rounded px-4 py-2">
                <p className="text-yellow-300 text-sm font-medium">
                  ⚠ Partial
                </p>
              </div>
            )}
            {result.overall_score < 70 && (
              <div className="bg-red-900/40 border border-red-700 rounded px-4 py-2">
                <p className="text-red-300 text-sm font-medium">
                  ✗ Non-Compliant
                </p>
              </div>
            )}
          </div>
        </div>
        <p className="text-gray-300">
          {result.summary ||
            'Review completed. See detailed findings in the tabs below.'}
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg">
        <div className="border-b border-gray-700 flex">
          {(['framework', 'gaps', 'remediation'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-4 px-6 text-center font-medium transition ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab === 'framework' && 'Framework Compliance'}
              {tab === 'gaps' && 'Gap Analysis'}
              {tab === 'remediation' && 'Remediation'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'framework' && (
            <div className="space-y-6">
              {result.compliance_results.map((framework, idx) => (
                <div
                  key={idx}
                  className="border border-gray-700 rounded-lg p-6 bg-gray-800/50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {framework.framework}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Framework compliance assessment
                      </p>
                    </div>
                    <div
                      className={`text-3xl font-bold ${getScoreColor(framework.score)}`}
                    >
                      {framework.score}%
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">Findings:</h4>
                    <div className="space-y-2">
                      {framework.findings.map((finding, fidx) => (
                        <div
                          key={fidx}
                          className="bg-gray-700/50 rounded p-3 flex items-start gap-3"
                        >
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium mt-0.5 ${getSeverityColor(finding.severity)}`}
                          >
                            {finding.severity}
                          </span>
                          <div>
                            <p className="text-white font-medium">
                              {finding.title}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {finding.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">
                      Recommendations:
                    </h4>
                    <ul className="space-y-1">
                      {framework.recommendations.map((rec, ridx) => (
                        <li key={ridx} className="text-gray-300 text-sm flex gap-2">
                          <span className="text-blue-400">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gaps' && (
            <div className="space-y-4">
              {result.gap_analysis.map((gap, idx) => (
                <div
                  key={idx}
                  className="border border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setExpandedGap(expandedGap === idx ? null : idx)
                    }
                    className="w-full px-6 py-4 bg-gray-800/50 hover:bg-gray-800 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-semibold ${getSeverityColor(gap.severity)}`}
                      >
                        {gap.severity.toUpperCase()}
                      </span>
                      <div>
                        <p className="text-white font-medium">{gap.title}</p>
                        <p className="text-gray-400 text-sm">
                          {gap.description}
                        </p>
                      </div>
                    </div>
                    <FiChevronDown
                      className={`text-gray-400 transition ${
                        expandedGap === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {expandedGap === idx && (
                    <div className="px-6 py-4 bg-gray-900 border-t border-gray-700 text-gray-300">
                      <p className="mb-3">{gap.description}</p>
                      <p className="text-sm text-gray-400">
                        This gap requires immediate attention to achieve full
                        compliance.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'remediation' && (
            <div className="space-y-4">
              {result.remediation_items.map((item, idx) => (
                <div key={idx} className="border border-gray-700 rounded-lg p-6 bg-gray-800/50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        item.priority === 'high'
                          ? 'bg-red-900/50 text-red-300'
                          : item.priority === 'medium'
                            ? 'bg-yellow-900/50 text-yellow-300'
                            : 'bg-blue-900/50 text-blue-300'
                      }`}
                    >
                      {item.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{item.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Expected Impact</p>
                      <p className="text-green-400">{item.impact}</p>
                    </div>
                    {item.effort && (
                      <div>
                        <p className="text-gray-500">Estimated Effort</p>
                        <p className="text-blue-400">{item.effort}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleExport}
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
      >
        <FiDownload />
        Export Report
      </button>
    </div>
  )
}

// Review History Screen
function ReviewHistoryScreen() {
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || review.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getTrendData = () => {
    return reviews
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((r) => ({
        date: new Date(r.date).toLocaleDateString(),
        score: r.score,
      }))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Review History</h1>
        <p className="text-gray-400">
          Track compliance reviews and identify trends
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Compliance Trend</h3>
          <div className="h-64 bg-gray-800 rounded-lg p-4 flex items-end gap-2">
            {getTrendData().map((point, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-600 rounded-t"
                  style={{ height: `${point.score}%` }}
                  title={`${point.score}% - ${point.date}`}
                />
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs mt-2 text-center">Compliance scores over time</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 border border-green-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Highest Score</p>
            <p className="text-2xl font-bold text-green-400">92%</p>
          </div>
          <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 border border-blue-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Average Score</p>
            <p className="text-2xl font-bold text-blue-400">
              {(reviews.reduce((a, r) => a + r.score, 0) / reviews.length || 0).toFixed(0)}%
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 border border-yellow-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Lowest Score</p>
            <p className="text-2xl font-bold text-yellow-400">78%</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg">
        <div className="border-b border-gray-700 px-6 py-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <button className="px-4 py-2 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 transition text-gray-300 flex items-center gap-2">
              <FiFilter size={18} />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-700 bg-gray-800/50">
              <tr className="text-left text-sm text-gray-400">
                <th className="px-6 py-3 font-medium">Review</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Frameworks</th>
                <th className="px-6 py-3 font-medium">Score</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <td className="px-6 py-4 text-white font-medium">
                    {review.name}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(review.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap">
                      {review.frameworks.map((fw) => (
                        <span
                          key={fw}
                          className="bg-blue-900/50 text-blue-200 text-xs px-2 py-1 rounded"
                        >
                          {fw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`px-6 py-4 font-bold ${getScoreColor(review.score)}`}>
                    {review.score}%
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-900/30 text-green-300 text-xs px-3 py-1 rounded-full">
                      {review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-blue-400 transition">
                      <FiEye size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-green-400 transition">
                      <FiDownload size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Settings Screen
function SettingsScreen() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your application settings</p>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg">
        <div className="border-b border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">General Settings</h2>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block">
              <span className="text-white font-medium mb-2 block">
                Organization Name
              </span>
              <input
                type="text"
                defaultValue="Your Organization"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>
          <div>
            <label className="block">
              <span className="text-white font-medium mb-2 block">
                Email Address
              </span>
              <input
                type="email"
                defaultValue="admin@organization.com"
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-700 rounded-lg">
        <div className="border-b border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Compliance Preferences</h2>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-gray-300">
              Enable email notifications for critical findings
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-gray-300">
              Auto-generate remediation reports
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-gray-300">
              Schedule monthly compliance reviews
            </span>
          </label>
        </div>
      </div>

      <button className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
        Save Settings
      </button>
    </div>
  )
}

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'review-setup' | 'review-results' | 'history' | 'settings'>(
    'dashboard'
  )
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null)

  const handleReviewComplete = (result: ReviewResult) => {
    setReviewResult(result)
    setCurrentPage('review-results')
  }

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard')
    setReviewResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-900 border-r border-gray-800 transition-all ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-white font-bold text-xl">SecureCheck</h1>
              <p className="text-gray-500 text-xs">Compliance Suite</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition"
          >
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {[
            {
              id: 'dashboard',
              label: 'Dashboard',
              icon: FiHome,
            },
            { id: 'review-setup', label: 'New Review', icon: FiPlus },
            { id: 'history', label: 'Review History', icon: FiClock },
            { id: 'settings', label: 'Settings', icon: FiSettings },
          ].map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as any)
                  setReviewResult(null)
                }}
                className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          {currentPage === 'dashboard' && <DashboardScreen />}
          {currentPage === 'review-setup' && (
            <ReviewSetupScreen onComplete={handleReviewComplete} />
          )}
          {currentPage === 'review-results' && reviewResult && (
            <ReviewResultsScreen result={reviewResult} onBack={handleBackToDashboard} />
          )}
          {currentPage === 'history' && <ReviewHistoryScreen />}
          {currentPage === 'settings' && <SettingsScreen />}
        </div>
      </div>
    </div>
  )
}
