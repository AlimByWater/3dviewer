import React, { useEffect, useRef, useState } from 'react';
import { useViewer } from '../../_context/ViewerContext';

interface AudioTrackProps {
  play: boolean;
  effectEnabled?: boolean;
}

const AudioTrack: React.FC<AudioTrackProps> = ({
  play,
  effectEnabled = true,
}) => {
  const { state } = useViewer();
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filterFrequency, setFilterFrequency] = useState(800);

  const link = state.slot?.audio?.link;
  const prevLinkRef = useRef(link);

  useEffect(() => {
    // Инициализация аудиоконтекста
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
    }

    return () => {
      // Очистка при размонтировании компонента
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!audioContextRef.current) return;

    const linkChanged = prevLinkRef.current !== link;
    const needReset = sourceNodeRef.current == null || linkChanged;
    console.log('needReset:', needReset);
    console.log('prevLink:', prevLinkRef.current);
    console.log('link:', link);
    console.log('play:', play);
    console.log('effectEnabled:', effectEnabled);
    console.log(sourceNodeRef.current == null);

    if (needReset) {
      sourceNodeRef.current?.stop();
      sourceNodeRef.current = null;
      filterNodeRef.current = null;
      prevLinkRef.current = link;
    }

    const processAudio = async () => {
      const audioContext = audioContextRef.current!;

      try {
        if (!link) return;

        let sourceNode: AudioBufferSourceNode;
        // Если sourceNode уже существует и ссылка не поменялась, не создаем заново, чтобы не прерывать воспроизведение
        if (needReset) {
          // Загрузка аудио
          const response = await fetch(link);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // Создание источника звука
          sourceNode = audioContext.createBufferSource();
          sourceNode.buffer = audioBuffer;
          sourceNode.onended = () => setIsPlaying(false);
          sourceNodeRef.current = sourceNode;
        } else {
          sourceNode = sourceNodeRef.current!;
        }

        if (effectEnabled) {
          // Если filterNode уже существует, не создаем заново, чтобы не прерывать воспроизведение
          if (filterNodeRef.current) {
            sourceNode.disconnect(audioContext.destination);
            sourceNode.connect(filterNodeRef.current);
          } else {
            // Применение эффекта "за дверью"
            // Фильтр низких частот для приглушения звука
            const filterNode = audioContext.createBiquadFilter();
            filterNodeRef.current = filterNode;
            filterNode.type = 'lowpass';
            filterNode.frequency.value = filterFrequency;

            // Уменьшение громкости
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 5;

            // Реверберация для эффекта пространства
            const convolverNode = audioContext.createConvolver();

            // Создание импульсного ответа для реверберации
            const sampleRate = audioContext.sampleRate;
            const length = 0.4 * sampleRate; // 0.5 секунды
            const impulseResponse = audioContext.createBuffer(
              2,
              length,
              sampleRate,
            );
            const leftChannel = impulseResponse.getChannelData(0);
            const rightChannel = impulseResponse.getChannelData(1);

            for (let i = 0; i < length; i++) {
              const n = i / length;
              leftChannel[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, 2);
              rightChannel[i] = (Math.random() * 2 - 1) * Math.pow(1 - n, 2);
            }

            convolverNode.buffer = impulseResponse;

            sourceNode.disconnect(audioContext.destination);
            // Соединение узлов: источник -> фильтр -> реверберация -> громкость -> выход
            sourceNode.connect(filterNode);
            filterNode.connect(convolverNode);
            convolverNode.connect(gainNode);
            gainNode.connect(audioContext.destination);
          }
        } else {
          // Прямое подключение без эффектов
          if (filterNodeRef.current) {
            sourceNode.disconnect(filterNodeRef.current);
          }
          sourceNode.connect(audioContext.destination);
        }

        if (needReset) {
          // Запуск воспроизведения
          sourceNode.start();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Ошибка обработки аудио:', error);
      }
    };

    if (play) {
      // Возобновление контекста если необходимо
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      processAudio();
    } else if (sourceNodeRef.current) {
      // Остановка воспроизведения
      // audioContextRef.current.suspend();
      setIsPlaying(false);
    }
  }, [play, link, effectEnabled, filterFrequency]);

  if (!link) return null;

  return <div />;
};

export default AudioTrack;
