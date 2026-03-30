'use client';

import { useState } from 'react';
import {
  Shield, AlertTriangle, MessageCircle, Flag,
  CheckCircle, XCircle, Eye, Clock,
  Users, Heart, ChevronDown, Search,
  Phone, Ban, UserX, FileWarning,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'flagged';
type ReportReason = 'harassment' | 'misinformation' | 'spam' | 'self_harm' | 'inappropriate' | 'medical_advice';
type PostType = 'text' | 'comfort_card' | 'poll' | 'milestone';

interface FlaggedPost {
  id: string;
  channelName: string;
  authorName: string;
  isAnonymous: boolean;
  type: PostType;
  contentEn: string;
  contentHi: string;
  moderationStatus: ModerationStatus;
  flagReason: ReportReason | 'auto_profanity' | 'auto_crisis' | 'auto_medical' | 'auto_threat';
  flaggedTerms: string[];
  supportCount: number;
  replyCount: number;
  createdAt: string;
  reportCount: number;
}

// ─────────────────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────────────────

const MOCK_STATS = {
  pendingReview: 7,
  flaggedToday: 3,
  totalPosts24h: 48,
  activeUsers: 156,
  crisisDetected: 1,
  postsApproved: 41,
};

const MOCK_FLAGGED_POSTS: FlaggedPost[] = [
  {
    id: 'flag_001',
    channelName: 'Active Treatment',
    authorName: 'Anonymous',
    isAnonymous: true,
    type: 'text',
    contentEn: 'I can\'t take this anymore. The pain is unbearable and I want to end my life. Nothing helps.',
    contentHi: 'मैं और नहीं सह सकता। दर्द असहनीय है और मैं अपना जीवन समाप्त करना चाहता हूँ।',
    moderationStatus: 'flagged',
    flagReason: 'auto_crisis',
    flaggedTerms: ['[crisis] end my life', '[crisis] want to die'],
    supportCount: 0,
    replyCount: 0,
    createdAt: '2026-02-26T14:22:00',
    reportCount: 0,
  },
  {
    id: 'flag_002',
    channelName: 'Newly Diagnosed',
    authorName: 'User_7829',
    isAnonymous: false,
    type: 'text',
    contentEn: 'Stop your medication and try this herbal cure instead. My uncle was cured completely by drinking neem water daily. Doctors are wrong about chemotherapy.',
    contentHi: 'अपनी दवाई बंद करो और इसके बजाय इस हर्बल इलाज को आज़माओ। डॉक्टर गलत हैं।',
    moderationStatus: 'flagged',
    flagReason: 'auto_medical',
    flaggedTerms: ['[medical] stop your medication', '[medical] doctors are wrong', '[medical] this will cure you'],
    supportCount: 2,
    replyCount: 1,
    createdAt: '2026-02-26T12:45:00',
    reportCount: 3,
  },
  {
    id: 'flag_003',
    channelName: 'Chronic Pain Management',
    authorName: 'Anonymous',
    isAnonymous: true,
    type: 'text',
    contentEn: 'You people are all idiots for listening to these doctors. They just want your money. Stupid fools.',
    contentHi: 'तुम सब बेवकूफ हो जो इन डॉक्टरों की सुनते हो।',
    moderationStatus: 'pending',
    flagReason: 'auto_profanity',
    flaggedTerms: ['idiot', 'stupid'],
    supportCount: 0,
    replyCount: 0,
    createdAt: '2026-02-26T11:30:00',
    reportCount: 2,
  },
  {
    id: 'flag_004',
    channelName: 'Caregiver Support',
    authorName: 'User_4511',
    isAnonymous: false,
    type: 'text',
    contentEn: 'Buy my herbal supplements at www.fakecure.com — 50% off today! Guaranteed cancer cure!',
    contentHi: 'मेरी हर्बल सप्लीमेंट्स खरीदें — कैंसर का गारंटीड इलाज!',
    moderationStatus: 'pending',
    flagReason: 'spam',
    flaggedTerms: [],
    supportCount: 0,
    replyCount: 0,
    createdAt: '2026-02-26T10:15:00',
    reportCount: 5,
  },
  {
    id: 'flag_005',
    channelName: 'Survivorship',
    authorName: 'Meera_R',
    isAnonymous: false,
    type: 'text',
    contentEn: 'I found this great article about alternative treatment options. Not saying stop chemo, but I tried acupuncture alongside and it helped my nausea. Worth discussing with your doctor.',
    contentHi: 'मैंने वैकल्पिक उपचार विकल्पों के बारे में एक अच्छा लेख पाया। एक्यूपंक्चर ने मेरी मिचली में मदद की।',
    moderationStatus: 'pending',
    flagReason: 'medical_advice',
    flaggedTerms: [],
    supportCount: 8,
    replyCount: 3,
    createdAt: '2026-02-26T09:00:00',
    reportCount: 1,
  },
];

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

export default function CommunityModerationPage() {
  const [posts, setPosts] = useState<FlaggedPost[]>(MOCK_FLAGGED_POSTS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'flagged' | 'crisis'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const filteredPosts = posts.filter((p) => {
    if (filter === 'pending') return p.moderationStatus === 'pending';
    if (filter === 'flagged') return p.moderationStatus === 'flagged';
    if (filter === 'crisis') return p.flagReason === 'auto_crisis';
    return true;
  }).filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.contentEn.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q) ||
      p.channelName.toLowerCase().includes(q)
    );
  });

  const handleApprove = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, moderationStatus: 'approved' as const } : p))
    );
  };

  const handleReject = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, moderationStatus: 'rejected' as const } : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-teal-600" />
            Community Moderation
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review flagged posts, manage reports, and ensure community safety
          </p>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          icon={<Clock className="h-4 w-4" />}
          label="Pending Review"
          value={MOCK_STATS.pendingReview}
          color="amber"
        />
        <StatCard
          icon={<Flag className="h-4 w-4" />}
          label="Flagged Today"
          value={MOCK_STATS.flaggedToday}
          color="red"
        />
        <StatCard
          icon={<Phone className="h-4 w-4" />}
          label="Crisis Detected"
          value={MOCK_STATS.crisisDetected}
          color="red"
          urgent
        />
        <StatCard
          icon={<MessageCircle className="h-4 w-4" />}
          label="Posts (24h)"
          value={MOCK_STATS.totalPosts24h}
          color="teal"
        />
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Active Users"
          value={MOCK_STATS.activeUsers}
          color="teal"
        />
        <StatCard
          icon={<CheckCircle className="h-4 w-4" />}
          label="Approved"
          value={MOCK_STATS.postsApproved}
          color="green"
        />
      </div>

      {/* ── Filters + Search ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {(['all', 'pending', 'flagged', 'crisis'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                filter === f
                  ? f === 'crisis'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              {f === 'all' ? 'All' : f === 'pending' ? '⏳ Pending' : f === 'flagged' ? '🚩 Flagged' : '🆘 Crisis'}
            </button>
          ))}
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts, authors, channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400"
          />
        </div>
      </div>

      {/* ── Moderation Queue ── */}
      <div className="space-y-3">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No posts matching this filter</p>
            <p className="text-sm mt-1">All clear! The community is behaving well.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <FlaggedPostCard
              key={post.id}
              post={post}
              isExpanded={expandedPost === post.id}
              onToggle={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              onApprove={() => handleApprove(post.id)}
              onReject={() => handleReject(post.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  color,
  urgent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'teal' | 'amber' | 'red' | 'green';
  urgent?: boolean;
}) {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-3 transition-all',
        colorMap[color],
        urgent && 'ring-2 ring-red-300 animate-pulse'
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function FlaggedPostCard({
  post,
  isExpanded,
  onToggle,
  onApprove,
  onReject,
}: {
  post: FlaggedPost;
  isExpanded: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isCrisis = post.flagReason === 'auto_crisis';
  const isResolved = post.moderationStatus === 'approved' || post.moderationStatus === 'rejected';

  const flagReasonLabel: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    auto_crisis: { label: 'Crisis Keywords Detected', icon: <Phone className="h-3.5 w-3.5" />, color: 'text-red-700 bg-red-50 border-red-200' },
    auto_profanity: { label: 'Profanity Detected', icon: <Ban className="h-3.5 w-3.5" />, color: 'text-orange-700 bg-orange-50 border-orange-200' },
    auto_medical: { label: 'Medical Advice Detected', icon: <FileWarning className="h-3.5 w-3.5" />, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    auto_threat: { label: 'Threatening Language', icon: <AlertTriangle className="h-3.5 w-3.5" />, color: 'text-red-700 bg-red-50 border-red-200' },
    harassment: { label: 'Harassment Report', icon: <UserX className="h-3.5 w-3.5" />, color: 'text-red-700 bg-red-50 border-red-200' },
    misinformation: { label: 'Misinformation Report', icon: <FileWarning className="h-3.5 w-3.5" />, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    spam: { label: 'Spam Report', icon: <Ban className="h-3.5 w-3.5" />, color: 'text-gray-700 bg-gray-50 border-gray-200' },
    self_harm: { label: 'Self-Harm Report', icon: <Phone className="h-3.5 w-3.5" />, color: 'text-red-700 bg-red-50 border-red-200' },
    inappropriate: { label: 'Inappropriate Content', icon: <Flag className="h-3.5 w-3.5" />, color: 'text-orange-700 bg-orange-50 border-orange-200' },
    medical_advice: { label: 'Unverified Medical Advice', icon: <FileWarning className="h-3.5 w-3.5" />, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  };

  const flagInfo = flagReasonLabel[post.flagReason] ?? {
    label: 'Unknown',
    icon: <Flag className="h-3.5 w-3.5" />,
    color: 'text-gray-700 bg-gray-50 border-gray-200',
  };

  return (
    <div
      className={cn(
        'rounded-xl border bg-white overflow-hidden transition-all',
        isCrisis && !isResolved && 'border-red-300 ring-1 ring-red-200',
        isResolved && 'opacity-60',
      )}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
      >
        {/* Flag badge */}
        <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium', flagInfo.color)}>
          {flagInfo.icon}
          {flagInfo.label}
        </div>

        {/* Channel */}
        <span className="text-xs text-gray-500 hidden sm:inline">
          in <span className="font-medium">{post.channelName}</span>
        </span>

        {/* Reports count */}
        {post.reportCount > 0 && (
          <span className="text-xs text-red-600 font-medium">
            {post.reportCount} report{post.reportCount > 1 ? 's' : ''}
          </span>
        )}

        <span className="flex-1" />

        {/* Status badge */}
        {post.moderationStatus === 'approved' && (
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" /> Approved
          </span>
        )}
        {post.moderationStatus === 'rejected' && (
          <span className="text-xs text-red-600 font-medium flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        )}

        {/* Time */}
        <span className="text-xs text-gray-400">
          {formatTime(post.createdAt)}
        </span>

        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', isExpanded && 'rotate-180')} />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* Author */}
          <div className="flex items-center gap-2 py-2 text-sm text-gray-600">
            <span className="font-medium">{post.authorName}</span>
            {post.isAnonymous && (
              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Anonymous</span>
            )}
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" /> {post.supportCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" /> {post.replyCount}
            </span>
          </div>

          {/* Content EN */}
          <div className="bg-gray-50 rounded-lg p-3 mb-2">
            <p className="text-sm text-gray-800 leading-relaxed">{post.contentEn}</p>
          </div>

          {/* Content HI */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-600 italic leading-relaxed">{post.contentHi}</p>
          </div>

          {/* Flagged Terms */}
          {post.flaggedTerms.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-500 mb-1">Flagged terms:</p>
              <div className="flex flex-wrap gap-1">
                {post.flaggedTerms.map((term, i) => (
                  <span
                    key={i}
                    className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-md font-mono"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Crisis Alert */}
          {isCrisis && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 text-red-700 font-medium text-sm mb-1">
                <Phone className="h-4 w-4" />
                Crisis Response Required
              </div>
              <p className="text-xs text-red-600">
                This user may be expressing suicidal ideation. The crisis helpline dialog was shown
                to them automatically. Consider reaching out via the messaging system.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {!isResolved && (
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={onApprove}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={onReject}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject & Remove
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <Eye className="h-4 w-4" />
                View Full Thread
              </button>
              {isCrisis && (
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors ml-auto">
                  <MessageCircle className="h-4 w-4" />
                  Message Patient
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(isoString: string): string {
  try {
    const dt = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - dt.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return dt.toLocaleDateString();
  } catch {
    return '';
  }
}
