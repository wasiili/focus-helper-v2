package com.focushelper.ui;

import { FocusService } from '../service/FocusService';
import { MusicService } from '../service/MusicService';
import { SettingsService } from '../service/SettingsService';
import { MusicItem } from '../model/MusicItem';
import { DurationOption } from '../model/UserSettings';
import { UserAchievement } from '../model/UserAchievement';

/**
 * 赞美文案工具类
 */
export class EncouragementUtil {
  private static messages = [
    '太棒了！你完成了本次专注！',
    '优秀！继续保持！',
    '你做得非常好！',
    '专注力满分！🎉',
    '又完成了一次挑战！',
    '为你感到骄傲！',
    '坚持就是胜利！',
    '完美的专注表现！',
    '你真的很棒！',
    '继续加油！💪',
  ];

  static getRandom(): string {
    const index = Math.floor(Math.random() * this.messages.length);
    return this.messages[index];
  }

  static getByDuration(minutes: number): string {
    if (minutes >= 60) {
      return '超级专注达人！🌟';
    } else if (minutes >= 45) {
      return '专注力满分！🎉';
    } else if (minutes >= 25) {
      return '太棒了！你做到了！';
    } else {
      return '良好的开始！继续加油！';
    }
  }
}

/**
 * 主页面 - 专注助手首页
 */
@Entry
@Component
struct MainPage {
  @State private todayCount: number = 0;
  @State private todayMinutes: number = 0;
  @State private totalMinutes: number = 0;
  @State private showSetting: boolean = false;
  @State private selectedDuration: number = 25; // 分钟
  @State private customDuration: number = 25;
  @State private isCustomDuration: boolean = false;
  @State private isFocusing: boolean = false;
  @State private elapsedSeconds: number = 0;
  @State private showComplete: boolean = false;
  @State private completeMessage: string = '';
  @State private showMusicPicker: boolean = false;
  @State private musicList: MusicItem[] = [];
  @State private selectedMusicId: string = '';
  @State private isMusicPlaying: boolean = false;
  @State private showAchievements: boolean = false;
  @State private achievements: UserAchievement[] = [];
  @State private newAchievements: UserAchievement[] = [];
  @State private durationOptions: DurationOption[] = DurationOption.getPresets();

  private focusService = FocusService.getInstance();
  private musicService = MusicService.getInstance();
  private settingsService = SettingsService.getInstance();

  aboutToAppear() {
    this.loadData();
  }

  async loadData() {
    const stats = await this.focusService.getTodayStats();
    this.todayCount = stats.count;
    this.todayMinutes = stats.totalMinutes;
    this.musicList = this.musicService.getMusicList();
    this.achievements = this.settingsService.getAchievements();
    this.totalMinutes = this.settingsService.getSettings().dailyGoal;
  }

  async startFocus() {
    const duration = this.isCustomDuration ? this.customDuration : this.selectedDuration;
    await this.focusService.startFocus(duration * 60);
    this.isFocusing = true;
    this.elapsedSeconds = 0;

    this.focusService.startTimer((seconds) => {
      this.elapsedSeconds = seconds;
    });

    if (this.selectedMusicId) {
      await this.musicService.play(this.selectedMusicId);
      this.isMusicPlaying = true;
    }
  }

  async endFocus() {
    const musicName = this.selectedMusicId ? 
      this.musicList.find(m => m.id === this.selectedMusicId)?.name || '' : '';
    
    const record = await this.focusService.endFocus(musicName);
    this.isFocusing = false;

    await this.musicService.stop();
    this.isMusicPlaying = false;

    if (record) {
      // 检查成就
      this.newAchievements = this.settingsService.checkAchievements(record, this.todayMinutes);
      this.settingsService.updateConsecutiveDays();
      
      this.completeMessage = EncouragementUtil.getByDuration(
        Math.floor(record.actualDuration / 60)
      );
      this.showComplete = true;
    }

    await this.loadData();
  }

  build() {
    Column() {
      if (this.isFocusing) {
        this.buildFocusingView();
      } else if (this.showComplete) {
        this.buildCompleteView();
      } else if (this.showAchievements) {
        this.buildAchievementsView();
      } else {
        this.buildMainView();
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
    .padding(20)
  }

  // 主视图
  @Builder
  buildMainView() {
    Column() {
      // 统计卡片
      Row() {
        Column() {
          Text('今日专注')
            .fontSize(14)
            .fontColor('#666')
          Text(`${this.todayCount}次`)
            .fontSize(24)
            .fontWeight(FontWeight.Bold)
          Text(`${this.todayMinutes}/${this.totalMinutes}分钟`)
            .fontSize(12)
            .fontColor('#999')
        }
        .alignItems(HorizontalAlign.Center)

        Blank()

        Column() {
          Text('🏆')
            .fontSize(24)
          Text('成就')
            .fontSize(14)
            .fontColor('#666')
        }
        .alignItems(HorizontalAlign.Center)
        .onClick(() => this.showAchievements = true)
      }
      .width('100%')
      .backgroundColor('#FFF')
      .borderRadius(12)
      .padding(20)
      .margin({ bottom: 30 })

      // 时长选择
      Text('选择专注时长')
        .fontSize(16)
        .fontColor('#333')
        .margin({ bottom: 15 })

      Flex({ wrap: FlexWrap.Wrap }) {
        ForEach(this.durationOptions, (option: DurationOption) => {
          Column() {
            Text(option.label)
              .fontSize(16)
              .fontColor(this.selectedDuration === option.value && !this.isCustomDuration ? '#FFF' : '#333')
          }
          .width(80)
          .height(44)
          .backgroundColor(this.selectedDuration === option.value && !this.isCustomDuration ? '#4CAF50' : '#FFF')
          .borderRadius(22)
          .margin(5)
          .justifyContent(FlexAlign.Center)
          .onClick(() => {
            this.selectedDuration = option.value;
            this.isCustomDuration = false;
          })
        })
        // 自定义按钮
        Column() {
          Text(this.isCustomDuration ? `${this.customDuration}分` : '自定义')
            .fontSize(16)
            .fontColor(this.isCustomDuration ? '#FFF' : '#333')
        }
        .width(80)
        .height(44)
        .backgroundColor(this.isCustomDuration ? '#4CAF50' : '#FFF')
        .borderRadius(22)
        .margin(5)
        .justifyContent(FlexAlign.Center)
        .onClick(() => this.isCustomDuration = true)
      }
      .margin({ bottom: 30 })

      // 自定义时长输入
      if (this.isCustomDuration) {
        Row() {
          Text('分钟:')
            .fontSize(16)
          TextInput({ text: this.customDuration.toString() })
            .width(80)
            .type(InputType.Number)
            .onChange((value: string) => {
              const num = parseInt(value);
              if (num > 0 && num <= 120) {
                this.customDuration = num;
              }
            })
        }
        .margin({ bottom: 30 })
      }

      // 计时器预览
      Column() {
        Text(`${this.formatTime((this.isCustomDuration ? this.customDuration : this.selectedDuration) * 60)}`)
          .fontSize(64)
          .fontWeight(FontWeight.Light)
          .fontColor('#333')
      }
      .margin({ bottom: 30 })

      // 音乐选择
      Row() {
        Text('🎵')
          .fontSize(20)
        Text(this.selectedMusicId ? 
          this.musicList.find(m => m.id === this.selectedMusicId)?.name : '轻音乐')
          .fontSize(16)
          .margin({ left: 8 })
        Blank()
        Toggle({ type: ToggleType.Switch, isOn: false })
          .onChange((isOn: boolean) => {
            if (isOn && this.musicList.length > 0) {
              this.selectedMusicId = this.musicList[0].id;
            } else {
              this.selectedMusicId = '';
            }
          })
      }
      .width('100%')
      .backgroundColor('#FFF')
      .borderRadius(12)
      .padding(16)
      .margin({ bottom: 30 })

      // 开始按钮
      Button('开始专注')
        .width('60%')
        .height(50)
        .backgroundColor('#4CAF50')
        .fontColor('#FFF')
        .fontSize(18)
        .borderRadius(25)
        .onClick(() => this.startFocus())
    }
    .justifyContent(FlexAlign.Center)
  }

  // 专注中视图
  @Builder
  buildFocusingView() {
    Column() {
      Row() {
        Text('< 返回')
          .fontSize(16)
          .fontColor('#666')
          .onClick(() => this.endFocus())
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)
      .margin({ bottom: 40 })

      Text(`目标: ${this.formatTime((this.isCustomDuration ? this.customDuration : this.selectedDuration) * 60)}`)
        .fontSize(18)
        .fontColor('#666')
        .margin({ bottom: 20 })

      Text(this.formatTime(this.elapsedSeconds))
        .fontSize(72)
        .fontWeight(FontWeight.Light)
        .fontColor('#333')

      Row() {
        Progress({
          value: this.elapsedSeconds,
          total: (this.isCustomDuration ? this.customDuration : this.selectedDuration) * 60,
          style: ProgressStyle.Linear
        })
          .width('80%')
          .color('#4CAF50')
      }
      .margin({ top: 30, bottom: 40 })

      Row() {
        Text('🎵')
          .fontSize(20)
        Text(this.selectedMusicId ? 
          this.musicList.find(m => m.id === this.selectedMusicId)?.name : '')
          .fontSize(16)
          .margin({ left: 8 })
      }
      .margin({ bottom: 40 })

      Button('结束专注')
        .width('60%')
        .height(50)
        .backgroundColor('#FF5722')
        .fontColor('#FFF')
        .fontSize(18)
        .borderRadius(25)
        .onClick(() => this.endFocus())
    }
    .width('100%')
  }

  // 完成视图
  @Builder
  buildCompleteView() {
    Column() {
      Text('🎉')
        .fontSize(64)
        .margin({ bottom: 20 })

      Text(this.completeMessage)
        .fontSize(24)
        .fontWeight(FontWeight.Medium)
        .textAlign(TextAlign.Center)
        .margin({ bottom: 30 })

      Text(`本次专注 ${Math.floor(this.elapsedSeconds / 60)} 分钟`)
        .fontSize(18)
        .fontColor('#666')
        .margin({ bottom: 20 })

      // 新成就提示
      if (this.newAchievements.length > 0) {
        Column() {
          Text('🎊 新成就解锁！')
            .fontSize(16)
            .fontColor('#FFD700')
            .margin({ bottom: 10 })
          ForEach(this.newAchievements, (ach: UserAchievement) => {
            Row() {
              Text(ach.icon)
                .fontSize(24)
              Text(ach.name)
                .fontSize(16)
                .margin({ left: 8 })
            }
          })
        }
        .margin({ bottom: 30 })
      }

      Row() {
        ForEach([1, 2, 3, 4, 5], (item: number) => {
          Text(item <= 3 ? '★' : '☆')
            .fontSize(32)
            .fontColor('#FFD700')
        })
      }
      .margin({ bottom: 40 })

      Button('返回首页')
        .width('60%')
        .height(50)
        .backgroundColor('#4CAF50')
        .fontColor('#FFF')
        .fontSize(18)
        .borderRadius(25)
        .onClick(() => {
          this.showComplete = false;
          this.newAchievements = [];
        })
    }
    .width('100%')
  }

  // 成就视图
  @Builder
  buildAchievementsView() {
    Column() {
      Row() {
        Text('< 返回')
          .fontSize(16)
          .fontColor('#666')
          .onClick(() => this.showAchievements = false)
        Text('成就徽章')
          .fontSize(18)
          .fontWeight(FontWeight.Medium)
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)
      .margin({ bottom: 20 })

      List() {
        ForEach(this.achievements, (ach: UserAchievement) => {
          ListItem() {
            Row() {
              Text(ach.unlocked ? ach.icon : '🔒')
                .fontSize(32)
              Column() {
                Text(ach.name)
                  .fontSize(16)
                  .fontWeight(FontWeight.Medium)
                  .fontColor(ach.unlocked ? '#333' : '#999')
                Text(ach.description)
                  .fontSize(12)
                  .fontColor('#999')
              }
              .alignItems(HorizontalAlign.Start)
              .margin({ left: 15 })
              Blank()
              if (!ach.unlocked) {
                Text(`${ach.progress}/${ach.target}`)
                  .fontSize(14)
                  .fontColor('#999')
              }
            }
            .width('100%')
            .padding(15)
            .backgroundColor(ach.unlocked ? '#FFF9C4' : '#FFF')
            .borderRadius(10)
            .margin({ bottom: 10 })
          }
        })
      }
      .width('100%')
      .height('100%')
    }
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
