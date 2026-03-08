/**
 * ImageUpload — Reusable image uploader for MKCC Admin
 *
 * How it works:
 *  1. User picks a file from disk (drag-and-drop or click)
 *  2. Component fetches a signed auth token from our backend  GET /api/upload/auth
 *  3. File is uploaded directly to ImageKit CDN (no file ever touches our server)
 *  4. On success, the returned CDN URL is passed up via onUpload(url, fileId)
 *
 * Props:
 *  onUpload(url, fileId)  — called with the final ImageKit URL and fileId
 *  folder                 — ImageKit folder to upload into  (default: "/mkcc")
 *  accept                 — file accept string              (default: "image/*")
 *  label                  — button label text
 *  preview                — existing image URL to show as thumbnail
 */

import { useState, useRef, useCallback } from 'react';
import api from '../../utils/api';

const MAX_SIZE_MB = 5;

export default function ImageUpload({
  onUpload,
  folder    = '/mkcc',
  accept    = 'image/*',
  label     = 'Upload Image',
  preview   = '',
}) {
  const [status,   setStatus]   = useState('idle');   // idle | uploading | success | error
  const [progress, setProgress] = useState(0);
  const [thumb,    setThumb]    = useState(preview);
  const [errorMsg, setErrorMsg] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  // ── Core upload function ────────────────────────────────────────
  const uploadFile = useCallback(async (file) => {
    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Only image files are allowed.');
      setStatus('error');
      return;
    }
    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMsg(`File too large. Max ${MAX_SIZE_MB}MB allowed.`);
      setStatus('error');
      return;
    }

    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    try {
      // Step 1 — get signed auth from our backend
      const authRes = await api.get('/upload/auth');
      const { token, expire, signature, publicKey, urlEndpoint } = authRes.data;

      // Step 2 — build multipart form for ImageKit upload API
      const formData = new FormData();
      formData.append('file',      file);
      formData.append('fileName',  `mkcc_${Date.now()}_${file.name}`);
      formData.append('folder',    folder);
      formData.append('publicKey', publicKey);
      formData.append('signature', signature);
      formData.append('expire',    expire);
      formData.append('token',     token);
      // Optionally add tags / custom metadata
      formData.append('tags',      'mkcc,upload');

      // Step 3 — upload directly to ImageKit
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      const result = await new Promise((resolve, reject) => {
        xhr.onload = () => {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status === 200) resolve(data);
          else reject(new Error(data.message || 'Upload failed'));
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
        xhr.send(formData);
      });

      // Step 4 — success
      setThumb(result.url);
      setStatus('success');
      setProgress(100);
      onUpload?.(result.url, result.fileId);

    } catch (err) {
      setErrorMsg(err.message || 'Upload failed. Please try again.');
      setStatus('error');
      setProgress(0);
    }
  }, [folder, onUpload]);

  // ── Event handlers ──────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const reset = () => {
    setStatus('idle');
    setProgress(0);
    setThumb('');
    setErrorMsg('');
    if (inputRef.current) inputRef.current.value = '';
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div className="space-y-3">

      {/* Drop zone */}
      <div
        onClick={() => status !== 'uploading' && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200
          ${dragging             ? 'border-mkcc-gold bg-mkcc-gold/5 scale-[1.01]' : ''}
          ${status === 'idle'    ? 'border-mkcc-border hover:border-mkcc-red hover:bg-mkcc-red/5' : ''}
          ${status === 'uploading' ? 'border-mkcc-gold/60 bg-mkcc-dark cursor-wait' : ''}
          ${status === 'success' ? 'border-green-600 bg-green-900/10' : ''}
          ${status === 'error'   ? 'border-mkcc-red/70 bg-mkcc-red/5' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={status === 'uploading'}
        />

        {/* Thumbnail preview */}
        {thumb && (
          <div className="mb-3 flex justify-center">
            <img
              src={thumb}
              alt="Preview"
              className="h-28 w-28 object-cover rounded-lg border border-mkcc-border shadow-lg"
            />
          </div>
        )}

        {/* Status icon + message */}
        {status === 'idle' && (
          <div className="space-y-1">
            <div className="text-3xl">📸</div>
            <p className="font-heading font-semibold text-white text-sm">{label}</p>
            <p className="text-mkcc-muted text-xs font-body">
              Drag & drop or <span className="text-mkcc-gold underline">click to browse</span>
            </p>
            <p className="text-mkcc-muted text-xs font-body">PNG, JPG, WEBP — max {MAX_SIZE_MB}MB</p>
          </div>
        )}

        {status === 'uploading' && (
          <div className="space-y-3">
            <div className="text-2xl animate-bounce">⬆️</div>
            <p className="font-heading text-mkcc-gold text-sm font-semibold">
              Uploading to ImageKit... {progress}%
            </p>
            {/* Progress bar */}
            <div className="w-full bg-mkcc-border rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-mkcc-red to-mkcc-gold rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-1">
            <div className="text-3xl">✅</div>
            <p className="font-heading text-green-400 text-sm font-semibold">Upload Successful!</p>
            <p className="text-mkcc-muted text-xs font-body truncate max-w-xs mx-auto">{thumb}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-1">
            <div className="text-3xl">❌</div>
            <p className="font-heading text-mkcc-red text-sm font-semibold">Upload Failed</p>
            <p className="text-mkcc-muted text-xs font-body">{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        {status === 'success' && (
          <button
            type="button"
            onClick={reset}
            className="font-heading text-xs text-mkcc-muted border border-mkcc-border hover:border-mkcc-gold hover:text-mkcc-gold px-3 py-1.5 rounded transition-colors"
          >
            🔄 Replace Image
          </button>
        )}
        {status === 'error' && (
          <button
            type="button"
            onClick={reset}
            className="font-heading text-xs text-mkcc-red border border-mkcc-red/40 hover:bg-mkcc-red/10 px-3 py-1.5 rounded transition-colors"
          >
            ↩ Try Again
          </button>
        )}
      </div>

      {/* ImageKit badge */}
      <p className="text-mkcc-muted/50 text-[10px] font-body text-right">
        Powered by{' '}
        <a href="https://imagekit.io" target="_blank" rel="noopener noreferrer"
          className="hover:text-mkcc-gold transition-colors" onClick={e => e.stopPropagation()}>
          ImageKit.io ↗
        </a>
      </p>
    </div>
  );
}
