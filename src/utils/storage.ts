import { supabase } from '../lib/supabase';
import { User, TimeEntry } from '../types';

export const storage = {
  // ===================
  // PERFIS DE USUÁRIO
  // ===================

  async createProfile(user: User) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: user.name,
          email: user.email,
          department: user.department,
          created_at: user.created_at,
          updated_at: user.updated_at
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro ao criar perfil:', error);
      return { data: null, error };
    }
  },

  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const profile: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        department: data.department,
        ip_address: data.ip_address,
        avatar_url: data.avatar_url,
        phone: data.phone,
        timezone: data.timezone,
        is_active: data.is_active,
        last_login_at: data.last_login_at,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return { data: profile, error: null };
    } catch (error: any) {
      console.error('Erro ao buscar perfil:', error);
      return { data: null, error };
    }
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.name) updateData.name = updates.name;
      if (updates.department) updateData.department = updates.department;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.avatar_url !== undefined) updateData.avatar_url = updates.avatar_url;
      if (updates.timezone !== undefined) updateData.timezone = updates.timezone;
      if (updates.is_active !== undefined) updateData.is_active = updates.is_active;

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      return { data: null, error };
    }
  },

  // ===================
  // REGISTROS DE TEMPO
  // ===================

  async getTimeEntries(): Promise<TimeEntry[]> {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      const entries: TimeEntry[] = (data || []).map(entry => ({
        id: entry.id,
        user_id: entry.user_id,
        date: entry.date,
        start_time: entry.start_time,
        minutes: entry.minutes,
        ticket_id: entry.ticket_id,
        description: entry.description,
        project_name: entry.project_name,
        activity_type: entry.activity_type,
        is_billable: entry.is_billable,
        is_approved: entry.is_approved,
        approved_by: entry.approved_by,
        approved_at: entry.approved_at,
        created_at: entry.created_at,
        updated_at: entry.updated_at
      }));

      return entries;
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      return [];
    }
  },

  async saveTimeEntry(entry: TimeEntry) {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .insert({
          user_id: entry.user_id,
          date: entry.date,
          start_time: entry.start_time,
          minutes: entry.minutes,
          ticket_id: entry.ticket_id,
          description: entry.description,
          project_name: entry.project_name,
          activity_type: entry.activity_type,
          is_billable: entry.is_billable || true,
          is_approved: false
        })
        .select()
        .single();

      if (error) throw error;

      const savedEntry: TimeEntry = {
        id: data.id,
        user_id: data.user_id,
        date: data.date,
        start_time: data.start_time,
        minutes: data.minutes,
        ticket_id: data.ticket_id,
        description: data.description,
        project_name: data.project_name,
        activity_type: data.activity_type,
        is_billable: data.is_billable,
        is_approved: data.is_approved,
        approved_by: data.approved_by,
        approved_at: data.approved_at,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      return { data: savedEntry, error: null };
    } catch (error: any) {
      console.error('Erro ao salvar registro:', error);
      return { data: null, error };
    }
  },

  async getUserTimeEntries(userId: string) {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) throw error;

      const entries: TimeEntry[] = (data || []).map(entry => ({
        id: entry.id,
        user_id: entry.user_id,
        date: entry.date,
        start_time: entry.start_time,
        minutes: entry.minutes,
        ticket_id: entry.ticket_id,
        description: entry.description,
        project_name: entry.project_name,
        activity_type: entry.activity_type,
        is_billable: entry.is_billable,
        is_approved: entry.is_approved,
        approved_by: entry.approved_by,
        approved_at: entry.approved_at,
        created_at: entry.created_at,
        updated_at: entry.updated_at
      }));

      return { data: entries, error: null };
    } catch (error: any) {
      console.error('Erro ao buscar registros do usuário:', error);
      return { data: [], error };
    }
  },

  async updateTimeEntry(id: string, updates: Partial<TimeEntry>) {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      if (updates.date) updateData.date = updates.date;
      if (updates.start_time) updateData.start_time = updates.start_time;
      if (updates.minutes) updateData.minutes = updates.minutes;
      if (updates.ticket_id !== undefined) updateData.ticket_id = updates.ticket_id;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.project_name !== undefined) updateData.project_name = updates.project_name;
      if (updates.activity_type !== undefined) updateData.activity_type = updates.activity_type;
      if (updates.is_billable !== undefined) updateData.is_billable = updates.is_billable;

      const { data, error } = await supabase
        .from('time_entries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar registro:', error);
      return { data: null, error };
    }
  },

  async deleteTimeEntry(id: string) {
    try {
      const { error } = await supabase
        .from('time_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Erro ao deletar registro:', error);
      return { error };
    }
  },

  // ===================
  // PREFERÊNCIAS (localStorage)
  // ===================

  getTheme(): boolean {
    const theme = localStorage.getItem('clt_tracking_theme');
    return theme ? JSON.parse(theme) : false;
  },

  setTheme(isDark: boolean): void {
    localStorage.setItem('clt_tracking_theme', JSON.stringify(isDark));
  },
};