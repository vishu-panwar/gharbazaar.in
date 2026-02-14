import React, { useState, useEffect } from 'react';
import { backendApi } from '@/lib/backendApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LocationRequestWidget = () => {
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [existingRequest, setExistingRequest] = useState<any>(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                setChecking(true);
                const response = await backendApi.locationRequests.getMyRequest();
                if (response.success && response.data) {
                    setExistingRequest(response.data);
                }
            } catch (error) {
                console.error('Failed to check location request:', error);
            } finally {
                setChecking(false);
            }
        };

        checkStatus();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!city.trim()) {
            toast.error('Please enter a city name');
            return;
        }

        try {
            setLoading(true);
            const response = await backendApi.locationRequests.create(city);
            
            if (response.success) {
                toast.success('Location request submitted successfully!');
                setExistingRequest(response.data);
                setCity('');
            } else {
                toast.error(response.error || 'Failed to submit request');
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (checking) return null; // Or a skeleton loader if needed

    // If user already has a request, don't show the widget (as per requirements "disappered for that account")
    // OR show status. The requirement says "it will be disappered for that account".
    if (existingRequest) {
        return null;
    }

    return (
        <Card className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
            <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                        <MapPin className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-indigo-900">Expand Request</h3>
                        <p className="text-sm text-indigo-700">
                            Currently operating in <span className="font-medium">Saharanpur</span> and <span className="font-medium">Roorkee</span>.
                            Want us in your city?
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
                    <Input
                        placeholder="Enter your city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-white border-indigo-200 focus:border-indigo-400 min-w-[200px]"
                        disabled={loading}
                    />
                    <Button 
                        type="submit" 
                        disabled={loading || !city.trim()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                    >
                        {loading ? 'Sending...' : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Request
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default LocationRequestWidget;
