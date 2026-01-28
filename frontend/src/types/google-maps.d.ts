declare global {
  interface Window {
    google: typeof google
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element | null, opts?: MapOptions)
      panTo(latLng: LatLng | LatLngLiteral): void
      setZoom(zoom: number): void
      setCenter(latLng: LatLng | LatLngLiteral): void
      fitBounds(bounds: LatLngBounds): void
    }

    class LatLngBounds {
      constructor()
      extend(point: LatLng | LatLngLiteral): LatLngBounds
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral
      zoom?: number
      styles?: MapTypeStyle[]
    }

    interface MapTypeStyle {
      featureType?: string
      elementType?: string
      stylers?: MapTypeStyler[]
    }

    interface MapTypeStyler {
      visibility?: string
    }

    class Marker {
      constructor(opts?: MarkerOptions)
      addListener(eventName: string, handler: () => void): void
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral
      map?: Map
      title?: string
      icon?: string | Icon | Symbol
    }

    interface Icon {
      url: string
      scaledSize?: Size
      anchor?: Point
    }

    class Size {
      constructor(width: number, height: number)
    }

    class Point {
      constructor(x: number, y: number)
    }

    interface LatLng {
      lat(): number
      lng(): number
    }

    interface LatLngLiteral {
      lat: number
      lng: number
    }
  }
}

export {}