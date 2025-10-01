import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Assignment } from '@/types/schedule';
import { Plus, Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AssignmentListProps {
  assignments: Assignment[];
  onAddAssignment: () => void;
  onEditAssignment: (assignment: Assignment) => void;
  onToggleComplete: (id: string) => void;
}

export function AssignmentList({ 
  assignments, 
  onAddAssignment, 
  onEditAssignment,
  onToggleComplete 
}: AssignmentListProps) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; assignmentId: string | null }>({
    open: false,
    assignmentId: null
  });

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'pending') return !assignment.completed;
    if (filter === 'completed') return assignment.completed;
    return true;
  }).sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const getDaysUntilDeadline = (dueDate: Date) => {
    const now = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: Assignment['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-accent text-accent-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDeadlineStatus = (assignment: Assignment) => {
    const daysLeft = getDaysUntilDeadline(assignment.dueDate);
    
    if (assignment.completed) {
      return { text: 'Selesai', variant: 'success' as const, urgent: false };
    }
    
    if (daysLeft < 0) {
      return { text: 'Terlambat', variant: 'destructive' as const, urgent: true };
    } else if (daysLeft === 0) {
      return { text: 'Hari ini', variant: 'accent' as const, urgent: true };
    } else if (daysLeft === 1) {
      return { text: 'Besok', variant: 'accent' as const, urgent: true };
    } else if (daysLeft <= 3) {
      return { text: `${daysLeft} hari lagi`, variant: 'accent' as const, urgent: true };
    } else {
      return { text: `${daysLeft} hari lagi`, variant: 'default' as const, urgent: false };
    }
  };

  const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

const handleCompleteClick = (assignmentId: string, isCompleted: boolean) => {
  if (isCompleted) {
    // If already completed, just toggle without confirmation
    onToggleComplete(assignmentId);
  } else {
    // If not completed, show confirmation dialog
    setConfirmDialog({ open: true, assignmentId });
  }
};

const handleConfirmComplete = () => {
  if (confirmDialog.assignmentId) {
    onToggleComplete(confirmDialog.assignmentId);
  }
  setConfirmDialog({ open: false, assignmentId: null });
};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Tugas</h2>
        <Button
          variant="accent"
          size="sm"
          onClick={onAddAssignment}
          className="shadow-card"
        >
          <Plus className="h-4 w-4" />
          Tambah
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        {[
          { key: 'pending', label: 'Pending', count: assignments.filter(a => !a.completed).length },
          { key: 'completed', label: 'Selesai', count: assignments.filter(a => a.completed).length },
          { key: 'all', label: 'Semua', count: assignments.length }
        ].map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter(key as any)}
            className={cn(
              "flex-1 transition-smooth",
              filter === key && "shadow-card"
            )}
          >
            {label} ({count})
          </Button>
        ))}
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <Card className="p-6 text-center border-dashed shadow-card">
            <div className="text-muted-foreground space-y-2">
              <Calendar className="h-8 w-8 mx-auto opacity-50" />
              <p>
                {filter === 'pending' && 'Tidak ada tugas yang pending'}
                {filter === 'completed' && 'Belum ada tugas yang selesai'}
                {filter === 'all' && 'Belum ada tugas'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddAssignment}
                className="mt-2"
              >
                <Plus className="h-4 w-4" />
                Tambah Tugas
              </Button>
            </div>
          </Card>
        ) : (
          filteredAssignments.map((assignment) => {
            const deadlineStatus = getDeadlineStatus(assignment);
            
            return (
              <Card
                key={assignment.id}
                className={cn(
                  "p-4 shadow-card hover:shadow-floating transition-smooth cursor-pointer",
                  assignment.completed && "opacity-75",
                  deadlineStatus.urgent && !assignment.completed && "ring-2 ring-accent/20"
                )}
                onClick={() => onEditAssignment(assignment)}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 rounded-full p-0 flex-shrink-0",
                        assignment.completed && "text-success"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteClick(assignment.id, assignment.completed);
                      }}
                    >
                      {assignment.completed ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                      )}
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-medium text-foreground line-clamp-1",
                        assignment.completed && "line-through text-muted-foreground"
                      )}>
                        {assignment.title}
                      </h3>
                      
                      {assignment.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {assignment.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(assignment.priority)}>
                        {assignment.priority === 'high' && 'Tinggi'}
                        {assignment.priority === 'medium' && 'Sedang'}
                        {assignment.priority === 'low' && 'Rendah'}
                      </Badge>
                      
                      {assignment.subject && (
                        <Badge variant="outline" className="text-xs">
                          {assignment.subject}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {deadlineStatus.urgent && !assignment.completed && (
                        <AlertTriangle className="h-3 w-3 text-accent" />
                      )}
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(assignment.dueDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={deadlineStatus.variant === 'success' ? 'default' : 'outline'}
                      className={cn(
                        deadlineStatus.variant === 'destructive' && 'border-destructive text-destructive',
                        deadlineStatus.variant === 'accent' && 'border-accent text-accent',
                        deadlineStatus.variant === 'success' && 'bg-success text-success-foreground'
                      )}
                    >
                      {deadlineStatus.text}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => setConfirmDialog({ open, assignmentId: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penyelesaian Tugas</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin sudah menyelesaikan tugas ini? Tugas yang sudah selesai akan ditandai sebagai completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmComplete}>
              Ya, Sudah Selesai
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}