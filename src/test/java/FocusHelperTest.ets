import { describe, it, expect, beforeEach } from '@ohos/hypium';

/**
 * 专注服务单元测试
 */
export default function focusServiceTest() {
  describe('FocusServiceTest', () => {
    it('test_startFocus', 0, async () => {
      const focusService = await import('../service/FocusService');
      const service = focusService.FocusService.getInstance();
      
      const record = await service.startFocus(25 * 60);
      
      expect(record !== null).assertTrue();
      expect(record.targetDuration).assertEqual(25 * 60);
      expect(record.completed).assertFalse();
    });

    it('test_getElapsedSeconds', 0, async () => {
      const focusService = await import('../service/FocusService');
      const service = focusService.FocusService.getInstance();
      
      await service.startFocus(25 * 60);
      
      // 等待1秒
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const elapsed = service.getElapsedSeconds();
      expect(elapsed >= 1).assertTrue();
    });

    it('test_endFocus', 0, async () => {
      const focusService = await import('../service/FocusService');
      const service = focusService.FocusService.getInstance();
      
      await service.startFocus(25 * 60);
      
      // 等待1秒
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      const record = await service.endFocus('雨声轻音乐');
      
      expect(record !== null).assertTrue();
      expect(record.musicUsed).assertEqual('雨声轻音乐');
      expect(record.completed).assertFalse(); // 1秒未达到25分钟
    });
  });
}

/**
 * 音乐服务单元测试
 */
export function musicServiceTest() {
  describe('MusicServiceTest', () => {
    it('test_getMusicList', 0, async () => {
      const musicService = await import('../service/MusicService');
      const service = musicService.MusicService.getInstance();
      
      const list = service.getMusicList();
      
      expect(list.length).assertEqual(5);
    });

    it('test_getVolume', 0, async () => {
      const musicService = await import('../service/MusicService');
      const service = musicService.MusicService.getInstance();
      
      const volume = service.getVolume();
      
      expect(volume).assertEqual(50); // 默认音量
    });

    it('test_setVolume', 0, async () => {
      const musicService = await import('../service/MusicService');
      const service = musicService.MusicService.getInstance();
      
      await service.setVolume(80);
      const volume = service.getVolume();
      
      expect(volume).assertEqual(80);
    });
  });
}
