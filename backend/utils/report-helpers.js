// Report Helper Functions
// File: backend/utils/report-helpers.js

import { getCollection } from '@/lib/mongodb';

// The reasons the report modal offers. Exported so the UI and the server can't
// drift apart -- the server accepting anything is how junk gets into the queue.
export const REPORT_REASONS = ['Inappropriate content', 'Spam', 'Harassment', 'Other'];

export const MAX_DESCRIPTION_LENGTH = 1000;

export function isValidReportReason(reason) {
  return REPORT_REASONS.includes(reason);
}

/**
 * File a report against a coach. One open report per user per coach: without that,
 * one person can submit the same report thousands of times and bury the real ones.
 * Throws "Already reported" if they have a pending one.
 */
export async function submitReport(reporterId, reportedCoachId, reason, description) {
  const reportsCollection = await getCollection('reports');

  const existing = await reportsCollection.findOne({
    reporter_id: reporterId,
    reported_coach_id: reportedCoachId,
    status: 'pending',
  });

  if (existing) throw new Error('Already reported');

  const result = await reportsCollection.insertOne({
    reporter_id: reporterId,
    reported_coach_id: reportedCoachId,
    reason,
    description: description ? String(description).trim().slice(0, MAX_DESCRIPTION_LENGTH) : null,
    status: 'pending',
    created_at: new Date(),
  });

  return {
    reportId: result.insertedId.toString(),
    success: true,
  };
}
