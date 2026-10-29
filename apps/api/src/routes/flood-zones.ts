import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import {
  MOCK_DATA_BUNDLE,
  MOCK_FLOOD_ZONES,
  MockDataResponse,
  FloodZone,
  CommunityReport,
  SubmitVotePayload,
  SubmitReportPayload,
} from '@flood-control/shared';

// Mutable in-memory store for active session validation and reports
const zonesState: FloodZone[] = JSON.parse(JSON.stringify(MOCK_FLOOD_ZONES));

const voteSchema = {
  description: 'Submit community confirmation or dispute vote for a barangay flood alert',
  tags: ['Citizen Validation'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 1 },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['confirm', 'dispute'] },
    },
    required: ['type'],
  },
};

const reportSchema = {
  description: 'Submit a citizen field observation report for a specific barangay',
  tags: ['Citizen Validation'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 1 },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      waterDepth: {
        type: 'string',
        enum: ['passable_dry', 'gutter_deep', 'knee_deep', 'waist_deep', 'submerged'],
      },
      isPassableForVehicles: { type: 'boolean' },
      comment: { type: 'string', minLength: 3, maxLength: 500 },
      landmark: { type: 'string', maxLength: 100 },
      reporterName: { type: 'string', maxLength: 50 },
    },
    required: ['waterDepth', 'isPassableForVehicles', 'comment'],
  },
};

export const floodZoneRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET all zones with latest validation stats
  fastify.get<{ Reply: MockDataResponse }>(
    '/api/v1/flood-zones',
    async (_request, reply) => {
      const response: MockDataResponse = {
        municipality: MOCK_DATA_BUNDLE.municipality,
        zones: zonesState,
        alerts: zonesState.map((z) => ({
          id: `alert-${z.id}`,
          zoneId: z.id,
          zoneCode: z.code,
          zoneName: z.name,
          barangay: z.barangay,
          severity: z.severity,
          status: z.status,
          headline: z.headline,
          affectedAreaDescription: `${z.areaSquareKm} km² (${z.landAreaHectares} ha) • ~${z.affectedPopulationEstimate.toLocaleString()} est. residents`,
          areaSquareKm: z.areaSquareKm,
          landAreaHectares: z.landAreaHectares,
          populationDensity: z.populationDensity,
          floodRiskIndex: z.floodRiskIndex,
          issuedAt: z.issuedAt,
          expiresAt: z.expiresAt,
          communityValidation: z.communityValidation,
          isSimulated: true,
        })),
        generatedAt: new Date().toISOString(),
        disclaimer: MOCK_DATA_BUNDLE.disclaimer,
      };

      return reply.code(200).send(response);
    }
  );

  // GET single zone
  fastify.get<{ Params: { id: string } }>(
    '/api/v1/flood-zones/:id',
    async (request, reply) => {
      const { id } = request.params;
      const zone = zonesState.find(
        (z) => z.id === id || z.code.toLowerCase() === id.toLowerCase()
      );

      if (!zone) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Barangay flood zone with id "${id}" was not found in Lucena City dataset.`,
        });
      }

      return reply.code(200).send(zone);
    }
  );

  // POST vote (Agree / Dispute)
  fastify.get<{ Params: { id: string } }>(
    '/api/v1/flood-zones/:id/reports',
    async (request, reply) => {
      const { id } = request.params;
      const zone = zonesState.find((z) => z.id === id);

      if (!zone) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Barangay flood zone with id "${id}" not found.`,
        });
      }

      return reply.code(200).send(zone.recentReports);
    }
  );

  // POST vote (Agree / Confirm vs Dispute)
  fastify.post<{ Params: { id: string }; Body: SubmitVotePayload }>(
    '/api/v1/flood-zones/:id/vote',
    { schema: voteSchema },
    async (request, reply) => {
      const { id } = request.params;
      const { type } = request.body;
      const zone = zonesState.find((z) => z.id === id);

      if (!zone) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Barangay flood zone with id "${id}" not found.`,
        });
      }

      if (type === 'confirm') {
        zone.communityValidation.confirmCount += 1;
      } else {
        zone.communityValidation.disputeCount += 1;
      }

      const totalVotes =
        zone.communityValidation.confirmCount + zone.communityValidation.disputeCount;
      zone.communityValidation.consensusPercentage = Math.round(
        (zone.communityValidation.confirmCount / totalVotes) * 100
      );
      zone.communityValidation.lastValidatedAt = new Date().toISOString();

      return reply.code(200).send({
        success: true,
        zoneId: zone.id,
        communityValidation: zone.communityValidation,
      });
    }
  );

  // POST citizen ground observation report
  fastify.post<{ Params: { id: string }; Body: SubmitReportPayload }>(
    '/api/v1/flood-zones/:id/reports',
    { schema: reportSchema },
    async (request, reply) => {
      const { id } = request.params;
      const { waterDepth, isPassableForVehicles, comment, landmark, reporterName } =
        request.body;
      const zone = zonesState.find((z) => z.id === id);

      if (!zone) {
        return reply.code(404).send({
          statusCode: 404,
          error: 'Not Found',
          message: `Barangay flood zone with id "${id}" not found.`,
        });
      }

      const newReport: CommunityReport = {
        id: `rep-${Date.now()}`,
        zoneId: zone.id,
        barangay: zone.barangay,
        waterDepth,
        isPassableForVehicles,
        comment,
        landmark: landmark || 'Lucena City Community Landmark',
        reporterName: reporterName || 'Anonymous Lucenahin Validator',
        timestamp: new Date().toISOString(),
        upvotes: 1,
      };

      // Prepend to recent reports
      zone.recentReports.unshift(newReport);

      // Submitting a report also counts as a community confirmation signal
      zone.communityValidation.confirmCount += 1;
      const total =
        zone.communityValidation.confirmCount + zone.communityValidation.disputeCount;
      zone.communityValidation.consensusPercentage = Math.round(
        (zone.communityValidation.confirmCount / total) * 100
      );
      zone.communityValidation.lastValidatedAt = new Date().toISOString();

      return reply.code(201).send({
        success: true,
        report: newReport,
        communityValidation: zone.communityValidation,
        recentReports: zone.recentReports,
      });
    }
  );
};
