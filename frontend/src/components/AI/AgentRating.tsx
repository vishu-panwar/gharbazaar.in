'use client';

import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface AgentRatingProps {
    onClose: () => void;
    onSubmit: (rating: number, feedback?: string) => void;
    agentName: string;
}

export default function AgentRating({ onClose, onSubmit, agentName }: AgentRatingProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const handleSubmit = () => {
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        onSubmit(rating, feedback);
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                    <h3 className="text-lg font-semibold">Rate Your Experience</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="text-center">
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            How was your conversation with {agentName}?
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Your feedback helps us improve our service
                        </p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-all duration-200 hover:scale-125"
                            >
                                <Star
                                    size={40}
                                    className={`${star <= (hoveredRating || rating)
                                            ? 'fill-yellow-400 stroke-yellow-400'
                                            : 'fill-none stroke-gray-300 dark:stroke-gray-600'
                                        } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Rating Labels */}
                    {rating > 0 && (
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </p>
                        </div>
                    )}

                    {/* Feedback */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Additional Feedback (Optional)
                        </label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us more about your experience..."
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-colors font-medium disabled:cursor-not-allowed"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
