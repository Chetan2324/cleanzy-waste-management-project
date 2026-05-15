import api from './api';

const API_URL = '/schedules';

const createSchedule = async (data) => {
  const response = await api.post(API_URL, data);
  return response.data;
};

const getMySchedules = async () => {
  const response = await api.get(`${API_URL}/my`);
  return response.data;
};

const getAllSchedules = async () => {
  const response = await api.get(`${API_URL}/all`);
  return response.data;
};

const updateScheduleStatus = async (id, status) => {
  const response = await api.put(`${API_URL}/${id}/status`, { status });
  return response.data;
};

const scheduleService = {
  createSchedule,
  getMySchedules,
  getAllSchedules,
  updateScheduleStatus,
};

export default scheduleService;