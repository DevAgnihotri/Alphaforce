'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateClientPDF, ClientPDFData, PredictionData } from '@/lib/pdfGenerator';

interface ExportSummaryButtonProps {
  client: ClientPDFData;
  predictions?: PredictionData[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export function ExportSummaryButton({
  client,
  predictions = [],
  variant = 'outline',
  size = 'default',
  showText = true,
}: ExportSummaryButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await generateClientPDF(client, predictions);
      toast.success(`PDF exported for ${client.name}`);
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error('Failed to export PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileText className="h-4 w-4" />
      )}
      {showText && <span className="ml-2">{loading ? 'Exporting...' : 'Export PDF'}</span>}
    </Button>
  );
}
