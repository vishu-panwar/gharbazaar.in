'use client';

import { useState, useEffect } from 'react';
import { Check, X, TrendingUp, Clock } from 'lucide-react';
import { CONFIG } from '@/config';

interface Bid {
    _id: string;
    propertyId: {
        _id: string;
        title: string;
        location: string;
        price: number;
        images: string[];
    };
    buyerId: string;
    sellerId: string;
    bidAmount: number;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
    counterAmount?: number;
    counterMessage?: string;
    createdAt: string;
    updatedAt: string;
}

export default function BidManagement() {
    const [bids, setBids] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [counterAmount, setCounterAmount] = useState<{ [key: string]: string }>({});
    const [counterMessage, setCounterMessage] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchBids();
    }, [filter]);

    const fetchBids = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const url = filter === 'all'
                ? '/bids/seller'
                : `/bids/seller?status=${filter}`;

            const response = await fetch(`${CONFIG.API.FULL_URL}${url}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setBids(data.data);
            }
        } catch (error) {
            console.error('Error fetching bids:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBid = async (bidId: string, status: 'accepted' | 'rejected' | 'countered') => {
        try {
            const token = localStorage.getItem('auth_token');
            const body: any = { status };

            if (status === 'countered') {
                body.counterAmount = parseFloat(counterAmount[bidId]);
                body.counterMessage = counterMessage[bidId];
            }

            const response = await fetch(`${CONFIG.API.FULL_URL}/bids/${bidId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                fetchBids();
                setCounterAmount(prev => ({ ...prev, [bidId]: '' }));
                setCounterMessage(prev => ({ ...prev, [bidId]: '' }));
            }
        } catch (error) {
            console.error('Error updating bid:', error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'countered': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Bid Management</h2>
                <div className="flex gap-2">
                    {['all', 'pending', 'accepted', 'rejected', 'countered'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition ${filter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {bids.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No bids {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bids.map((bid) => (
                        <div key={bid._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                            <div className="flex gap-6">
                                {/* Property Image */}
                                <div className="w-48 h-32 flex-shrink-0">
                                    <img
                                        src={bid.propertyId.images[0] || '/images/placeholder.jpg'}
                                        alt={bid.propertyId.title}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </div>

                                {/* Bid Details */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {bid.propertyId.title}
                                            </h3>
                                            <p className="text-sm text-gray-600">{bid.propertyId.location}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bid.status)}`}>
                                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-600">Listed Price:</span>
                                            <span className="ml-2 font-semibold text-gray-900">
                                                {formatPrice(bid.propertyId.price)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Bid Amount:</span>
                                            <span className="ml-2 font-semibold text-blue-600">
                                                {formatPrice(bid.bidAmount)}
                                            </span>
                                        </div>
                                    </div>

                                    {bid.message && (
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-700">{bid.message}</p>
                                        </div>
                                    )}

                                    {bid.status === 'countered' && bid.counterAmount && (
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                            <div className="flex items-center gap-2 mb-1">
                                                <TrendingUp className="w-4 h-4 text-blue-600" />
                                                <span className="font-semibold text-blue-900">Counter Offer:</span>
                                                <span className="text-blue-700">{formatPrice(bid.counterAmount)}</span>
                                            </div>
                                            {bid.counterMessage && (
                                                <p className="text-sm text-blue-700 mt-1">{bid.counterMessage}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Actions for pending bids */}
                                    {bid.status === 'pending' && (
                                        <div className="space-y-3 pt-3 border-t border-gray-200">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleUpdateBid(bid._id, 'accepted')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                                >
                                                    <Check className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateBid(bid._id, 'rejected')}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>

                                            {/* Counter Offer Section */}
                                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                                <label className="text-sm font-medium text-gray-700">
                                                    Counter Offer
                                                </label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        placeholder="Counter amount"
                                                        value={counterAmount[bid._id] || ''}
                                                        onChange={(e) => setCounterAmount(prev => ({
                                                            ...prev,
                                                            [bid._id]: e.target.value
                                                        }))}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        onClick={() => handleUpdateBid(bid._id, 'countered')}
                                                        disabled={!counterAmount[bid._id]}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                    >
                                                        Send Counter
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Optional message"
                                                    value={counterMessage[bid._id] || ''}
                                                    onChange={(e) => setCounterMessage(prev => ({
                                                        ...prev,
                                                        [bid._id]: e.target.value
                                                    }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-xs text-gray-500 pt-2">
                                        Received: {new Date(bid.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
