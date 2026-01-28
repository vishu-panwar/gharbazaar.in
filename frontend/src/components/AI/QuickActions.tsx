'use client';

import React from 'react';
import { Search, DollarSign, Calendar, FileText, TrendingUp, Users, MessageSquare, BarChart } from 'lucide-react';

interface QuickActionsProps {
    userRole: 'buyer' | 'seller' | 'admin';
    onClick: (action: string) => void;
}

export default function QuickActions({ userRole, onClick }: QuickActionsProps) {
    const buyerActions = [
        {
            icon: Search,
            label: 'Search Properties',
            question: 'How do I search for properties effectively?',
        },
        {
            icon: DollarSign,
            label: 'Pricing Info',
            question: 'How does pricing work on GharBazaar?',
        },
        {
            icon: Calendar,
            label: 'Schedule Visit',
            question: 'How do I schedule a property visit?',
        },
        {
            icon: FileText,
            label: 'Documents',
            question: 'What documents do I need to buy a property?',
        },
    ];

    const sellerActions = [
        {
            icon: TrendingUp,
            label: 'Boost Visibility',
            question: 'How do I improve my listing visibility?',
        },
        {
            icon: DollarSign,
            label: 'Pricing Strategy',
            question: 'How should I price my property?',
        },
        {
            icon: Users,
            label: 'Get Inquiries',
            question: 'Why am I not getting buyer inquiries?',
        },
        {
            icon: BarChart,
            label: 'Understand Analytics',
            question: 'How do I interpret my listing analytics?',
        },
    ];

    const actions = userRole === 'buyer' ? buyerActions : sellerActions;

    return (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                Quick Actions
            </p>
            <div className="grid grid-cols-2 gap-2">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => onClick(action.question)}
                            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-gray-200 dark:border-gray-600 rounded-lg transition-colors text-left group"
                        >
                            <Icon
                                size={18}
                                className="text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform flex-shrink-0"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {action.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
