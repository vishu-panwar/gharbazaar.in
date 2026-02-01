'use client';

import React, { useState, useRef, DragEvent } from 'react';
import { Upload, X, File, Image as ImageIcon, FileText, Archive } from 'lucide-react';
import { useToast } from '../Toast/ToastProvider';

interface FileUploadProps {
    conversationId: string;
    onFileSelect: (file: File) => void;
    onCancel: () => void;
}

export default function FileUpload({ conversationId, onFileSelect, onCancel }: FileUploadProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    const MAX_FILE_SIZE = {
        image: 10 * 1024 * 1024, // 10MB
        document: 25 * 1024 * 1024, // 25MB
        other: 10 * 1024 * 1024, // 10MB
    };

    const ALLOWED_TYPES = {
        image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        document: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        archive: ['application/zip', 'application/x-rar-compressed'],
    };

    const validateFile = (file: File): boolean => {
        // Check file type
        const allAllowedTypes = [
            ...ALLOWED_TYPES.image,
            ...ALLOWED_TYPES.document,
            ...ALLOWED_TYPES.archive,
        ];

        if (!allAllowedTypes.includes(file.type)) {
            toast.error('File type not allowed');
            return false;
        }

        // Check file size
        let maxSize = MAX_FILE_SIZE.other;
        if (file.type.startsWith('image/')) maxSize = MAX_FILE_SIZE.image;
        if (file.type.includes('pdf') || file.type.includes('word') || file.type.includes('document')) {
            maxSize = MAX_FILE_SIZE.document;
        }

        if (file.size > maxSize) {
            toast.error(`File size exceeds limit of ${maxSize / 1024 / 1024}MB`);
            return false;
        }

        return true;
    };

    const handleFile = (file: File) => {
        if (!validateFile(file)) return;

        setSelectedFile(file);

        // Generate preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleSend = () => {
        if (selectedFile) {
            onFileSelect(selectedFile);
            setSelectedFile(null);
            setPreview(null);
        }
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon size={48} className="text-blue-500" />;
        if (type.includes('pdf') || type.includes('document')) return <FileText size={48} className="text-red-500" />;
        if (type.includes('zip') || type.includes('rar')) return <Archive size={48} className="text-yellow-500" />;
        return <File size={48} className="text-gray-500" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="absolute bottom-full left-0 mb-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upload File</h3>
                <button
                    onClick={onCancel}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                >
                    <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                {!selectedFile ? (
                    /* Drop Zone */
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => inputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${dragActive
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-900 dark:text-white font-medium mb-1">
                            Drop your file here or click to browse
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            Images (10MB) • Documents (25MB) • Archives (10MB)
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Supported: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX, XLS, XLSX, ZIP
                        </p>
                    </div>
                ) : (
                    /* File Preview */
                    <div className="space-y-4">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt={selectedFile.name}
                                    className="w-full h-48 object-contain rounded mb-3"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-48 mb-3">
                                    {getFileIcon(selectedFile.type)}
                                </div>
                            )}
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatFileSize(selectedFile.size)}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreview(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Change
                            </button>
                            <button
                                onClick={handleSend}
                                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Send File
                            </button>
                        </div>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleChange}
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar"
                    className="hidden"
                />
            </div>
        </div>
    );
}
