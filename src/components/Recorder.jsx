import React, { useState, useRef } from 'react'
import { Mic, Square, Upload, Loader as Loader2 } from 'lucide-react'
import { useApi } from '../contexts/ApiContext'
import { useUser } from '../contexts/UserContext'

export const Recorder = ({ poem, onRecordingComplete, onScoreCalculated }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef()
  const chunksRef = useRef([])
  const timerRef = useRef()
  
  const api = useApi()
  const { userId } = useUser()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      chunksRef.current = []
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' })
        setRecordedBlob(blob)
        
        // Arrêter les tracks du stream
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Timer pour afficher la durée
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (error) {
      console.error('Erreur accès microphone:', error)
      alert('Impossible d\'accéder au microphone. Vérifiez les permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const uploadRecording = async () => {
    if (!recordedBlob) return

    setIsProcessing(true)
    
    try {
      const formData = new FormData()
      formData.append('audio', recordedBlob, 'recording.webm')
      formData.append('poemId', poem._id)
      formData.append('userId', userId)
      formData.append('duration', recordingTime)
      
      // Upload de l'enregistrement
      const uploadResponse = await api.uploadRecording(formData)
      const recordingId = uploadResponse.data.recordingId

      // Transcription
      const transcriptionResponse = await api.transcribe(formData)
      const transcription = transcriptionResponse.data.transcription

      // Calcul du score
      const scoreResponse = await api.calculateScore({
        recordingId,
        originalText: poem.content,
        transcribedText: transcription,
        duration: recordingTime,
        poemId: poem._id,
        userId
      })

      const score = scoreResponse.data
      
      // Notifications
      if (onRecordingComplete) {
        onRecordingComplete({
          recordingId,
          transcription,
          score,
          duration: recordingTime
        })
      }
      
      if (onScoreCalculated) {
        onScoreCalculated(score)
      }

      // Reset
      setRecordedBlob(null)
      setRecordingTime(0)
      
    } catch (error) {
      console.error('Erreur upload:', error)
      alert('Erreur lors du traitement de l\'enregistrement')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* État actuel */}
      <div className="text-center">
        {isRecording && (
          <div className="recording-indicator">
            <div className="flex items-center justify-center gap-2 text-red-600 font-medium">
              <div className="recording-wave w-3 h-3 rounded-full"></div>
              Enregistrement... {formatTime(recordingTime)}
            </div>
          </div>
        )}
        
        {recordedBlob && !isRecording && (
          <div className="text-green-600 font-medium">
            ✅ Enregistrement prêt ({formatTime(recordingTime)})
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="btn-primary bg-red-500 hover:bg-red-600"
            disabled={isProcessing}
          >
            <Mic className="h-5 w-5" />
            Commencer
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="btn-accent"
          >
            <Square className="h-5 w-5" />
            Arrêter
          </button>
        )}

        {recordedBlob && !isRecording && (
          <button
            onClick={uploadRecording}
            disabled={isProcessing}
            className="btn-primary"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isProcessing ? 'Traitement...' : 'Analyser'}
          </button>
        )}
      </div>

      {/* Audio de contrôle */}
      {recordedBlob && (
        <div className="flex justify-center">
          <audio 
            controls 
            src={URL.createObjectURL(recordedBlob)}
            className="max-w-full"
          />
        </div>
      )}

      {isProcessing && (
        <div className="bg-blue-50 p-4 rounded-lg text-center text-sm text-blue-700">
          <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
          Analyse en cours... Transcription et calcul du score
        </div>
      )}
    </div>
  )
}