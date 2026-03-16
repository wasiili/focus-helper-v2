package com.focushelper.model;

/**
 * 用户设置数据模型
 */
export class UserSettings {
  defaultDuration: number;     // 默认专注时长(分钟)
  lastMusicId: string;        // 上次使用的音乐
  dailyGoal: number;          // 每日目标(分钟)
  darkMode: boolean;          // 深色模式
  language: string;           // 语言
  dndEnabled: boolean;        // 勿扰模式联动
  maxDuration: number;        // 单次最大时长(分钟)

  constructor() {
    this.defaultDuration = 25;
    this.lastMusicId = '';
    this.dailyGoal = 120;
    this.darkMode = false;
    this.language = 'zh-CN';
    this.dndEnabled = false;
    this.maxDuration = 120;
  }

  static getDefault(): UserSettings {
    return new UserSettings();
  }
}

/**
 * 专注时长选项
 */
export class DurationOption {
  label: string;
  value: number; // 分钟

  constructor(label: string, value: number) {
    this.label = label;
    this.value = value;
  }

  static getPresets(): DurationOption[] {
    return [
      new DurationOption('15分钟', 15),
      new DurationOption('25分钟', 25),
      new DurationOption('30分钟', 30),
      new DurationOption('45分钟', 45),
      new DurationOption('60分钟', 60),
      new DurationOption('90分钟', 90),
      new DurationOption('120分钟', 120),
    ];
  }
}
