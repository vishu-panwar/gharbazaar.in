'use client'

import PropertyDetailView from '@/components/PropertyDetailView'

export default function DashboardBrowseDetailPage() {
  return <PropertyDetailView isDashboard={true} backPath="/dashboard/browse" />
}