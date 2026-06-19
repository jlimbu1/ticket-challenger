"use client";

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

export function saveTranscription(
  text: string,
  duration: number,
  source: TranscriptionSource
): Transcription {
  const transcription: Transcription = {
    id: generateId(),
    text,
    timestamp: new Date().toISOString(),
    duration,
    source,
  };

  const transcriptions = getStoredTranscriptions();
  transcriptions.push(transcription);

  // Keep only the most recent MAX_ENTRIES
  const trimmed = transcriptions.slice(-MAX_ENTRIES);
  setStoredTranscriptions(trimmed);

  return transcription;
}

export function getTranscriptions(): Transcription[] {
  return getStoredTranscriptions();
}

export function getTranscriptionSummaries(): TranscriptionSummary[] {
  const transcriptions = getStoredTranscriptions();
  return transcriptions.map((t) => ({
    id: t.id,
    textPreview: t.text.length > 100 ? t.text.substring(0, 100) + '...' : t.text,
    timestamp: t.timestamp,
    duration: t.duration,
    source: t.source,
  }));
}

export function deleteTranscription(id: string): boolean {
  const transcriptions = getStoredTranscriptions();
  const filtered = transcriptions.filter((t) => t.id !== id);
  if (filtered.length === transcriptions.length) {
    return false;
  }
  setStoredTranscriptions(filtered);
  return true;
}

export function clearTranscriptions(): void {
  setStoredTranscriptions([]);
}

// Cart storage helpers
const CART_STORAGE_KEY = 'ticket-challenger-cart';

export function safeGetCart<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function safeSetCart<T>(data: T): boolean {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded for cart data');
    } else {
      console.error('Failed to save cart to localStorage:', e);
    }
    return false;
  }
}

export function clearCartStorage(): void {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear cart from localStorage:', e);
  }
}