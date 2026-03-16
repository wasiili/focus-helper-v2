package com.focushelper.model;

/**
 * 用户成就数据模型
 */
export class UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: number;
  progress: number;
  target: number;

  constructor(id: string, name: string, description: string, icon: string, target: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.unlocked = false;
    this.unlockedAt = 0;
    this.progress = 0;
    this.target = target;
  }

  static getDefaultAchievements(): UserAchievement[] {
    return [
      new UserAchievement('beginner', '初学者', '完成第一次专注', '🌱', 1),
      new UserAchievement('focus_25', '25分钟达人', '单次专注25分钟', '⏱️', 25),
      new UserAchievement('focus_60', '一小时大师', '单次专注60分钟', '🏆', 60),
      new UserAchievement('streak_3', '三天连续', '连续专注3天', '🔥', 3),
      new UserAchievement('streak_7', '一周坚持', '连续专注7天', '💪', 7),
      new UserAchievement('total_100', '百分达人', '累计专注100分钟', '⭐', 100),
      new UserAchievement('total_500', '五百分选手', '累计专注500分钟', '🌟', 500),
      new UserAchievement('total_1000', '千分传奇', '累计专注1000分钟', '👑', 1000),
    ];
  }

  updateProgress(current: number): boolean {
    this.progress = current;
    if (current >= this.target && !this.unlocked) {
      this.unlocked = true;
      this.unlockedAt = Date.now();
      return true; // 返回true表示解锁了新成就
    }
    return false;
  }
}
