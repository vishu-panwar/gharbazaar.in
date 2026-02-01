'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

type ModalType = 'success' | 'error' | 'warning' | 'info';

interface ModalOptions {
    title: string;
    message: string;
    type?: ModalType;
    onConfirm?: () => void;
    confirmText?: string;
    showCancel?: boolean;
}

interface ModalContextType {
    showAlert: (options: ModalOptions) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<(ModalOptions & { id: string }) | null>(null);

    const showAlert = useCallback((options: ModalOptions) => {
        setModal({ ...options, id: Math.random().toString(36).substring(7), type: options.type || 'info' });
    }, []);

    const hideModal = useCallback(() => {
        setModal(null);
    }, []);

    const getIcon = (type: ModalType) => {
        switch (type) {
            case 'success': return <CheckCircle className="text-emerald-500" size={40} />;
            case 'error': return <AlertCircle className="text-red-500" size={40} />;
            case 'warning': return <AlertTriangle className="text-amber-500" size={40} />;
            case 'info': return <Info className="text-blue-500" size={40} />;
        }
    };

    const getGradients = (type: ModalType) => {
        switch (type) {
            case 'success': return 'from-emerald-500 to-teal-500';
            case 'error': return 'from-red-500 to-rose-600';
            case 'warning': return 'from-amber-400 to-orange-500';
            case 'info': return 'from-blue-500 to-indigo-600';
        }
    };

    const getButtonStyles = (type: ModalType) => {
        switch (type) {
            case 'success': return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-none';
            case 'error': return 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none';
            case 'warning': return 'bg-amber-500 hover:bg-amber-600 shadow-amber-200 dark:shadow-none';
            case 'info': return 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 dark:shadow-none';
        }
    };

    return (
        <ModalContext.Provider value={{ showAlert, hideModal }}>
            {children}

            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={hideModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
                        >
                            {/* Accent line */}
                            <div className={`h-1.5 w-full bg-gradient-to-r ${getGradients(modal.type || 'info')}`} />

                            <div className="p-8 pt-10">
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-6 relative">
                                        <div className={`absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r ${getGradients(modal.type || 'info')}`} />
                                        <div className="relative">
                                            {getIcon(modal.type || 'info')}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                        {modal.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                                        {modal.message}
                                    </p>

                                    <div className="w-full flex flex-col gap-3">
                                        <button
                                            onClick={() => {
                                                if (modal.onConfirm) modal.onConfirm();
                                                hideModal();
                                            }}
                                            className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg active:scale-95 ${getButtonStyles(modal.type || 'info')}`}
                                        >
                                            {modal.confirmText || 'Got it'}
                                        </button>

                                        {modal.showCancel && (
                                            <button
                                                onClick={hideModal}
                                                className="w-full py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={hideModal}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within ModalProvider');
    }
    return context;
}
