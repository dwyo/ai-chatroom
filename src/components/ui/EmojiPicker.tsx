import { useEffect, useRef, useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: { id: string; name: string; native: string; unified: string; keywords: string[]; shortcodes: string }) => void;
  onClose: () => void;
}

export const EmojiPicker = ({ onEmojiSelect, onClose }: EmojiPickerProps) => {
  const [showPicker, setShowPicker] = useState(true);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  if (!showPicker) return null;

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full mb-2 z-50"
      style={{ width: '352px' }}
    >
      <Picker
        data={data}
        onEmojiSelect={onEmojiSelect}
        theme="light"
        locale="zh"
        previewPosition="none"
        skinTonePosition="none"
      />
    </div>
  );
};