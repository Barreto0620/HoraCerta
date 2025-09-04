import { supabase } from '../lib/supabase';
import { User, TimeEntry } from '../types';

export const storage = {
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

      return data || [];
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
          id: entry.id,
          user_id: entry.userId,
          date: entry.date,
          start_time: entry.startTime,
          minutes: entry.minutes,
          ticket_id: entry.ticketId,
          description: entry.description,
          created_at: entry.createdAt
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
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

      // Converter para o formato esperado pela aplicação
      const entries: TimeEntry[] = (data || []).map(entry => ({
        id: entry.id,
        userId: entry.user_id,
        date: entry.date,
        startTime: entry.start_time,
        minutes: entry.minutes,
        ticketId: entry.ticket_id,
        description: entry.description,
        createdAt: entry.created_at
      }));

      return { data: entries, error: null };
    } catch (error: any) {
      console.error('Erro ao buscar registros do usuário:', error);
      return { data: [], error };
    }
  },

  async updateTimeEntry(id: string, updates: Partial<TimeEntry>) {
    try {
      const updateData: any = {};

      if (updates.date) updateData.date = updates.date;
      if (updates.startTime) updateData.start_time = updates.startTime;
      if (updates.minutes) updateData.minutes = updates.minutes;
      if (updates.ticketId !== undefined) updateData.ticket_id = updates.ticketId;
      if (updates.description !== undefined) updateData.description = updates.description;

      updateData.updated_at = new Date().toISOString();

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
  // PREFERÊNCIAS (manter no localStorage)
  // ===================

  getTheme(): boolean {
    const theme = localStorage.getItem('clt_tracking_theme');
    return theme ? JSON.parse(theme) : false;
  },

  setTheme(isDark: boolean): void {
    localStorage.setItem('clt_tracking_theme', JSON.stringify(isDark));
  },
};
