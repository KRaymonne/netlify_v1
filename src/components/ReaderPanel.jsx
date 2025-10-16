import React, { useState, useRef, useEffect } from 'react'
import { Play, Square, RotateCcw } from 'lucide-react'
import { Recorder } from './Recorder'
import { ScoreDisplay } from './ScoreDisplay'
import { useTTS } from '../hooks/useTTS'

export const ReaderPanel = ({ poem, onRecordingComplete }) => {
  const [currentWord, setCurrentWord] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [lastScore, setLastScore] = useState(null)
  const intervalRef = useRef()
  const { speak, isSpeaking, stopSpeaking } = useTTS()

  const words = poem.content.split(/\s+/)

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      stopSpeaking()
    }
  }, [stopSpeaking])

  const handlePlayModel = () => {
    if (isSpeaking) {
      stopSpeaking()
      setIsPlaying(false)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    setIsPlaying(true)
    setCurrentWord(0)

    // Synchroniser le surlignage avec la lecture TTS
    const avgWordsPerMinute = 120 // Vitesse moyenne de lecture
    const intervalMs = (60 / avgWordsPerMinute) * 1000

    intervalRef.current = setInterval(() => {
      setCurrentWord(prev => {
        if (prev >= words.length - 1) {
          clearInterval(intervalRef.current)
          setIsPlaying(false)
          return 0
        }
        return prev + 1
      })
    }, intervalMs)

    speak(poem.content, {
      rate: 0.8,
      pitch: 1.0,
      onEnd: () => {
        setIsPlaying(false)
        setCurrentWord(0)
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    })
  }

  const handleReset = () => {
    setCurrentWord(0)
    setShowScore(false)
    setLastScore(null)
    if (intervalRef.current) clearInterval(intervalRef.current)
    stopSpeaking()
    setIsPlaying(false)
  }

  const handleScoreCalculated = (score) => {
    setLastScore(score)
    setShowScore(true)
  }

  const renderTextWithHighlight = () => {
    return words.map((word, index) => (
      <span
        key={index}
        className={`${
          index === currentWord && isPlaying
            ? 'bg-yellow-200 px-1 rounded transition-colors duration-300'
            : ''
        }`}
      >
        {word}{' '}
      </span>
    ))
  }

  return (
    <div className="space-y-6">
      {/* Contrôles de lecture modèle */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Écouter le modèle
        </h3>
        
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handlePlayModel}
            className={`btn-primary ${isSpeaking ? 'bg-accent-500 hover:bg-accent-600' : ''}`}
          >
            {isSpeaking ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isSpeaking ? 'Arrêter' : 'Écouter'}
          </button>
          
          <button onClick={handleReset} className="btn-secondary">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>

        {/* Texte avec surlignage */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="poem-text">
            {renderTextWithHighlight()}
          </div>
        </div>
      </div>

      {/* Enregistrement */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Votre enregistrement
        </h3>
        
        <Recorder
          poem={poem}
          onRecordingComplete={onRecordingComplete}
          onScoreCalculated={handleScoreCalculated}
        />
      </div>

      {/* Affichage du score */}
      {showScore && lastScore && (
        <div className="card score-card animate-slide-up">
          <ScoreDisplay score={lastScore} poem={poem} />
        </div>
      )}
    </div>
  )
}