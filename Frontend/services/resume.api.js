import { baseUrl } from './auth.api';

export async function UploadMasterResume(file) {
  try {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await baseUrl.post('/api/resume/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during master resume upload:', error);
    throw error;
  }
}

export async function TailorResume(resumeId, jobDescription) {
  try {
    const response = await baseUrl.post('/api/resume/tailor', {
      resumeId,
      jobDescription,
    });
    return response.data;
  } catch (error) {
    console.error('Error during resume tailoring:', error);
    throw error;
  }
}

export async function GetMyResumes() {
  try {
    const response = await baseUrl.get('/api/resume/my-resumes');
    return response.data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
}
export async function GetResumeById(resumeId) {
  try {
    const response = await baseUrl.get(`/api/resume/${resumeId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resume by ID:', error);
    throw error;
  }
}
export async function DownloadResumePdf(id) {
  try {
    const response = await baseUrl.get(`/api/resume/download/${id}`, {
      responseType: 'blob', // Ye line PDF download ke liye sabse important hai!
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}