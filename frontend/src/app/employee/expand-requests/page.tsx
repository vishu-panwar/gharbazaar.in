'use client';

import React, { useState, useEffect } from 'react';
import { backendApi } from '@/lib/backendApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Send, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LocationStat {
    city: string;
    count: number;
}

export default function ExpandRequestsPage() {
    const [stats, setStats] = useState<LocationStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await backendApi.locationRequests.getStats();
            if (response.success && Array.isArray(response.data)) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            toast.error('Failed to load location requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSendToAdmin = async (city: string) => {
        try {
            setActionLoading(city);
            const response = await backendApi.locationRequests.sendToAdmin(city);
            
            if (response.success) {
                toast.success(`Requests for ${city} forwarded to Admin`);
                // Refresh stats to remove forwarded ones (since API filters only pending)
                fetchStats();
            } else {
                toast.error(response.error || 'Failed to forward requests');
            }
        } catch (error) {
            console.error('Error forwarding requests:', error);
            toast.error('Something went wrong');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Location Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and manage expansion requests from users.</p>
                </div>
                <Button onClick={fetchStats} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : stats.length === 0 ? (
                <Card className="bg-gray-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <MapPin className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No Pending Requests</h3>
                        <p className="text-gray-500 max-w-sm mt-2">
                            There are no new location requests from users at the moment.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <Card key={stat.city} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-blue-500" />
                                    {stat.city}
                                </CardTitle>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {stat.count} Requests
                                </span>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-4">
                                    {stat.count} users have requested to expand services to {stat.city}.
                                </p>
                                <Button 
                                    className="w-full" 
                                    onClick={() => handleSendToAdmin(stat.city)}
                                    disabled={actionLoading === stat.city}
                                >
                                    {actionLoading === stat.city ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Send className="h-4 w-4 mr-2" />
                                    )}
                                    Send to Admin
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
