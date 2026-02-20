import { Injectable, NotFoundException } from '@nestjs/common';
import { WellnessRepository } from './wellness.repository';

@Injectable()
export class WellnessService {
  constructor(private readonly repo: WellnessRepository) {}

  // ─── Goals ─────────────────────────────────────────────────

  async getGoals(patientId: string, status?: string) {
    return this.repo.findGoals(patientId, status);
  }

  async getGoalById(goalId: string) {
    const goal = await this.repo.findGoalById(goalId);
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async createGoal(patientId: string, data: Record<string, any>) {
    return this.repo.createGoal(patientId, data);
  }

  async updateGoal(goalId: string, data: Record<string, any>) {
    const goal = await this.repo.findGoalById(goalId);
    if (!goal) throw new NotFoundException('Goal not found');
    return this.repo.updateGoal(goalId, data);
  }

  async logGoal(goalId: string, date: string, completed: boolean, notes?: string) {
    const goal = await this.repo.findGoalById(goalId);
    if (!goal) throw new NotFoundException('Goal not found');
    return this.repo.logGoal(goalId, date, completed, notes);
  }

  async getGoalHistory(goalId: string, days: number = 30) {
    return this.repo.getGoalHistory(goalId, days);
  }

  // ─── Gratitude ─────────────────────────────────────────────

  async getGratitudeEntries(patientId: string, limit?: number) {
    return this.repo.findGratitudeEntries(patientId, limit);
  }

  async getTodayGratitude(patientId: string) {
    const today = new Date().toISOString().slice(0, 10);
    return this.repo.findGratitudeByDate(patientId, today);
  }

  async saveGratitude(patientId: string, content: string, voiceNoteUrl?: string) {
    const today = new Date().toISOString().slice(0, 10);
    return this.repo.upsertGratitude(patientId, content, today, voiceNoteUrl);
  }

  async getGratitudeStreak(patientId: string) {
    return this.repo.getGratitudeStreak(patientId);
  }

  // ─── Intentions ────────────────────────────────────────────

  async getIntentions(patientId: string, limit?: number) {
    return this.repo.findIntentions(patientId, limit);
  }

  async getTodayIntention(patientId: string) {
    const today = new Date().toISOString().slice(0, 10);
    return this.repo.findIntentionByDate(patientId, today);
  }

  async saveIntention(patientId: string, data: Record<string, any>) {
    return this.repo.upsertIntention(patientId, data);
  }

  async completeIntention(patientId: string, date: string, status: string) {
    return this.repo.updateIntentionStatus(patientId, date, status);
  }

  // ─── Milestones ────────────────────────────────────────────

  async getMilestones(patientId: string, unseenOnly: boolean = false) {
    return this.repo.findMilestones(patientId, unseenOnly);
  }

  async markSeen(milestoneId: string) {
    return this.repo.markMilestoneSeen(milestoneId);
  }

  async markAllSeen(patientId: string) {
    return this.repo.markAllMilestonesSeen(patientId);
  }

  async getUnseenCount(patientId: string) {
    return this.repo.getUnseenCount(patientId);
  }

  // ─── Wellness Dashboard ────────────────────────────────────

  async getWellnessSummary(patientId: string) {
    const [goals, gratitudeStreak, todayIntention, unseenMilestones] =
      await Promise.all([
        this.repo.findGoals(patientId, 'active'),
        this.repo.getGratitudeStreak(patientId),
        this.repo.findIntentionByDate(patientId, new Date().toISOString().slice(0, 10)),
        this.repo.getUnseenCount(patientId),
      ]);

    return {
      active_goals: goals.length,
      goals_completed_today: goals.filter((g: any) => {
        const today = new Date().toISOString().slice(0, 10);
        return g.last_completed_date === today;
      }).length,
      gratitude_streak: gratitudeStreak,
      today_intention: todayIntention,
      unseen_milestones: unseenMilestones,
    };
  }
}
