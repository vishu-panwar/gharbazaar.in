import axios from 'axios';

interface GeolocationResult {
    city: string;
    state: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
}

// Operating cities (case-insensitive)
const OPERATING_CITIES = ['saharanpur', 'roorkee'];

class IPGeolocationService {
    private cache: Map<string, GeolocationResult> = new Map();
    private cacheExpiry: Map<string, number> = new Map();
    private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    /**
     * Get location from IP address using ipapi.co (free tier: 1000 requests/day)
     */
    async getLocation(ipAddress: string): Promise<GeolocationResult | null> {
        try {
            // Check cache first
            if (this.isCached(ipAddress)) {
                return this.cache.get(ipAddress)!;
            }

            // Skip localhost/private IPs
            if (this.isPrivateIP(ipAddress)) {
                console.log('Private IP detected, skipping geolocation');
                return null;
            }

            // Call ipapi.co API
            const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`, {
                timeout: 5000
            });

            if (response.data && response.data.city) {
                const result: GeolocationResult = {
                    city: response.data.city || '',
                    state: response.data.region || '',
                    country: response.data.country_name || '',
                    countryCode: response.data.country_code || '',
                    latitude: response.data.latitude || 0,
                    longitude: response.data.longitude || 0
                };

                // Cache the result
                this.cache.set(ipAddress, result);
                this.cacheExpiry.set(ipAddress, Date.now() + this.CACHE_DURATION);

                return result;
            }

            return null;
        } catch (error: any) {
            console.error('IP Geolocation error:', error.message);
            return null;
        }
    }

    /**
     * Check if user is in an operating city
     */
    async isInOperatingCity(ipAddress: string): Promise<boolean> {
        const location = await this.getLocation(ipAddress);
        if (!location || !location.city) {
            return false;
        }

        const userCity = location.city.toLowerCase().trim();
        return OPERATING_CITIES.some(city => userCity.includes(city));
    }

    /**
     * Check if IP is cached and not expired
     */
    private isCached(ipAddress: string): boolean {
        if (!this.cache.has(ipAddress)) {
            return false;
        }

        const expiry = this.cacheExpiry.get(ipAddress);
        if (!expiry || Date.now() > expiry) {
            this.cache.delete(ipAddress);
            this.cacheExpiry.delete(ipAddress);
            return false;
        }

        return true;
    }

    /**
     * Check if IP is private/localhost
     */
    private isPrivateIP(ip: string): boolean {
        if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
            return true;
        }

        // Check for private IP ranges
        const parts = ip.split('.');
        if (parts.length !== 4) return false;

        const first = parseInt(parts[0]);
        const second = parseInt(parts[1]);

        // 10.0.0.0 - 10.255.255.255
        if (first === 10) return true;

        // 172.16.0.0 - 172.31.255.255
        if (first === 172 && second >= 16 && second <= 31) return true;

        // 192.168.0.0 - 192.168.255.255
        if (first === 192 && second === 168) return true;

        return false;
    }

    /**
     * Clear cache (for testing or manual refresh)
     */
    clearCache(): void {
        this.cache.clear();
        this.cacheExpiry.clear();
    }
}

export default new IPGeolocationService();
