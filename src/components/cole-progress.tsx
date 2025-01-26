'use client';

import { HeatmapStudy } from '@/components/heatmap-study';
import { HeatmapWorkout } from '@/components/heatmap-workout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { addActivity } from '@/lib/db/actions';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type Year = '2025' | '2026';
type ActivityType = 'study' | 'workout';

export default function ColeProgress() {
  const [year, setYear] = useState<Year>('2025');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [description, setDescription] = useState('');

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(
    null
  );

  const handleActivitySelect = (type: ActivityType) => {
    setSelectedActivity(type);
    setShowOtpDialog(true);
    setDescription('');
  };

  const handleAddActivity = async () => {
    if (otp === '223444' && selectedActivity) {
      await addActivity(selectedActivity, new Date(), 1, 'cole', description);
      setShowOtpDialog(false);
      setOtp('');
      setDescription('');
      setRefreshTrigger((prev) => prev + 1);
      toast.success('Nice');
      setSelectedActivity(null);
    } else {
      toast.error('Wrong password');
    }
  };

  return (
    <div className="w-full h-full pb-6 pt-24">
      <main className="flex flex-col gap-8 items-start max-w-full">
        <h1 className="text-2xl text-black/70 sm:text-4xl font-bold">
          Cole&apos;s Daily habits
        </h1>
        <ol className="list-inside list-decimal text-sm text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">First heatmap is my study progress</li>
          <li>Second heatmap is my workout progress</li>
        </ol>
        <div className="flex gap-2 items-center">
          <Tabs
            defaultValue={year}
            onValueChange={(value) => setYear(value as Year)}
          >
            <TabsList>
              <TabsTrigger value="2025">2025</TabsTrigger>
              <TabsTrigger value="2026">2026</TabsTrigger>
            </TabsList>
          </Tabs>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'}>
                <Plus />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleActivitySelect('study')}>
                Study
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleActivitySelect('workout')}>
                Workout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add {selectedActivity} Activity</DialogTitle>
              <DialogDescription>
                Please describe what you did and enter the OTP to verify
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid w-full gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What did you do today?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
                onComplete={handleAddActivity}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button onClick={handleAddActivity}>Verify & Add</Button>
            </div>
          </DialogContent>
        </Dialog>

        <HeatmapStudy year={year} user="cole" refresh={refreshTrigger} />
        <HeatmapWorkout year={year} user="cole" refresh={refreshTrigger} />
      </main>
    </div>
  );
}
