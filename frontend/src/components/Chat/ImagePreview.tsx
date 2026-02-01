'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImagePreviewProps {
    imageUrl: string;
    alt?: string;
    images?: string[]; // For gallery mode
    currentIndex?: number;
    onClose: () => void;
    onNavigate?: (direction: 'prev' | 'next') => void;
}

export default function ImagePreview({
    imageUrl,
    alt = 'Image',
    images,
    currentIndex,
    onClose,
    onNavigate,
}: ImagePreviewProps) {
    const [zoom, setZoom] = useState(100);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 200));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 50));
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = alt || 'download';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const showNavigation = images && images.length > 1 && currentIndex !== undefined;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            {/* Header Controls */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-2">
                    {showNavigation && (
                        <span className="text-white text-sm">
                            {(currentIndex || 0) + 1} / {images?.length}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 50}
                        className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg backdrop-blur-sm transition-colors"
                        title="Zoom out"
                    >
                        <ZoomOut size={20} className="text-white" />
                    </button>
                    <span className="text-white text-sm w-12 text-center">{zoom}%</span>
                    <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 200}
                        className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg backdrop-blur-sm transition-colors"
                        title="Zoom in"
                    >
                        <ZoomIn size={20} className="text-white" />
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
                        title="Download"
                    >
                        <Download size={20} className="text-white" />
                    </button>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors"
                        title="Close"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>
            </div>

            {/* Navigation Controls */}
            {showNavigation && onNavigate && (
                <>
                    <button
                        onClick={() => onNavigate('prev')}
                        disabled={currentIndex === 0}
                        className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full backdrop-blur-sm transition-colors"
                    >
                        <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button
                        onClick={() => onNavigate('next')}
                        disabled={currentIndex === (images?.length || 0) - 1}
                        className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full backdrop-blur-sm transition-colors"
                    >
                        <ChevronRight size={24} className="text-white" />
                    </button>
                </>
            )}

            {/* Image */}
            <div className="relative max-w-[90vw] max-h-[90vh] overflow-auto">
                <div
                    style={{
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: 'center',
                        transition: 'transform 0.2s ease',
                    }}
                >
                    <img
                        src={imageUrl}
                        alt={alt}
                        className="max-w-full max-h-[90vh] object-contain"
                    />
                </div>
            </div>

            {/* Click outside to close */}
            <div
                className="absolute inset-0 -z-10"
                onClick={onClose}
            />
        </div>
    );
}
