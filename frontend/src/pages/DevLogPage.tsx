import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDevLogs, DevLog, TimeSection, FocusLevel } from '../state/devLogs';
import { getTodayKey } from '../lib/dates';
import { COPY } from '../lib/copy';
import { useAutosave } from '../hooks/useAutosave';
import { toast } from 'sonner';

const ACTIVITIES = [
  'Coding practice',
  'Tutorial learning',
  'Building project',
  'Debugging/problem solving',
  'Job preparation',
  'Reading tech',
  'Other'
];

export default function DevLogPage() {
  const navigate = useNavigate();
  const params = useParams({ from: '/log/$section' });
  const section = params.section as TimeSection;
  const { getLog, saveLog } = useDevLogs();

  const todayKey = getTodayKey();
  const existingLog = getLog(todayKey, section);

  const [description, setDescription] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [hours, setHours] = useState(0);
  const [relevance, setRelevance] = useState(5);
  const [focus, setFocus] = useState<FocusLevel>('normal');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (existingLog) {
      setDescription(existingLog.description);
      setActivities(existingLog.activities);
      setHours(existingLog.hours);
      setRelevance(existingLog.relevance ?? 5);
      setFocus(existingLog.focus);
      setNotes(existingLog.notes);
    }
  }, [existingLog]);

  const logData: DevLog = {
    dateKey: todayKey,
    section,
    description,
    activities,
    hours,
    relevance,
    focus,
    notes,
    timestamp: Date.now()
  };

  const autosaveStatus = useAutosave(logData, saveLog, 2000);

  const handleSave = () => {
    saveLog(logData);
    toast.success('Entry saved successfully');
    
    if (section === 'night') {
      navigate({ to: '/summary' });
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  const toggleActivity = (activity: string) => {
    setActivities(prev =>
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  return (
    <div className="container max-w-md mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate({ to: '/dashboard' })}
          className="font-rajdhani"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          BACK
        </Button>
        {autosaveStatus !== 'idle' && (
          <span className="text-xs text-muted-foreground paragraph-text">
            {autosaveStatus === 'saving' ? 'Saving...' : 'Saved'}
          </span>
        )}
      </div>

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="heading text-primary">
            {section.toUpperCase()} LOG
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="ui-text">WHAT DEV WORK DID YOU DO?</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your development work..."
              className="paragraph-text min-h-[100px]"
            />
          </div>

          <div className="space-y-3">
            <Label className="ui-text">ACTIVITIES</Label>
            {ACTIVITIES.map(activity => (
              <div key={activity} className="flex items-center space-x-2">
                <Checkbox
                  id={activity}
                  checked={activities.includes(activity)}
                  onCheckedChange={() => toggleActivity(activity)}
                />
                <label
                  htmlFor={activity}
                  className="paragraph-text text-sm cursor-pointer"
                >
                  {activity}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="ui-text">
              TIME SPENT LEARNING (HOURS)
            </Label>
            <Input
              id="hours"
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
              className="paragraph-text"
            />
          </div>

          <div className="space-y-3">
            <Label className="ui-text">{COPY.RELEVANCE_LABEL}</Label>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-muted-foreground paragraph-text">0</span>
              <Slider
                value={[relevance]}
                onValueChange={(value) => setRelevance(value[0])}
                min={0}
                max={10}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground paragraph-text">10</span>
            </div>
            <div className="text-center text-2xl font-bold text-primary">
              {relevance}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="ui-text">FOCUS LEVEL</Label>
            <RadioGroup value={focus} onValueChange={(value) => setFocus(value as FocusLevel)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deep" id="deep" />
                <label htmlFor="deep" className="paragraph-text text-sm cursor-pointer">
                  Deep focus
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <label htmlFor="normal" className="paragraph-text text-sm cursor-pointer">
                  Normal
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="distracted" id="distracted" />
                <label htmlFor="distracted" className="paragraph-text text-sm cursor-pointer">
                  Distracted
                </label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="ui-text">NOTES</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="paragraph-text"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-rajdhani text-lg tracking-wider h-12"
          >
            <Save className="w-5 h-5 mr-2" />
            SAVE ENTRY
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
