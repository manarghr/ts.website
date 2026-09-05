import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { requireAdmin, requireCoach } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

// DELETE - Reject a pending blog (admin), or withdraw your own (coach)
export async function DELETE(request, context) {
  try {
    // Await params in Next.js 15
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const pendingBlogCollection = await getCollection('pending_blogs');

    // Two callers reach this route: an admin rejecting a submission, and a coach
    // deleting their own pending post from the dashboard. Anyone else -- including a
    // coach aiming at someone else's blog id -- gets 401/403.
    const isAdmin = Boolean(await requireAdmin(request));

    if (!isAdmin) {
      const coachId = await requireCoach(request);
      if (!coachId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const blog = await pendingBlogCollection.findOne({ id });
      if (!blog) {
        return NextResponse.json({ error: 'Pending blog not found' }, { status: 404 });
      }

      // Ownership is recorded as submittedBy (users) or coach_id (coach dashboard).
      const ownerId = blog.coach_id || blog.submittedBy;
      if (ownerId !== coachId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const result = await pendingBlogCollection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Pending blog not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Pending blog rejected successfully' });
  } catch (error) {
    console.error('Error rejecting pending blog:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}