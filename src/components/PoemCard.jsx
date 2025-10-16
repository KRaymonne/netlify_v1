import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Play } from 'lucide-react'
import { useTTS } from '../hooks/useTTS'

export const PoemCard = ({ poem }) => {
  const { speak, isSpeaking, stopSpeaking } = useTTS()

  const handlePlayDemo = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSpeaking) {
      stopSpeaking()
    } else {
      speak(poem.content, {
        rate: 0.8,
        pitch: 1.1,
        voice: 'fr-FR'
      })
    }
  }

  const getDifficultyColor = (age) => {
    if (age <= 7) return 'bg-green-100 text-green-700 border-green-200'
    if (age <= 10) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-red-100 text-red-700 border-red-200'
  }

  const getDifficultyLabel = (age) => {
    if (age <= 7) return 'Facile'
    if (age <= 10) return 'Moyen'
    return 'Difficile'
  }

  return (
    <Link to={`/poem/${poem._id}`} className="block">
      <div className="card group hover:shadow-2xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors duration-200">
              {poem.title}
            </h3>
            <p className="text-gray-600 mt-1">par {poem.author}</p>
          </div>
          
          <button
            onClick={handlePlayDemo}
            className={`p-2 rounded-full transition-all duration-200 ${
              isSpeaking 
                ? 'bg-accent-500 text-white animate-pulse-soft' 
                : 'bg-primary-100 text-primary-600 hover:bg-primary-500 hover:text-white'
            }`}
            title={isSpeaking ? 'Arrêter la lecture' : 'Écouter le poème'}
          >
            <Play className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {poem.estimatedDuration || '2-3'} min
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {poem.targetAge}+ ans
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(poem.targetAge)}`}>
            {getDifficultyLabel(poem.targetAge)}
          </div>
        </div>

        <p className="poem-text text-sm line-clamp-3 mb-4">
          {poem.content.substring(0, 150)}...
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {poem.stats?.totalRecordings || 0} enregistrements
          </div>
          <div className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-200">
            Commencer →
          </div>
        </div>
      </div>
    </Link>
  )
}