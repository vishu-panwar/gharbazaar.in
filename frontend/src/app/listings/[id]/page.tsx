'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PropertyDetailView from '@/components/PropertyDetailView'

export default function ListingDetailPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  useEffect(() => {
    // If user is authenticated and we're on the public route, redirect to dashboard
    if (!loading && user) {
      router.replace(`/dashboard/browse/${id}`)
    }
  }, [user, loading, id, router])

  return <PropertyDetailView backPath="/listings" />
}
