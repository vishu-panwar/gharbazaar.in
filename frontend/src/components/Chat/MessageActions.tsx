'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Trash2, Copy, MoreVertical } from 'lucide-react';

interface MessageActionsProps {
    messageId: string;
    content: string;
    onEdit: () => void;
    onDelete: () => void;
}

export default function MessageActions({ messageId, content, onEdit, onDelete }: MessageActionsProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setShowMenu(false);
    };

    const handleEdit = () => {
        onEdit();
        setShowMenu(false);
    };

    const handleDelete = () => {
        onDelete();
        setShowMenu(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                title="More actions"
            >
                <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
            </button>

            {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <button
                        onClick={handleCopy}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                        <Copy size={16} />
                        Copy text
                    </button>
                    <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                        <Edit2 size={16} />
                        Edit
                    </button>
                    <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}
