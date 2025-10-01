import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Clock, MapPin, StickyNote, FileText } from 'lucide-react';
import { ScheduleItem, DayOfWeek, DAYS_ORDER } from '@/types/schedule';
import { SubjectNotes } from './SubjectNotes';
import { cn } from '@/lib/utils';

interface WeeklyScheduleProps {
  scheduleItems: ScheduleItem[];
  onAddSchedule: (day: DayOfWeek) => void;
  onEditSchedule: (item: ScheduleItem) => void;
}

export function WeeklySchedule({ scheduleItems, onAddSchedule, onEditSchedule }: WeeklyScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<ScheduleItem | null>(null);

  const getScheduleForDay = (day: DayOfWeek) => {
    return scheduleItems
      .filter(item => item.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  const handleSubjectClick = (item: ScheduleItem) => {
    setSelectedSubject(item);
    setNotesModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Day Selector */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg overflow-x-auto">
        {DAYS_ORDER.map((day) => (
          <Button
            key={day}
            variant={selectedDay === day ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedDay(day)}
            className={cn(
              "flex-1 min-w-0 text-xs whitespace-nowrap transition-smooth",
              selectedDay === day && "shadow-card"
            )}
          >
            {day.slice(0, 3)}
          </Button>
        ))}
      </div>

      {/* Selected Day Schedule */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            Jadwal {selectedDay}
          </h2>
          <Button
            variant="accent"
            size="sm"
            onClick={() => onAddSchedule(selectedDay)}
            className="shadow-card"
          >
            <Plus className="h-4 w-4" />
            Tambah
          </Button>
        </div>

        <div className="space-y-2">
          {getScheduleForDay(selectedDay).length === 0 ? (
            <Card className="p-6 text-center border-dashed shadow-card">
              <div className="text-muted-foreground space-y-2">
                <Clock className="h-8 w-8 mx-auto opacity-50" />
                <p>Tidak ada jadwal untuk hari {selectedDay}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddSchedule(selectedDay)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4" />
                  Tambah Jadwal
                </Button>
              </div>
            </Card>
          ) : (
            getScheduleForDay(selectedDay).map((item) => (
              <Card
                key={item.id}
                className="p-4 shadow-card hover:shadow-floating transition-smooth cursor-pointer"
                onClick={() => handleSubjectClick(item)}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-foreground line-clamp-1">
                      {item.title}
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