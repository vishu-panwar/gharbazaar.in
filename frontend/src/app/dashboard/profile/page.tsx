'use client'

import { useState, useEffect } from 'react'
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Camera,
  Save,
  X,
  CheckCircle,
  Award,
  Home,
  Heart,
  Gavel,
  MessageCircle,
  Star,
  TrendingUp,
  Shield,
  Verified
} from 'lucide-react'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    preferences: {
      propertyType: 'apartment',
      budget: '50-100',
      location: 'mumbai'
    }
  })

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '+91 98765 43210',
          location: userData.location || 'Mumbai, Maharashtra',
          bio: userData.bio || 'Looking for my dream property',
          preferences: userData.preferences || {
            propertyType: 'apartment',
            budget: '50-100',
            location: 'mumbai'
          }
        })
      } catch (error) {
        console.error('Error parsing user:', error)
      }
    }
  }, [])

  const handleSave = () => {
    // Save profile updates
    const updatedUser = { ...user, ...formData }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
    setIsEditing(false)
  }

  const stats = [
    { label: 'Properties Viewed', value: '247', icon: Home, color: 'blue' },
    { label: 'Favorites', value: '32', icon: Heart, color: 'red' },
    { label: 'Active Bids', value: '9', icon: Gavel, color: 'orange' },
    { label: 'Messages', value: '156', icon: MessageCircle, color: 'green' }
  ]

  const achievements = [
    { title: 'Early Adopter', description: 'Joined in the first month', icon: Award, color: 'purple' },
    { title: 'Active Buyer', description: 'Viewed 100+ properties', icon: TrendingUp, color: 'blue' },
    { title: 'Verified User', description: 'Profile verified', icon: CheckCircle, color: 'green' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <User className="mr-3 text-blue-500" size={28} />
          My Profile
        </h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
          >
            <Edit size={18} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              <Save size={18} />
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              <X size={18} />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            {/* Avatar */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {formData.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all">
                  <Camera size={18} />
                </button>
              )}
              <div className="absolute top-0 right-0 w-8 h-8 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full flex items-center justify-center">
                <Verified size={16} className="text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {formData.name || 'User'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {formData.email}
              </p>
              <div className="inline-flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                <Shield size={12} />
                <span>Verified Buyer</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}>
                      <stat.icon size={18} className={`text-${stat.color}-600`} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stat.label}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Member Since */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={16} className="mr-2" />
                <span>Member since November 2024</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Award className="mr-2 text-yellow-500" size={20} />
              Achievements
            </h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`w-10 h-10 bg-${achievement.color}-100 dark:bg-${achievement.color}-900/30 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <achievement.icon size={18} className={`text-${achievement.color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <User size={18} className="text-gray-400" />
                    <span>{formData.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <Mail size={18} className="text-gray-400" />
                  <span>{formData.email}</span>
                  <CheckCircle size={16} className="text-green-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <Phone size={18} className="text-gray-400" />
                    <span>{formData.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <MapPin size={18} className="text-gray-400" />
                    <span>{formData.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{formData.bio}</p>
              )}
            </div>
          </div>

          {/* Property Preferences */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Property Preferences
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type
                </label>
                {isEditing ? (
                  <select
                    value={formData.preferences.propertyType}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, propertyType: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="house">House</option>
                    <option value="plot">Plot</option>
                  </select>
                ) : (
                  <p className="text-gray-900 dark:text-white capitalize">{formData.preferences.propertyType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Range
                </label>
                {isEditing ? (
                  <select
                    value={formData.preferences.budget}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, budget: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0-50">Under ₹50L</option>
                    <option value="50-100">₹50L - ₹1Cr</option>
                    <option value="100-500">₹1Cr - ₹5Cr</option>
                    <option value="500+">Above ₹5Cr</option>
                  </select>
                ) : (
                  <p className="text-gray-900 dark:text-white">
                    {formData.preferences.budget === '0-50' && 'Under ₹50L'}
                    {formData.preferences.budget === '50-100' && '₹50L - ₹1Cr'}
                    {formData.preferences.budget === '100-500' && '₹1Cr - ₹5Cr'}
                    {formData.preferences.budget === '500+' && 'Above ₹5Cr'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preferred Location
                </label>
                {isEditing ? (
                  <select
                    value={formData.preferences.location}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      preferences: { ...formData.preferences, location: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mumbai">Mumbai</option>
                    <option value="bangalore">Bangalore</option>
                    <option value="delhi">Delhi NCR</option>
                    <option value="pune">Pune</option>
                  </select>
                ) : (
                  <p className="text-gray-900 dark:text-white capitalize">{formData.preferences.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Rating & Reviews
            </h3>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">4.8</div>
                <div className="flex items-center space-x-1 text-yellow-500 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} className="fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Based on 24 reviews</p>
              </div>
              
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{rating}★</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${rating === 5 ? 80 : rating === 4 ? 15 : 5}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                      {rating === 5 ? 19 : rating === 4 ? 4 : 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
