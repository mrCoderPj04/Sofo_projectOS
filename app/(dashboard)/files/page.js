'use client';

import React, { useState } from 'react';
import { FolderClosed, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function FilesPage() {
  const [files, setFiles] = useState([]);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <FolderClosed className="w-6 h-6 text-indigo-400" />
            <span>File Management & Storage Abstraction</span>
          </h1>
          <p className="text-xs text-zinc-400">Pluggable Storage Layer (Local FS / S3 / Supabase Storage adapter).</p>
        </div>
        <Button size="sm" className="flex items-center space-x-1">
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {files.length === 0 ? (
          <Card className="p-12 text-center text-zinc-500 text-xs border-dashed border-zinc-800 col-span-2">
            No files uploaded yet. Files can be attached to Requirements, Problems, Solutions, and Tasks.
          </Card>
        ) : (
          files.map((file) => (
            <Card key={file.id} className="p-4 flex items-center justify-between text-xs">
              <div className="font-bold text-white text-sm">{file.name}</div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
