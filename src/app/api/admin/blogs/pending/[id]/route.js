import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';

// DELETE - Reject pending blog
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID is required' },
        { status: 400 }
      );
    }

    const pendingBlogCollection = await getCollection('pending_blogs');
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