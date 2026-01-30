'use client'

import PropertyDetailView from '@/components/PropertyDetailView'

export default function DashboardListingDetailPage() {
  return <PropertyDetailView isDashboard={true} backPath="/dashboard/listings" />
}