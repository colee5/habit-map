'use client';

import { HeatmapPlan } from '@/components/heatmap-plan';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addActivity } from '@/lib/db/actions';
import { format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Calendar } from './ui/calendar';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

type Year = '2025' | '2026';
type ActivityType = 'study' | 'workout' | 'plan';
type User = 'cole' | 'keki';

interface ProgressProps {
  user: User;
  className?: string;
}

export default function UserProgress({ user, className = '' }: ProgressProps) {
  const [year, setYear] = useState<Year>('2025');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [description, setDescription] = useState('');
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleActivitySelect = (type: ActivityType) => {
    setSelectedActivity(type);
    setShowOtpDialog(true);
    setDescription('');
  };

  const handleAddActivity = async () => {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        body: JSON.stringify({ otp, user }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { isValid } = await response.json();

      if (isValid && selectedActivity) {
        const activityDescription =
          selectedActivity === 'plan' ? '' : description;

        await addActivity(
          selectedActivity,
          selectedDate,
          1,
          user,
          activityDescription
        );
        setShowOtpDialog(false);
        setOtp('');
        setDescription('');
        setRefreshTrigger((prev) => prev + 1);
        toast.success('Nice');
        setSelectedActivity(null);
        setSelectedDate(new Date());
      } else {
        toast.error('Wrong password');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };
  return (
    <div className={`w-full h-full ${className}`}>
      <main className="flex flex-col gap-8 items-start max-w-full">
        <h1 className="text-2xl text-black/70 sm:text-4xl font-bold">
          {user.charAt(0).toUpperCase() + user.slice(1)}&apos;s Daily habits
        </h1>
        <ol className="list-inside list-decimal text-sm text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">First heatmap is my study progress</li>
          <li className="mb-2">Second heatmap is my workout progress</li>
          <li>Second heatmap is my --- progress</li>
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
              <DropdownMenuItem onClick={() => handleActivitySelect('plan')}>
                Plan
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add {selectedActivity} Activity</DialogTitle>
              <DialogDescription>
                Please select a date
                {selectedActivity !== 'plan'
                  ? ', describe what you did'
                  : ''}{' '}
                and enter the OTP to verify
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="grid w-full gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !selectedDate && 'text-muted-foreground'
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, 'PPP')
                        : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0"
                    align="start"
                    sideOffset={4}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {selectedActivity !== 'plan' && (
                <div className="grid w-full gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What did you do today?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              )}

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

        <HeatmapStudy year={year} user={user} refresh={refreshTrigger} />
        <HeatmapWorkout year={year} user={user} refresh={refreshTrigger} />
        <HeatmapPlan year={year} user={user} refresh={refreshTrigger} />
      </main>
    </div>
  );
}
