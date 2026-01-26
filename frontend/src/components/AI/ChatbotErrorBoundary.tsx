'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ChatbotErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Chatbot Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="fixed bottom-6 right-6 w-[420px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-red-200 dark:border-red-800 p-6 z-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <AlertTriangle size={24} className="text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Chatbot Error
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Something went wrong
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        The chatbot encountered an error. Please refresh the page or try again later.
                    </p>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full px-4 py-2  bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
