package com.focushelper.model;

/**
 * 音乐项数据模型
 */
export class MusicItem {
  id: string;
  name: string;
  resource: string;
  duration: number;

  constructor(id: string, name: string, resource: string, duration: number) {
    this.id = id;
    this.name = name;
    this.resource = resource;
    this.duration = duration;
  }

  static getDefaultList(): MusicItem[] {
    return [
      new MusicItem('1', '雨声轻音乐', 'rain.mp3', 300),
      new MusicItem('2', '森林鸟鸣', 'forest.mp3', 300),
      new MusicItem('3', '海浪声', 'ocean.mp3', 300),
      new MusicItem('4', '咖啡馆白噪音', 'cafe.mp3', 300),
      new MusicItem('5', '古典钢琴', 'piano.mp3', 300),
    ];
  }
}
