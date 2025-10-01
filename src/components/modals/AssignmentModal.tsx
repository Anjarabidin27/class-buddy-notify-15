import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Assignment } from '@/types/schedule';
import { Calendar, Save, X, Bell, BookOpen } from 'lucide-react';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Omit<Assignment, 'id'>) => void;
  initialData?: Assignment;
}

export function AssignmentModal({ isOpen, onClose, onSave, initialData }: AssignmentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '23:59',
    subject: '',
    priority: 'medium' as Assignment['priority'],
    completed: false,
    notifications: {
      twoDaysBefore: true,
      oneDayBefore: true,
      sameDay: true,
      eightHoursBefore: true
    }
  });

  useEffect(() => {
    if (initialData) {
      const dueDate = new Date(initialData.dueDate);
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        dueDate: dueDate.toISOString().split('T')[0],
        dueTime: dueDate.toTimeString().slice(0, 5),
        subject: initialData.subject || '',
        priority: initialData.priority,
        completed: initialData.completed,
        notifications: initialData.notifications
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) {
      return;
    }
    
    const combinedDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
    
    onSave({
      title: formData.title,
      description: formData.description,
      dueDate: combinedDateTime,
      subject: formData.subject,
      priority: formData.priority,
      completed: formData.completed,
      notifications: formData.notifications
    });
    
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      dueTime: '23:59',
      subject: '',
      priority: 'medium',
      completed: false,
      notifications: {
        twoDaysBefore: true,
        oneDayBefore: true,
        sameDay: true,
        eightHoursBefore: true
      }
    });
  };

  const updateNotification = (key: keyof typeof formData.notifications, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] shadow-floating max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {initialData ? 'Edit Tugas' : 'Tambah Tugas'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Judul Tugas *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Contoh: Laporan Praktikum"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Mata Kuliah</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Nama mata kuliah"
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Tanggal Deadline *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">Jam Deadline</Label>
              <Input
                id="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Prioritas</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Assignment['priority'] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih prioritas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Rendah</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detail tugas (opsional)"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifikasi Pengingat
            </Label>
            
            <div className="space-y-3 pl-6">
              <div className="flex items-center justify-between">
                <span className="text-sm">2 hari sebelumnya</span>
                <Switch
                  checked={formData.notifications.twoDaysBefore}
                  onCheckedChange={(checked) => updateNotification('twoDaysBefore', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">1 hari sebelumnya</span>
                <Switch
                  checked={formData.notifications.oneDayBefore}
                  onCheckedChange={(checked) => updateNotification('oneDayBefore', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Hari yang sama</span>
                <Switch
                  checked={formData.notifications.sameDay}
                  onCheckedChange={(checked) => updateNotification('sameDay', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">8 jam sebelumnya</span>
                <Switch
                  checked={formData.notifications.eightHoursBefore}
                  onCheckedChange={(checked) => updateNotification('eightHoursBefore', checked)}
                />
              </div>
            </div>
          </div>

          {initialData && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">Status Penyelesaian</span>
              <Switch
                checked={formData.completed}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, completed: checked }))}
              />
            </div>
          )}

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