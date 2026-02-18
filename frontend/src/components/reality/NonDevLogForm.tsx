import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNonDevLogs, ActivityType, Category, Mood } from '../../state/nonDevLogs';
import { getTodayKey } from '../../lib/dates';
import { toast } from 'sonner';

interface NonDevLogFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'gaming', label: 'Gaming' },
  { value: 'social_media', label: 'Social media scrolling' },
  { value: 'series_movies', label: 'Watching series/movies' },
  { value: 'youtube', label: 'Random YouTube' },
  { value: 'going_out', label: 'Going out' },
  { value: 'sleeping_extra', label: 'Sleeping extra' },
  { value: 'other', label: 'Other' }
];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'necessary', label: 'Necessary' },
  { value: 'time_pass', label: 'Time pass' },
  { value: 'pure_distraction', label: 'Pure distraction' }
];

const MOODS: { value: Mood; label: string }[] = [
  { value: 'good', label: 'Good' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'regret', label: 'Regret' },
  { value: 'wasted', label: 'Wasted' }
];

export default function NonDevLogForm({ onSaved, onCancel }: NonDevLogFormProps) {
  const { saveLog } = useNonDevLogs();
  const [activityType, setActivityType] = useState<ActivityType>('gaming');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [category, setCategory] = useState<Category>('time_pass');
  const [mood, setMood] = useState<Mood>('neutral');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    const totalHours = hours + minutes / 60;
    
    if (totalHours === 0) {
      toast.error('Please enter time spent');
      return;
    }

    saveLog({
      dateKey: getTodayKey(),
      activityType,
      hours: totalHours,
      category,
      mood,
      notes
    });

    toast.success('Distraction logged');
    onSaved();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="ui-text">ACTIVITY TYPE</Label>
        <Select value={activityType} onValueChange={(value) => setActivityType(value as ActivityType)}>
          <SelectTrigger className="paragraph-text">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="cyber-card">
            {ACTIVITY_TYPES.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="paragraph-text">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="ui-text">HOURS</Label>
          <Input
            type="number"
            min="0"
            max="24"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value) || 0)}
            className="paragraph-text"
          />
        </div>
        <div className="space-y-2">
          <Label className="ui-text">MINUTES</Label>
          <Input
            type="number"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
            className="paragraph-text"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="ui-text">CATEGORY</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
          <SelectTrigger className="paragraph-text">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="cyber-card">
            {CATEGORIES.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="paragraph-text">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="ui-text">MOOD AFTER</Label>
        <Select value={mood} onValueChange={(value) => setMood(value as Mood)}>
          <SelectTrigger className="paragraph-text">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="cyber-card">
            {MOODS.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="paragraph-text">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <div className="flex gap-2">
        <Button
          onClick={handleSave}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-rajdhani tracking-wider"
        >
          <Save className="w-4 h-4 mr-2" />
          SAVE ENTRY
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="font-rajdhani tracking-wider"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
