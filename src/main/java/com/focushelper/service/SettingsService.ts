package com.focushelper.service;

import { FocusRecord } from '../model/FocusRecord';
import { UserAchievement } from '../model/UserAchievement';
import { UserSettings } from '../model/UserSettings';

/**
 * 设置服务 - 管理用户设置和持久化
 */
export class SettingsService {
  private static instance: SettingsService;
  private settings: UserSettings = UserSettings.getDefault();
  private achievements: UserAchievement[] = UserAchievement.getDefaultAchievements();
  private consecutiveDays: number = 0;
  private lastFocusDate: string = '';

  private constructor() {}

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  /**
   * 获取用户设置
   */
  getSettings(): UserSettings {
    return this.settings;
  }

  /**
   * 更新设置
   */
  updateSettings(newSettings: Partial<UserSettings>): void {
    Object.assign(this.settings, newSettings);
    this.saveSettings();
  }

  /**
   * 获取成就列表
   */
  getAchievements(): UserAchievement[] {
    return this.achievements;
  }

  /**
   * 检查并更新成就
   */
  checkAchievements(focusRecord: FocusRecord, totalMinutes: number): UserAchievement[] {
    const newlyUnlocked: UserAchievement[] = [];

    // 检查单次专注成就
    const focusMinutes = Math.floor(focusRecord.actualDuration / 60);
    
    for (const achievement of this.achievements) {
      let current = 0;
      
      switch (achievement.id) {
        case 'beginner':
          current = 1; // 只要完成一次就算
          break;
        case 'focus_25':
        case 'focus_60':
          current = focusMinutes;
          break;
        case 'total_100':
        case 'total_500':
        case 'total_1000':
          current = totalMinutes;
          break;
      }

      if (achievement.updateProgress(current)) {
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  /**
   * 更新连续天数
   */
  updateConsecutiveDays(): void {
    const today = new Date().toDateString();
    
    if (this.lastFocusDate === '') {
      this.consecutiveDays = 1;
    } else if (this.lastFocusDate !== today) {
      const lastDate = new Date(this.lastFocusDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        this.consecutiveDays++;
      } else if (diffDays > 1) {
        this.consecutiveDays = 1;
      }
    }
    
    this.lastFocusDate = today;

    // 检查连续天数成就
    for (const achievement of this.achievements) {
      if (achievement.id === 'streak_3' || achievement.id === 'streak_7') {
        const target = achievement.id === 'streak_3' ? 3 : 7;
        if (achievement.updateProgress(this.consecutiveDays >= target ? this.consecutiveDays : 0)) {
          // 解锁
        }
      }
    }
  }

  /**
   * 获取连续天数
   */
  getConsecutiveDays(): number {
    return this.consecutiveDays;
  }

  /**
   * 保存设置到持久化
   */
  private saveSettings(): void {
    // TODO: 实现持久化存储
    console.log('Settings saved:', JSON.stringify(this.settings));
  }

  /**
   * 加载设置
   */
  loadSettings(): void {
    // TODO: 从持久化加载
  }
}
