'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  lectures: Lecture[];
}

interface Lecture {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'CODING_EXERCISE';
  content: string;
  videoUrl?: string;
  duration: number;
  isFree: boolean;
  order: number;
  resources: Resource[];
  dripReleaseDate?: string;
  isPreview?: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'LINK' | 'DOCUMENT';
  url: string;
}

interface CurriculumBuilderProps {
  sections: Section[];
  onSectionsChange: (sections: Section[]) => void;
}

const CurriculumBuilder: React.FC<CurriculumBuilderProps> = ({
  sections,
  onSectionsChange
}) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [isAddingLecture, setIsAddingLecture] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDescription, setNewSectionDescription] = useState('');
  const [newLectureTitle, setNewLectureTitle] = useState('');
  const [newLectureType, setNewLectureType] = useState<Lecture['type']>('VIDEO');

  const addSection = () => {
    if (newSectionTitle.trim()) {
      const newSection: Section = {
        id: `section-${Date.now()}`,
        title: newSectionTitle.trim(),
        description: newSectionDescription.trim(),
        order: sections.length + 1,
        lectures: []
      };
      onSectionsChange([...sections, newSection]);
      setNewSectionTitle('');
      setNewSectionDescription('');
      setIsAddingSection(false);
    }
  };

  const addLecture = (sectionId: string) => {
    if (newLectureTitle.trim()) {
      const section = sections.find(s => s.id === sectionId);
      if (section) {
        const newLecture: Lecture = {
          id: `lecture-${Date.now()}`,
          title: newLectureTitle.trim(),
          type: newLectureType,
          content: '',
          duration: 0,
          isFree: false,
          order: section.lectures.length + 1,
          resources: []
        };
        
        const updatedSections = sections.map(s => 
          s.id === sectionId 
            ? { ...s, lectures: [...s.lectures, newLecture] }
            : s
        );
        onSectionsChange(updatedSections);
        setNewLectureTitle('');
        setIsAddingLecture(false);
      }
    }
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    const updatedSections = sections.map(s => 
      s.id === sectionId ? { ...s, ...updates } : s
    );
    onSectionsChange(updatedSections);
  };

  const updateLecture = (sectionId: string, lectureId: string, updates: Partial<Lecture>) => {
    const updatedSections = sections.map(s => 
      s.id === sectionId 
        ? {
            ...s,
            lectures: s.lectures.map(l => 
              l.id === lectureId ? { ...l, ...updates } : l
            )
          }
        : s
    );
    onSectionsChange(updatedSections);
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(s => s.id !== sectionId);
    onSectionsChange(updatedSections);
    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  const deleteLecture = (sectionId: string, lectureId: string) => {
    const updatedSections = sections.map(s => 
      s.id === sectionId 
        ? { ...s, lectures: s.lectures.filter(l => l.id !== lectureId) }
        : s
    );
    onSectionsChange(updatedSections);
    if (selectedLecture === lectureId) {
      setSelectedLecture(null);
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < sections.length - 1)
    ) {
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const newSections = [...sections];
      [newSections[currentIndex], newSections[newIndex]] = [newSections[newIndex], newSections[currentIndex]];
      
      // Update order numbers
      newSections.forEach((section, index) => {
        section.order = index + 1;
      });
      
      onSectionsChange(newSections);
    }
  };

  const moveLecture = (sectionId: string, lectureId: string, direction: 'up' | 'down') => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      const currentIndex = section.lectures.findIndex(l => l.id === lectureId);
      if (
        (direction === 'up' && currentIndex > 0) ||
        (direction === 'down' && currentIndex < section.lectures.length - 1)
      ) {
        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        const newLectures = [...section.lectures];
        [newLectures[currentIndex], newLectures[newIndex]] = [newLectures[newIndex], newLectures[currentIndex]];
        
        // Update order numbers
        newLectures.forEach((lecture, index) => {
          lecture.order = index + 1;
        });
        
        updateSection(sectionId, { lectures: newLectures });
      }
    }
  };

  const getLectureIcon = (type: Lecture['type']) => {
    switch (type) {
      case 'VIDEO': return '🎥';
      case 'TEXT': return '📝';
      case 'QUIZ': return '❓';
      case 'ASSIGNMENT': return '📋';
      case 'CODING_EXERCISE': return '💻';
      default: return '📄';
    }
  };

  const getLectureTypeColor = (type: Lecture['type']) => {
    switch (type) {
      case 'VIDEO': return 'bg-blue-100 text-blue-800';
      case 'TEXT': return 'bg-gray-100 text-gray-800';
      case 'QUIZ': return 'bg-green-100 text-green-800';
      case 'ASSIGNMENT': return 'bg-orange-100 text-orange-800';
      case 'CODING_EXERCISE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const totalDuration = sections.reduce((total, section) => 
    total + section.lectures.reduce((sectionTotal, lecture) => sectionTotal + lecture.duration, 0), 0
  );

  const totalLectures = sections.reduce((total, section) => total + section.lectures.length, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Overview</CardTitle>
          <CardDescription>Track your course progress and content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#FF804B]">{sections.length}</div>
              <div className="text-sm text-gray-600">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#2C4E41]">{totalLectures}</div>
              <div className="text-sm text-gray-600">Lectures</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatDuration(totalDuration)}</div>
              <div className="text-sm text-gray-600">Total Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sections.reduce((total, section) => 
                  total + section.lectures.filter(l => l.isFree).length, 0
                )}
              </div>
              <div className="text-sm text-gray-600">Free Lectures</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sections</CardTitle>
                <Button 
                  onClick={() => setIsAddingSection(true)}
                  size="sm"
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90"
                >
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {isAddingSection && (
                <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-2">
                  <Input
                    placeholder="Section title"
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                  />
                  <Input
                    placeholder="Section description (optional)"
                    value={newSectionDescription}
                    onChange={(e) => setNewSectionDescription(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button onClick={addSection} size="sm">Add</Button>
                    <Button 
                      onClick={() => setIsAddingSection(false)} 
                      variant="outline" 
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {sections.map((section) => (
                <div
                  key={section.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSection === section.id
                      ? 'border-[#FF804B] bg-[#FF804B]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{section.title}</div>
                      <div className="text-xs text-gray-500">
                        {section.lectures.length} lectures
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(section.id, 'up');
                        }}
                        disabled={section.order === 1}
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(section.id, 'down');
                        }}
                        disabled={section.order === sections.length}
                      >
                        ↓
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Lectures List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lectures</CardTitle>
                {selectedSection && (
                  <Button 
                    onClick={() => setIsAddingLecture(true)}
                    size="sm"
                    className="bg-[#2C4E41] hover:bg-[#2C4E41]/90"
                  >
                    Add Lecture
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedSection ? (
                <div className="text-center py-8 text-gray-500">
                  Select a section to view lectures
                </div>
              ) : (
                <div className="space-y-2">
                  {isAddingLecture && (
                    <div className="p-4 border border-dashed border-gray-300 rounded-lg space-y-2">
                      <Input
                        placeholder="Lecture title"
                        value={newLectureTitle}
                        onChange={(e) => setNewLectureTitle(e.target.value)}
                      />
                      <select
                        value={newLectureType}
                        onChange={(e) => setNewLectureType(e.target.value as Lecture['type'])}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="VIDEO">Video Lecture</option>
                        <option value="TEXT">Text Lecture</option>
                        <option value="QUIZ">Quiz</option>
                        <option value="ASSIGNMENT">Assignment</option>
                        <option value="CODING_EXERCISE">Coding Exercise</option>
                      </select>
                      <div className="flex gap-2">
                        <Button onClick={() => addLecture(selectedSection)} size="sm">Add</Button>
                        <Button 
                          onClick={() => setIsAddingLecture(false)} 
                          variant="outline" 
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {sections
                    .find(s => s.id === selectedSection)
                    ?.lectures.map((lecture) => (
                      <div
                        key={lecture.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedLecture === lecture.id
                            ? 'border-[#2C4E41] bg-[#2C4E41]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedLecture(lecture.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-lg">{getLectureIcon(lecture.type)}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{lecture.title}</div>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Badge className={getLectureTypeColor(lecture.type)}>
                                  {lecture.type.replace('_', ' ')}
                                </Badge>
                                {lecture.duration > 0 && (
                                  <span>{formatDuration(lecture.duration)}</span>
                                )}
                                {lecture.isFree && (
                                  <Badge variant="outline" className="text-green-600">
                                    Free
                                  </Badge>
                                )}
                                {lecture.isPreview && (
                                  <Badge variant="outline" className="text-blue-600">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLecture(selectedSection, lecture.id, 'up');
                              }}
                              disabled={lecture.order === 1}
                            >
                              ↑
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                moveLecture(selectedSection, lecture.id, 'down');
                              }}
                              disabled={lecture.order === sections.find(s => s.id === selectedSection)?.lectures.length}
                            >
                              ↓
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteLecture(selectedSection, lecture.id);
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lecture Editor */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Lecture Editor</CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedLecture ? (
                <div className="text-center py-8 text-gray-500">
                  Select a lecture to edit
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const section = sections.find(s => s.id === selectedSection);
                    const lecture = section?.lectures.find(l => l.id === selectedLecture);
                    if (!lecture) return null;

                    return (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">Lecture Title</label>
                          <Input
                            value={lecture.title}
                            onChange={(e) => updateLecture(selectedSection, selectedLecture, { title: e.target.value })}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Type</label>
                          <select
                            value={lecture.type}
                            onChange={(e) => updateLecture(selectedSection, selectedLecture, { type: e.target.value as Lecture['type'] })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="VIDEO">Video Lecture</option>
                            <option value="TEXT">Text Lecture</option>
                            <option value="QUIZ">Quiz</option>
                            <option value="ASSIGNMENT">Assignment</option>
                            <option value="CODING_EXERCISE">Coding Exercise</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                          <Input
                            type="number"
                            value={lecture.duration}
                            onChange={(e) => updateLecture(selectedSection, selectedLecture, { duration: parseInt(e.target.value) || 0 })}
                            min="0"
                          />
                        </div>

                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={lecture.isFree}
                              onChange={(e) => updateLecture(selectedSection, selectedLecture, { isFree: e.target.checked })}
                              className="rounded"
                            />
                            <span className="text-sm">Free lecture</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={lecture.isPreview}
                              onChange={(e) => updateLecture(selectedSection, selectedLecture, { isPreview: e.target.checked })}
                              className="rounded"
                            />
                            <span className="text-sm">Preview</span>
                          </label>
                        </div>

                        {lecture.type === 'VIDEO' && (
                          <div>
                            <label className="block text-sm font-medium mb-2">Video URL</label>
                            <Input
                              value={lecture.videoUrl || ''}
                              onChange={(e) => updateLecture(selectedSection, selectedLecture, { videoUrl: e.target.value })}
                              placeholder="YouTube/Vimeo URL or S3 URL"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium mb-2">Content/Description</label>
                          <textarea
                            value={lecture.content}
                            onChange={(e) => updateLecture(selectedSection, selectedLecture, { content: e.target.value })}
                            className="w-full p-2 border border-gray-300 rounded-md h-24"
                            placeholder="Lecture content or description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Drip Release Date</label>
                          <Input
                            type="datetime-local"
                            value={lecture.dripReleaseDate || ''}
                            onChange={(e) => updateLecture(selectedSection, selectedLecture, { dripReleaseDate: e.target.value })}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurriculumBuilder;
