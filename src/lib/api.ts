import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

const client = generateClient<Schema>();

// Course API
export const courseAPI = {
  // Get all courses
  async getAllCourses() {
    try {
      const { data: courses } = await client.models.Course.list();
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Get course by ID
  async getCourseById(courseId: string) {
    try {
      const { data: course } = await client.models.Course.get({ id: courseId });
      return course;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  },

  // Create course
  async createCourse(courseData: any) {
    try {
      const { data: course } = await client.models.Course.create(courseData);
      return course;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  },

  // Update course
  async updateCourse(courseId: string, courseData: any) {
    try {
      const { data: course } = await client.models.Course.update({
        id: courseId,
        ...courseData
      });
      return course;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  // Delete course
  async deleteCourse(courseId: string) {
    try {
      const { data: course } = await client.models.Course.delete({ id: courseId });
      return course;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Get course sections
  async getCourseSections(courseId: string) {
    try {
      const { data: sections } = await client.models.CourseSection.list({
        filter: { courseId: { eq: courseId } }
      });
      return sections;
    } catch (error) {
      console.error('Error fetching course sections:', error);
      throw error;
    }
  },

  // Get course lectures
  async getCourseLectures(courseId: string) {
    try {
      const { data: lectures } = await client.models.CourseLecture.list({
        filter: { courseId: { eq: courseId } }
      });
      return lectures;
    } catch (error) {
      console.error('Error fetching course lectures:', error);
      throw error;
    }
  }
};

// User API
export const userAPI = {
  // Get all users
  async getAllUsers() {
    try {
      const { data: users } = await client.models.User.list();
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  async getUserById(userId: string) {
    try {
      const { data: user } = await client.models.User.get({ id: userId });
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user
  async updateUser(userId: string, userData: any) {
    try {
      const { data: user } = await client.models.User.update({
        id: userId,
        ...userData
      });
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
};

// Enrollment API
export const enrollmentAPI = {
  // Get user enrollments
  async getUserEnrollments(userId: string) {
    try {
      const { data: enrollments } = await client.models.Enrollment.list({
        filter: { userId: { eq: userId } }
      });
      return enrollments;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  },

  // Enroll user in course
  async enrollUser(userId: string, courseId: string) {
    try {
      const { data: enrollment } = await client.models.Enrollment.create({
        userId,
        courseId,
        status: 'ACTIVE',
        enrolledAt: new Date().toISOString()
      });
      return enrollment;
    } catch (error) {
      console.error('Error enrolling user:', error);
      throw error;
    }
  },

  // Update enrollment progress
  async updateEnrollmentProgress(enrollmentId: string, progress: number) {
    try {
      const { data: enrollment } = await client.models.Enrollment.update({
        id: enrollmentId,
        progress
      });
      return enrollment;
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
      throw error;
    }
  }
};

// Assignment API
export const assignmentAPI = {
  // Get course assignments
  async getCourseAssignments(courseId: string) {
    try {
      const { data: assignments } = await client.models.Assignment.list({
        filter: { courseId: { eq: courseId } }
      });
      return assignments;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  // Create assignment
  async createAssignment(assignmentData: any) {
    try {
      const { data: assignment } = await client.models.Assignment.create(assignmentData);
      return assignment;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  // Get assignment submissions
  async getAssignmentSubmissions(assignmentId: string) {
    try {
      const { data: submissions } = await client.models.AssignmentSubmission.list({
        filter: { assignmentId: { eq: assignmentId } }
      });
      return submissions;
    } catch (error) {
      console.error('Error fetching assignment submissions:', error);
      throw error;
    }
  }
};

// Community API
export const communityAPI = {
  // Get community posts
  async getCommunityPosts(limit: number = 20) {
    try {
      const { data: posts } = await client.models.CommunityPost.list({
        limit
      });
      return posts;
    } catch (error) {
      console.error('Error fetching community posts:', error);
      throw error;
    }
  },

  // Create community post
  async createCommunityPost(postData: any) {
    try {
      const { data: post } = await client.models.CommunityPost.create(postData);
      return post;
    } catch (error) {
      console.error('Error creating community post:', error);
      throw error;
    }
  },

  // Get community comments
  async getCommunityComments(postId: string) {
    try {
      const { data: comments } = await client.models.CommunityComment.list({
        filter: { postId: { eq: postId } }
      });
      return comments;
    } catch (error) {
      console.error('Error fetching community comments:', error);
      throw error;
    }
  }
};

// Analytics API
export const analyticsAPI = {
  // Get course analytics
  async getCourseAnalytics(courseId: string) {
    try {
      // Get enrollments
      const { data: enrollments } = await client.models.Enrollment.list({
        filter: { courseId: { eq: courseId } }
      });

      // Get assignments
      const { data: assignments } = await client.models.Assignment.list({
        filter: { courseId: { eq: courseId } }
      });

      // Calculate analytics
      const totalEnrollments = enrollments.length;
      const completedEnrollments = enrollments.filter(e => e.progress === 100).length;
      const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;

      return {
        totalEnrollments,
        completedEnrollments,
        completionRate,
        totalAssignments: assignments.length
      };
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      throw error;
    }
  }
};

// Storage API
export const storageAPI = {
  // Upload file
  async uploadFile(file: File, path: string) {
    try {
      const { data } = await client.storage.uploadData({
        key: path,
        data: file
      });
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get file URL
  async getFileUrl(key: string) {
    try {
      const { data } = await client.storage.getUrl({
        key
      });
      return data;
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  }
};

export default {
  courseAPI,
  userAPI,
  enrollmentAPI,
  assignmentAPI,
  communityAPI,
  analyticsAPI,
  storageAPI
};
