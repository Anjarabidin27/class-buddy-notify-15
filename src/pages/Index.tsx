import { useState, useEffect } from 'react';
import { ScheduleItem, Assignment, DayOfWeek } from '@/types/schedule';
import { WeeklySchedule } from '@/components/schedule/WeeklySchedule';
import { TodaySchedule } from '@/components/schedule/TodaySchedule';
import { AssignmentList } from '@/components/assignments/AssignmentList';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ScheduleModal } from '@/components/modals/ScheduleModal';
import { AssignmentModal } from '@/components/modals/AssignmentModal';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { RealtimeClock } from '@/components/ui/clock';
import { Card } from '@/components/ui/card';
import { GraduationCap, Calendar, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';
import { usePWANotifications } from '@/hooks/usePWANotifications';
import { useScheduleNotifications } from '@/hooks/useScheduleNotifications';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'assignments' | 'notifications' | 'today'>('today');
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Senin');
  const { toast } = useToast();

  // Initialize notifications
  useNotifications(assignments);
  const { sendNotification } = usePWANotifications();
  useScheduleNotifications(scheduleItems);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem('schedule-items');
    const savedAssignments = localStorage.getItem('assignments');
    
    if (savedSchedule) {
      setScheduleItems(JSON.parse(savedSchedule));
    }
    
    if (savedAssignments) {
      const parsed = JSON.parse(savedAssignments);
      // Convert date strings back to Date objects
      const assignmentsWithDates = parsed.map((assignment: any) => ({
        ...assignment,
        dueDate: new Date(assignment.dueDate)
      }));
      setAssignments(assignmentsWithDates);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('schedule-items', JSON.stringify(scheduleItems));
  }, [scheduleItems]);

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const handleAddSchedule = (day: DayOfWeek) => {
    setSelectedDay(day);
    setEditingSchedule(null);
    setIsScheduleModalOpen(true);
  };

  const handleEditSchedule = (schedule: ScheduleItem) => {
    setEditingSchedule(schedule);
    setIsScheduleModalOpen(true);
  };

  const handleSaveSchedule = (scheduleData: Omit<ScheduleItem, 'id'>) => {
    if (editingSchedule) {
      setScheduleItems(prev => 
        prev.map(item => 
          item.id === editingSchedule.id 
            ? { ...scheduleData, id: editingSchedule.id }
            : item
        )
      );
      toast({
        title: "Jadwal diperbarui",
        description: "Jadwal kuliah berhasil diperbarui",
      });
    } else {
      const newSchedule: ScheduleItem = {
        ...scheduleData,
        id: Date.now().toString()
      };
      setScheduleItems(prev => [...prev, newSchedule]);
      toast({
        title: "Jadwal ditambahkan",
        description: "Jadwal kuliah baru berhasil ditambahkan",
      });
    }
  };

  const handleAddAssignment = () => {
    setEditingAssignment(null);
    setIsAssignmentModalOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsAssignmentModalOpen(true);
  };

  const handleSaveAssignment = (assignmentData: Omit<Assignment, 'id'>) => {
    if (editingAssignment) {
      setAssignments(prev => 
        prev.map(item => 
          item.id === editingAssignment.id 
            ? { ...assignmentData, id: editingAssignment.id }
            : item
        )
      );
      toast({
        title: "Tugas diperbarui",
        description: "Tugas berhasil diperbarui",
      });
    } else {
      const newAssignment: Assignment = {
        ...assignmentData,
        id: Date.now().toString()
      };
      setAssignments(prev => [...prev, newAssignment]);
      toast({
        title: "Tugas ditambahkan",
        description: "Tugas baru berhasil ditambahkan",
      });
    }
  };

  const handleToggleAssignmentComplete = (id: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, completed: !assignment.completed }
          : assignment
      )
    );
    
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
      toast({
        title: assignment.completed ? "Tugas dibuka kembali" : "Tugas selesai",
        description: assignment.completed 
          ? "Tugas telah dibuka kembali" 
          : "Selamat! Tugas telah diselesaikan",
      });
    }
  };

  const pendingAssignments = assignments.filter(a => !a.completed).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <TodaySchedule
            scheduleItems={scheduleItems}
            onAddSchedule={handleAddSchedule}
            onEditSchedule={handleEditSchedule}
          />
        );
      case 'schedule':
        return (
          <WeeklySchedule
            scheduleItems={scheduleItems}
            onAddSchedule={handleAddSchedule}
            onEditSchedule={handleEditSchedule}
          />
        );
      case 'assignments':
        return (
          <AssignmentList
            assignments={assignments}
            onAddAssignment={handleAddAssignment}
            onEditAssignment={handleEditAssignment}
            onToggleComplete={handleToggleAssignmentComplete}
          />
        );
      case 'notifications':
        return <NotificationCenter assignments={assignments} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4 shadow-floating">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Jadwal Kuliah</h1>
              <p className="text-primary-foreground/80 text-sm">
                Kelola jadwal dan tugas kuliah Anda
              </p>
            </div>
          </div>
          <RealtimeClock className="text-primary-foreground" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{scheduleItems.length}</p>
              <p className="text-sm text-muted-foreground">Jadwal</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingAssignments}</p>
              <p className="text-sm text-muted-foreground">Tugas Pending</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        assignmentCount={pendingAssignments}
      />

      {/* Modals */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditingSchedule(null);
        }}
        onSave={handleSaveSchedule}
        initialData={editingSchedule || undefined}
        defaultDay={selectedDay}
      />

      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        onSave={handleSaveAssignment}
        initialData={editingAssignment || undefined}
      />
    </div>
  );
};

export default Index;
