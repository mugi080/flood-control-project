'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { FloodZone, DemonstrationMunicipality } from '@flood-control/shared';
import { MapLoadingState } from '../common/StateViews';

interface FloodMapWrapperProps {
  municipality: DemonstrationMunicipality;
  zones: FloodZone[];
  selectedZoneId: string | null;
  onSelectZone: (zoneId: string | null) => void;
}

// Next.js client-only dynamic boundary to prevent Leaflet SSR "window is not defined" errors
const DynamicFloodMap = dynamic(
  () => import('./FloodMap').then((mod) => mod.FloodMap),
  {
    ssr: false,
    loading: () => <MapLoadingState />,
  }
);

export function FloodMapWrapper(props: FloodMapWrapperProps) {
  return <DynamicFloodMap {...props} />;
}
