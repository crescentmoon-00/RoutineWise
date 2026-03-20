import { apiClient } from './api';
import { ChildProfile, Routine, ActivityLog, Rule } from '../types';

export const childService = {
  // Get all children for parent
  getChildren: async (): Promise<ChildProfile[]> => {
    const response = await apiClient.get<ChildProfile[]>('/children');
    return response.data;
  },

  // Get single child profile
  getChild: async (childId: string): Promise<ChildProfile> => {
    const response = await apiClient.get<ChildProfile>(`/children/${childId}`);
    return response.data;
  },

  // Create child profile
  createChild: async (childData: Partial<ChildProfile>): Promise<ChildProfile> => {
    const response = await apiClient.post<ChildProfile>('/children', childData);
    return response.data;
  },

  // Update child profile
  updateChild: async (childId: string, childData: Partial<ChildProfile>): Promise<ChildProfile> => {
    const response = await apiClient.put<ChildProfile>(`/children/${childId}`, childData);
    return response.data;
  },

  // Delete child profile
  deleteChild: async (childId: string): Promise<void> => {
    await apiClient.delete<void>(`/children/${childId}`);
  },

  // Get routines for child
  getRoutines: async (childId: string): Promise<Routine[]> => {
    const response = await apiClient.get<Routine[]>(`/children/${childId}/routines`);
    return response.data;
  },

  // Create routine
  createRoutine: async (childId: string, routine: Partial<Routine>): Promise<Routine> => {
    const response = await apiClient.post<Routine>(`/children/${childId}/routines`, routine);
    return response.data;
  },

  // Update routine
  updateRoutine: async (childId: string, routineId: string, routine: Partial<Routine>): Promise<Routine> => {
    const response = await apiClient.put<Routine>(`/children/${childId}/routines/${routineId}`, routine);
    return response.data;
  },

  // Delete routine
  deleteRoutine: async (childId: string, routineId: string): Promise<void> => {
    await apiClient.delete<void>(`/children/${childId}/routines/${routineId}`);
  },

  // Get logs for child
  getLogs: async (childId: string, startDate?: Date, endDate?: Date): Promise<ActivityLog[]> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate.toISOString());
    if (endDate) params.append('endDate', endDate.toISOString());
    const response = await apiClient.get<ActivityLog[]>(`/children/${childId}/logs?${params}`);
    return response.data;
  },

  // Create log entry
  createLog: async (childId: string, log: Partial<ActivityLog>): Promise<ActivityLog> => {
    const response = await apiClient.post<ActivityLog>(`/children/${childId}/logs`, log);
    return response.data;
  },

  // Update log entry
  updateLog: async (childId: string, logId: string, log: Partial<ActivityLog>): Promise<ActivityLog> => {
    const response = await apiClient.put<ActivityLog>(`/children/${childId}/logs/${logId}`, log);
    return response.data;
  },

  // Delete log entry
  deleteLog: async (childId: string, logId: string): Promise<void> => {
    await apiClient.delete<void>(`/children/${childId}/logs/${logId}`);
  },

  // Get rules for child
  getRules: async (childId: string): Promise<Rule[]> => {
    const response = await apiClient.get<Rule[]>(`/children/${childId}/rules`);
    return response.data;
  },

  // Create rule
  createRule: async (childId: string, rule: Partial<Rule>): Promise<Rule> => {
    const response = await apiClient.post<Rule>(`/children/${childId}/rules`, rule);
    return response.data;
  },

  // Update rule
  updateRule: async (childId: string, ruleId: string, rule: Partial<Rule>): Promise<Rule> => {
    const response = await apiClient.put<Rule>(`/children/${childId}/rules/${ruleId}`, rule);
    return response.data;
  },

  // Delete rule
  deleteRule: async (childId: string, ruleId: string): Promise<void> => {
    await apiClient.delete<void>(`/children/${childId}/rules/${ruleId}`);
  },
};
