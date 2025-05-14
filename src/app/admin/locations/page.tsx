'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Location {
  id: number;
  name: string;
  address?: string;
  is_main?: boolean;
}

export default function LocationDashboard() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isMain, setIsMain] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/locations')
      .then(res => res.json())
      .then(data => {
        console.log('[LocationDashboard] Fetched locations:', data);
        setLocations(data);
      })
      .catch(err => console.error('Error fetching locations:', err));
  }, []);

  const handleCreateLocation = async () => {
    const payload = { name, address, is_main: isMain };
    console.log('[LocationDashboard] Creating location with payload:', payload);

    try {
      const res = await fetch('http://localhost:8080/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const newLocation = await res.json();
      setLocations([...locations, newLocation]);
      setName('');
      setAddress('');
      setIsMain(false);
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Location Management</h1>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">Add New Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Location name" />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address (optional)" />
            </div>
            <div className="col-span-2">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isMain}
                  onChange={(e) => setIsMain(e.target.checked)}
                />
                <span>Mark as main location</span>
              </label>
            </div>
          </div>
          <Button onClick={handleCreateLocation}>Create Location</Button>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Locations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left border-b">Name</th>
                <th className="px-4 py-2 text-left border-b">Address</th>
                <th className="px-4 py-2 text-left border-b">Main</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{loc.name}</td>
                  <td className="px-4 py-2 border-b">{loc.address || '—'}</td>
                  <td className="px-4 py-2 border-b">{loc.is_main ? '✅' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}