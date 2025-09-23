declare module 'react-reveal/Fade'

// Daily tasks notification system
declare global {
  interface Window {
    showDailyTasksNotification?: () => void;
    onExamDiarioClose?: () => void;
    MBE?: {
      showDailyTasks?: () => void;
      onExamClose?: () => void;
    };
  }
}

export {};