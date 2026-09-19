export const formatNumber = (num?: number, decimals: number = 2): string => {
  if (num === undefined || num === null || isNaN(num)) return '0.00';
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatHectares = (ha?: number): string => {
  if (ha === undefined || ha === null) return '0 ha';
  if (ha >= 1000) {
    return `${(ha / 1000).toFixed(1)}k ha`;
  }
  return `${ha.toFixed(1)} ha`;
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const formatMonth = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
  } catch {
    return dateStr;
  }
};
