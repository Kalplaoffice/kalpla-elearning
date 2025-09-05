import CoursePlayer from '@/components/CoursePlayer';

interface CoursePlayerPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export default function CoursePlayerPage({ params }: CoursePlayerPageProps) {
  return (
    <CoursePlayer 
      courseId={params.courseId} 
      lessonId={params.lessonId} 
    />
  );
}
