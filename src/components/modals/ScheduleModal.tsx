import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScheduleItem, DayOfWeek, DAYS_ORDER } from '@/types/schedule';
import { Clock, MapPin, Palette, Save, X } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: Omit<ScheduleItem, 'id'>) => void;
  initialData?: ScheduleItem;
  defaultDay?: DayOfWeek;
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
];

export function ScheduleModal({ isOpen, onClose, onSave, initialData, defaultDay }: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    room: '',
    startTime: '',
    endTime: '',
    day: defaultDay || 'Senin' as DayOfWeek,
    notes: '',
    color: COLORS[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        room: initialData.room,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        day: initialData.day as DayOfWeek,
        notes: initialData.notes || '',
        color: initialData.color || COLORS[0]
      });
    } else if (defaultDay) {
      setFormData(prev => ({ ...prev, day: defaultDay }));
    }
  }, [initialData, defaultDay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.room.trim() || !formData.startTime || !formData.endTime) {
      return;
    }
    
    onSave(formData);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      room: '',
      startTime: '',
      endTime: '',
      day: defaultDay || 'Senin',
      notes: '',
      color: COLORS[0]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] shadow-floating">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {initialData ? 'Edit Jadwal' : 'Tambah Jadwal'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Mata Kuliah *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Contoh: Pemrograman Web"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Jam Mulai *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Jam Selesai *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Hari</Label>
              <Select 
                value={formData.day} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, day: value as DayOfWeek }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hari" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_ORDER.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Ruangan *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                  placeholder="A101"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Warna</Label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-smooth ${
                    formData.color === color ? 'border-primary scale-110' : 'border-border hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Catatan tambahan (opsional)"
              rows={3}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
              Batal
            </Button>
            <Button type="submit" variant="accent">
              <Save className="h-4 w-4" />
              {initialData ? 'Update' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}