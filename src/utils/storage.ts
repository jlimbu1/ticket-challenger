import { v4 as uuidv4 } from 'uuid';

export type TranscriptionSource = 'file' | 'microphone';

export interface Transcription {
  id: string;
  text: string;
  timestamp: string;
  duration: number;
  source: TranscriptionSource;
}

export interface TranscriptionSummary {
  id: string;
  textPreview: string;
  timestamp: string;
  duration: number;
  source: TranscriptionSource;
}

const STORAGE_KEY = 'transcriptions';
const MAX_ENTRIES = 50;

function generateId(): string {
  return uuidv4();
}

function getStoredTranscriptions(): Transcription[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: unknown): item is Transcription =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as Transcription).id === 'string' &&
        typeof (item as Transcription).text === 'string' &&
        typeof (item as Transcription).timestamp === 'string' &&
        typeof (item as Transcription).duration === 'number' &&
        ((item as Transcription).source === 'file' || (item as Transcription).source === 'microphone')
    );
  } catch {
    return [];
  }
}

function setStoredTranscriptions(transcriptions: Transcription[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transcriptions));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

export function saveTranscription(transcription: Omit<Transcription, 'id'>): Transcription {
  const id = generateId();
  const newTranscription: Transcription = { ...transcription, id };
  const transcriptions = getStoredTranscriptions();
  transcriptions.push(newTranscription);
  if (transcriptions.length > MAX_ENTRIES) {
    transcriptions.splice(0, transcriptions.length - MAX_ENTRIES);
  }
  setStoredTranscriptions(transcriptions);
  return newTranscription;
}

export function loadTranscriptions(): Transcription[] {
  return getStoredTranscriptions();
}

export function deleteTranscription(id: string): void {
  const transcriptions = getStoredTranscriptions();
  const filtered = transcriptions.filter((t) => t.id !== id);
  setStoredTranscriptions(filtered);
}

export function clearTranscriptions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable — silently fail
  }
}

export function getTranscriptionSummary(transcription: Transcription): TranscriptionSummary {
  const maxPreviewLength = 100;
  const textPreview =
    transcription.text.length > maxPreviewLength
      ? transcription.text.substring(0, maxPreviewLength) + '...'
      : transcription.text;
  return {
    id: transcription.id,
    textPreview,
    timestamp: transcription.timestamp,
    duration: transcription.duration,
    source: transcription.source,
  };
}