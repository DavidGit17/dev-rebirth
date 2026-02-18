import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppState } from '../state/useAppState';
import { getDateKey } from '../lib/dates';
import { COPY } from '../lib/copy';

const DEV_PATHS = [
  'Web Development',
  'Full Stack Development',
  'Frontend Development',
  'Backend Development',
  'Mobile Development',
  'Java Development',
  'Python Development',
  'DevOps Engineering',
  'Data Science',
  'Machine Learning',
  'Custom Path'
];

export default function InitializePage() {
  const navigate = useNavigate();
  const { initialize } = useAppState();
  const [devPath, setDevPath] = useState('');
  const [customPath, setCustomPath] = useState('');
  const [startDate, setStartDate] = useState(getDateKey(new Date()));

  const handleInitialize = () => {
    const finalPath = devPath === 'Custom Path' ? customPath : devPath;
    
    if (!finalPath.trim()) {
      return;
    }

    initialize(startDate, finalPath);
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md cyber-card">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/generated/dev-rebirth-logo.dim_512x512.png" 
              alt="DEV REBIRTH"
              className="w-24 h-24 object-contain"
            />
          </div>
          <CardTitle className="heading text-3xl text-primary cyber-glow">
            {COPY.APP_TITLE}
          </CardTitle>
          <CardDescription className="paragraph-text text-muted-foreground text-base">
            {COPY.APP_SUBTITLE}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="devPath" className="ui-text text-foreground">
              DEVELOPER PATH
            </Label>
            <Select value={devPath} onValueChange={setDevPath}>
              <SelectTrigger id="devPath" className="font-exo">
                <SelectValue placeholder="Select your path" />
              </SelectTrigger>
              <SelectContent className="cyber-card">
                {DEV_PATHS.map(path => (
                  <SelectItem key={path} value={path} className="font-exo">
                    {path}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {devPath === 'Custom Path' && (
            <div className="space-y-2">
              <Label htmlFor="customPath" className="ui-text text-foreground">
                CUSTOM PATH
              </Label>
              <Input
                id="customPath"
                value={customPath}
                onChange={(e) => setCustomPath(e.target.value)}
                placeholder="Enter your custom path"
                className="paragraph-text"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="startDate" className="ui-text text-foreground">
              START DATE
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="paragraph-text"
            />
          </div>

          <Button
            onClick={handleInitialize}
            disabled={!devPath || (devPath === 'Custom Path' && !customPath.trim())}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-rajdhani text-lg tracking-wider h-12"
          >
            {COPY.INITIALIZE_BUTTON}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
