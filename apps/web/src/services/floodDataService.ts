import {
  MOCK_DATA_BUNDLE,
  MockDataResponse,
  CommunityReport,
  SubmitVotePayload,
  SubmitReportPayload,
  CommunityValidation,
} from '@flood-control/shared';

// In-memory fallback cache for client session
let clientCacheBundle: MockDataResponse = JSON.parse(JSON.stringify(MOCK_DATA_BUNDLE));

export async function fetchFloodData(): Promise<MockDataResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  if (apiUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${apiUrl}/api/v1/flood-zones`, {
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as MockDataResponse;
        clientCacheBundle = data;
        return data;
      }
    } catch {
      // API not reachable, use client fallback cache
    }
  }

  return clientCacheBundle;
}

export async function submitZoneVote(
  zoneId: string,
  type: 'confirm' | 'dispute'
): Promise<{ success: boolean; communityValidation: CommunityValidation }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  try {
    const res = await fetch(`${apiUrl}/api/v1/flood-zones/${zoneId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type } as SubmitVotePayload),
    });

    if (res.ok) {
      const data = await res.json();
      // Sync cache
      const zone = clientCacheBundle.zones.find((z) => z.id === zoneId);
      if (zone) {
        zone.communityValidation = data.communityValidation;
      }
      return data;
    }
  } catch {
    // Local fallback update
  }

  // Fallback update in client cache
  const zone = clientCacheBundle.zones.find((z) => z.id === zoneId);
  if (!zone) {
    throw new Error(`Zone ${zoneId} not found.`);
  }

  if (type === 'confirm') {
    zone.communityValidation.confirmCount += 1;
  } else {
    zone.communityValidation.disputeCount += 1;
  }
  const total = zone.communityValidation.confirmCount + zone.communityValidation.disputeCount;
  zone.communityValidation.consensusPercentage = Math.round(
    (zone.communityValidation.confirmCount / total) * 100
  );
  zone.communityValidation.lastValidatedAt = new Date().toISOString();

  return { success: true, communityValidation: zone.communityValidation };
}

export async function submitCitizenReport(
  zoneId: string,
  payload: SubmitReportPayload
): Promise<{ success: boolean; report: CommunityReport; communityValidation: CommunityValidation }> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  try {
    const res = await fetch(`${apiUrl}/api/v1/flood-zones/${zoneId}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const zone = clientCacheBundle.zones.find((z) => z.id === zoneId);
      if (zone) {
        zone.communityValidation = data.communityValidation;
        zone.recentReports = data.recentReports;
      }
      return data;
    }
  } catch {
    // Fallback update
  }

  const zone = clientCacheBundle.zones.find((z) => z.id === zoneId);
  if (!zone) {
    throw new Error(`Zone ${zoneId} not found.`);
  }

  const newReport: CommunityReport = {
    id: `rep-client-${Date.now()}`,
    zoneId,
    barangay: zone.barangay,
    waterDepth: payload.waterDepth,
    isPassableForVehicles: payload.isPassableForVehicles,
    comment: payload.comment,
    landmark: payload.landmark || 'Barangay Roadway',
    reporterName: payload.reporterName || 'Citizen Validator',
    timestamp: new Date().toISOString(),
    upvotes: 1,
  };

  zone.recentReports.unshift(newReport);
  zone.communityValidation.confirmCount += 1;
  const total = zone.communityValidation.confirmCount + zone.communityValidation.disputeCount;
  zone.communityValidation.consensusPercentage = Math.round(
    (zone.communityValidation.confirmCount / total) * 100
  );
  zone.communityValidation.lastValidatedAt = new Date().toISOString();

  return {
    success: true,
    report: newReport,
    communityValidation: zone.communityValidation,
  };
}
