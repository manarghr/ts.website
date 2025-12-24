// File: src/app/api/coaches/[id]/route.js

import { NextResponse } from 'next/server';
import {
  getCoachById,
  getCoachCertifications,
  getCoachVideos,
  getCoachAnnouncements,
  getCoachRatings,
} from '../../../../../backend/utils/db-helpers';

export async function GET(request, { params }) {
  try {
    // ✅ FIX
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Coach ID is required' },
        { status: 400 }
      );
    }

    const coach = await getCoachById(id);

    if (!coach) {
      return NextResponse.json(
        { error: 'Coach not found' },
        { status: 404 }
      );
    }

    const [certifications, videos, announcements, ratings] = await Promise.all([
      getCoachCertifications(id),
      getCoachVideos(id),
      getCoachAnnouncements(id),
      getCoachRatings(id),
    ]);

    const response = {
      id: coach.id,
      name: coach.name,
      category: coach.category,
      bio: coach.bio,
      image_url: coach.image_url || coach.imageUrl,
      rating: coach.rating || 0,
      total_ratings: coach.total_ratings || ratings.length,
      followers_count: coach.followers_count || 0,
      following_count: coach.following_count || 0,

      certifications: certifications.map(cert => ({
        name: cert.name,
        year: cert.year,
      })),

      videos: videos.map(video => ({
        id: video._id?.toString(),
        title: video.title,
        thumbnail: video.thumbnail_url || video.thumbnailUrl,
        views: video.views || 0,
        likes: video.likes || 0,
        duration: video.duration || '0:00',
      })),

      announcements: announcements.map(a => ({
        id: a._id?.toString(),
        title: a.title,
        content: a.content,
        date: a.date,
      })),

      comments: ratings.map(r => ({
        id: r.id || r._id?.toString(),
        user: r.user?.name || 'Anonymous',
        rating: r.rating,
        text: r.comment || '',
        date: r.created_at
          ? new Date(r.created_at).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching coach:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
