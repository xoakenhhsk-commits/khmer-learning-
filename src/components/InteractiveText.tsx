import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playTTS } from "@/lib/utils";
import { Volume2, X } from "lucide-react";

interface InteractiveTextProps {
  contentKh: string;
  wordMeanings: { [word: string]: { vi: string; phonetic: string } };
}

export function InteractiveText({ contentKh, wordMeanings }: InteractiveTextProps) {
  const [selectedWord, setSelectedWord] = useState<{ word: string; vi: string; phonetic: string } | null>(null);

  // Simple splitting: Find all keys in contentKh and separate them from other text
  // To handle Khmer text correctly without spaces, we use a regex of all keys
  const keys = Object.keys(wordMeanings).sort((a, b) => b.length - a.length); // Longest first
  
  if (keys.length === 0) return <p className="khmer-text text-xl leading-loose">{contentKh}</p>;

  const escapedKeys = keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|");
  const regex = new RegExp(`(${escapedKeys})`, "g");
  
  const segments = contentKh.split(regex);

  const handleWordClick = (word: string) => {
    const info = wordMeanings[word];
    if (info) {
      setSelectedWord({ word, ...info });
      playTTS(word);
    }
  };

  return (
    <div className="relative">
      <div className="khmer-text text-xl sm:text-2xl leading-[2.5] tracking-wide text-justify select-none">
        {segments.map((seg, i) => {
          const isKnown = wordMeanings[seg];
          return isKnown ? (
            <span
              key={i}
              onClick={() => handleWordClick(seg)}
              className="cursor-pointer hover:bg-green-100 border-b-2 border-dashed border-green-400 px-0.5 rounded transition-colors text-green-700"
            >
              {seg}
            </span>
          ) : (
            <span key={i}>{seg}</span>
          );
        })}
      </div>

      {/* Meaning Popup */}
      <AnimatePresence>
        {selectedWord && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-x-4 bottom-24 sm:relative sm:inset-auto sm:mt-6 p-6 rounded-3xl shadow-xl border-2 z-50"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <button 
              onClick={() => setSelectedWord(null)}
              className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="khmer-text text-3xl font-bold text-green-600">{selectedWord.word}</h3>
                  <button 
                    onClick={() => playTTS(selectedWord.word)}
                    className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100"
                  >
                    <Volume2 size={20} />
                  </button>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-3 italic">/ {selectedWord.phonetic} /</p>
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-lg font-bold text-gray-800">{selectedWord.vi}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
