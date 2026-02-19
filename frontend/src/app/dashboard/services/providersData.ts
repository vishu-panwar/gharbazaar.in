// Shared providers data for all service pages

export interface Review {
  id: number
  name: string
  rating: number
  date: string
  comment: string
  helpful: number
}

export interface Provider {
  id: number
  name: string
  profession: string
  experience: string
  rating: string | number
  reviews: number
  location: string
  price: string
  priceType: string
  verified: boolean
  available: boolean
  languages: string[]
  image: null
  specialties: string[]
  completedProjects?: number
  responseTime?: string
  email?: string
  phone?: string
  website?: string
  bio?: string
  certifications?: string[]
  services?: Array<{ name: string; price: string; type: string }>
  portfolio?: Array<{ type: string; title: string; url: null }>
  reviewsList?: Review[]
}

export const allProviders: Provider[] = [
  {
    "id": 1,
    "name": "Advocate Rajesh Kumar",
    "profession": "Property Lawyer",
    "experience": "9+ years",
    "rating": "4.6",
    "reviews": 239,
    "location": "Mumbai, Maharashtra",
    "price": "₹7438",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Sale Deed",
      "Registry",
      "Legal Disputes"
    ],
    "completedProjects": 610
  },
  {
    "id": 2,
    "name": "Adv. Meera Patel",
    "profession": "Property Lawyer",
    "experience": "15+ years",
    "rating": "4.6",
    "reviews": 175,
    "location": "Delhi NCR",
    "price": "₹6782",
    "priceType": "per consultation",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Property Disputes",
      "Documentation",
      "Court Cases"
    ],
    "completedProjects": 364
  },
  {
    "id": 3,
    "name": "Adv. Suresh Reddy",
    "profession": "Property Lawyer",
    "experience": "9+ years",
    "rating": "4.5",
    "reviews": 230,
    "location": "Bangalore, Karnataka",
    "price": "₹5391",
    "priceType": "per consultation",
    "verified": true,
    "available": false,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Title Verification",
      "Property Registration",
      "Legal Opinion"
    ],
    "completedProjects": 358
  },
  {
    "id": 4,
    "name": "Adv. Kavita Deshmukh",
    "profession": "Property Lawyer",
    "experience": "20+ years",
    "rating": "4.8",
    "reviews": 218,
    "location": "Pune, Maharashtra",
    "price": "₹8172",
    "priceType": "per consultation",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Lease Agreements",
      "Property Tax",
      "NOC"
    ],
    "completedProjects": 498
  },
  {
    "id": 5,
    "name": "Adv. Anil Sharma",
    "profession": "Property Lawyer",
    "experience": "9+ years",
    "rating": "4.7",
    "reviews": 136,
    "location": "Ahmedabad, Gujarat",
    "price": "₹4616",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Commercial Property",
      "Litigation",
      "Due Diligence"
    ],
    "completedProjects": 412
  },
  {
    "id": 6,
    "name": "Adv. Priya Nair",
    "profession": "Property Lawyer",
    "experience": "10+ years",
    "rating": "4.8",
    "reviews": 223,
    "location": "Hyderabad, Telangana",
    "price": "₹5025",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Sale Deed",
      "Registry",
      "Legal Disputes"
    ],
    "completedProjects": 433
  },
  {
    "id": 7,
    "name": "Adv. Ramesh Gupta",
    "profession": "Property Lawyer",
    "experience": "12+ years",
    "rating": "4.7",
    "reviews": 309,
    "location": "Chennai, Tamil Nadu",
    "price": "₹4839",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Property Disputes",
      "Documentation",
      "Court Cases"
    ],
    "completedProjects": 626
  },
  {
    "id": 8,
    "name": "Adv. Sanjay Verma",
    "profession": "Property Lawyer",
    "experience": "9+ years",
    "rating": "4.7",
    "reviews": 267,
    "location": "Kolkata, West Bengal",
    "price": "₹8568",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Title Verification",
      "Property Registration",
      "Legal Opinion"
    ],
    "completedProjects": 453
  },
  {
    "id": 9,
    "name": "Adv. Neha Singh",
    "profession": "Property Lawyer",
    "experience": "11+ years",
    "rating": "4.8",
    "reviews": 90,
    "location": "Jaipur, Rajasthan",
    "price": "₹6828",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Lease Agreements",
      "Property Tax",
      "NOC"
    ],
    "completedProjects": 649
  },
  {
    "id": 10,
    "name": "Adv. Vikram Malhotra",
    "profession": "Property Lawyer",
    "experience": "18+ years",
    "rating": "4.8",
    "reviews": 284,
    "location": "Kochi, Kerala",
    "price": "₹4984",
    "priceType": "per consultation",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Commercial Property",
      "Litigation",
      "Due Diligence"
    ],
    "completedProjects": 439
  },
  {
    "id": 11,
    "name": "Adv. Anjali Kapoor",
    "profession": "Property Lawyer",
    "experience": "21+ years",
    "rating": "4.7",
    "reviews": 284,
    "location": "Chandigarh",
    "price": "₹6626",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Sale Deed",
      "Registry",
      "Legal Disputes"
    ],
    "completedProjects": 710
  },
  {
    "id": 12,
    "name": "Adv. Rohit Joshi",
    "profession": "Property Lawyer",
    "experience": "15+ years",
    "rating": "4.8",
    "reviews": 236,
    "location": "Lucknow, Uttar Pradesh",
    "price": "₹6774",
    "priceType": "per consultation",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Property Disputes",
      "Documentation",
      "Court Cases"
    ],
    "completedProjects": 733
  },
  {
    "id": 13,
    "name": "Adv. Deepa Iyer",
    "profession": "Property Lawyer",
    "experience": "13+ years",
    "rating": "4.7",
    "reviews": 155,
    "location": "Mumbai, Maharashtra",
    "price": "₹7388",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Title Verification",
      "Property Registration",
      "Legal Opinion"
    ],
    "completedProjects": 631
  },
  {
    "id": 14,
    "name": "Adv. Karthik Rao",
    "profession": "Property Lawyer",
    "experience": "8+ years",
    "rating": "4.5",
    "reviews": 249,
    "location": "Delhi NCR",
    "price": "₹6708",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Lease Agreements",
      "Property Tax",
      "NOC"
    ],
    "completedProjects": 461
  },
  {
    "id": 15,
    "name": "Adv. Simran Kaur",
    "profession": "Property Lawyer",
    "experience": "13+ years",
    "rating": "4.8",
    "reviews": 226,
    "location": "Bangalore, Karnataka",
    "price": "₹8996",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Commercial Property",
      "Litigation",
      "Due Diligence"
    ],
    "completedProjects": 641
  },
  {
    "id": 16,
    "name": "Ar. Priya Sharma",
    "profession": "Architect",
    "experience": "14+ years",
    "rating": "4.6",
    "reviews": 218,
    "location": "Mumbai, Maharashtra",
    "price": "₹17014",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Residential",
      "Commercial",
      "Approvals"
    ],
    "completedProjects": 332
  },
  {
    "id": 17,
    "name": "Ar. Vikram Singh",
    "profession": "Architect",
    "experience": "11+ years",
    "rating": "4.9",
    "reviews": 133,
    "location": "Delhi NCR",
    "price": "₹21839",
    "priceType": "per project",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Modern Architecture",
      "Green Buildings",
      "Interior Planning"
    ],
    "completedProjects": 271
  },
  {
    "id": 18,
    "name": "Ar. Anita Desai",
    "profession": "Architect",
    "experience": "7+ years",
    "rating": "4.8",
    "reviews": 92,
    "location": "Bangalore, Karnataka",
    "price": "₹25382",
    "priceType": "per project",
    "verified": true,
    "available": false,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Contemporary Design",
      "Sustainable",
      "Urban Planning"
    ],
    "completedProjects": 207
  },
  {
    "id": 19,
    "name": "Ar. Rahul Mehta",
    "profession": "Architect",
    "experience": "13+ years",
    "rating": "4.8",
    "reviews": 232,
    "location": "Pune, Maharashtra",
    "price": "₹24389",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Villa Design",
      "Renovation",
      "3D Modeling"
    ],
    "completedProjects": 293
  },
  {
    "id": 20,
    "name": "Ar. Sneha Patel",
    "profession": "Architect",
    "experience": "10+ years",
    "rating": "4.8",
    "reviews": 251,
    "location": "Ahmedabad, Gujarat",
    "price": "₹21500",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Industrial",
      "Institutional",
      "Landscape"
    ],
    "completedProjects": 417
  },
  {
    "id": 21,
    "name": "Ar. Arjun Reddy",
    "profession": "Architect",
    "experience": "6+ years",
    "rating": "4.9",
    "reviews": 111,
    "location": "Hyderabad, Telangana",
    "price": "₹21285",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Residential",
      "Commercial",
      "Approvals"
    ],
    "completedProjects": 322
  },
  {
    "id": 22,
    "name": "Ar. Kavya Nair",
    "profession": "Architect",
    "experience": "9+ years",
    "rating": "4.8",
    "reviews": 196,
    "location": "Chennai, Tamil Nadu",
    "price": "₹17053",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Modern Architecture",
      "Green Buildings",
      "Interior Planning"
    ],
    "completedProjects": 303
  },
  {
    "id": 23,
    "name": "Ar. Aditya Gupta",
    "profession": "Architect",
    "experience": "17+ years",
    "rating": "4.7",
    "reviews": 140,
    "location": "Kolkata, West Bengal",
    "price": "₹18562",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Contemporary Design",
      "Sustainable",
      "Urban Planning"
    ],
    "completedProjects": 224
  },
  {
    "id": 24,
    "name": "Ar. Pooja Verma",
    "profession": "Architect",
    "experience": "16+ years",
    "rating": "4.8",
    "reviews": 181,
    "location": "Jaipur, Rajasthan",
    "price": "₹20007",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Villa Design",
      "Renovation",
      "3D Modeling"
    ],
    "completedProjects": 375
  },
  {
    "id": 25,
    "name": "Ar. Karan Malhotra",
    "profession": "Architect",
    "experience": "8+ years",
    "rating": "4.9",
    "reviews": 110,
    "location": "Kochi, Kerala",
    "price": "₹18489",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Industrial",
      "Institutional",
      "Landscape"
    ],
    "completedProjects": 244
  },
  {
    "id": 26,
    "name": "Ar. Riya Kapoor",
    "profession": "Architect",
    "experience": "15+ years",
    "rating": "4.6",
    "reviews": 151,
    "location": "Chandigarh",
    "price": "₹13374",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Residential",
      "Commercial",
      "Approvals"
    ],
    "completedProjects": 241
  },
  {
    "id": 27,
    "name": "Ar. Sameer Joshi",
    "profession": "Architect",
    "experience": "6+ years",
    "rating": "4.7",
    "reviews": 246,
    "location": "Lucknow, Uttar Pradesh",
    "price": "₹23083",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Modern Architecture",
      "Green Buildings",
      "Interior Planning"
    ],
    "completedProjects": 452
  },
  {
    "id": 28,
    "name": "Ar. Divya Iyer",
    "profession": "Architect",
    "experience": "17+ years",
    "rating": "4.8",
    "reviews": 164,
    "location": "Mumbai, Maharashtra",
    "price": "₹19133",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Contemporary Design",
      "Sustainable",
      "Urban Planning"
    ],
    "completedProjects": 334
  },
  {
    "id": 29,
    "name": "Ar. Nikhil Rao",
    "profession": "Architect",
    "experience": "17+ years",
    "rating": "4.8",
    "reviews": 153,
    "location": "Delhi NCR",
    "price": "₹24571",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Villa Design",
      "Renovation",
      "3D Modeling"
    ],
    "completedProjects": 437
  },
  {
    "id": 30,
    "name": "Ar. Tanya Singh",
    "profession": "Architect",
    "experience": "12+ years",
    "rating": "4.6",
    "reviews": 228,
    "location": "Bangalore, Karnataka",
    "price": "₹14013",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Industrial",
      "Institutional",
      "Landscape"
    ],
    "completedProjects": 429
  },
  {
    "id": 31,
    "name": "Amit Designs Studio",
    "profession": "Interior Designer",
    "experience": "5+ years",
    "rating": "4.7",
    "reviews": 335,
    "location": "Mumbai, Maharashtra",
    "price": "₹21768",
    "priceType": "per room",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Modern",
      "Minimalist",
      "3D Design"
    ],
    "completedProjects": 501
  },
  {
    "id": 32,
    "name": "Creative Interiors",
    "profession": "Interior Designer",
    "experience": "6+ years",
    "rating": "4.5",
    "reviews": 328,
    "location": "Delhi NCR",
    "price": "₹36966",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Contemporary",
      "Traditional",
      "Space Planning"
    ],
    "completedProjects": 285
  },
  {
    "id": 33,
    "name": "Luxe Design Co.",
    "profession": "Interior Designer",
    "experience": "7+ years",
    "rating": "4.8",
    "reviews": 183,
    "location": "Bangalore, Karnataka",
    "price": "₹30783",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Luxury",
      "Boutique",
      "Custom Furniture"
    ],
    "completedProjects": 463
  },
  {
    "id": 34,
    "name": "Modern Spaces",
    "profession": "Interior Designer",
    "experience": "13+ years",
    "rating": "4.8",
    "reviews": 300,
    "location": "Pune, Maharashtra",
    "price": "₹18529",
    "priceType": "per room",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Scandinavian",
      "Industrial",
      "Bohemian"
    ],
    "completedProjects": 548
  },
  {
    "id": 35,
    "name": "Elite Interiors",
    "profession": "Interior Designer",
    "experience": "14+ years",
    "rating": "4.8",
    "reviews": 121,
    "location": "Ahmedabad, Gujarat",
    "price": "₹19809",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Classic",
      "Vintage",
      "Eclectic"
    ],
    "completedProjects": 327
  },
  {
    "id": 36,
    "name": "Dream Decor",
    "profession": "Interior Designer",
    "experience": "6+ years",
    "rating": "4.6",
    "reviews": 279,
    "location": "Hyderabad, Telangana",
    "price": "₹28716",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Modern",
      "Minimalist",
      "3D Design"
    ],
    "completedProjects": 382
  },
  {
    "id": 37,
    "name": "Style Studio",
    "profession": "Interior Designer",
    "experience": "14+ years",
    "rating": "4.8",
    "reviews": 286,
    "location": "Chennai, Tamil Nadu",
    "price": "₹34306",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Contemporary",
      "Traditional",
      "Space Planning"
    ],
    "completedProjects": 293
  },
  {
    "id": 38,
    "name": "Urban Interiors",
    "profession": "Interior Designer",
    "experience": "14+ years",
    "rating": "4.5",
    "reviews": 313,
    "location": "Kolkata, West Bengal",
    "price": "₹20828",
    "priceType": "per room",
    "verified": true,
    "available": false,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Luxury",
      "Boutique",
      "Custom Furniture"
    ],
    "completedProjects": 317
  },
  {
    "id": 39,
    "name": "Classic Designs",
    "profession": "Interior Designer",
    "experience": "12+ years",
    "rating": "4.7",
    "reviews": 110,
    "location": "Jaipur, Rajasthan",
    "price": "₹25308",
    "priceType": "per room",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Scandinavian",
      "Industrial",
      "Bohemian"
    ],
    "completedProjects": 502
  },
  {
    "id": 40,
    "name": "Fusion Interiors",
    "profession": "Interior Designer",
    "experience": "7+ years",
    "rating": "4.6",
    "reviews": 227,
    "location": "Kochi, Kerala",
    "price": "₹35334",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Classic",
      "Vintage",
      "Eclectic"
    ],
    "completedProjects": 318
  },
  {
    "id": 41,
    "name": "Elegant Spaces",
    "profession": "Interior Designer",
    "experience": "7+ years",
    "rating": "4.7",
    "reviews": 125,
    "location": "Chandigarh",
    "price": "₹36186",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Modern",
      "Minimalist",
      "3D Design"
    ],
    "completedProjects": 483
  },
  {
    "id": 42,
    "name": "Chic Designs",
    "profession": "Interior Designer",
    "experience": "12+ years",
    "rating": "4.8",
    "reviews": 139,
    "location": "Lucknow, Uttar Pradesh",
    "price": "₹31790",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Contemporary",
      "Traditional",
      "Space Planning"
    ],
    "completedProjects": 211
  },
  {
    "id": 43,
    "name": "Premium Interiors",
    "profession": "Interior Designer",
    "experience": "7+ years",
    "rating": "4.7",
    "reviews": 328,
    "location": "Mumbai, Maharashtra",
    "price": "₹20573",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Luxury",
      "Boutique",
      "Custom Furniture"
    ],
    "completedProjects": 237
  },
  {
    "id": 44,
    "name": "Artistic Touch",
    "profession": "Interior Designer",
    "experience": "12+ years",
    "rating": "4.8",
    "reviews": 136,
    "location": "Delhi NCR",
    "price": "₹22900",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Scandinavian",
      "Industrial",
      "Bohemian"
    ],
    "completedProjects": 268
  },
  {
    "id": 45,
    "name": "Designer Hub",
    "profession": "Interior Designer",
    "experience": "13+ years",
    "rating": "4.5",
    "reviews": 101,
    "location": "Bangalore, Karnataka",
    "price": "₹20469",
    "priceType": "per room",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Classic",
      "Vintage",
      "Eclectic"
    ],
    "completedProjects": 546
  },
  {
    "id": 46,
    "name": "Perfect Painters Co.",
    "profession": "Painter",
    "experience": "18+ years",
    "rating": "4.6",
    "reviews": 375,
    "location": "Mumbai, Maharashtra",
    "price": "₹18",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Interior",
      "Exterior",
      "Texture"
    ],
    "completedProjects": 769
  },
  {
    "id": 47,
    "name": "ColorMaster Painters",
    "profession": "Painter",
    "experience": "19+ years",
    "rating": "4.7",
    "reviews": 421,
    "location": "Delhi NCR",
    "price": "₹24",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Asian Paints",
      "Texture",
      "Waterproofing"
    ],
    "completedProjects": 653
  },
  {
    "id": 48,
    "name": "Rainbow Paints",
    "profession": "Painter",
    "experience": "8+ years",
    "rating": "4.5",
    "reviews": 234,
    "location": "Bangalore, Karnataka",
    "price": "₹24",
    "priceType": "per sq.ft",
    "verified": true,
    "available": false,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Decorative",
      "Stencil",
      "Wall Art"
    ],
    "completedProjects": 698
  },
  {
    "id": 49,
    "name": "Pro Painters",
    "profession": "Painter",
    "experience": "8+ years",
    "rating": "4.7",
    "reviews": 211,
    "location": "Pune, Maharashtra",
    "price": "₹23",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Spray Painting",
      "Wood Finish",
      "Metal Coating"
    ],
    "completedProjects": 767
  },
  {
    "id": 50,
    "name": "Elite Painting",
    "profession": "Painter",
    "experience": "18+ years",
    "rating": "4.8",
    "reviews": 341,
    "location": "Ahmedabad, Gujarat",
    "price": "₹25",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Epoxy",
      "Enamel",
      "Distemper"
    ],
    "completedProjects": 642
  },
  {
    "id": 51,
    "name": "Color Craft",
    "profession": "Painter",
    "experience": "13+ years",
    "rating": "4.4",
    "reviews": 381,
    "location": "Hyderabad, Telangana",
    "price": "₹22",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Interior",
      "Exterior",
      "Texture"
    ],
    "completedProjects": 571
  },
  {
    "id": 52,
    "name": "Brush Masters",
    "profession": "Painter",
    "experience": "17+ years",
    "rating": "4.7",
    "reviews": 440,
    "location": "Chennai, Tamil Nadu",
    "price": "₹27",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Asian Paints",
      "Texture",
      "Waterproofing"
    ],
    "completedProjects": 777
  },
  {
    "id": 53,
    "name": "Paint Pro",
    "profession": "Painter",
    "experience": "11+ years",
    "rating": "4.7",
    "reviews": 388,
    "location": "Kolkata, West Bengal",
    "price": "₹19",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Decorative",
      "Stencil",
      "Wall Art"
    ],
    "completedProjects": 615
  },
  {
    "id": 54,
    "name": "Artistic Painters",
    "profession": "Painter",
    "experience": "9+ years",
    "rating": "4.8",
    "reviews": 337,
    "location": "Jaipur, Rajasthan",
    "price": "₹19",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Spray Painting",
      "Wood Finish",
      "Metal Coating"
    ],
    "completedProjects": 705
  },
  {
    "id": 55,
    "name": "Color Experts",
    "profession": "Painter",
    "experience": "10+ years",
    "rating": "4.7",
    "reviews": 246,
    "location": "Kochi, Kerala",
    "price": "₹18",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Epoxy",
      "Enamel",
      "Distemper"
    ],
    "completedProjects": 495
  },
  {
    "id": 56,
    "name": "Premium Paints",
    "profession": "Painter",
    "experience": "15+ years",
    "rating": "4.6",
    "reviews": 237,
    "location": "Chandigarh",
    "price": "₹24",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Interior",
      "Exterior",
      "Texture"
    ],
    "completedProjects": 587
  },
  {
    "id": 57,
    "name": "Decor Painters",
    "profession": "Painter",
    "experience": "14+ years",
    "rating": "4.7",
    "reviews": 378,
    "location": "Lucknow, Uttar Pradesh",
    "price": "₹15",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Asian Paints",
      "Texture",
      "Waterproofing"
    ],
    "completedProjects": 521
  },
  {
    "id": 58,
    "name": "Quality Painting",
    "profession": "Painter",
    "experience": "13+ years",
    "rating": "4.6",
    "reviews": 304,
    "location": "Mumbai, Maharashtra",
    "price": "₹26",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Decorative",
      "Stencil",
      "Wall Art"
    ],
    "completedProjects": 779
  },
  {
    "id": 59,
    "name": "Color Studio",
    "profession": "Painter",
    "experience": "15+ years",
    "rating": "4.5",
    "reviews": 336,
    "location": "Delhi NCR",
    "price": "₹16",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Spray Painting",
      "Wood Finish",
      "Metal Coating"
    ],
    "completedProjects": 443
  },
  {
    "id": 60,
    "name": "Master Painters",
    "profession": "Painter",
    "experience": "8+ years",
    "rating": "4.6",
    "reviews": 254,
    "location": "Bangalore, Karnataka",
    "price": "₹22",
    "priceType": "per sq.ft",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Epoxy",
      "Enamel",
      "Distemper"
    ],
    "completedProjects": 686
  },
  {
    "id": 61,
    "name": "BuildRight Contractors",
    "profession": "Civil Contractor",
    "experience": "21+ years",
    "rating": "4.6",
    "reviews": 226,
    "location": "Mumbai, Maharashtra",
    "price": "₹97449",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Construction",
      "Renovation",
      "Structural Work"
    ],
    "completedProjects": 331
  },
  {
    "id": 62,
    "name": "Solid Constructions",
    "profession": "Civil Contractor",
    "experience": "18+ years",
    "rating": "4.6",
    "reviews": 144,
    "location": "Delhi NCR",
    "price": "₹72989",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Foundation",
      "Roofing",
      "Plastering"
    ],
    "completedProjects": 377
  },
  {
    "id": 63,
    "name": "Prime Builders",
    "profession": "Civil Contractor",
    "experience": "24+ years",
    "rating": "4.8",
    "reviews": 252,
    "location": "Bangalore, Karnataka",
    "price": "₹72558",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Brickwork",
      "Concrete",
      "Finishing"
    ],
    "completedProjects": 224
  },
  {
    "id": 64,
    "name": "Elite Contractors",
    "profession": "Civil Contractor",
    "experience": "23+ years",
    "rating": "4.8",
    "reviews": 221,
    "location": "Pune, Maharashtra",
    "price": "₹67613",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Demolition",
      "Remodeling",
      "Extensions"
    ],
    "completedProjects": 302
  },
  {
    "id": 65,
    "name": "Master Builders",
    "profession": "Civil Contractor",
    "experience": "14+ years",
    "rating": "4.7",
    "reviews": 168,
    "location": "Ahmedabad, Gujarat",
    "price": "₹72369",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Construction",
      "Renovation",
      "Structural Work"
    ],
    "completedProjects": 398
  },
  {
    "id": 66,
    "name": "Quality Construction",
    "profession": "Civil Contractor",
    "experience": "21+ years",
    "rating": "4.6",
    "reviews": 252,
    "location": "Hyderabad, Telangana",
    "price": "₹65073",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Foundation",
      "Roofing",
      "Plastering"
    ],
    "completedProjects": 398
  },
  {
    "id": 67,
    "name": "Pro Contractors",
    "profession": "Civil Contractor",
    "experience": "12+ years",
    "rating": "4.9",
    "reviews": 125,
    "location": "Chennai, Tamil Nadu",
    "price": "₹67276",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Brickwork",
      "Concrete",
      "Finishing"
    ],
    "completedProjects": 393
  },
  {
    "id": 68,
    "name": "Urban Builders",
    "profession": "Civil Contractor",
    "experience": "11+ years",
    "rating": "4.5",
    "reviews": 202,
    "location": "Kolkata, West Bengal",
    "price": "₹62866",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Demolition",
      "Remodeling",
      "Extensions"
    ],
    "completedProjects": 529
  },
  {
    "id": 69,
    "name": "Reliable Construction",
    "profession": "Civil Contractor",
    "experience": "10+ years",
    "rating": "4.5",
    "reviews": 195,
    "location": "Jaipur, Rajasthan",
    "price": "₹88911",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Construction",
      "Renovation",
      "Structural Work"
    ],
    "completedProjects": 378
  },
  {
    "id": 70,
    "name": "Expert Contractors",
    "profession": "Civil Contractor",
    "experience": "15+ years",
    "rating": "4.8",
    "reviews": 124,
    "location": "Kochi, Kerala",
    "price": "₹75805",
    "priceType": "per project",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Foundation",
      "Roofing",
      "Plastering"
    ],
    "completedProjects": 454
  },
  {
    "id": 71,
    "name": "Premium Builders",
    "profession": "Civil Contractor",
    "experience": "24+ years",
    "rating": "4.7",
    "reviews": 298,
    "location": "Chandigarh",
    "price": "₹80674",
    "priceType": "per project",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Brickwork",
      "Concrete",
      "Finishing"
    ],
    "completedProjects": 452
  },
  {
    "id": 72,
    "name": "Top Contractors",
    "profession": "Civil Contractor",
    "experience": "20+ years",
    "rating": "4.5",
    "reviews": 230,
    "location": "Lucknow, Uttar Pradesh",
    "price": "₹98615",
    "priceType": "per project",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Demolition",
      "Remodeling",
      "Extensions"
    ],
    "completedProjects": 458
  },
  {
    "id": 73,
    "name": "Pandit Ramesh Shastri",
    "profession": "Vastu Consultant",
    "experience": "31+ years",
    "rating": "4.8",
    "reviews": 225,
    "location": "Mumbai, Maharashtra",
    "price": "₹3897",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Residential Vastu",
      "Commercial Vastu",
      "Remedies"
    ],
    "completedProjects": 695
  },
  {
    "id": 74,
    "name": "Dr. Vastu Expert",
    "profession": "Vastu Consultant",
    "experience": "18+ years",
    "rating": "4.7",
    "reviews": 241,
    "location": "Delhi NCR",
    "price": "₹4558",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Home Vastu",
      "Office Vastu",
      "Factory Vastu"
    ],
    "completedProjects": 560
  },
  {
    "id": 75,
    "name": "Guruji Vastu",
    "profession": "Vastu Consultant",
    "experience": "28+ years",
    "rating": "4.7",
    "reviews": 206,
    "location": "Bangalore, Karnataka",
    "price": "₹2563",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Plot Selection",
      "Direction Analysis",
      "Energy Balance"
    ],
    "completedProjects": 840
  },
  {
    "id": 76,
    "name": "Vastu Acharya",
    "profession": "Vastu Consultant",
    "experience": "20+ years",
    "rating": "4.7",
    "reviews": 143,
    "location": "Pune, Maharashtra",
    "price": "₹4808",
    "priceType": "per consultation",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Residential Vastu",
      "Commercial Vastu",
      "Remedies"
    ],
    "completedProjects": 766
  },
  {
    "id": 77,
    "name": "Pandit Suresh Sharma",
    "profession": "Vastu Consultant",
    "experience": "27+ years",
    "rating": "4.6",
    "reviews": 99,
    "location": "Ahmedabad, Gujarat",
    "price": "₹4378",
    "priceType": "per consultation",
    "verified": true,
    "available": false,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Home Vastu",
      "Office Vastu",
      "Factory Vastu"
    ],
    "completedProjects": 624
  },
  {
    "id": 78,
    "name": "Vastu Master",
    "profession": "Vastu Consultant",
    "experience": "31+ years",
    "rating": "4.9",
    "reviews": 116,
    "location": "Hyderabad, Telangana",
    "price": "₹3710",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Plot Selection",
      "Direction Analysis",
      "Energy Balance"
    ],
    "completedProjects": 518
  },
  {
    "id": 79,
    "name": "Dr. Vastu Consultant",
    "profession": "Vastu Consultant",
    "experience": "32+ years",
    "rating": "4.6",
    "reviews": 213,
    "location": "Chennai, Tamil Nadu",
    "price": "₹2513",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Residential Vastu",
      "Commercial Vastu",
      "Remedies"
    ],
    "completedProjects": 641
  },
  {
    "id": 80,
    "name": "Vastu Guru",
    "profession": "Vastu Consultant",
    "experience": "34+ years",
    "rating": "4.8",
    "reviews": 137,
    "location": "Kolkata, West Bengal",
    "price": "₹4677",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Home Vastu",
      "Office Vastu",
      "Factory Vastu"
    ],
    "completedProjects": 699
  },
  {
    "id": 81,
    "name": "Pandit Anil Joshi",
    "profession": "Vastu Consultant",
    "experience": "24+ years",
    "rating": "4.8",
    "reviews": 255,
    "location": "Jaipur, Rajasthan",
    "price": "₹3502",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Plot Selection",
      "Direction Analysis",
      "Energy Balance"
    ],
    "completedProjects": 616
  },
  {
    "id": 82,
    "name": "Vastu Specialist",
    "profession": "Vastu Consultant",
    "experience": "23+ years",
    "rating": "4.8",
    "reviews": 248,
    "location": "Kochi, Kerala",
    "price": "₹4503",
    "priceType": "per consultation",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Residential Vastu",
      "Commercial Vastu",
      "Remedies"
    ],
    "completedProjects": 819
  },
  {
    "id": 83,
    "name": "InspectPro Services",
    "profession": "Property Inspector",
    "experience": "14+ years",
    "rating": "4.5",
    "reviews": 99,
    "location": "Mumbai, Maharashtra",
    "price": "₹11322",
    "priceType": "per inspection",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Structural Inspection",
      "Legal Verification",
      "Quality Check"
    ],
    "completedProjects": 394
  },
  {
    "id": 84,
    "name": "Quality Inspectors",
    "profession": "Property Inspector",
    "experience": "15+ years",
    "rating": "4.8",
    "reviews": 184,
    "location": "Delhi NCR",
    "price": "₹7897",
    "priceType": "per inspection",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Pre-Purchase Inspection",
      "Construction Audit",
      "Defect Analysis"
    ],
    "completedProjects": 442
  },
  {
    "id": 85,
    "name": "Expert Inspection",
    "profession": "Property Inspector",
    "experience": "14+ years",
    "rating": "4.6",
    "reviews": 144,
    "location": "Bangalore, Karnataka",
    "price": "₹11932",
    "priceType": "per inspection",
    "verified": true,
    "available": false,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Building Survey",
      "Compliance Check",
      "Safety Audit"
    ],
    "completedProjects": 373
  },
  {
    "id": 86,
    "name": "Pro Inspect",
    "profession": "Property Inspector",
    "experience": "13+ years",
    "rating": "4.8",
    "reviews": 201,
    "location": "Pune, Maharashtra",
    "price": "₹9683",
    "priceType": "per inspection",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Structural Inspection",
      "Legal Verification",
      "Quality Check"
    ],
    "completedProjects": 525
  },
  {
    "id": 87,
    "name": "Reliable Inspectors",
    "profession": "Property Inspector",
    "experience": "11+ years",
    "rating": "4.5",
    "reviews": 126,
    "location": "Ahmedabad, Gujarat",
    "price": "₹6539",
    "priceType": "per inspection",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Pre-Purchase Inspection",
      "Construction Audit",
      "Defect Analysis"
    ],
    "completedProjects": 350
  },
  {
    "id": 88,
    "name": "Property Check",
    "profession": "Property Inspector",
    "experience": "11+ years",
    "rating": "4.7",
    "reviews": 215,
    "location": "Hyderabad, Telangana",
    "price": "₹10994",
    "priceType": "per inspection",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Building Survey",
      "Compliance Check",
      "Safety Audit"
    ],
    "completedProjects": 381
  },
  {
    "id": 89,
    "name": "Inspection Masters",
    "profession": "Property Inspector",
    "experience": "17+ years",
    "rating": "4.6",
    "reviews": 209,
    "location": "Chennai, Tamil Nadu",
    "price": "₹11637",
    "priceType": "per inspection",
    "verified": true,
    "available": false,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Structural Inspection",
      "Legal Verification",
      "Quality Check"
    ],
    "completedProjects": 261
  },
  {
    "id": 90,
    "name": "Quality Check",
    "profession": "Property Inspector",
    "experience": "16+ years",
    "rating": "4.8",
    "reviews": 190,
    "location": "Kolkata, West Bengal",
    "price": "₹7439",
    "priceType": "per inspection",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Pre-Purchase Inspection",
      "Construction Audit",
      "Defect Analysis"
    ],
    "completedProjects": 523
  },
  {
    "id": 91,
    "name": "Expert Property Inspect",
    "profession": "Property Inspector",
    "experience": "13+ years",
    "rating": "4.8",
    "reviews": 182,
    "location": "Jaipur, Rajasthan",
    "price": "₹9482",
    "priceType": "per inspection",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Building Survey",
      "Compliance Check",
      "Safety Audit"
    ],
    "completedProjects": 327
  },
  {
    "id": 92,
    "name": "Premium Inspection",
    "profession": "Property Inspector",
    "experience": "8+ years",
    "rating": "4.6",
    "reviews": 104,
    "location": "Kochi, Kerala",
    "price": "₹10014",
    "priceType": "per inspection",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Structural Inspection",
      "Legal Verification",
      "Quality Check"
    ],
    "completedProjects": 293
  },
  {
    "id": 93,
    "name": "SafeMove Packers",
    "profession": "Packers & Movers",
    "experience": "10+ years",
    "rating": "4.8",
    "reviews": 282,
    "location": "Mumbai, Maharashtra",
    "price": "₹17320",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Home Shifting",
      "Office Relocation",
      "Vehicle Transport"
    ],
    "completedProjects": 688
  },
  {
    "id": 94,
    "name": "Quick Movers",
    "profession": "Packers & Movers",
    "experience": "16+ years",
    "rating": "4.7",
    "reviews": 314,
    "location": "Delhi NCR",
    "price": "₹12247",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Local Moving",
      "Interstate",
      "International"
    ],
    "completedProjects": 725
  },
  {
    "id": 95,
    "name": "Reliable Packers",
    "profession": "Packers & Movers",
    "experience": "13+ years",
    "rating": "4.4",
    "reviews": 245,
    "location": "Bangalore, Karnataka",
    "price": "₹11664",
    "priceType": "per move",
    "verified": true,
    "available": false,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Packing",
      "Loading",
      "Insurance"
    ],
    "completedProjects": 729
  },
  {
    "id": 96,
    "name": "Express Movers",
    "profession": "Packers & Movers",
    "experience": "15+ years",
    "rating": "4.4",
    "reviews": 462,
    "location": "Pune, Maharashtra",
    "price": "₹11150",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Home Shifting",
      "Office Relocation",
      "Vehicle Transport"
    ],
    "completedProjects": 608
  },
  {
    "id": 97,
    "name": "Safe Relocation",
    "profession": "Packers & Movers",
    "experience": "11+ years",
    "rating": "4.7",
    "reviews": 274,
    "location": "Ahmedabad, Gujarat",
    "price": "₹15274",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Local Moving",
      "Interstate",
      "International"
    ],
    "completedProjects": 834
  },
  {
    "id": 98,
    "name": "Pro Movers",
    "profession": "Packers & Movers",
    "experience": "17+ years",
    "rating": "4.6",
    "reviews": 448,
    "location": "Hyderabad, Telangana",
    "price": "₹12159",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Packing",
      "Loading",
      "Insurance"
    ],
    "completedProjects": 1007
  },
  {
    "id": 99,
    "name": "Fast Packers",
    "profession": "Packers & Movers",
    "experience": "11+ years",
    "rating": "4.7",
    "reviews": 488,
    "location": "Chennai, Tamil Nadu",
    "price": "₹16510",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Home Shifting",
      "Office Relocation",
      "Vehicle Transport"
    ],
    "completedProjects": 733
  },
  {
    "id": 100,
    "name": "Secure Movers",
    "profession": "Packers & Movers",
    "experience": "9+ years",
    "rating": "4.4",
    "reviews": 461,
    "location": "Kolkata, West Bengal",
    "price": "₹9375",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Local Moving",
      "Interstate",
      "International"
    ],
    "completedProjects": 1054
  },
  {
    "id": 101,
    "name": "Elite Packers",
    "profession": "Packers & Movers",
    "experience": "18+ years",
    "rating": "4.8",
    "reviews": 499,
    "location": "Jaipur, Rajasthan",
    "price": "₹18114",
    "priceType": "per move",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Packing",
      "Loading",
      "Insurance"
    ],
    "completedProjects": 777
  },
  {
    "id": 102,
    "name": "Premium Movers",
    "profession": "Packers & Movers",
    "experience": "8+ years",
    "rating": "4.7",
    "reviews": 438,
    "location": "Kochi, Kerala",
    "price": "₹11224",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Home Shifting",
      "Office Relocation",
      "Vehicle Transport"
    ],
    "completedProjects": 1085
  },
  {
    "id": 103,
    "name": "Trust Packers",
    "profession": "Packers & Movers",
    "experience": "8+ years",
    "rating": "4.4",
    "reviews": 270,
    "location": "Chandigarh",
    "price": "₹14443",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Local Moving",
      "Interstate",
      "International"
    ],
    "completedProjects": 789
  },
  {
    "id": 104,
    "name": "Swift Movers",
    "profession": "Packers & Movers",
    "experience": "15+ years",
    "rating": "4.3",
    "reviews": 330,
    "location": "Lucknow, Uttar Pradesh",
    "price": "₹14497",
    "priceType": "per move",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Packing",
      "Loading",
      "Insurance"
    ],
    "completedProjects": 1036
  },
  {
    "id": 105,
    "name": "PowerFix Electricians",
    "profession": "Electrician",
    "experience": "8+ years",
    "rating": "4.7",
    "reviews": 267,
    "location": "Mumbai, Maharashtra",
    "price": "₹430",
    "priceType": "per hour",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Wiring",
      "Repairs",
      "Installation"
    ],
    "completedProjects": 594
  },
  {
    "id": 106,
    "name": "Spark Electricals",
    "profession": "Electrician",
    "experience": "13+ years",
    "rating": "4.8",
    "reviews": 292,
    "location": "Delhi NCR",
    "price": "₹552",
    "priceType": "per hour",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "MCB",
      "Switchboard",
      "Lighting"
    ],
    "completedProjects": 509
  },
  {
    "id": 107,
    "name": "Volt Masters",
    "profession": "Electrician",
    "experience": "6+ years",
    "rating": "4.4",
    "reviews": 346,
    "location": "Bangalore, Karnataka",
    "price": "₹564",
    "priceType": "per hour",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Appliance Repair",
      "Fan Installation",
      "AC Wiring"
    ],
    "completedProjects": 727
  },
  {
    "id": 108,
    "name": "Current Experts",
    "profession": "Electrician",
    "experience": "7+ years",
    "rating": "4.9",
    "reviews": 346,
    "location": "Pune, Maharashtra",
    "price": "₹439",
    "priceType": "per hour",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Wiring",
      "Repairs",
      "Installation"
    ],
    "completedProjects": 415
  },
  {
    "id": 109,
    "name": "Wire Wizards",
    "profession": "Electrician",
    "experience": "8+ years",
    "rating": "4.9",
    "reviews": 172,
    "location": "Ahmedabad, Gujarat",
    "price": "₹625",
    "priceType": "per hour",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "MCB",
      "Switchboard",
      "Lighting"
    ],
    "completedProjects": 702
  },
  {
    "id": 110,
    "name": "Electric Pro",
    "profession": "Electrician",
    "experience": "8+ years",
    "rating": "4.8",
    "reviews": 151,
    "location": "Hyderabad, Telangana",
    "price": "₹532",
    "priceType": "per hour",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Appliance Repair",
      "Fan Installation",
      "AC Wiring"
    ],
    "completedProjects": 576
  },
  {
    "id": 111,
    "name": "Power Solutions",
    "profession": "Electrician",
    "experience": "9+ years",
    "rating": "4.8",
    "reviews": 212,
    "location": "Chennai, Tamil Nadu",
    "price": "₹619",
    "priceType": "per hour",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Wiring",
      "Repairs",
      "Installation"
    ],
    "completedProjects": 552
  },
  {
    "id": 112,
    "name": "Bright Electricians",
    "profession": "Electrician",
    "experience": "7+ years",
    "rating": "4.7",
    "reviews": 182,
    "location": "Kolkata, West Bengal",
    "price": "₹499",
    "priceType": "per hour",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "MCB",
      "Switchboard",
      "Lighting"
    ],
    "completedProjects": 694
  },
  {
    "id": 113,
    "name": "Circuit Masters",
    "profession": "Electrician",
    "experience": "9+ years",
    "rating": "4.8",
    "reviews": 150,
    "location": "Jaipur, Rajasthan",
    "price": "₹681",
    "priceType": "per hour",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Appliance Repair",
      "Fan Installation",
      "AC Wiring"
    ],
    "completedProjects": 434
  },
  {
    "id": 114,
    "name": "Electro Experts",
    "profession": "Electrician",
    "experience": "15+ years",
    "rating": "4.6",
    "reviews": 138,
    "location": "Kochi, Kerala",
    "price": "₹431",
    "priceType": "per hour",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Wiring",
      "Repairs",
      "Installation"
    ],
    "completedProjects": 500
  },
  {
    "id": 115,
    "name": "Wiring Pro",
    "profession": "Electrician",
    "experience": "11+ years",
    "rating": "4.6",
    "reviews": 181,
    "location": "Chandigarh",
    "price": "₹531",
    "priceType": "per hour",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "MCB",
      "Switchboard",
      "Lighting"
    ],
    "completedProjects": 549
  },
  {
    "id": 116,
    "name": "Voltage Experts",
    "profession": "Electrician",
    "experience": "9+ years",
    "rating": "4.8",
    "reviews": 230,
    "location": "Lucknow, Uttar Pradesh",
    "price": "₹512",
    "priceType": "per hour",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Appliance Repair",
      "Fan Installation",
      "AC Wiring"
    ],
    "completedProjects": 442
  },
  {
    "id": 117,
    "name": "ModernKitchen Designs",
    "profession": "Modular Kitchen",
    "experience": "9+ years",
    "rating": "4.6",
    "reviews": 216,
    "location": "Mumbai, Maharashtra",
    "price": "₹128233",
    "priceType": "per kitchen",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Modular Kitchen",
      "Wardrobes",
      "Custom Furniture"
    ],
    "completedProjects": 166
  },
  {
    "id": 118,
    "name": "Elite Furniture",
    "profession": "Modular Kitchen",
    "experience": "16+ years",
    "rating": "4.6",
    "reviews": 251,
    "location": "Delhi NCR",
    "price": "₹120467",
    "priceType": "per kitchen",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Kitchen Cabinets",
      "Storage Solutions",
      "Countertops"
    ],
    "completedProjects": 178
  },
  {
    "id": 119,
    "name": "Custom Kitchens",
    "profession": "Modular Kitchen",
    "experience": "13+ years",
    "rating": "4.6",
    "reviews": 186,
    "location": "Bangalore, Karnataka",
    "price": "₹136254",
    "priceType": "per kitchen",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "TV Units",
      "Crockery Units",
      "Study Tables"
    ],
    "completedProjects": 331
  },
  {
    "id": 120,
    "name": "Modular Masters",
    "profession": "Modular Kitchen",
    "experience": "15+ years",
    "rating": "4.7",
    "reviews": 208,
    "location": "Pune, Maharashtra",
    "price": "₹128452",
    "priceType": "per kitchen",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Modular Kitchen",
      "Wardrobes",
      "Custom Furniture"
    ],
    "completedProjects": 248
  },
  {
    "id": 121,
    "name": "Kitchen Kraft",
    "profession": "Modular Kitchen",
    "experience": "13+ years",
    "rating": "4.8",
    "reviews": 234,
    "location": "Ahmedabad, Gujarat",
    "price": "₹66074",
    "priceType": "per kitchen",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Kitchen Cabinets",
      "Storage Solutions",
      "Countertops"
    ],
    "completedProjects": 310
  },
  {
    "id": 122,
    "name": "Furniture Pro",
    "profession": "Modular Kitchen",
    "experience": "13+ years",
    "rating": "4.5",
    "reviews": 208,
    "location": "Hyderabad, Telangana",
    "price": "₹65936",
    "priceType": "per kitchen",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "TV Units",
      "Crockery Units",
      "Study Tables"
    ],
    "completedProjects": 230
  },
  {
    "id": 123,
    "name": "Design Kitchen",
    "profession": "Modular Kitchen",
    "experience": "11+ years",
    "rating": "4.9",
    "reviews": 165,
    "location": "Chennai, Tamil Nadu",
    "price": "₹87219",
    "priceType": "per kitchen",
    "verified": true,
    "available": false,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Modular Kitchen",
      "Wardrobes",
      "Custom Furniture"
    ],
    "completedProjects": 288
  },
  {
    "id": 124,
    "name": "Premium Modular",
    "profession": "Modular Kitchen",
    "experience": "16+ years",
    "rating": "4.8",
    "reviews": 116,
    "location": "Kolkata, West Bengal",
    "price": "₹87416",
    "priceType": "per kitchen",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Kitchen Cabinets",
      "Storage Solutions",
      "Countertops"
    ],
    "completedProjects": 398
  },
  {
    "id": 125,
    "name": "Kitchen Studio",
    "profession": "Modular Kitchen",
    "experience": "13+ years",
    "rating": "4.8",
    "reviews": 250,
    "location": "Jaipur, Rajasthan",
    "price": "₹111057",
    "priceType": "per kitchen",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "TV Units",
      "Crockery Units",
      "Study Tables"
    ],
    "completedProjects": 220
  },
  {
    "id": 126,
    "name": "Furniture Experts",
    "profession": "Modular Kitchen",
    "experience": "13+ years",
    "rating": "4.6",
    "reviews": 113,
    "location": "Kochi, Kerala",
    "price": "₹71938",
    "priceType": "per kitchen",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Modular Kitchen",
      "Wardrobes",
      "Custom Furniture"
    ],
    "completedProjects": 231
  },
  {
    "id": 127,
    "name": "Modular Solutions",
    "profession": "Modular Kitchen",
    "experience": "10+ years",
    "rating": "4.8",
    "reviews": 273,
    "location": "Chandigarh",
    "price": "₹116227",
    "priceType": "per kitchen",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Kitchen Cabinets",
      "Storage Solutions",
      "Countertops"
    ],
    "completedProjects": 325
  },
  {
    "id": 128,
    "name": "Kitchen Designers",
    "profession": "Modular Kitchen",
    "experience": "9+ years",
    "rating": "4.9",
    "reviews": 190,
    "location": "Lucknow, Uttar Pradesh",
    "price": "₹80808",
    "priceType": "per kitchen",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "TV Units",
      "Crockery Units",
      "Study Tables"
    ],
    "completedProjects": 187
  },
  {
    "id": 129,
    "name": "Precision Surveyors",
    "profession": "Surveyor",
    "experience": "12+ years",
    "rating": "4.9",
    "reviews": 82,
    "location": "Mumbai, Maharashtra",
    "price": "₹9653",
    "priceType": "per survey",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Land Survey",
      "Property Valuation",
      "Measurement"
    ],
    "completedProjects": 333
  },
  {
    "id": 130,
    "name": "Accurate Survey",
    "profession": "Surveyor",
    "experience": "17+ years",
    "rating": "4.7",
    "reviews": 86,
    "location": "Delhi NCR",
    "price": "₹11404",
    "priceType": "per survey",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Boundary Survey",
      "Topographic",
      "Construction Survey"
    ],
    "completedProjects": 387
  },
  {
    "id": 131,
    "name": "Land Experts",
    "profession": "Surveyor",
    "experience": "19+ years",
    "rating": "4.6",
    "reviews": 171,
    "location": "Bangalore, Karnataka",
    "price": "₹10430",
    "priceType": "per survey",
    "verified": true,
    "available": true,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Plot Demarcation",
      "Area Calculation",
      "Legal Survey"
    ],
    "completedProjects": 277
  },
  {
    "id": 132,
    "name": "Survey Masters",
    "profession": "Surveyor",
    "experience": "14+ years",
    "rating": "4.9",
    "reviews": 155,
    "location": "Pune, Maharashtra",
    "price": "₹11986",
    "priceType": "per survey",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "Gujarati",
      "English"
    ],
    "image": null,
    "specialties": [
      "Land Survey",
      "Property Valuation",
      "Measurement"
    ],
    "completedProjects": 337
  },
  {
    "id": 133,
    "name": "Property Surveyors",
    "profession": "Surveyor",
    "experience": "14+ years",
    "rating": "4.7",
    "reviews": 148,
    "location": "Ahmedabad, Gujarat",
    "price": "₹15029",
    "priceType": "per survey",
    "verified": true,
    "available": true,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Boundary Survey",
      "Topographic",
      "Construction Survey"
    ],
    "completedProjects": 283
  },
  {
    "id": 134,
    "name": "Expert Survey",
    "profession": "Surveyor",
    "experience": "14+ years",
    "rating": "4.8",
    "reviews": 138,
    "location": "Hyderabad, Telangana",
    "price": "₹14496",
    "priceType": "per survey",
    "verified": true,
    "available": true,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Plot Demarcation",
      "Area Calculation",
      "Legal Survey"
    ],
    "completedProjects": 528
  },
  {
    "id": 135,
    "name": "Measurement Pro",
    "profession": "Surveyor",
    "experience": "20+ years",
    "rating": "4.8",
    "reviews": 86,
    "location": "Chennai, Tamil Nadu",
    "price": "₹14877",
    "priceType": "per survey",
    "verified": true,
    "available": true,
    "languages": [
      "Bengali",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Land Survey",
      "Property Valuation",
      "Measurement"
    ],
    "completedProjects": 473
  },
  {
    "id": 136,
    "name": "Survey Specialists",
    "profession": "Surveyor",
    "experience": "13+ years",
    "rating": "4.9",
    "reviews": 133,
    "location": "Kolkata, West Bengal",
    "price": "₹12658",
    "priceType": "per survey",
    "verified": true,
    "available": true,
    "languages": [
      "Malayalam",
      "English",
      "Hindi"
    ],
    "image": null,
    "specialties": [
      "Boundary Survey",
      "Topographic",
      "Construction Survey"
    ],
    "completedProjects": 428
  },
  {
    "id": 137,
    "name": "Land Survey Co.",
    "profession": "Surveyor",
    "experience": "17+ years",
    "rating": "4.5",
    "reviews": 121,
    "location": "Jaipur, Rajasthan",
    "price": "₹15889",
    "priceType": "per survey",
    "verified": true,
    "available": false,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "image": null,
    "specialties": [
      "Plot Demarcation",
      "Area Calculation",
      "Legal Survey"
    ],
    "completedProjects": 368
  },
  {
    "id": 138,
    "name": "Valuation Experts",
    "profession": "Surveyor",
    "experience": "20+ years",
    "rating": "4.6",
    "reviews": 91,
    "location": "Kochi, Kerala",
    "price": "₹8451",
    "priceType": "per survey",
    "verified": true,
    "available": true,
    "languages": [
      "Hindi",
      "English"
    ],
    "image": null,
    "specialties": [
      "Land Survey",
      "Property Valuation",
      "Measurement"
    ],
    "completedProjects": 510
  }
]

// Category mapping
export const categoryMapping: Record<string, string[]> = {
  'lawyer': ['Property Lawyer'],
  'architect': ['Architect'],
  'interior-designer': ['Interior Designer'],
  'painter': ['Painter'],
  'contractor': ['Civil Contractor'],
  'inspector': ['Property Inspector'],
  'movers': ['Packers & Movers'],
  'electrician': ['Electrician'],
  'furniture': ['Modular Kitchen'],
  'surveyor': ['Surveyor'],
}

// Get providers by category
export function getProvidersByCategory(category: string): Provider[] {
  if (category === 'all') {
    return allProviders
  }
  
  const professions = categoryMapping[category] || []
  return allProviders.filter(provider => 
    professions.some(prof => provider.profession.toLowerCase().includes(prof.toLowerCase()))
  )
}
