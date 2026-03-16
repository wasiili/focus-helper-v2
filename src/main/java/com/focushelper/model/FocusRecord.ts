package com.focushelper.model;

/**
 * 专注记录数据模型
 */
export class FocusRecord {
  id: string;
  startTime: number;
  endTime: number;
  targetDuration: number;
  actualDuration: number;
  completed: boolean;
  musicUsed: string;

  constructor() {
    this.id = '';
    this.startTime = 0;
    this.endTime = 0;
    this.targetDuration = 0;
    this.actualDuration = 0;
    this.completed = false;
    this.musicUsed = '';
  }

  static create(targetDuration: number): FocusRecord {
    const record = new FocusRecord();
    record.id = Date.now().toString();
    record.startTime = Date.now();
    record.targetDuration = targetDuration;
    return record;
  }

  complete(musicUsed: string = ''): void {
    this.endTime = Date.now();
    this.actualDuration = Math.floor((this.endTime - this.startTime) / 1000);
    this.completed = this.actualDuration >= this.targetDuration;
    this.musicUsed = musicUsed;
  }
}
