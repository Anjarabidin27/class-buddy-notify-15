import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, StickyNote, Plus, FileText } from 'lucide-react';
import { ScheduleItem, DayOfWeek } from '@/types/schedule';
import { SubjectNotes } from './SubjectNotes';
import { cn } from '@/lib/utils';

interface TodayScheduleProps {
  scheduleItems: ScheduleItem[];
  onAddSchedule: (day: DayOfWeek) => void;
  onEditSchedule: (item: ScheduleItem) => void;
}

export function TodaySchedule({ scheduleItems, onAddSchedule, onEditSchedule }: TodayScheduleProps) {
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<ScheduleItem | null>(null);
  
  const today = new Date();
  const dayNames: DayOfWeek[] = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const currentDay = dayNames[today.getDay()];

  const todaySchedule = scheduleItems
    .filter(item => item.day === currentDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  const isCurrentTime = (startTime: string, endTime: string) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= startTime && currentTime <= endTime;
  };

  const handleSubjectClick = (item: ScheduleItem) => {
    setSelectedSubject(item);
    setNotesModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">
          Jadwal Hari Ini ({currentDay})
        </h2>
        <Button
          variant="accent"
          size="sm"
          onClick={() => onAddSchedule(currentDay)}
          className="shadow-card"
        >
          <Plus className="h-4 w-4" />
          Tambah
        </Button>
      </div>

      <div className="space-y-2">
        {todaySchedule.length === 0 ? (
          <Card className="p-6 text-center border-dashed shadow-card">
            <div className="text-muted-foreground space-y-2">
              <Clock className="h-8 w-8 mx-auto opacity-50" />
              <p>Tidak ada jadwal untuk hari ini</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddSchedule(currentDay)}
                className="mt-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Jadwal
              </Button>
            </div>
          </Card>
        ) : (
          todaySchedule.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "p-4 shadow-card hover:shadow-floating transition-smooth cursor-pointer",
                isCurrentTime(item.startTime, item.endTime) && "ring-2 ring-accent border-accent bg-accent/5"
              )}
              onClick={() => handleSubjectClick(item)}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-foreground line-clamp-1">
                    {item.title}
                    {isCurrentTime(item.startTime, item.endTime) && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent text-accent-foreground">
                        Berlangsung
                      </span>
                    )}
                  </h3>
                  <span 
                    className="w-3 h-3 rounded-full flex-shrink-0 ml-2"
                    style={{ backgroundColor: item.color || '#3b82f6' }}
                  />
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{item.room}</span>
                  </div>
                </div>

                {item.notes && (
                  <div className="flex items-start gap-1 text-sm text-muted-foreground">
                    <StickyNote className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{item.notes}</span>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Subject Notes Modal */}
      {selectedSubject && (
        <SubjectNotes
          isOpen={notesModalOpen}
          onClose={() => {
            setNotesModalOpen(false);
            setSelectedSubject(null);
          }}
          subjectTitle={selectedSubject.title}
          subjectId={selectedSubject.id}
        />
      )}
    </div>
  );
}