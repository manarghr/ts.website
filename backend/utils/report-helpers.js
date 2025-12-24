// Report Helper Functions
// File: backend/utils/report-helpers.js

import { getCollection } from '../../src/lib/mongodb';

/**
 * Submit a report
 */
export async function submitReport(reporterId, reportedCoachId, reason, description) {
  const reportsCollection = await getCollection('reports');
  
  const result = await reportsCollection.insertOne({
    reporter_id: reporterId,
    reported_coach_id: reportedCoachId,
    reason: reason,
    description: description || null,
    status: 'pending',
    created_at: new Date()
  });

  return {
    reportId: result.insertedId.toString(),
    success: true
  };
}

