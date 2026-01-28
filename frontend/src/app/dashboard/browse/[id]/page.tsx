'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Heart, Share2, Star, Home, Phone, MessageCircle,
  MapPin, Eye, Calendar, CheckCircle, Shield, Crown, Timer, Users,
  BadgeCheck, ChevronLeft, ChevronRight, Download,
  Building2, Calculator, Map, DollarSign, FileCheck,
  HelpCircle, Sofa, Square
} from 'lucide-react'
import { usePayment } from '@/contexts/PaymentContext'

export default function PropertyDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  const { hasPaid } = usePayment()

  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeMediaTab, setActiveMediaTab] = useState('photos')
  const [showFullscreen, setShowFullscreen] = useState(false)
  const [showPriceBreakup, setShowPriceBreakup] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)
  const [showDescription, setShowDescription] = useState(false)

  // Redirect to pricing if user hasn't paid
  useEffect(() => {
    if (!hasPaid) {
      router.push('/dashboard/pricing')
    }
  }, [hasPaid, router])

  // Dynamic property data based on property ID
  const getPropertyData = (id: string) => {
    const properties = {
      '1': {
        id: '1',
        title: 'Luxury 4BHK Penthouse with Panoramic Sea Views',
        subtitle: 'Premium Penthouse in Mumbai\'s Most Prestigious Tower',
        location: 'Worli, Mumbai, Maharashtra',
        fullAddress: 'Tower A, 25th Floor, Lodha World One, Lower Parel, Worli, Mumbai - 400013',
        price: '₹8.5 Cr',
        originalPrice: '₹9.2 Cr',
        pricePerSqFt: '₹26,562',
        listingType: 'sale',
        status: 'For Sale',
        type: 'Apartment',
        subType: 'Penthouse',
        bhk: '4 BHK',
        beds: 4,
        baths: 5,
        balconies: 3,
        area: '3200 sq ft',
        carpetArea: '2800 sq ft',
        builtUpArea: '3200 sq ft',
        superArea: '3600 sq ft',
        parking: 3,
        floor: '25th Floor',
        totalFloors: 30,
        facing: 'North-East',
        furnished: 'Fully Furnished',
        possession: 'Ready to Move',
        age: '2 years',
        verified: true,
        featured: true,
        premium: true,
        trustScore: 4.8,
        rating: 4.8,
        reviews: 156,
        views: 1234,
        interested: 89,
        shortlisted: 45,
        postedDate: '2024-12-20',
        lastUpdated: '2024-12-23',
        propertyId: 'GHB-WOR-001',
        rera: 'P51700000271',
        description: 'Experience luxury living at its finest in this stunning penthouse apartment located in the heart of Worli. This magnificent 4BHK penthouse features floor-to-ceiling windows offering breathtaking panoramic views of the Arabian Sea and Mumbai skyline. The property boasts premium Italian marble flooring, state-of-the-art smart home automation, modular kitchen with imported appliances, and spacious balconies perfect for entertaining.',
        highlights: [
          'East-facing property with morning sunlight',
          'Vastu compliant layout and design',
          'Wide road access with easy connectivity',
          'Premium Italian marble flooring throughout',
          'Smart home automation system',
          'Imported modular kitchen with appliances',
          'Private elevator access to penthouse'
        ],
        seller: {
          name: 'Rajesh Kumar',
          type: 'Owner',
          phone: '+91 98765 43210',
          email: 'rajesh.kumar@example.com',
          verified: true,
          premium: true,
          rating: 4.9,
          totalProperties: 3,
          responseTime: '< 2 hours',
          languages: ['Hindi', 'English', 'Marathi'],
          experience: '8 years'
        }
      },
      '2': {
        id: '2',
        title: 'Modern 3BHK Villa with Private Garden',
        subtitle: 'Contemporary Villa in Bangalore\'s Premium Locality',
        location: 'Whitefield, Bangalore, Karnataka',
        fullAddress: 'Villa No. 42, Brigade Orchards, Whitefield, Bangalore - 560066',
        price: '₹3.8 Cr',
        originalPrice: '₹4.2 Cr',
        pricePerSqFt: '₹18,095',
        listingType: 'sale',
        status: 'For Sale',
        type: 'Villa',
        subType: 'Independent Villa',
        bhk: '3 BHK',
        beds: 3,
        baths: 4,
        balconies: 2,
        area: '2100 sq ft',
        carpetArea: '1800 sq ft',
        builtUpArea: '2100 sq ft',
        superArea: '2400 sq ft',
        parking: 2,
        floor: 'Ground Floor',
        totalFloors: 2,
        facing: 'South-West',
        furnished: 'Semi-Furnished',
        possession: 'Ready to Move',
        age: '1 year',
        verified: true,
        featured: true,
        premium: false,
        trustScore: 4.6,
        rating: 4.6,
        reviews: 89,
        views: 892,
        interested: 67,
        shortlisted: 28,
        postedDate: '2024-12-18',
        lastUpdated: '2024-12-22',
        propertyId: 'GHB-BLR-002',
        rera: 'PRM/KA/RERA/1251/446/PR/010119/002252',
        description: 'Beautiful modern villa with private garden in Bangalore\'s premium Whitefield area. This contemporary 3BHK villa features spacious rooms, modern amenities, and excellent connectivity to IT parks and shopping centers.',
        highlights: [
          'Private garden and outdoor space',
          'Modern architecture and design',
          'Close to IT parks and offices',
          'Excellent connectivity to airport',
          'Premium gated community',
          'Club house and recreational facilities'
        ],
        seller: {
          name: 'Priya Sharma',
          type: 'Owner',
          phone: '+91 87654 32109',
          email: 'priya.sharma@example.com',
          verified: true,
          premium: false,
          rating: 4.7,
          totalProperties: 1,
          responseTime: '< 4 hours',
          languages: ['English', 'Hindi', 'Kannada'],
          experience: '3 years'
        }
      },
      '3': {
        id: '3',
        title: 'Spacious 2BHK Apartment with City Views',
        subtitle: 'Modern Apartment in Gurgaon\'s Business District',
        location: 'Gurgaon, Delhi NCR',
        fullAddress: 'Tower B, 15th Floor, DLF Phase 2, Gurgaon - 122002',
        price: '₹1.8 Cr',
        originalPrice: '₹2.1 Cr',
        pricePerSqFt: '₹15,000',
        listingType: 'sale',
        status: 'For Sale',
        type: 'Apartment',
        subType: 'High-Rise Apartment',
        bhk: '2 BHK',
        beds: 2,
        baths: 2,
        balconies: 1,
        area: '1200 sq ft',
        carpetArea: '1000 sq ft',
        builtUpArea: '1200 sq ft',
        superArea: '1400 sq ft',
        parking: 1,
        floor: '15th Floor',
        totalFloors: 25,
        facing: 'North',
        furnished: 'Unfurnished',
        possession: 'Under Construction',
        age: 'New',
        verified: true,
        featured: false,
        premium: false,
        trustScore: 4.3,
        rating: 4.3,
        reviews: 45,
        views: 567,
        interested: 34,
        shortlisted: 12,
        postedDate: '2024-12-15',
        lastUpdated: '2024-12-21',
        propertyId: 'GHB-GUR-003',
        rera: 'RC/REP/HARERA/GGM/767/499/2023/48',
        description: 'Well-designed 2BHK apartment with city views in Gurgaon\'s prime business district. Modern amenities and excellent connectivity to metro and corporate offices.',
        highlights: [
          'City skyline views from balcony',
          'Close to metro station',
          'Modern amenities and facilities',
          'Excellent investment opportunity',
          'Prime location in business district'
        ],
        seller: {
          name: 'Amit Patel',
          type: 'Builder',
          phone: '+91 76543 21098',
          email: 'amit.patel@example.com',
          verified: true,
          premium: false,
          rating: 4.4,
          totalProperties: 12,
          responseTime: '< 6 hours',
          languages: ['Hindi', 'English', 'Gujarati'],
          experience: '5 years'
        }
      },
      '4': {
        id: '4',
        title: 'Premium 3BHK Apartment for Rent',
        subtitle: 'Fully Furnished Luxury Apartment in Bandra West',
        location: 'Bandra West, Mumbai, Maharashtra',
        fullAddress: 'Flat 1204, Oberoi Sky Heights, Lokhandwala, Bandra West, Mumbai - 400050',
        price: '₹85,000/month',
        originalPrice: '₹95,000/month',
        pricePerSqFt: '₹47/sq ft/month',
        listingType: 'rent',
        status: 'For Rent',
        type: 'Apartment',
        subType: 'High-Rise Apartment',
        bhk: '3 BHK',
        beds: 3,
        baths: 3,
        balconies: 2,
        area: '1800 sq ft',
        carpetArea: '1500 sq ft',
        builtUpArea: '1800 sq ft',
        superArea: '2000 sq ft',
        parking: 2,
        floor: '12th Floor',
        totalFloors: 20,
        facing: 'West',
        furnished: 'Fully Furnished',
        possession: 'Immediate',
        age: '3 years',
        verified: true,
        featured: true,
        premium: true,
        trustScore: 4.7,
        rating: 4.7,
        reviews: 78,
        views: 743,
        interested: 56,
        shortlisted: 32,
        postedDate: '2024-12-22',
        lastUpdated: '2024-12-24',
        propertyId: 'GHB-BAN-004',
        rera: 'P51700000271',
        securityDeposit: '₹2,55,000',
        leasePeriod: '11 months minimum',
        maintenanceCharges: '₹8,500/month',
        description: 'Luxurious fully furnished 3BHK apartment in prime Bandra West location. Perfect for working professionals and families. Features premium furniture, modern appliances, and excellent amenities.',
        highlights: [
          'Fully furnished with premium furniture',
          'All modern appliances included',
          'Prime Bandra West location',
          'Close to restaurants and shopping',
          'Excellent connectivity to business districts',
          'Premium building with top amenities',
          'Immediate possession available'
        ],
        seller: {
          name: 'Sunita Gupta',
          type: 'Owner',
          phone: '+91 98765 43213',
          email: 'sunita.gupta@example.com',
          verified: true,
          premium: true,
          rating: 4.8,
          totalProperties: 2,
          responseTime: '< 1 hour',
          languages: ['Hindi', 'English', 'Marathi'],
          experience: '6 years'
        }
      },
      '5': {
        id: '5',
        title: 'Furnished 2BHK Flat for Rent',
        subtitle: 'Modern Furnished Apartment in Koramangala',
        location: 'Koramangala, Bangalore, Karnataka',
        fullAddress: 'Flat 503, Prestige Shantiniketan, 5th Block, Koramangala, Bangalore - 560095',
        price: '₹45,000/month',
        originalPrice: '₹50,000/month',
        pricePerSqFt: '₹41/sq ft/month',
        listingType: 'rent',
        status: 'For Rent',
        type: 'Apartment',
        subType: 'Mid-Rise Apartment',
        bhk: '2 BHK',
        beds: 2,
        baths: 2,
        balconies: 1,
        area: '1100 sq ft',
        carpetArea: '950 sq ft',
        builtUpArea: '1100 sq ft',
        superArea: '1250 sq ft',
        parking: 1,
        floor: '5th Floor',
        totalFloors: 12,
        facing: 'East',
        furnished: 'Fully Furnished',
        possession: 'Available from Jan 2025',
        age: '4 years',
        verified: true,
        featured: false,
        premium: false,
        trustScore: 4.4,
        rating: 4.4,
        reviews: 34,
        views: 432,
        interested: 28,
        shortlisted: 18,
        postedDate: '2024-12-20',
        lastUpdated: '2024-12-23',
        propertyId: 'GHB-KOR-005',
        rera: 'PRM/KA/RERA/1251/446/PR/010119/002252',
        securityDeposit: '₹90,000',
        leasePeriod: '11 months minimum',
        maintenanceCharges: '₹3,500/month',
        description: 'Well-furnished 2BHK apartment in the heart of Koramangala. Perfect for young professionals working in nearby IT companies. Modern amenities and excellent connectivity.',
        highlights: [
          'Fully furnished with modern furniture',
          'Heart of Koramangala location',
          'Close to IT companies and startups',
          'Excellent pub and restaurant scene nearby',
          'Metro connectivity available',
          'Modern amenities in building'
        ],
        seller: {
          name: 'Vikash Singh',
          type: 'Owner',
          phone: '+91 87654 32107',
          email: 'vikash.singh@example.com',
          verified: true,
          premium: false,
          rating: 4.5,
          totalProperties: 1,
          responseTime: '< 3 hours',
          languages: ['English', 'Hindi', 'Kannada'],
          experience: '2 years'
        }
      },
      '6': {
        id: '6',
        title: 'Luxury Villa on Rent',
        subtitle: 'Premium Independent Villa in DLF Phase 2',
        location: 'DLF Phase 2, Gurgaon, Delhi NCR',
        fullAddress: 'Villa No. 156, DLF Phase 2, Gurgaon - 122002',
        price: '₹1,20,000/month',
        originalPrice: '₹1,35,000/month',
        pricePerSqFt: '₹40/sq ft/month',
        listingType: 'rent',
        status: 'For Rent',
        type: 'Villa',
        subType: 'Independent Villa',
        bhk: '4 BHK',
        beds: 4,
        baths: 5,
        balconies: 3,
        area: '3000 sq ft',
        carpetArea: '2500 sq ft',
        builtUpArea: '3000 sq ft',
        superArea: '3500 sq ft',
        parking: 3,
        floor: 'Ground + 1st Floor',
        totalFloors: 2,
        facing: 'North-East',
        furnished: 'Semi-Furnished',
        possession: 'Immediate',
        age: '5 years',
        verified: true,
        featured: true,
        premium: true,
        trustScore: 4.9,
        rating: 4.9,
        reviews: 67,
        views: 891,
        interested: 45,
        shortlisted: 23,
        postedDate: '2024-12-19',
        lastUpdated: '2024-12-24',
        propertyId: 'GHB-DLF-006',
        rera: 'RC/REP/HARERA/GGM/767/499/2023/48',
        securityDeposit: '₹3,60,000',
        leasePeriod: '12 months minimum',
        maintenanceCharges: '₹15,000/month',
        description: 'Luxurious independent villa in prestigious DLF Phase 2. Perfect for senior executives and large families. Features private garden, multiple parking spaces, and premium amenities.',
        highlights: [
          'Independent villa with private garden',
          'Premium DLF Phase 2 location',
          'Multiple parking spaces available',
          'Close to corporate offices',
          'Excellent security and maintenance',
          'Club house and recreational facilities',
          'Perfect for senior executives'
        ],
        seller: {
          name: 'Meera Joshi',
          type: 'Owner',
          phone: '+91 76543 21097',
          email: 'meera.joshi@example.com',
          verified: true,
          premium: true,
          rating: 4.9,
          totalProperties: 3,
          responseTime: '< 2 hours',
          languages: ['Hindi', 'English'],
          experience: '10 years'
        }
      },
      '7': {
        id: '7',
        title: 'Modern 3BHK Villa with Private Garden',
        subtitle: 'Contemporary Villa in Bangalore\'s Premium Locality',
        location: 'Whitefield, Bangalore, Karnataka',
        fullAddress: 'Villa No. 42, Brigade Orchards, Whitefield, Bangalore - 560066',
        price: '₹3.8 Cr',
        originalPrice: '₹4.2 Cr',
        pricePerSqFt: '₹18,095',
        listingType: 'sale',
        status: 'For Sale',
        type: 'Villa',
        subType: 'Independent Villa',
        bhk: '3 BHK',
        beds: 3,
        baths: 4,
        balconies: 2,
        area: '2100 sq ft',
        carpetArea: '1850 sq ft',
        builtUpArea: '2100 sq ft',
        superArea: '2400 sq ft',
        parking: 2,
        floor: 'Ground Floor',
        totalFloors: 2,
        facing: 'South-West',
        furnished: 'Semi Furnished',
        possession: 'Ready to Move',
        age: '1 year',
        verified: true,
        featured: true,
        premium: false,
        trustScore: 4.6,
        rating: 4.6,
        reviews: 89,
        views: 892,
        interested: 67,
        shortlisted: 32,
        postedDate: '2024-12-18',
        lastUpdated: '2024-12-22',
        propertyId: 'GHB-WHT-002',
        rera: 'PRM/KA/RERA/1251/446/PR/010119/002054',
        description: 'Discover modern living in this beautifully designed 3BHK villa located in the heart of Whitefield. This contemporary villa features an open-plan living area, modern kitchen with premium appliances, spacious bedrooms with attached bathrooms, and a private garden perfect for family gatherings. The property is part of a gated community with world-class amenities.',
        highlights: [
          'Private garden and outdoor space',
          'Gated community with security',
          'Modern architecture and design',
          'Premium fixtures and fittings',
          'Close to IT parks and schools',
          'Excellent connectivity to city center',
          'Clubhouse and recreational facilities'
        ],
        seller: {
          name: 'Priya Sharma',
          type: 'Owner',
          phone: '+91 98765 43211',
          email: 'priya.sharma@example.com',
          verified: true,
          premium: false,
          rating: 4.7,
          totalProperties: 1,
          responseTime: '< 3 hours',
          languages: ['English', 'Hindi', 'Kannada'],
          experience: '3 years'
        }
      }
    }

    return properties[id as keyof typeof properties] || properties['1'] // Default to property 1 if ID not found
  }

  const property: any = getPropertyData(propertyId)

  // Dynamic specifications, amenities, and other data based on property
  const getDynamicPropertyData = (property: any) => {
    const baseData = {
      specifications: {
        builtUpArea: property.builtUpArea,
        carpetArea: property.carpetArea,
        floorNumber: property.floor,
        totalFloors: `${property.totalFloors} Floors`,
        ageOfProperty: property.age,
        facingDirection: property.facing,
        flooringType: property.type === 'Villa' ? 'Vitrified Tiles' : 'Italian Marble',
        kitchenType: 'Modular Kitchen',
        bathroomCount: `${property.baths} Bathrooms`,
        balconyCount: `${property.balconies} Balconies`
      },
      amenities: [
        { name: 'Covered Parking', icon: '🚗', available: true },
        { name: 'High Speed Elevator', icon: '🛗', available: property.type !== 'Villa' },
        { name: 'Power Backup', icon: '🔌', available: true },
        { name: '24/7 Security', icon: '🛡️', available: true },
        { name: 'CCTV Surveillance', icon: '📹', available: true },
        { name: 'Landscaped Garden', icon: '🌳', available: property.type === 'Villa' || property.premium },
        { name: 'Swimming Pool', icon: '🏊‍♂️', available: property.premium || property.type === 'Villa' },
        { name: 'Gym & Fitness Center', icon: '🏋️', available: property.premium },
        { name: 'Clubhouse', icon: '🏛️', available: property.premium || property.type === 'Villa' },
        { name: 'Children Play Area', icon: '🎪', available: true },
        { name: 'Jogging Track', icon: '🏃‍♂️', available: property.premium },
        { name: 'Water Supply 24/7', icon: '💧', available: true }
      ],
      priceBreakup: {
        basePrice: property.price,
        stampDuty: `₹${Math.round(parseFloat(property.price.replace(/[₹,Cr]/g, '')) * 6)}L`,
        registrationCharges: `₹${Math.round(parseFloat(property.price.replace(/[₹,Cr]/g, '')) * 3)}L`,
        brokerage: property.seller.type === 'Owner' ? '₹0' : `₹${Math.round(parseFloat(property.price.replace(/[₹,Cr]/g, '')) * 2)}L`,
        legalCharges: '₹2L',
        totalCost: `₹${(parseFloat(property.price.replace(/[₹,Cr]/g, '')) * 1.12).toFixed(1)}Cr`
      },
      nearbyPlaces: property.location.includes('Mumbai') ? [
        { name: 'Phoenix Mills Mall', distance: '0.5 km', time: '2 min', type: 'Shopping', icon: '🛍️', rating: 4.5 },
        { name: 'Breach Candy Hospital', distance: '1.2 km', time: '5 min', type: 'Healthcare', icon: '🏥', rating: 4.7 },
        { name: 'Worli Sea Face', distance: '0.8 km', time: '3 min', type: 'Recreation', icon: '🌊', rating: 4.8 },
        { name: 'American School of Bombay', distance: '2.0 km', time: '8 min', type: 'Education', icon: '🎓', rating: 4.9 },
        { name: 'Starbucks Coffee', distance: '0.3 km', time: '1 min', type: 'Cafe', icon: '☕', rating: 4.3 },
        { name: 'Worli Railway Station', distance: '1.5 km', time: '6 min', type: 'Transport', icon: '🚊', rating: 4.2 },
        { name: 'Mumbai Airport', distance: '8.5 km', time: '25 min', type: 'Airport', icon: '✈️', rating: 4.4 },
        { name: 'Bandra-Kurla Complex', distance: '3.2 km', time: '12 min', type: 'Business', icon: '🏢', rating: 4.6 }
      ] : property.location.includes('Bangalore') ? [
        { name: 'Forum Mall', distance: '1.2 km', time: '5 min', type: 'Shopping', icon: '🛍️', rating: 4.4 },
        { name: 'Columbia Asia Hospital', distance: '2.1 km', time: '8 min', type: 'Healthcare', icon: '🏥', rating: 4.6 },
        { name: 'Whitefield Park', distance: '0.8 km', time: '3 min', type: 'Recreation', icon: '🌳', rating: 4.5 },
        { name: 'Ryan International School', distance: '1.5 km', time: '6 min', type: 'Education', icon: '🎓', rating: 4.7 },
        { name: 'Cafe Coffee Day', distance: '0.4 km', time: '2 min', type: 'Cafe', icon: '☕', rating: 4.2 },
        { name: 'Whitefield Railway Station', distance: '3.2 km', time: '12 min', type: 'Transport', icon: '🚊', rating: 4.1 },
        { name: 'Bangalore Airport', distance: '45 km', time: '60 min', type: 'Airport', icon: '✈️', rating: 4.3 },
        { name: 'ITPL Tech Park', distance: '2.8 km', time: '10 min', type: 'Business', icon: '🏢', rating: 4.5 }
      ] : [
        { name: 'Ambience Mall', distance: '2.1 km', time: '8 min', type: 'Shopping', icon: '🛍️', rating: 4.3 },
        { name: 'Fortis Hospital', distance: '1.8 km', time: '7 min', type: 'Healthcare', icon: '🏥', rating: 4.5 },
        { name: 'Leisure Valley Park', distance: '1.2 km', time: '5 min', type: 'Recreation', icon: '🌳', rating: 4.4 },
        { name: 'DPS School', distance: '0.9 km', time: '4 min', type: 'Education', icon: '🎓', rating: 4.6 },
        { name: 'Starbucks', distance: '0.6 km', time: '3 min', type: 'Cafe', icon: '☕', rating: 4.1 },
        { name: 'Sikanderpur Metro', distance: '1.5 km', time: '6 min', type: 'Transport', icon: '🚊', rating: 4.2 },
        { name: 'IGI Airport', distance: '15 km', time: '35 min', type: 'Airport', icon: '✈️', rating: 4.2 },
        { name: 'Cyber City', distance: '3.5 km', time: '15 min', type: 'Business', icon: '🏢', rating: 4.4 }
      ],
      legalDocuments: [
        { name: 'Sale Deed', status: property.seller.type === 'Owner' ? 'Verified' : 'Available', icon: '📋', available: true },
        { name: 'Title Chain', status: 'Clear', icon: '🔗', available: true },
        { name: 'Approved Layout', status: 'Available', icon: '📐', available: true },
        { name: 'Encumbrance Certificate', status: 'Clear', icon: '📜', available: true },
        { name: 'Occupancy Certificate', status: property.possession === 'Ready to Move' ? 'Verified' : 'Pending', icon: '🏠', available: property.possession === 'Ready to Move' },
        { name: 'Property Tax Receipt', status: 'Updated', icon: '🧾', available: true }
      ]
    }
    return baseData
  }

  const dynamicData = getDynamicPropertyData(property)

  const mediaItems = {
    photos: [
      { id: 1, type: 'Living Room', featured: true },
      { id: 2, type: 'Master Bedroom', featured: false },
      { id: 3, type: 'Kitchen', featured: false },
      { id: 4, type: 'Bathroom', featured: false },
      { id: 5, type: property.type === 'Villa' ? 'Garden View' : 'Balcony View', featured: true },
      { id: 6, type: 'Dining Area', featured: false },
      { id: 7, type: property.type === 'Villa' ? 'Outdoor Space' : 'Study Room', featured: false },
      { id: 8, type: property.type === 'Villa' ? 'Entrance' : 'Terrace', featured: true }
    ],
    videos: [
      { id: 1, type: 'Property Walkthrough', duration: '3:45' },
      { id: 2, type: 'Neighborhood Tour', duration: '2:30' }
    ]
  }

  const faqs = [
    {
      question: 'Is this property verified by GharBazaar?',
      answer: 'Yes, this property has been thoroughly verified by our expert team. We have checked all legal documents, ownership details, and conducted physical verification.'
    },
    {
      question: 'Are there any hidden charges?',
      answer: 'No, we believe in complete transparency. All charges including stamp duty, registration, and legal fees are clearly mentioned in the price breakup section.'
    },
    {
      question: 'Can GharBazaar assist with end-to-end purchase?',
      answer: 'Absolutely! Our Managed Buyer Plan (₹1,999 + 1%) provides complete assistance from property search to final registration, including legal verification and loan assistance.'
    },
    {
      question: 'What is the GharBazaar Trust Score?',
      answer: 'Our Trust Score is based on document verification, seller credibility, property condition, legal clearance, and market analysis. This property scores 4.8/5.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SECTION 1: HERO GALLERY */}
      <div className="relative">
        <div className="h-[500px] lg:h-[600px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Home size={120} className="text-gray-400" />
          </div>

          {/* Overlay Elements */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className={`text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg ${property.listingType === 'rent'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700'
              : 'bg-gradient-to-r from-blue-600 to-blue-700'
              }`}>
              <span>{property.status}</span>
            </div>
            {property.verified && (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg">
                <BadgeCheck size={16} />
                <span>Verified by GharBazaar</span>
              </div>
            )}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
            >
              <Heart size={24} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
            </button>
            <button className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
              <Share2 size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Price Display */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-blue-600">{property.price}</span>
              {property.originalPrice !== property.price && (
                <span className="text-lg text-gray-500 line-through">{property.originalPrice}</span>
              )}
            </div>
            <p className="text-sm text-gray-600">{property.pricePerSqFt}/sq ft{property.listingType === 'rent' ? '/month' : ''}</p>
            {property.listingType === 'rent' && (
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-500">Security Deposit: {property.securityDeposit}</p>
                <p className="text-xs text-gray-500">Maintenance: {property.maintenanceCharges}</p>
              </div>
            )}
          </div>

          {/* Image Navigation */}
          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
            <ChevronLeft size={24} className="text-gray-800" />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg">
            <ChevronRight size={24} className="text-gray-800" />
          </button>
        </div>

        {/* Media Tabs */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {[
                { key: 'photos', label: 'Photos', count: mediaItems.photos.length, path: null },
                { key: 'videos', label: 'Videos', count: mediaItems.videos.length, path: `/dashboard/browse/${propertyId}/videos` },
                { key: '360', label: '360° View', count: 1, path: `/dashboard/browse/${propertyId}/360-view` },
                { key: 'virtual', label: 'Virtual Tour', count: 1, path: `/dashboard/browse/${propertyId}/virtual-tour` }
              ].map((tab) => (
                tab.path ? (
                  <button
                    key={tab.key}
                    onClick={() => router.push(tab.path)}
                    className="py-4 px-2 border-b-2 border-transparent font-medium text-sm transition-colors text-gray-500 hover:text-blue-600 hover:border-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                  >
                    {tab.label} ({tab.count})
                  </button>
                ) : (
                  <button
                    key={tab.key}
                    onClick={() => setActiveMediaTab(tab.key)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${activeMediaTab === tab.key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="bg-white dark:bg-gray-900 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {mediaItems.photos.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all ${selectedImage === index ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
                    }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                    <Home size={20} className="text-gray-500" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Browse</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Eye size={16} />
                <span>{property.views} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* SECTION 2: QUICK PROPERTY SNAPSHOT */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${property.listingType === 'rent'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      }`}>
                      {property.type} • {property.bhk} • {property.listingType === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">ID: {property.propertyId}</span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {property.title}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    {property.subtitle}
                  </p>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin size={20} className="mr-2 text-blue-600" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-yellow-500 mb-2">
                    <Star size={24} className="fill-current" />
                    <span className="text-2xl font-bold">{property.trustScore}</span>
                  </div>
                  <p className="text-sm text-gray-500">GharBazaar Trust Score</p>
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Building2 size={24} className="text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Property Type</p>
                  <p className="font-bold text-gray-900 dark:text-white">{property.type}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Square size={24} className="text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Area</p>
                  <p className="font-bold text-gray-900 dark:text-white">{property.area}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Home size={24} className="text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">Furnishing</p>
                  <p className="font-bold text-gray-900 dark:text-white">{property.furnished}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Calendar size={24} className="text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-1">{property.listingType === 'rent' ? 'Available From' : 'Possession'}</p>
                  <p className="font-bold text-gray-900 dark:text-white">{property.possession}</p>
                </div>
              </div>

              {/* Rental-specific Information */}
              {property.listingType === 'rent' && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 mb-6 border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Rental Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Security Deposit</p>
                      <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{property.securityDeposit}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Lease Period</p>
                      <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{property.leasePeriod}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Maintenance</p>
                      <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{property.maintenanceCharges}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Phone size={18} />
                  <span>Contact Owner</span>
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Calendar size={18} />
                  <span>Book Site Visit</span>
                </button>
                {property.listingType === 'rent' ? (
                  <>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                      <Shield size={18} />
                      <span>Rental Agreement</span>
                    </button>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                      <Crown size={18} />
                      <span>Managed Rental</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                      <Shield size={18} />
                      <span>Get Due Diligence</span>
                    </button>
                    <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                      <Crown size={18} />
                      <span>Handle Everything</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* SECTION 3: PROPERTY DESCRIPTION */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About This Property</h2>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {showDescription ? property.description : property.description.substring(0, 300) + '...'}
                </p>
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {showDescription ? 'Read Less' : 'Read More'}
                </button>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Highlights</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.highlights.map((highlight: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: AMENITIES & FEATURES */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Amenities & Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dynamicData.amenities.filter(amenity => amenity.available).map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="text-2xl">{amenity.icon}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white">{amenity.name}</p>
                    </div>
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 6: PRICE BREAKUP & TRANSPARENCY */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {property.listingType === 'rent' ? 'Rental Cost Breakdown' : 'Price Breakup & Transparency'}
                </h2>
                <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold">
                  No Hidden Charges | Transparent Pricing
                </div>
              </div>

              <button
                onClick={() => setShowPriceBreakup(!showPriceBreakup)}
                className="w-full text-left"
              >
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                      {property.listingType === 'rent' ? 'View Complete Rental Cost Breakdown' : 'View Complete Price Breakdown'}
                    </span>
                    <ChevronRight size={20} className={`text-blue-600 transition-transform ${showPriceBreakup ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </button>

              {showPriceBreakup && (
                <div className="mt-4 space-y-3">
                  {property.listingType === 'rent' ? (
                    // Rental cost breakdown
                    <>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Monthly Rent</span>
                        <span className="font-bold text-gray-900 dark:text-white">{property.price}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Security Deposit</span>
                        <span className="font-bold text-gray-900 dark:text-white">{property.securityDeposit}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Maintenance Charges</span>
                        <span className="font-bold text-gray-900 dark:text-white">{property.maintenanceCharges}</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Brokerage (if applicable)</span>
                        <span className="font-bold text-gray-900 dark:text-white">₹0 - Direct Owner</span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl">
                        <span className="font-medium text-purple-900 dark:text-purple-100">Total Move-in Cost</span>
                        <span className="font-bold text-purple-600 text-xl">
                          {(() => {
                            const monthlyRent = parseInt(property.price.replace(/[₹,/month]/g, ''));
                            const deposit = parseInt(property.securityDeposit.replace(/[₹,]/g, ''));
                            const maintenance = parseInt(property.maintenanceCharges.replace(/[₹,/month]/g, ''));
                            return `₹${(monthlyRent + deposit + maintenance).toLocaleString()}`;
                          })()}
                        </span>
                      </div>
                    </>
                  ) : (
                    // Sale price breakdown
                    Object.entries(dynamicData.priceBreakup).map(([key, value]) => (
                      <div key={key} className={`flex justify-between items-center p-4 rounded-xl ${key === 'totalCost'
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800'
                        }`}>
                        <span className={`font-medium ${key === 'totalCost' ? 'text-green-900 dark:text-green-100' : 'text-gray-700 dark:text-gray-300'}`}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className={`font-bold ${key === 'totalCost' ? 'text-green-600 text-xl' : 'text-gray-900 dark:text-white'}`}>
                          {value}
                        </span>
                      </div>
                    ))
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    {property.listingType === 'rent' ? (
                      <>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                          <Calculator size={18} />
                          <span>Calculate Affordability</span>
                        </button>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                          <DollarSign size={18} />
                          <span>Negotiate Rent</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                          <Calculator size={18} />
                          <span>Calculate EMI</span>
                        </button>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                          <DollarSign size={18} />
                          <span>Request Price Negotiation</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 7: LOCATION & GOOGLE MAPS */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <MapPin className="mr-2 text-blue-600" size={24} />
                Location & Connectivity
              </h2>

              <div className="mb-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <Map size={48} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive Google Maps</p>
                    <p className="text-sm text-gray-400">Exact location will be shown here</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Nearby Places</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dynamicData.nearbyPlaces.map((place, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{place.icon}</div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{place.name}</p>
                            <p className="text-sm text-gray-500">{place.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{place.distance}</p>
                          <p className="text-sm text-gray-500">{place.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* SECTION 8: DOCUMENTS & LEGAL STATUS */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Shield className="mr-2 text-green-600" size={24} />
                  Documents & Legal Status
                </h2>
                <div className="flex space-x-2">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <CheckCircle size={14} />
                    <span>Ownership Verified</span>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <CheckCircle size={14} />
                    <span>Documents Checked</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDocuments(!showDocuments)}
                className="w-full text-left mb-4"
              >
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-green-900 dark:text-green-100">View All Legal Documents</span>
                    <ChevronRight size={20} className={`text-green-600 transition-transform ${showDocuments ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </button>

              {showDocuments && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {dynamicData.legalDocuments.map((doc, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{doc.icon}</div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{doc.name}</p>
                            <p className={`text-sm font-medium ${doc.available ? 'text-green-600' : 'text-yellow-600'}`}>{doc.status}</p>
                          </div>
                        </div>
                        {doc.available ? (
                          <CheckCircle size={20} className="text-green-500" />
                        ) : (
                          <Timer size={20} className="text-yellow-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Download size={18} />
                  <span>Download Property Summary</span>
                </button>
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <FileCheck size={18} />
                  <span>Get Full Due Diligence Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 9 & 10: SIDEBAR - GHARBAZAAR TRUST & CONTACT */}
          <div className="space-y-6">
            {/* GharBazaar Trust & Assistance */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl shadow-xl border border-blue-200 dark:border-blue-800 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-2">Why Trust GharBazaar?</h2>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-blue-800 dark:text-blue-200">Professional verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-blue-800 dark:text-blue-200">Transparent process</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-blue-800 dark:text-blue-200">Legal & compliance support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  <span className="text-blue-800 dark:text-blue-200">Dedicated relationship manager</span>
                </div>
              </div>

              <div className="space-y-3">
                {property.listingType === 'rent' ? (
                  <>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg">
                      <Shield size={20} />
                      <span>Rental Agreement Support – ₹2,999</span>
                    </button>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg">
                      <Crown size={20} />
                      <span>Managed Rental Plan – ₹999 + 5%</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg">
                      <Shield size={20} />
                      <span>Get Due Diligence – ₹15,000</span>
                    </button>
                    <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg">
                      <Crown size={20} />
                      <span>Managed Buyer Plan – ₹1,999 + 1%</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Contact & Action Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Seller</h2>

              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{property.seller.name.charAt(0)}</span>
                  </div>
                  {property.seller.premium && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Crown size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-bold text-gray-900 dark:text-white">{property.seller.name}</p>
                    {property.seller.verified && (
                      <BadgeCheck size={16} className="text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{property.seller.type} • {property.seller.experience}</p>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{property.seller.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{property.seller.responseTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg">
                  <Phone size={20} />
                  <span>Call / WhatsApp (OTP Gated)</span>
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Calendar size={18} />
                  <span>Book Site Visit</span>
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <MessageCircle size={18} />
                  <span>Request Callback</span>
                </button>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Users size={18} />
                  <span>Chat with GharBazaar Expert</span>
                </button>
                {property.listingType === 'rent' && (
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                    <Shield size={18} />
                    <span>Apply for Rental</span>
                  </button>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Languages:</p>
                <div className="flex flex-wrap gap-2">
                  {property.seller.languages.map((lang: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Urgency Indicator */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <h4 className="font-bold text-orange-900 dark:text-orange-100">High Interest Property</h4>
              </div>
              <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
                This property is receiving high interest with {property.interested} people interested and {property.shortlisted} shortlisted. Contact now to avoid missing out!
              </p>
              <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
                <Timer size={16} />
                <span>Last updated: {new Date(property.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Detailed Specifications - Moved to Sidebar */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detailed Specifications</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Building2 className="mr-2 text-blue-600" size={18} />
                    Property Details
                  </h3>
                  <div className="space-y-3">
                    {Object.entries({
                      'Built-up Area': dynamicData.specifications.builtUpArea,
                      'Carpet Area': dynamicData.specifications.carpetArea,
                      'Floor Number': dynamicData.specifications.floorNumber,
                      'Total Floors': dynamicData.specifications.totalFloors,
                      'Age of Property': dynamicData.specifications.ageOfProperty,
                      'Facing Direction': dynamicData.specifications.facingDirection
                    }).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{key}</span>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Sofa className="mr-2 text-blue-600" size={18} />
                    Interior Details
                  </h3>
                  <div className="space-y-3">
                    {Object.entries({
                      'Flooring Type': dynamicData.specifications.flooringType,
                      'Kitchen Type': dynamicData.specifications.kitchenType,
                      'Bathroom Count': dynamicData.specifications.bathroomCount,
                      'Balcony Count': dynamicData.specifications.balconyCount
                    }).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{key}</span>
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ & DISCLAIMER - Moved to Sidebar */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                    <button className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{faq.question}</span>
                        <HelpCircle size={18} className="text-gray-400" />
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-400 text-xs">{faq.answer}</p>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">Legal Disclaimer</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  GharBazaar provides professional real estate assistance and brokerage services. Property details are shared as received and verified to the best of our process. We recommend independent verification before making any investment decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT PRICING CAROUSEL */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Explore Our Services</h2>
            <p className="text-blue-100">Discover pricing plans tailored for you</p>
          </div>

          <div className="relative">
            <div className="flex space-x-4 animate-scroll">
              {/* Buyer Plans Card */}
              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Buyer Plans</h3>
                    <p className="text-blue-100 text-sm">Starting from ₹99</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Find your dream property with expert assistance and verified listings</p>
                <button
                  onClick={() => router.push('/dashboard/pricing')}
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all text-sm"
                >
                  View Plans
                </button>
              </div>

              {/* Seller Plans Card */}
              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                    <Home size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Seller Plans</h3>
                    <p className="text-blue-100 text-sm">Starting from ₹999</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Sell faster with premium listings and professional photography</p>
                <button
                  onClick={() => router.push('/dashboard/seller-pricing')}
                  className="w-full bg-white text-emerald-600 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-all text-sm"
                >
                  View Plans
                </button>
              </div>

              {/* Due Diligence Card */}
              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Due Diligence</h3>
                    <p className="text-blue-100 text-sm">₹15,000</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Complete property verification and legal document analysis</p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all text-sm"
                >
                  Learn More
                </button>
              </div>

              {/* Managed Buyer Plan Card */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 border border-orange-300/30">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Crown size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Managed Buyer</h3>
                    <p className="text-orange-100 text-sm">₹1,999 + 1%</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">We find qualified sellers according to your requirements</p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-white text-orange-600 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all text-sm"
                >
                  Get Started
                </button>
              </div>

              {/* Managed Seller Plan Card */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 border border-orange-300/30">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Crown size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Managed Seller</h3>
                    <p className="text-orange-100 text-sm">₹1,999 + 1%</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">We handle everything from listing to closing the deal</p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-white text-orange-600 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all text-sm"
                >
                  Get Started
                </button>
              </div>

              {/* Duplicate cards for seamless loop - ALL 5 CARDS */}
              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Buyer Plans</h3>
                    <p className="text-blue-100 text-sm">Starting from ₹99</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Find your dream property with expert assistance and verified listings</p>
                <button
                  onClick={() => router.push('/dashboard/pricing')}
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all text-sm"
                >
                  View Plans
                </button>
              </div>

              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                    <Home size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Seller Plans</h3>
                    <p className="text-blue-100 text-sm">Starting from ₹999</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Sell faster with premium listings and professional photography</p>
                <button
                  onClick={() => router.push('/dashboard/seller-pricing')}
                  className="w-full bg-white text-emerald-600 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition-all text-sm"
                >
                  View Plans
                </button>
              </div>

              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Due Diligence</h3>
                    <p className="text-blue-100 text-sm">₹15,000</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Complete property verification and legal document analysis</p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all text-sm"
                >
                  Learn More
                </button>
              </div>

              <div className="flex-shrink-0 w-80 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 border border-orange-300/30">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Crown size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Managed Buyer</h3>
                    <p className="text-orange-100 text-sm">₹1,999 + 1%</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">We find qualified sellers according to your requirements</p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-white text-orange-600 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all text-sm"
                >
                  Get Started
                </button>
              </div>

              <div className="flex-shrink-0 w-80 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 border border-orange-300/30">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Crown size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Managed Seller</h3>
                    <p className="text-orange-100 text-sm">₹1,999 + 1%</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">We handle everything from listing to closing the deal</p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-white text-orange-600 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-all text-sm"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 z-50">
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2">
            <Phone size={18} />
            <span>Call Now</span>
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2">
            <Calendar size={18} />
            <span>{property.listingType === 'rent' ? 'Book Visit' : 'Book Visit'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}