import { Column, Row, Text, Circle } from '@kit.ArkUI';

/**
 * 统计卡片组件
 */
@Component
export struct StatCard {
  @Prop count: number = 0;
  @Prop totalMinutes: number = 0;
  @Prop goalMinutes: number = 60;
  @Prop themeColor: string = '#4CAF50';
  @Prop onAchievementClick?: () => void;

  build() {
    Row() {
      Column() {
        Text('今日专注')
          .fontSize(14)
          .fontColor('#666')
        Text(`${this.count}次`)
          .fontSize(24)
          .fontWeight(FontWeight.Bold)
        Text(`${this.totalMinutes}/${this.goalMinutes}分钟`)
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
      .onClick(this.onAchievementClick)
    }
    .width('100%')
    .backgroundColor('#FFF')
    .borderRadius(12)
    .padding(20)
  }
}

/**
 * 时长选择器组件
 */
@Component
export struct DurationPicker {
  @Prop options: { label: string, value: number }[] = [];
  @Prop selectedValue: number = 25;
  @Prop isCustom: boolean = false;
  @Prop customValue: number = 25;
  @Prop themeColor: string = '#4CAF50';
  onSelect?: (value: number) => void;
  onCustomToggle?: (isCustom: boolean) => void;
  onCustomChange?: (value: number) => void;

  build() {
    Column() {
      Flex({ wrap: FlexWrap.Wrap }) {
        ForEach(this.options, (option: { label: string, value: number }) => {
          Column() {
            Text(option.label)
              .fontSize(16)
              .fontColor(this.selectedValue === option.value && !this.isCustom ? '#FFF' : '#333')
          }
          .width(80)
          .height(44)
          .backgroundColor(this.selectedValue === option.value && !this.isCustom ? this.themeColor : '#FFF')
          .borderRadius(22)
          .margin(5)
          .justifyContent(FlexAlign.Center)
          .onClick(() => {
            if (this.onSelect) {
              this.onSelect(option.value);
            }
          })
        })

        Column() {
          Text(this.isCustom ? `${this.customValue}分` : '自定义')
            .fontSize(16)
            .fontColor(this.isCustom ? '#FFF' : '#333')
        }
        .width(80)
        .height(44)
        .backgroundColor(this.isCustom ? this.themeColor : '#FFF')
        .borderRadius(22)
        .margin(5)
        .justifyContent(FlexAlign.Center)
        .onClick(() => {
          if (this.onCustomToggle) {
            this.onCustomToggle(true);
          }
        })
      }
    }
  }
}

/**
 * 音乐开关组件
 */
@Component
export struct MusicToggle {
  @Prop musicName: string = '';
  @Prop isPlaying: boolean = false;
  onToggle?: (isOn: boolean) => void;

  build() {
    Row() {
      Text('🎵')
        .fontSize(20)
      Text(this.musicName || '轻音乐')
        .fontSize(16)
        .margin({ left: 8 })
      Blank()
      Toggle({ type: ToggleType.Switch, isOn: this.isPlaying })
        .onChange((isOn: boolean) => {
          if (this.onToggle) {
            this.onToggle(isOn);
          }
        })
    }
    .width('100%')
    .backgroundColor('#FFF')
    .borderRadius(12)
    .padding(16)
  }
}

/**
 * 成就卡片组件
 */
@Component
export struct AchievementCard {
  @Prop icon: string = '🔒';
  @Prop name: string = '';
  @Prop description: string = '';
  @Prop progress: number = 0;
  @Prop target: number = 1;
  @Prop unlocked: boolean = false;

  build() {
    Row() {
      Text(this.unlocked ? this.icon : '🔒')
        .fontSize(32)
      Column() {
        Text(this.name)
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor(this.unlocked ? '#333' : '#999')
        Text(this.description)
          .fontSize(12)
          .fontColor('#999')
      }
      .alignItems(HorizontalAlign.Start)
      .margin({ left: 15 })
      Blank()
      if (!this.unlocked) {
        Text(`${this.progress}/${this.target}`)
          .fontSize(14)
          .fontColor('#999')
      }
    }
    .width('100%')
    .padding(15)
    .backgroundColor(this.unlocked ? '#FFF9C4' : '#FFF')
    .borderRadius(10)
    .margin({ bottom: 10 })
  }
}

/**
 * 计时器显示组件
 */
@Component
export struct TimerDisplay {
  @Prop seconds: number = 0;
  @Prop isPulsing: boolean = false;
  @Prop fontSize: number = 64;

  private formatTime(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  build() {
    Text(this.formatTime(this.seconds))
      .fontSize(this.fontSize)
      .fontWeight(FontWeight.Light)
      .fontColor('#333')
      .scale({ x: this.isPulsing ? 1.02 : 1, y: this.isPulsing ? 1.02 : 1 })
  }
}
