// Video Upload API Route
// File: src/app/api/upload/video/route.js

import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only video files (MP4, WebM, OGG, MOV, AVI) are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 500MB for videos)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 500MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads/videos directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'videos');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const filename = `${timestamp}_${randomString}.${fileExtension}`;
    const filepath = join(uploadsDir, filename);

    // Write file to disk
    await writeFile(filepath, buffer);

    // Return the public URL
    const videoUrl = `/uploads/videos/${filename}`;

    return NextResponse.json({
      success: true,
      videoUrl,
      filename
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload video',
        details: error.message
      },
      { status: 500 }
    );
  }
}
