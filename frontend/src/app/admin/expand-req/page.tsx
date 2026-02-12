'use client';

import React, { useState, useEffect } from 'react';
import { backendApi } from '@/lib/backendApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, CheckCircle, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LocationStat {
    city: string;
    count: number;
}

export default function ExpandReqPage() {
    const [stats, setStats] = useState<LocationStat[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await backendApi.locationRequests.getAdminRequests();
            if (response.success && Array.isArray(response.data)) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            toast.error('Failed to load admin requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expansion Requests</h1>
                    <p className="text-gray-500 dark:text-gray-400">Review high-demand locations forwarded by your team.</p>
                </div>
                <Button onClick={fetchStats} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            ) : stats.length === 0 ? (
                <Card className="bg-gray-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">All Clear!</h3>
                        <p className="text-gray-500 max-w-sm mt-2">
                            No forwarded requests pending review.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={stat.city} className="hover:shadow-lg transition-all border-l-4 border-l-purple-500">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-purple-500" />
                                    {stat.city}
                                </CardTitle>
                                <div className="flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    <TrendingUp className="h-3 w-3" />
                                    Top #{index + 1}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-4xl font-black text-gray-900 dark:text-white">{stat.count}</span>
                                    <span className="text-sm text-gray-500 mb-1">Total Requests</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    These users are waiting for GharBazaar services in {stat.city}.
                                </p>
                                <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                                    View Details
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
