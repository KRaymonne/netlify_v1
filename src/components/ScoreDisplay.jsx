import React from 'react'
import { Trophy, Clock, Target, TriangleAlert as AlertTriangle } from 'lucide-react'

export const ScoreDisplay = ({ score, poem }) => {
  const getScoreColor = (value, thresholds) => {
    if (value >= thresholds.excellent) return 'text-green-600'
    if (value >= thresholds.good) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getWERColor = (wer) => getScoreColor(100 - wer, { excellent: 95, good: 85 })
  const getWPMColor = (wpm) => getScoreColor(wpm, { excellent: 120, good: 80 })

  const getFeedbackMessage = () => {
    const accuracy = 100 - score.wer
    
    if (accuracy >= 95) {
      return {
        title: "Excellent ! 🏆",
        message: "Votre lecture est presque parfaite. Continuez comme ça !",
        color: "text-green-700 bg-green-50 border-green-200"
      }
    } else if (accuracy >= 85) {
      return {
        title: "Très bien ! ⭐",
        message: "Belle lecture ! Quelques petits détails à améliorer.",
        color: "text-yellow-700 bg-yellow-50 border-yellow-200"
      }
    } else if (accuracy >= 70) {
      return {
        title: "Bien ! 👍",
        message: "Vous progressez ! Continuez à vous entraîner.",
        color: "text-blue-700 bg-blue-50 border-blue-200"
      }
    } else {
      return {
        title: "Continue tes efforts ! 💪",
        message: "La lecture demande de la pratique. Réessayez !",
        color: "text-orange-700 bg-orange-50 border-orange-200"
      }
    }
  }

  const feedback = getFeedbackMessage()

  return (
    <div className="space-y-6">
      {/* Message de feedback principal */}
      <div className={`p-4 rounded-lg border-2 ${feedback.color}`}>
        <h3 className="font-semibold text-lg mb-2">{feedback.title}</h3>
        <p>{feedback.message}</p>
      </div>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Précision */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Target className={`h-5 w-5 ${getWERColor(score.wer)}`} />
            <span className="text-2xl font-bold">
              {Math.round(100 - score.wer)}%
            </span>
          </div>
          <div className="text-sm text-gray-600">Précision</div>
          <div className={`text-xs mt-1 ${getWERColor(score.wer)}`}>
            {score.wer < 5 ? 'Excellent' : 
             score.wer < 15 ? 'Très bien' : 
             score.wer < 30 ? 'Bien' : 'À améliorer'}
          </div>
        </div>

        {/* Vitesse */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className={`h-5 w-5 ${getWPMColor(score.wpm)}`} />
            <span className="text-2xl font-bold">
              {Math.round(score.wpm)}
            </span>
          </div>
          <div className="text-sm text-gray-600">Mots/minute</div>
          <div className={`text-xs mt-1 ${getWPMColor(score.wpm)}`}>
            {score.wpm >= 120 ? 'Rapide' :
             score.wpm >= 80 ? 'Normal' :
             score.wpm >= 60 ? 'Lent' : 'Très lent'}
          </div>
        </div>

        {/* Pauses */}
        <div className="bg-white p-4 rounded-lg border-2 border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-5 w-5 text-blue-500" />
            <span className="text-2xl font-bold">
              {score.pauseCount || 0}
            </span>
          </div>
          <div className="text-sm text-gray-600">Pauses longues</div>
          <div className="text-xs mt-1 text-blue-600">
            {(score.pauseCount || 0) <= 2 ? 'Fluide' : 'Plusieurs pauses'}
          </div>
        </div>
      </div>

      {/* Détails techniques (repliable) */}
      <details className="bg-gray-50 p-4 rounded-lg">
        <summary className="cursor-pointer font-medium text-gray-700">
          Détails techniques
        </summary>
        <div className="mt-3 space-y-2 text-sm">
          <div>
            <span className="font-medium">Durée :</span> {score.duration}s
          </div>
          <div>
            <span className="font-medium">Erreurs détectées :</span> {score.errorCount || 0}
          </div>
          <div>
            <span className="font-medium">Transcription :</span>
            <div className="bg-white p-2 rounded mt-1 text-xs font-mono">
              {score.transcription || 'Non disponible'}
            </div>
          </div>
        </div>
      </details>

      {/* Suggestions d'amélioration */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">💡 Conseils pour s'améliorer</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          {score.wer > 15 && (
            <li>• Prenez votre temps pour bien prononcer chaque mot</li>
          )}
          {score.wpm < 60 && (
            <li>• Essayez de lire un peu plus rapidement</li>
          )}
          {score.wpm > 150 && (
            <li>• Ralentissez légèrement pour mieux articuler</li>
          )}
          {(score.pauseCount || 0) > 3 && (
            <li>• Entraînez-vous à lire de façon plus continue</li>
          )}
          <li>• Réécoutez le modèle pour vous inspirer</li>
        </ul>
      </div>
    </div>
  )
}