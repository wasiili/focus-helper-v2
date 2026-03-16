package com.focushelper.service;

import { FocusRecord } from '../model/FocusRecord';
import { MusicItem } from '../model/MusicItem';
import { PreferencesManager } from '@ohos.data.preferences';

/**
 * 专注服务 - 管理专注计时和记录
 */
export class FocusService {
  private static instance: FocusService;
  private currentFocus: FocusRecord | null = null;
  private timer: number | null = null;
  private onTickCallback: ((seconds: number) => void) | null = null;
  private historyKey = 'focus_history';
  private preferences: PreferencesManager | null = null;

  private constructor() {}

  static getInstance(): FocusService {
    if (!FocusService.instance) {
      FocusService.instance = new FocusService();
    }
    return FocusService.instance;
  }

  /**
   * 开始专注
   */
  async startFocus(targetDuration: number): Promise<FocusRecord> {
    // 停止之前的计时
    this.stopTimer();

    this.currentFocus = FocusRecord.create(targetDuration);
    return this.currentFocus;
  }

  /**
   * 结束专注
   */
  async endFocus(musicUsed: string = ''): Promise<FocusRecord | null> {
    if (!this.currentFocus) {
      return null;
    }

    this.currentFocus.complete(musicUsed);
    const completed = this.currentFocus;

    // 保存到历史
    await this.saveRecord(completed);

    this.stopTimer();
    this.currentFocus = null;

    return completed;
  }

  /**
   * 获取当前专注状态
   */
  getFocusing(): FocusRecord | null {
    return this.currentFocus;
  }

  /**
   * 获取专注中经过的秒数
   */
  getElapsedSeconds(): number {
    if (!this.currentFocus) {
      return 0;
    }
    return Math.floor((Date.now() - this.currentFocus.startTime) / 1000);
  }

  /**
   * 启动计时器
   */
  startTimer(onTick: (seconds: number) => void): void {
    this.onTickCallback = onTick;
    this.timer = setInterval(() => {
      if (this.onTickCallback) {
        this.onTickCallback(this.getElapsedSeconds());
      }
    }, 1000);
  }

  /**
   * 停止计时器
   */
  stopTimer(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.onTickCallback = null;
  }

  /**
   * 获取历史记录
   */
  async getHistory(): Promise<FocusRecord[]> {
    // 简化实现，返回空数组
    // 实际应从持久化存储读取
    return [];
  }

  /**
   * 获取今日统计
   */
  async getTodayStats(): Promise<{ count: number; totalMinutes: number }> {
    const history = await this.getHistory();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const todayRecords = history.filter(r => r.startTime >= todayStart);
    const totalSeconds = todayRecords.reduce((sum, r) => sum + r.actualDuration, 0);

    return {
      count: todayRecords.length,
      totalMinutes: Math.floor(totalSeconds / 60)
    };
  }

  /**
   * 保存记录
   */
  private async saveRecord(record: FocusRecord): Promise<void> {
    // TODO: 实现持久化存储
    console.log('Focus record saved:', JSON.stringify(record));
  }
}
