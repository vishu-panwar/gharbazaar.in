'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';

export default function ConnectionStatus() {
    const { connected } = useSocket();
    const [showStatus, setShowStatus] = useState(false);
    const [reconnectCountdown, setReconnectCountdown] = useState(0);

    useEffect(() => {
        // Show status when disconnected
        if (!connected) {
            setShowStatus(true);
            setReconnectCountdown(5);
        } else {
            // Hide after a brief "connected" message
            const timer = setTimeout(() => setShowStatus(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [connected]);

    useEffect(() => {
        if (!connected && reconnectCountdown > 0) {
            const timer = setTimeout(() => {
                setReconnectCountdown(prev => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [connected, reconnectCountdown]);

    if (!showStatus) return null;

    return (
        <div
            className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 animate-in slide-in-from-top-5 ${connected
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
                }`}
        >
            <div className="flex items-center gap-2">
                {connected ? (
                    <>
                        <Wifi className="w-4 h-4" />
                        <span className="text-sm font-medium">Connected to chat</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            Connection lost
                            {reconnectCountdown > 0 && ` • Reconnecting in ${reconnectCountdown}s`}
                        </span>
                        <Loader2 className="w-4 h-4 animate-spin" />
                    </>
                )}
            </div>
        </div>
    );
}
