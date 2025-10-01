import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Camera, FileText, Save, X, Upload, Trash2, ZoomIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubjectNote {
  id: string;
  text: string;
  images: string[];
  createdAt: Date;
}

interface SubjectNotesProps {
  isOpen: boolean;
  onClose: () => void;
  subjectTitle: string;
  subjectId: string;
}

export function SubjectNotes({ isOpen, onClose, subjectTitle, subjectId }: SubjectNotesProps) {
  const [notes, setNotes] = useState<SubjectNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const { toast } = useToast();

  // Load notes from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const savedNotes = localStorage.getItem(`subject-notes-${subjectId}`);
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        const notesWithDates = parsed.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        setNotes(notesWithDates);
      }
    }
  }, [isOpen, subjectId]);

  // Save notes to localStorage whenever it changes
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem(`subject-notes-${subjectId}`, JSON.stringify(notes));
    }
  }, [notes, subjectId]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages(prev => [...prev, ...files]);
      
      // Create preview URLs
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviewImages(prev => [...prev, e.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageSelect(e);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const saveNote = () => {
    if (!currentNote.trim() && previewImages.length === 0) {
      toast({
        title: "Catatan kosong",
        description: "Tambahkan teks atau gambar untuk menyimpan catatan",
        variant: "destructive"
      });
      return;
    }

    const newNote: SubjectNote = {
      id: Date.now().toString(),
      text: currentNote,
      images: previewImages,
      createdAt: new Date()
    };

    setNotes(prev => [newNote, ...prev]);
    setCurrentNote('');
    setSelectedImages([]);
    setPreviewImages([]);
    
    toast({
      title: "Catatan disimpan",
      description: "Catatan berhasil ditambahkan ke mata kuliah",
    });
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast({
      title: "Catatan dihapus",
      description: "Catatan berhasil dihapus",
    });
  };

  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setImagePreviewOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col shadow-floating">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Catatan - {subjectTitle}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4 overflow-hidden">
            {/* Add New Note */}
            <div className="space-y-3 border-b border-border pb-4">
              <Textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Tulis catatan untuk mata kuliah ini..."
                rows={3}
                className="resize-none"
              />
              
              {/* Image Preview */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg cursor-pointer"
                        onClick={() => openImagePreview(image)}
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="hidden"
                  id="camera-input"
                  multiple
                />
                <label htmlFor="camera-input">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Camera className="h-4 w-4" />
                      Foto
                    </span>
                  </Button>
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="file-input"
                  multiple
                />
                <label htmlFor="file-input">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      Upload
                    </span>
                  </Button>
                </label>

                <Button onClick={saveNote} variant="accent" size="sm">
                  <Save className="h-4 w-4" />
                  Simpan
                </Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {notes.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <FileText className="h-12 w-12 mx-auto opacity-50 mb-2" />
                  <p>Belum ada catatan untuk mata kuliah ini</p>
                </div>
              ) : (
                notes.map((note) => (
                  <Card key={note.id} className="p-4 shadow-card">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-muted-foreground">
                          {note.createdAt.toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteNote(note.id)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {note.text && (
                        <p className="text-sm text-foreground whitespace-pre-wrap">{note.text}</p>
                      )}
                      
                      {note.images.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {note.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Note image ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => openImagePreview(image)}
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                <ZoomIn className="h-5 w-5 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] p-2">
          <div className="flex items-center justify-center">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}