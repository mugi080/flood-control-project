'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AddCommentIcon from '@mui/icons-material/AddComment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';
import BlockIcon from '@mui/icons-material/Block';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import {
  FloodZone,
  WaterDepthLevel,
  SubmitReportPayload,
} from '@flood-control/shared';
import { submitZoneVote, submitCitizenReport } from '../../services/floodDataService';

interface CitizenValidationWidgetProps {
  zone: FloodZone;
  onZoneUpdated: () => void;
}

const DEPTH_OPTIONS: { label: string; value: WaterDepthLevel; color: string; desc: string }[] = [
  { label: 'Passable / Dry', value: 'passable_dry', color: '#2E7D32', desc: 'No standing water' },
  { label: 'Gutter-Deep', value: 'gutter_deep', color: '#0288D1', desc: '~20 cm (passable for cars)' },
  { label: 'Knee-Deep', value: 'knee_deep', color: '#ED6C02', desc: '~50 cm (passable only for trucks)' },
  { label: 'Waist-Deep', value: 'waist_deep', color: '#D32F2F', desc: '~1.0 m (impassable for all vehicles)' },
  { label: 'Submerged', value: 'submerged', color: '#7B1FA2', desc: '> 1.5 m (extreme current / danger)' },
];

function formatTimeAgo(isoString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recent';
  }
}

export function CitizenValidationWidget({ zone, onZoneUpdated }: CitizenValidationWidgetProps) {
  const [voted, setVoted] = React.useState<'confirm' | 'dispute' | null>(null);
  const [votingLoading, setVotingLoading] = React.useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [submittingReport, setSubmittingReport] = React.useState<boolean>(false);

  // Form State
  const [selectedDepth, setSelectedDepth] = React.useState<WaterDepthLevel>('knee_deep');
  const [isPassable, setIsPassable] = React.useState<boolean>(false);
  const [comment, setComment] = React.useState<string>('');
  const [landmark, setLandmark] = React.useState<string>('');
  const [reporterName, setReporterName] = React.useState<string>('');

  const validation = zone.communityValidation;
  const totalVotes = validation.confirmCount + validation.disputeCount;
  const isHighConsensus = validation.consensusPercentage >= 85 && totalVotes >= 5;

  const handleVote = async (type: 'confirm' | 'dispute') => {
    if (votingLoading || voted) return;
    setVotingLoading(true);
    try {
      await submitZoneVote(zone.id, type);
      setVoted(type);
      onZoneUpdated();
    } catch {
      // Ignore
    } finally {
      setVotingLoading(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmittingReport(true);
    try {
      const payload: SubmitReportPayload = {
        waterDepth: selectedDepth,
        isPassableForVehicles: isPassable,
        comment: comment.trim(),
        landmark: landmark.trim() || undefined,
        reporterName: reporterName.trim() || undefined,
      };
      await submitCitizenReport(zone.id, payload);
      setDialogOpen(false);
      setComment('');
      setLandmark('');
      setReporterName('');
      onZoneUpdated();
    } catch {
      // Ignore
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {/* Community Accuracy Card */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
          bgcolor: '#F8FAFC',
          borderColor: 'rgba(11, 37, 69, 0.12)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <VerifiedUserIcon
                sx={{
                  fontSize: 18,
                  color: isHighConsensus ? '#2E7D32' : '#0288D1',
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                Citizen Crowd-Validation
              </Typography>
            </Stack>

            <Chip
              label={
                isHighConsensus
                  ? `Community Verified (${validation.consensusPercentage}%)`
                  : `${validation.consensusPercentage}% Agreement`
              }
              size="small"
              sx={{
                fontWeight: 700,
                fontSize: '0.68rem',
                bgcolor: isHighConsensus ? '#E8F5E9' : '#E3F2FD',
                color: isHighConsensus ? '#2E7D32' : '#0277BD',
                border: '1px solid',
                borderColor: isHighConsensus ? '#A5D6A7' : '#90CAF9',
              }}
            />
          </Stack>

          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5, fontSize: '0.74rem' }}>
            Lucena City residents act as ground validators. Does this barangay alert match real conditions?
          </Typography>

          {/* Validation Ratio Bar */}
          <Box sx={{ mb: 1.5 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#2E7D32' }}>
                {validation.confirmCount} Confirmed Accurate
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#D32F2F' }}>
                {validation.disputeCount} Disputed
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={validation.consensusPercentage}
              sx={{
                height: 7,
                borderRadius: 4,
                bgcolor: '#FFCDD2',
                '& .MuiLinearProgress-bar': { bgcolor: '#2E7D32' },
              }}
            />
          </Box>

          {/* Voting Action Buttons */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              size="small"
              variant={voted === 'confirm' ? 'contained' : 'outlined'}
              color="success"
              startIcon={<ThumbUpIcon sx={{ fontSize: 15 }} />}
              onClick={() => handleVote('confirm')}
              disabled={votingLoading || voted !== null}
              sx={{
                flex: 1,
                fontSize: '0.75rem',
                py: 0.6,
                fontWeight: 600,
              }}
            >
              {voted === 'confirm' ? 'Confirmed!' : `Confirm (${validation.confirmCount})`}
            </Button>

            <Button
              size="small"
              variant={voted === 'dispute' ? 'contained' : 'outlined'}
              color="error"
              startIcon={<ThumbDownIcon sx={{ fontSize: 15 }} />}
              onClick={() => handleVote('dispute')}
              disabled={votingLoading || voted !== null}
              sx={{
                flex: 1,
                fontSize: '0.75rem',
                py: 0.6,
                fontWeight: 600,
              }}
            >
              {voted === 'dispute' ? 'Disputed!' : `Dispute (${validation.disputeCount})`}
            </Button>
          </Stack>

          {voted && (
            <Box
              sx={{
                p: 1,
                mb: 1.5,
                bgcolor: voted === 'confirm' ? '#E8F5E9' : '#FFEBEE',
                borderRadius: 1.5,
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 600, color: voted === 'confirm' ? '#2E7D32' : '#C62828' }}>
                {voted === 'confirm'
                  ? 'Salamat sa pag-validate! Your feedback reinforces accurate barangay telemetry.'
                  : 'Salamat! Your dispute report prompts CDRRMO ground inspection.'}
              </Typography>
            </Box>
          )}

          {/* Button to open Ground Report Modal */}
          <Button
            size="small"
            variant="contained"
            fullWidth
            startIcon={<AddCommentIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              bgcolor: '#0B2545',
              fontSize: '0.75rem',
              py: 0.75,
              '&:hover': { bgcolor: '#134074' },
            }}
          >
            Add Ground Report for Brgy. {zone.barangay}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Field Reports Feed */}
      {zone.recentReports && zone.recentReports.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary', letterSpacing: '0.05em' }}>
              Citizen Field Observations ({zone.recentReports.length})
            </Typography>
          </Stack>

          <Stack spacing={1}>
            {zone.recentReports.map((rep) => {
              const depthOpt = DEPTH_OPTIONS.find((d) => d.value === rep.waterDepth);
              return (
                <Card
                  key={rep.id}
                  variant="outlined"
                  sx={{
                    p: 1.25,
                    borderRadius: 1.5,
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Stack direction="row" spacing={0.75} alignItems="center">
                      <Chip
                        label={depthOpt?.label || rep.waterDepth}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 20,
                          bgcolor: `${depthOpt?.color}18`,
                          color: depthOpt?.color || '#0B2545',
                          border: `1px solid ${depthOpt?.color}50`,
                        }}
                      />
                      <Chip
                        icon={
                          rep.isPassableForVehicles ? (
                            <DirectionsCarFilledIcon sx={{ fontSize: '13px !important' }} />
                          ) : (
                            <BlockIcon sx={{ fontSize: '13px !important' }} />
                          )
                        }
                        label={rep.isPassableForVehicles ? 'Vehicles Passable' : 'Not Passable'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.62rem',
                          height: 20,
                          bgcolor: rep.isPassableForVehicles ? '#E8F5E9' : '#FFEBEE',
                          color: rep.isPassableForVehicles ? '#2E7D32' : '#C62828',
                        }}
                      />
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                        {formatTimeAgo(rep.timestamp)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Typography variant="body2" sx={{ fontSize: '0.78rem', color: '#1E293B', mb: 0.5, lineHeight: 1.35 }}>
                    "{rep.comment}"
                  </Typography>

                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      {rep.landmark && (
                        <Stack direction="row" alignItems="center" spacing={0.3}>
                          <LocationOnIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
                            {rep.landmark} &bull;
                          </Typography>
                        </Stack>
                      )}
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', fontWeight: 600 }}>
                        {rep.reporterName}
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Ground Report Submission Modal Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !submittingReport && setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2.5 } }}
      >
        <form onSubmit={handleReportSubmit}>
          <DialogTitle sx={{ pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Submit Citizen Ground Report
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Contribute verified ground observation for <strong>Brgy. {zone.barangay}</strong>, Lucena City.
            </Typography>
          </DialogTitle>

          <DialogContent dividers sx={{ py: 2 }}>
            <Stack spacing={2.5}>
              {/* Depth Selector */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, fontSize: '0.85rem' }}>
                  Current Flood Depth Level
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {DEPTH_OPTIONS.map((opt) => {
                    const isSelected = selectedDepth === opt.value;
                    return (
                      <Chip
                        key={opt.value}
                        label={`${opt.label} (${opt.desc})`}
                        onClick={() => setSelectedDepth(opt.value)}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          height: 30,
                          bgcolor: isSelected ? opt.color : undefined,
                          color: isSelected ? '#FFFFFF' : opt.color,
                          borderColor: opt.color,
                          cursor: 'pointer',
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>

              {/* Passability Switch */}
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#F8FAFC',
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPassable}
                      onChange={(e) => setIsPassable(e.target.checked)}
                      color="success"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {isPassable ? 'Roads are PASSABLE for ordinary vehicles' : 'Roads are IMPASSABLE for ordinary vehicles'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {isPassable
                          ? 'Light cars and tricycles can still traverse cautiously.'
                          : 'High water levels or strong current prevent safe vehicular passage.'}
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              {/* Landmark Input */}
              <TextField
                label="Specific Landmark or Street (Optional)"
                placeholder="e.g. Near Cotta Ferry Pier, Merchan Bridge, Purok Ilaya"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                size="small"
                fullWidth
              />

              {/* Observation Note */}
              <TextField
                label="Ground Observation & Details"
                placeholder="Describe current road conditions, water flow, or evacuation activity..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                rows={3}
                size="small"
                required
                fullWidth
                helperText="Be objective. This information assists fellow Lucenahin and emergency teams."
              />

              {/* Reporter Name */}
              <TextField
                label="Your Name or Resident Handle (Optional)"
                placeholder="e.g. Kuya Rey (Resident), Ate Joy (Vendor)"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                size="small"
                fullWidth
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setDialogOpen(false)} disabled={submittingReport}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submittingReport || !comment.trim()}
              sx={{ bgcolor: '#0B2545', fontWeight: 600 }}
            >
              {submittingReport ? 'Submitting...' : 'Post Observation'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
