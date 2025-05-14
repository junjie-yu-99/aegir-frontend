'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

interface Location {
  id: number;
  name: string;
  address: string;
  is_main: boolean;
}

interface Session {
  id: number;
  title?: string;
  date?: string;
  start_time: string;
  end_time: string;
  location_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  locations?: Location | null;
  day_of_week?: number;
}

export default function RecurringSessionsDashboard() {
  const [day, setDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    console.log('[RecurringSessionsDashboard] Fetching data...');

    fetch('http://localhost:8080/api/recurringSessions')
      .then(res => res.json())
      .then(data => {
        console.log('[RecurringSessionsDashboard] Recurring sessions fetched:', data);
        setSessions(data);
      })
      .catch(err => console.error('Error fetching sessions:', err));

    fetch('http://localhost:8080/api/locations')
      .then(res => res.json())
      .then(data => {
        console.log('[RecurringSessionsDashboard] Locations fetched:', data);
        setLocations(data);
      })
      .catch(err => console.error('Error fetching locations:', err));
  }, []);

  const parseTime = (isoString: string) => {
  if (!isoString) return '-';
  return isoString.slice(11, 16);
};

  const handleAddNewLocation = () => {
    console.log('[RecurringSessionsDashboard] User requested to add new location');
    alert('Redirect to location creation or open modal to create new location');
    window.location.href = '/admin/locations';
  };

  const handleCreateSession = async () => {
    const payload = {
        day_of_week: parseInt(day),
        start_time: startTime, // e.g. "10:10:00"
        end_time: endTime,     // e.g. "12:00:00"
        location_id: parseInt(location),
    };

    console.log('[RecurringSessionsDashboard] Submitting payload:', payload);

    try {
      const res = await fetch('http://localhost:8080/api/recurringSessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const newSession = await res.json();
      console.log('[RecurringSessionsDashboard] Created session:', newSession);

      setSessions(prev => [...prev, newSession]);

      setDay('');
      setStartTime('');
      setEndTime('');
      setLocation('');
    } catch (err) {
      console.error('[RecurringSessionsDashboard] Failed to create session:', err);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Add New Recurring Session</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Day of the Week</Label>
              <Select onValueChange={value => {
                console.log('[RecurringSessionsDashboard] Day selected:', value);
                setDay(value);
              }}>
                <SelectTrigger>{day ? daysOfWeek[parseInt(day)] : 'Select Day'}</SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((d, idx) => (
                    <SelectItem key={idx} value={String(idx)}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Location</Label>
              <Select onValueChange={value => {
                if (value === 'new') {
                  handleAddNewLocation();
                } else {
                  console.log('[RecurringSessionsDashboard] Location selected:', value);
                  setLocation(value);
                }
              }}>
                <SelectTrigger>{location ? locations.find(l => l.id.toString() === location)?.name || 'Select Location' : 'Select Location'}</SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc.id} value={String(loc.id)}>{loc.name}</SelectItem>
                  ))}
                  <SelectItem value="new">➕ Add New Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={e => {
                  console.log('[RecurringSessionsDashboard] Start time:', e.target.value);
                  setStartTime(e.target.value);
                }}
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={e => {
                  console.log('[RecurringSessionsDashboard] End time:', e.target.value);
                  setEndTime(e.target.value);
                }}
              />
            </div>
          </div>
          <Button className="mt-4" onClick={handleCreateSession}>
            Create Recurring Session
          </Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Recurring Sessions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border-b">Day</th>
                <th className="px-4 py-2 text-left border-b">Start Time</th>
                <th className="px-4 py-2 text-left border-b">End Time</th>
                <th className="px-4 py-2 text-left border-b">Location</th>
                <th className="px-4 py-2 text-left border-b">Address</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{session.day_of_week !== undefined ? daysOfWeek[session.day_of_week] : '-'}</td>
                  <td className="px-4 py-2 border-b">{parseTime(session.start_time)}</td>
                  <td className="px-4 py-2 border-b">{parseTime(session.end_time)}</td>
                  <td className="px-4 py-2 border-b">{session.locations?.name || '-'}</td>
                  <td className="px-4 py-2 border-b">{session.locations?.address || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
