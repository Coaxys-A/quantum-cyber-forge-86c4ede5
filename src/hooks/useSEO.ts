import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { seoEngine } from '@/lib/seo-engine';
import { useToast } from './use-toast';

export function useSEO() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: audits, isLoading: auditsLoading } = useQuery({
    queryKey: ['seo-audits'],
    queryFn: async () => {
      const { data: profile } = await supabase.from('profiles').select('tenant_id').single();
      if (!profile?.tenant_id) throw new Error('No tenant found');

      const { data, error } = await supabase
        .from('seo_audits')
        .select('*')
        .eq('tenant_id', profile.tenant_id)
        .order('scanned_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const scanPageMutation = useMutation({
    mutationFn: async (url: string) => {
      const { data: profile } = await supabase.from('profiles').select('tenant_id').single();
      if (!profile?.tenant_id) throw new Error('No tenant found');

      return await seoEngine.scanPage(url, profile.tenant_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seo-audits'] });
      toast({ title: 'Success', description: 'SEO scan completed' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  return {
    audits,
    auditsLoading,
    scanPage: scanPageMutation.mutate,
    isScanning: scanPageMutation.isPending,
  };
}
