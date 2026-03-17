package com.focushelper.ui;

import { FocusService } from '../service/FocusService';
import { MusicService } from '../service/MusicService';
import { SettingsService } from '../service/SettingsService';
import { MusicItem } from '../model/MusicItem';
import { DurationOption } from '../model/UserSettings';
import { UserAchievement } from '../model/UserAchievement';
import { animateTo } from '@kit.ArkUI';
import { audio } from '@kit.AudioKit';

/**
 * 音效管理器
 */
export class SoundManager {
  private static soundEnabled: boolean = true;
  private static volume: number = 0.7;
  
  // 音效类型
  static readonly SOUND_TAP = 'tap';
  static readonly SOUND_START = 'start';
  static readonly SOUND_END = 'end';
  static readonly SOUND_ACHIEVE = 'achieve';
  static readonly SOUND_COMPLETE = 'complete';
  static readonly SOUND_REMINDER = 'reminder';
  
  static setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }
  
  static setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }
  
  static isEnabled(): boolean {
    return this.soundEnabled;
  }
  
  // 播放音效
  static async playSound(type: string) {
    if (!this.soundEnabled) return;
    
    // 这里简化处理，实际项目中需要加载真实音频文件
    // 鸿蒙音频播放示例:
    // const audioRenderer = await audio.createAudioRenderer();
    // await audioRenderer.start();
    console.log(`[Sound] Playing: ${type}, volume: ${this.volume}`);
  }
  
  // 播放提示音
  static async playTone(frequency: number, duration: number) {
    if (!this.soundEnabled) return;
    console.log(`[Sound] Tone: ${frequency}Hz, ${duration}ms`);
  }
}

/**
 * 主题色彩系统
 */
export class ThemeManager {
  static themes = {
    morning: {
      name: '晨曦',
      primary: '#FF9500',
      secondary: '#FF6B00',
      background: '#FFF8F0',
      accent: '#FFD60A',
      gradient: ['#FF9500', '#FF6B00']
    },
    forest: {
      name: '森林',
      primary: '#4CAF50',
      secondary: '#2E7D32',
      background: '#F5F5F5',
      accent: '#81C784',
      gradient: ['#4CAF50', '#2E7D32']
    },
    ocean: {
      name: '海洋',
      primary: '#2196F3',
      secondary: '#1565C0',
      background: '#F0F8FF',
      accent: '#64B5F6',
      gradient: ['#2196F3', '#1565C0']
    },
    dusk: {
      name: '暮色',
      primary: '#7C4DFF',
      secondary: '#536DFE',
      background: '#F3F0FF',
      accent: '#B388FF',
      gradient: ['#7C4DFF', '#536DFE']
    },
    sakura: {
      name: '樱粉',
      primary: '#FF80AB',
      secondary: '#F48FB1',
      background: '#FFF0F5',
      accent: '#FF4081',
      gradient: ['#FF80AB', '#F48FB1']
    }
  };
  
  static currentTheme = 'forest';
  
  static getTheme() {
    return this.themes[this.currentTheme as keyof typeof this.themes] || this.themes.forest;
  }
  
  static setTheme(theme: string) {
    if (this.themes[theme as keyof typeof this.themes]) {
      this.currentTheme = theme;
    }
  }
}

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
  
  // 动画状态
  @State private pageOpacity: number = 1;
  @State private pageScale: number = 1;
  @State private buttonScale: number = 1;
  @State private cardHoverIndex: number = -1;
  
  // 主题状态
  @State private currentTheme: string = 'forest';
  @State private showThemePicker: boolean = false;
  
  // 手势状态
  @State private swipeX: number = 0;
  @State private isSwiping: boolean = false;
  @State private longPressTimer: number = 0;
  @State private showTimerDetail: boolean = false;
  
  // 音效状态
  @State private soundEnabled: boolean = true;
  
  // 加载状态
  @State private isLoading: boolean = true;
  @State private showSplash: boolean = true;
  @State private splashOpacity: number = 1;
  
  // 空状态/错误状态
  @State private showEmptyState: boolean = false;
  @State private emptyStateType: string = ''; // 'achievements' | 'records' | 'music'
  @State private errorMessage: string = '';
  @State private showError: boolean = false;
  
  // 动效状态
  @State private progressValue: number = 0;
  @State private showParticles: boolean = false;
  @State private timerPulse: boolean = false;
  
  // 无障碍/辅助功能状态
  @State private reduceMotion: boolean = false;
  @State private highContrast: boolean = false;
  @State private fontSize: string = 'medium'; // 'small' | 'medium' | 'large'
  @State private screenReaderEnabled: boolean = false;
  @State private showAccessibilitySettings: boolean = false;
  
  // 性能/稳定性状态
  @State private showFeedback: boolean = false;
  @State private showExport: boolean = false;
  @State private showRateApp: boolean = false;

  private focusService = FocusService.getInstance();
  private musicService = MusicService.getInstance();
  private settingsService = SettingsService.getInstance();

  aboutToAppear() {
    // 延迟加载数据，优化首屏显示
    setTimeout(() => {
      this.loadData();
    }, 100);
  }

  async loadData() {
    this.isLoading = true;
    
    const stats = await this.focusService.getTodayStats();
    this.todayCount = stats.count;
    this.todayMinutes = stats.totalMinutes;
    this.musicList = this.musicService.getMusicList();
    this.achievements = this.settingsService.getAchievements();
    this.totalMinutes = this.settingsService.getSettings().dailyGoal;
    // 加载主题
    const settings = this.settingsService.getSettings();
    this.currentTheme = (settings as any).theme || 'forest';
    ThemeManager.setTheme(this.currentTheme);
    
    this.isLoading = false;
    
    // 关闭启动屏
    if (this.showSplash) {
      animateTo({ duration: 500 }, () => {
        this.splashOpacity = 0;
      });
      setTimeout(() => {
        this.showSplash = false;
      }, 500);
    }
  }

  async startFocus() {
    // 播放开始音效
    SoundManager.playSound(SoundManager.SOUND_START);
    
    const duration = this.isCustomDuration ? this.customDuration : this.selectedDuration;
    await this.focusService.startFocus(duration * 60);
    this.isFocusing = true;
    this.elapsedSeconds = 0;

    this.focusService.startTimer((seconds) => {
      this.elapsedSeconds = seconds;
      // 每分钟脉冲效果
      this.timerPulse = !this.timerPulse;
      // 每25分钟提醒一次
      if (seconds > 0 && seconds % (25 * 60) === 0) {
        SoundManager.playSound(SoundManager.SOUND_REMINDER);
      }
    });

    if (this.selectedMusicId) {
      await this.musicService.play(this.selectedMusicId);
      this.isMusicPlaying = true;
    }
  }

  async endFocus() {
    // 播放结束音效
    SoundManager.playSound(SoundManager.SOUND_END);
    
    const musicName = this.selectedMusicId ? 
      this.musicList.find(m => m.id === this.selectedMusicId)?.name || '' : '';
    
    const record = await this.focusService.endFocus(musicName);
    this.isFocusing = false;

    await this.musicService.stop();
    this.isMusicPlaying = false;

    if (record) {
      // 检查成就
      this.newAchievements = this.settingsService.checkAchievements(record, this.todayMinutes);
      
      // 成就解锁音效
      if (this.newAchievements.length > 0) {
        SoundManager.playSound(SoundManager.SOUND_ACHIEVE);
      }
      
      this.settingsService.updateConsecutiveDays();
      
      this.completeMessage = EncouragementUtil.getByDuration(
        Math.floor(record.actualDuration / 60)
      );
      
      // 完成后播放庆祝音效
      setTimeout(() => {
        SoundManager.playSound(SoundManager.SOUND_COMPLETE);
      }, 500);
      
      this.showComplete = true;
    }

    await this.loadData();
  }

  build() {
    Stack() {
      // 启动屏
      if (this.showSplash) {
        this.buildSplashScreen();
      }
      
      // 主内容
      Column() {
        if (this.isLoading) {
          this.buildSkeletonView();
        } else if (this.showAccessibilitySettings) {
          this.buildAccessibilitySettings();
        } else if (this.showThemePicker) {
          this.buildThemePicker();
        } else if (this.isFocusing) {
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
      .backgroundColor(this.showThemePicker ? 'rgba(0,0,0,0.5)' : '#F5F5F5')
      .padding(20)
      .opacity(this.pageOpacity)
      .scale({ x: this.pageScale, y: this.pageScale })
      .animation({
        duration: 200,
        curve: Curve.EaseInOut
      })
      // 全局滑动手势
      .gesture(
        GestureGroup(GestureMode.Exclusive,
          PanGesture()
            .onActionStart((event: GestureEvent) => {
              this.isSwiping = true;
              this.swipeX = 0;
            })
            .onActionUpdate((event: GestureEvent) => {
              this.swipeX = event.offsetX;
            })
            .onActionEnd(() => {
              this.isSwiping = false;
              // 左滑返回
              if (this.swipeX < -100) {
                if (this.showAchievements) {
                  this.showAchievements = false;
                }
              }
              // 右滑开始专注
              if (this.swipeX > 100 && !this.isFocusing && !this.showComplete) {
                this.startFocus();
              }
              this.swipeX = 0;
            })
        )
      )
    }
  }

  // 主视图
  @Builder
  buildMainView() {
    Column() {
      // 统计卡片 - 使用主题色
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
        
        // 主题切换按钮
        Column() {
          Text('🎨')
            .fontSize(24)
          Text('主题')
            .fontSize(14)
            .fontColor('#666')
        }
        .alignItems(HorizontalAlign.Center)
        .onClick(() => this.showThemePicker = true)

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
          .backgroundColor(this.selectedDuration === option.value && !this.isCustomDuration ? this.getTheme().primary : '#FFF')
          .borderRadius(22)
          .margin(5)
          .justifyContent(FlexAlign.Center)
          .animation({ duration: 200 })
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
        .backgroundColor(this.isCustomDuration ? this.getTheme().primary : '#FFF')
        .borderRadius(22)
        .margin(5)
        .justifyContent(FlexAlign.Center)
        .animation({ duration: 200 })
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

      // 计时器预览 - 双击开始/长按显示详情
      Column() {
        Text(`${this.formatTime((this.isCustomDuration ? this.customDuration : this.selectedDuration) * 60)}`)
          .fontSize(64)
          .fontWeight(FontWeight.Light)
          .fontColor('#333')
        if (this.showTimerDetail) {
          Text(`目标: ${this.isCustomDuration ? this.customDuration : this.selectedDuration}分钟`)
            .fontSize(14)
            .fontColor('#999')
            .margin({ top: 8 })
        }
      }
      .margin({ bottom: 30 })
      .gesture(
        GestureGroup(GestureMode.Exclusive,
          LongPressGesture()
            .onAction(() => {
              this.showTimerDetail = true;
            })
            .onActionEnd(() => {
              setTimeout(() => { this.showTimerDetail = false; }, 2000);
            }),
          TapGesture({ count: 2 })
            .onAction(() => {
              if (!this.isFocusing) {
                this.startFocus();
              }
            })
        )
      )

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

      // 开始按钮 - 带动画 - 使用主题色
      this.PressableButton('开始专注', this.getTheme().primary, () => this.startFocus())
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

      // 计时器带脉冲效果
      Text(this.formatTime(this.elapsedSeconds))
        .fontSize(72)
        .fontWeight(FontWeight.Light)
        .fontColor('#333')
        .scale({ x: this.timerPulse ? 1.02 : 1, y: this.timerPulse ? 1.02 : 1 })
        .animation({
          duration: 300,
          curve: Curve.EaseInOut
        })

      Row() {
        Progress({
          value: this.elapsedSeconds,
          total: (this.isCustomDuration ? this.customDuration : this.selectedDuration) * 60,
          style: ProgressStyle.Linear
        })
          .width('80%')
          .color(this.getTheme().primary)
          .backgroundColor('#E0E0E0')
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

      // 结束按钮 - 带动画
      this.PressableButton('结束专注', '#FF5722', () => this.endFocus())
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

      // 返回按钮 - 带动画
      this.PressableButton('返回首页', '#4CAF50', () => {
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

      // 空状态
      if (this.achievements.length === 0) {
        this.EmptyState(
          '🏆',
          '暂无成就',
          '完成专注任务来解锁成就吧！',
          '开始专注',
          () => {
            this.showAchievements = false;
            this.startFocus();
          }
        )
      } else {
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
  }
  
  // 空状态组件
  @Builder
  EmptyState(icon: string, title: string, message: string, buttonText: string, buttonAction: () => void) {
    Column() {
      Text(icon)
        .fontSize(64)
        .margin({ bottom: 20 })
      Text(title)
        .fontSize(20)
        .fontWeight(FontWeight.Medium)
        .margin({ bottom: 10 })
      Text(message)
        .fontSize(14)
        .fontColor('#999')
        .textAlign(TextAlign.Center)
        .margin({ bottom: 30 })
      Button(buttonText)
        .width('60%')
        .height(44)
        .backgroundColor(this.getTheme().primary)
        .fontColor('#FFF')
        .borderRadius(22)
        .onClick(buttonAction)
    }
    .width('100%')
    .padding(40)
    .justifyContent(FlexAlign.Center)
  }
  
  // 错误提示组件
  @Builder
  ErrorToast(message: string) {
    Row() {
      Text('⚠️')
        .fontSize(16)
      Text(message)
        .fontSize(14)
        .fontColor('#FFF')
        .margin({ left: 8 })
      Blank()
      Text('✕')
        .fontSize(16)
        .fontColor('#FFF')
        .onClick(() => this.showError = false)
    }
    .width('90%')
    .padding(16)
    .backgroundColor('#FF5722')
    .borderRadius(8)
    .margin({ bottom: 20 })
  }
  
  // 粒子效果组件
  @Builder
  ParticleEffect() {
    Column() {
      if (this.showParticles) {
        // 简化的粒子效果 - 星星散落
        Row() {
          ForEach([1,2,3,4,5], (i: number) => {
            Text('✨')
              .fontSize(16 + i * 4)
              .opacity(this.showParticles ? 1 : 0)
              .animation({
                duration: 1000,
                curve: Curve.EaseOut
              })
          })
        }
        .margin({ bottom: 10 })
      }
    }
  }
  
  // 脉冲动画文本
  @Builder
  PulseText(text: string, fontSize: number, color: string) {
    Text(text)
      .fontSize(fontSize)
      .fontColor(color)
      .scale({ 
        x: this.reduceMotion ? 1 : (this.timerPulse ? 1.05 : 1), 
        y: this.reduceMotion ? 1 : (this.timerPulse ? 1.05 : 1) 
      })
      .animation({
        duration: this.reduceMotion ? 0 : 500,
        curve: Curve.EaseInOut
      })
  }
  
  // 获取无障碍字体大小
  private getFontSize(): number {
    switch (this.fontSize) {
      case 'small': return 14;
      case 'large': return 20;
      default: return 16;
    }
  }
  
  // 获取高对比度颜色
  private getContrastColor(bgColor: string): string {
    if (!this.highContrast) return bgColor;
    return '#000'; // 高对比度返回黑色
  }
  
  // 无障碍设置组件
  @Builder
  buildAccessibilitySettings() {
    Column() {
      Text('辅助功能设置')
        .fontSize(20)
        .fontWeight(FontWeight.Medium)
        .margin({ bottom: 20 })
      
      // 减少动画
      Row() {
        Text('减少动画')
          .fontSize(16)
        Blank()
        Toggle({ isOn: this.reduceMotion })
          .onChange((isOn: boolean) => {
            this.reduceMotion = isOn;
          })
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#FFF')
      .borderRadius(12)
      .margin({ bottom: 10 })
      
      // 高对比度
      Row() {
        Text('高对比度')
          .fontSize(16)
        Blank()
        Toggle({ isOn: this.highContrast })
          .onChange((isOn: boolean) => {
            this.highContrast = isOn;
          })
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#FFF')
      .borderRadius(12)
      .margin({ bottom: 10 })
      
      // 字体大小
      Row() {
        Text('字体大小')
          .fontSize(16)
        Blank()
        Row() {
          ForEach(['小', '中', '大'], (size: string) => {
            Text(size)
              .fontSize(14)
              .padding(8)
              .backgroundColor(this.fontSize === (size === '小' ? 'small' : size === '中' ? 'medium' : 'large') 
                ? this.getTheme().primary : '#EEE')
              .fontColor(this.fontSize === (size === '小' ? 'small' : size === '中' ? 'medium' : 'large') ? '#FFF' : '#666')
              .borderRadius(8)
              .margin({ left: 8 })
              .onClick(() => {
                this.fontSize = size === '小' ? 'small' : size === '中' ? 'medium' : 'large';
              })
          })
        }
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#FFF')
      .borderRadius(12)
      .margin({ bottom: 20 })
      
      // 数据导出
      Row() {
        Text('📤')
          .fontSize(20)
        Text('导出专注数据')
          .fontSize(16)
          .margin({ left: 12 })
        Blank()
        Text('>')
          .fontSize(20)
          .fontColor('#999')
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#FFF')
      .borderRadius(12)
      .margin({ bottom: 10 })
      .onClick(() => this.showExport = true)
      
      // 反馈
      Row() {
        Text('💬')
          .fontSize(20)
        Text('意见反馈')
          .fontSize(16)
          .margin({ left: 12 })
        Blank()
        Text('>')
          .fontSize(20)
          .fontColor('#999')
      }
      .width('100%')
      .padding(16)
      .backgroundColor('#FFF')
      .borderRadius(12)
      .margin({ bottom: 20 })
      .onClick(() => this.showFeedback = true)
      
      Button('关闭')
        .width('100%')
        .height(44)
        .backgroundColor('#EEE')
        .fontColor('#666')
        .borderRadius(22)
        .onClick(() => this.showAccessibilitySettings = false)
    }
    .width('100%')
    .padding(20)
  }
  
  // 骨架屏组件
  @Builder
  SkeletonBox(width: number, height: number, borderRadius: number = 8) {
    Row()
      .width(width)
      .height(height)
      .borderRadius(borderRadius)
      .backgroundColor('#EEE')
      .animation({
        duration: 1500,
        curve: Curve.EaseInOut,
        iterations: -1
      })
      .onAppear(() => {
        // shimmer效果简化处理
      })
  }
  
  // 骨架屏视图
  @Builder
  buildSkeletonView() {
    Column() {
      // 统计卡片骨架
      Row() {
        Column() {
          this.SkeletonBox(60, 16, 4)
          this.SkeletonBox(40, 24, 4)
          this.SkeletonBox(80, 12, 4)
        }
        Blank()
        this.SkeletonBox(40, 40, 20)
      }
      .width('100%')
      .backgroundColor('#FFF')
      .borderRadius(12)
      .padding(20)
      .margin({ bottom: 30 })
      
      // 时长选择骨架
      Text('')
        .fontSize(16)
        .margin({ bottom: 15 })
      Flex({ wrap: FlexWrap.Wrap }) {
        ForEach([1,2,3,4,5,6], () => {
          this.SkeletonBox(80, 44, 22)
        })
      }
      .margin({ bottom: 30 })
      
      // 计时器骨架
      this.SkeletonBox(160, 64, 8)
        .margin({ bottom: 30 })
      
      // 音乐选择骨架
      this.SkeletonBox('100%', 48, 12)
        .margin({ bottom: 30 })
      
      // 按钮骨架
      this.SkeletonBox('60%', 50, 25)
    }
  }
  
  // 启动屏
  @Builder
  buildSplashScreen() {
    Column() {
      Text('🎯')
        .fontSize(80)
      Text('Focus Helper')
        .fontSize(28)
        .fontWeight(FontWeight.Medium)
        .margin({ top: 20 })
      Text('专注每一刻')
        .fontSize(16)
        .fontColor('#999')
        .margin({ top: 10 })
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#FFF')
    .justifyContent(FlexAlign.Center)
    .alignItems(HorizontalAlign.Center)
    .opacity(this.splashOpacity)
  }
  
  // 主题选择器
  @Builder
  buildThemePicker() {
    Column() {
      Text('选择主题')
        .fontSize(20)
        .fontWeight(FontWeight.Medium)
        .margin({ bottom: 20 })
      
      Column() {
        ForEach(Object.entries(ThemeManager.themes), ([key, theme]: [string, any]) => {
          Row() {
            Row() {
              Column() {
                Row() {
                  Circle()
                    .width(24)
                    .height(24)
                    .fill(theme.gradient[0])
                }
              }
              .width(24)
              .height(24)
              .margin({ right: 12 })
              
              Text(theme.name)
                .fontSize(16)
                .fontColor(this.currentTheme === key ? theme.primary : '#333')
              
              Blank()
              
              if (this.currentTheme === key) {
                Text('✓')
                  .fontSize(18)
                  .fontColor(theme.primary)
              }
            }
          }
          .width('100%')
          .padding(16)
          .backgroundColor(this.currentTheme === key ? '#F0' + theme.primary.slice(1) : '#FFF')
          .borderRadius(12)
          .margin({ bottom: 10 })
          .onClick(() => {
            this.currentTheme = key;
            ThemeManager.setTheme(key);
          })
        })
      }
      
      Button('关闭')
        .width('100%')
        .height(44)
        .backgroundColor('#EEE')
        .fontColor('#666')
        .borderRadius(22)
        .margin({ top: 20 })
        .onClick(() => this.showThemePicker = false)
    }
    .width('100%')
    .padding(20)
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  
  // 获取当前主题色
  private getTheme() {
    return ThemeManager.getTheme();
  }
  
  // 页面切换动画
  private animatePageTransition(callback: Function) {
    animateTo({
      duration: 150,
      curve: Curve.EaseOut
    }, () => {
      this.pageOpacity = 0;
      this.pageScale = 0.95;
    });
    
    setTimeout(() => {
      callback();
      animateTo({
        duration: 200,
        curve: Curve.EaseInOut
      }, () => {
        this.pageOpacity = 1;
        this.pageScale = 1;
      });
    }, 150);
  }
  
  // 按钮按压效果
  @Builder
  PressableButton(text: string, bgColor: string, callback: () => void) {
    Button(text)
      .width('60%')
      .height(50)
      .backgroundColor(bgColor)
      .fontColor('#FFF')
      .fontSize(18)
      .borderRadius(25)
      .scale({ x: this.buttonScale, y: this.buttonScale })
      .animation({
        duration: 100,
        curve: Curve.EaseOut
      })
      .onClick(() => {
        animateTo({ duration: 100, curve: Curve.EaseOut }, () => {
          this.buttonScale = 0.95;
        });
        setTimeout(() => {
          animateTo({ duration: 100, curve: Curve.EaseOut }, () => {
            this.buttonScale = 1;
          });
        }, 100);
        callback();
      })
  }
  
  // 卡片悬浮效果
  @Builder
  HoverCard(content: () => void, index: number) {
    Column() {
      content()
    }
    .animation({
      duration: 200,
      curve: Curve.EaseOut
    })
    .shadow({
      radius: this.cardHoverIndex === index ? 20 : 4,
      color: this.cardHoverIndex === index ? '#40000000' : '#20000000',
      offsetX: 0,
      offsetY: this.cardHoverIndex === index ? 8 : 2
    })
    .onHover((isHover: boolean) => {
      this.cardHoverIndex = isHover ? index : -1;
    })
  }
}
