import api from './api';

const API_URL = '/reports';

// --- Resident Functions ---

// Create a new report
// @desc    Create a new report (Supports Images)
// @route   POST /api/reports
const createReport = async (reportData) => {
  // We don't need to manually set 'Content-Type': 'multipart/form-data'
  // Axios detects FormData and sets it automatically!
  const response = await api.post(API_URL, reportData);
  return response.data;
};

// Get user's own reports
const getMyReports = async () => {
  const response = await api.get(`${API_URL}/myreports`);
  return response.data;
};

// --- Admin Functions ---

// Get ALL reports (Admin only)
const getAllReports = async () => {
  const response = await api.get(`${API_URL}/all`);
  return response.data;
};

// Update report status (Admin only)
const updateReportStatus = async (id, status) => {
  const response = await api.put(`${API_URL}/${id}/status`, { status });
  return response.data;
};

const reportService = {
  createReport,
  getMyReports,
  getAllReports,       // <-- New
  updateReportStatus,  // <-- New
};

export default reportService;