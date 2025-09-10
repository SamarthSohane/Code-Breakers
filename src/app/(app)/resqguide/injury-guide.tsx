'use client';

import { useState, useEffect } from 'react';
import { getCommonInjuriesAction, getFirstAidGuideAction } from './actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InjuryGuideProps {
  animal: string;
  onBack: () => void;
}

export default function InjuryGuide({ animal, onBack }: InjuryGuideProps) {
  const [injuries, setInjuries] = useState<string[]>([]);
  const [selectedInjury, setSelectedInjury] = useState<string | null>(null);
  const [guide, setGuide] = useState<string | null>(null);
  const [isLoadingInjuries, setIsLoadingInjuries] = useState(true);
  const [isLoadingGuide, setIsLoadingGuide] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchInjuries() {
      setIsLoadingInjuries(true);
      setError(null);
      const result = await getCommonInjuriesAction({ animal });
      if (result.success) {
        setInjuries(result.data.injuries || []);
      } else {
        setError(result.error);
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      }
      setIsLoadingInjuries(false);
    }
    fetchInjuries();
  }, [animal, toast]);

  const handleInjurySelect = async (injury: string) => {
    setSelectedInjury(injury);
    setIsLoadingGuide(true);
    setGuide(null);
    setError(null);
    const result = await getFirstAidGuideAction({ animal, injury });
    if (result.success) {
      setGuide(result.data.guide);
    } else {
      setError(result.error);
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
    setIsLoadingGuide(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
       <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to animal selection
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>First-Aid Guide for a {animal}</CardTitle>
          <CardDescription>Select a common issue to get a first-aid guide.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingInjuries ? (
            <Skeleton className="h-10 w-full" />
          ) : error && injuries.length === 0 ? (
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <Select onValueChange={handleInjurySelect} disabled={injuries.length === 0}>
              <SelectTrigger>
                <SelectValue placeholder="Select an injury or ailment..." />
              </SelectTrigger>
              <SelectContent>
                {injuries.map((injury) => (
                  <SelectItem key={injury} value={injury}>
                    {injury}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {isLoadingGuide && <GuideSkeleton />}

          {guide && (
             <div className="prose prose-sm md:prose-base max-w-none p-4 border rounded-lg bg-muted/50">
                <div dangerouslySetInnerHTML={{ __html: guide.replace(/\n/g, '<br />') }} />
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


const GuideSkeleton = () => (
    <div className="space-y-4 pt-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
         <Skeleton className="h-4 w-full mt-4" />
         <Skeleton className="h-4 w-full" />
         <Skeleton className="h-4 w-4/5" />
    </div>
)
