import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { storageAdapter } from '@/lib/storage';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const artifacts = await prisma.projectArtifact.findMany({
      where: { projectId: id },
      include: {
        uploadedBy: { select: { id: true, name: true, avatarUrl: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ artifacts });
  } catch (error) {
    console.error('Fetch artifacts error:', error);
    return NextResponse.json({ error: 'Failed to fetch project artifacts' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params; // projectId
    const session = await getSession();

    // Check if multipart form data (File upload) or JSON (Paste Link)
    const contentType = request.headers.get('content-type') || '';

    let title = '';
    let category = 'IMPLEMENTATION_PLAN'; // IMPLEMENTATION_PLAN, WALKTHROUGH, PRESENTATION_PPT, PROJECT_LOGO, OTHER
    let kind = 'FILE'; // FILE, LINK
    let url = '';
    let fileSize = 0;
    let mimeType = 'application/octet-stream';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      category = formData.get('category') || 'OTHER';
      title = formData.get('title') || file?.name || 'Uploaded File';
      kind = 'FILE';

      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const saved = await storageAdapter.uploadFile(buffer, file.name, file.type);
      url = saved.path;
      fileSize = saved.size;
      mimeType = saved.mimeType;
    } else {
      const body = await request.json();
      title = body.title || 'Pasted Link';
      category = body.category || 'OTHER';
      kind = 'LINK';
      url = body.url;

      if (!url) {
        return NextResponse.json({ error: 'URL link is required' }, { status: 400 });
      }
    }

    const artifact = await prisma.projectArtifact.create({
      data: {
        title,
        category,
        kind,
        url,
        fileSize,
        mimeType,
        projectId: id,
        uploadedById: session?.userId || null
      }
    });

    // Record activity log
    await prisma.activity.create({
      data: {
        projectId: id,
        userId: session?.userId || null,
        userName: session?.name || 'Employee',
        action: `added ${category.toLowerCase().replace(/_/g, ' ')}`,
        details: `Uploaded ${kind === 'LINK' ? 'link' : 'file'}: "${title}"`,
        entityType: 'FILE',
        entityId: artifact.id
      }
    });

    return NextResponse.json({ success: true, artifact });
  } catch (error) {
    console.error('Artifact upload error:', error);
    return NextResponse.json({ error: 'Failed to upload artifact' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const artifactId = searchParams.get('artifactId');

    if (!artifactId) {
      return NextResponse.json({ error: 'artifactId parameter is required' }, { status: 400 });
    }

    await prisma.projectArtifact.delete({ where: { id: artifactId } });
    return NextResponse.json({ success: true, message: 'Artifact deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete artifact' }, { status: 500 });
  }
}
