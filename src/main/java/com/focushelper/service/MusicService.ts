package com.focushelper.service;

import { MusicItem } from '../model/MusicItem';
import { media } from '@kit.MediaKit';

/**
 * 音乐服务 - 管理背景音乐播放
 */
export class MusicService {
  private static instance: MusicService;
  private musicList: MusicItem[] = [];
  private currentPlayer: media.AudioPlayer | null = null;
  private currentMusicId: string = '';
  private isPlaying: boolean = false;
  private volume: number = 50;

  private constructor() {
    this.musicList = MusicItem.getDefaultList();
  }

  static getInstance(): MusicService {
    if (!MusicService.instance) {
      MusicService.instance = new MusicService();
    }
    return MusicService.instance;
  }

  /**
   * 获取音乐列表
   */
  getMusicList(): MusicItem[] {
    return this.musicList;
  }

  /**
   * 播放音乐
   */
  async play(musicId: string): Promise<void> {
    const music = this.musicList.find(m => m.id === musicId);
    if (!music) {
      console.error('Music not found:', musicId);
      return;
    }

    // 停止当前音乐
    await this.stop();

    try {
      // 创建播放器
      this.currentPlayer = await media.createAudioPlayer();
      this.currentMusicId = musicId;

      // 设置音量
      await this.currentPlayer.setVolume(this.volume / 100);

      // 播放（这里简化处理，实际需要加载资源）
      this.isPlaying = true;
      console.log('Playing:', music.name);
    } catch (error) {
      console.error('Failed to play music:', error);
    }
  }

  /**
   * 暂停
   */
  async pause(): Promise<void> {
    if (this.currentPlayer && this.isPlaying) {
      await this.currentPlayer.pause();
      this.isPlaying = false;
    }
  }

  /**
   * 恢复播放
   */
  async resume(): Promise<void> {
    if (this.currentPlayer && !this.isPlaying) {
      await this.currentPlayer.play();
      this.isPlaying = true;
    }
  }

  /**
   * 停止播放
   */
  async stop(): Promise<void> {
    if (this.currentPlayer) {
      await this.currentPlayer.stop();
      await this.currentPlayer.release();
      this.currentPlayer = null;
      this.currentMusicId = '';
      this.isPlaying = false;
    }
  }

  /**
   * 设置音量
   */
  async setVolume(level: number): Promise<void> {
    this.volume = Math.max(0, Math.min(100, level));
    if (this.currentPlayer) {
      await this.currentPlayer.setVolume(this.volume / 100);
    }
  }

  /**
   * 获取当前音量
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * 是否正在播放
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * 获取当前音乐ID
   */
  getCurrentMusicId(): string {
    return this.currentMusicId;
  }
}
