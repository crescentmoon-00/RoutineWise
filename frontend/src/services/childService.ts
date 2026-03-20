import { apiClient } from './api';
import type { ChildProfile, Routine, ActivityLog, Rule } from '@/types';

export const childService = {
  // Get all children for parent
  getChildren: async (): Promise<ChildProfile[]> => {
    const response: any = await apiClient.get('/children');
    return response.children || [];
  },

  // Get single child profile
  getChild: async (childId: string): Promise<ChildProfile> => {
    const response: any = await apiClient.get(`/children/${childId}`);
    return response.child;
  },

  // Create child profile
  createChild: async (childData: Partial<ChildProfile>): Promise<ChildProfile> => {
    const response: any = await apiClient.post('/children', childData);
    return response.child;
  },

  // Update child profile
  updateChild: async (childId: string, childData: Partial<ChildProfile>): Promise<ChildProfile> => {
    const response: any = await apiClient.put(`/children/${childId}`, childData);
    return response.child;
  },

  // Delete child profile
  deleteChild: async (childId: string): Promise<void> => {
    await apiClient.delete<void>(`/children/${childId}`);
  },

  // Get routines for child
  getRoutines: async (childId: string): Promise<Routine[]> => {
    const response: any = await apiClient.get(`/children/${childId}/routines`);
    return response.routines || [];
  },

  // Create routine
  createRoutine: async (childId: string, routine: Partial<Routine>): Promise<Routine> => {
    const response: any = await apiClient.post(`/children/${childId}/routines`, routine);
    return response.routine;
  },

  // Update routine
  updateRoutine: async (childId: string, routineId: string, routine: Partial<Routine>): Promise<Routine> => {
    const response: any = await apiClient.put(`/children/${childId}/routines/${routineId}`, routine);
    return response.routine;
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
    const response: any = await apiClient.get(`/children/${childId}/logs?${params}`);
    return response.logs || [];
  },

  // Create log entry
  createLog: async (childId: string, log: Partial<ActivityLog>): Promise<ActivityLog> => {
    const response: any = await apiClient.post(`/children/${childId}/logs`, log);
    return response.log;
  },

  // Update log entry
  updateLog: async (childId: string, logId: string, log: Partial<ActivityLog>): Promise<ActivityLog> => {
    const response: any = await apiClient.put(`/children/${childId}/logs/${logId}`, log);
    return response.log;
  },

  // Delete log entry
  deleteLog: async (childId: string, logId: string): Promise<void> => {
    await apiClient.delete<void>(`/children/${childId}/logs/${logId}`);
  },

  // Get rules for child
  getRules: async (childId: string): Promise<Rule[]> => {
    const response: any = await apiClient.get(`/children/${childId}/rules`);
    return response.rules || [];
  },

  // Create rule
  createRule: async (childId: string, rule: Partial<Rule>): Promise<Rule> => {
    const response: any = await apiClient.post(`/children/${childId}/rules`, rule);
    return response.rule;
  },

  // Update rule
  updateRule: async (childId: string, ruleId: string, rule: Partial<Rule>): Promise<Rule> => {
    const response: any = await apiClient.put(`/children/${childId}/rules/${ruleId}`, rule);
    return response.rule;
  },

  // Delete rule
  deleteRule: async (childId: string, ruleId: string): Promise<void> => {
    await apiClient.delete<void>(`/children/${childId}/rules/${ruleId}`);
  },
};
