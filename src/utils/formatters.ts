/** Shared formatting utilities */

export const STREAM_GRADIENTS = [
  'linear-gradient(135deg,#febd56,#d4962e)',
  'linear-gradient(135deg,#1a9fff,#0057c8)',
  'linear-gradient(135deg,#ff4d6a,#a01030)',
  'linear-gradient(135deg,#00c8a0,#007a63)',
  'linear-gradient(135deg,#ff9f00,#c86f00)',
];

export const gradientFor = (id: number): { background: string } => ({
  background: STREAM_GRADIENTS[id % STREAM_GRADIENTS.length],
});

export const initials = (name: string): string =>
  (name || '?').slice(0, 2).toUpperCase();

export const formatViewers = (n = 0): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === '') return '0.00';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  return isNaN(n) ? '0.00' : n.toFixed(2);
};

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
