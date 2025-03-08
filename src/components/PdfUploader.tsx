import React, { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { DietPlan } from '../types';

interface PdfUploaderProps {
  onPlanCreated: (plan: DietPlan) => void;
}

export function PdfUploader({ onPlanCreated }: PdfUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      // In una versione reale, qui ci sarebbe la logica per processare il PDF
      // e estrarre le informazioni del piano dietetico
      const formData = new FormData();
      formData.append('file', file);

      // Simula il processing del file
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Per ora, creiamo un piano di esempio
      const examplePlan: DietPlan = {
        id: Date.now(),
        name: 'Piano Estratto da PDF',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        meals: [
          {
            type: 'colazione',
            dayOfWeek: 0,
            ingredients: ['Esempio ingrediente 1', 'Esempio ingrediente 2'],
            portions: ['100g', '50g']
          }
        ]
      };

      onPlanCreated(examplePlan);
    } catch (err) {
      setError('Si è verificato un errore durante l\'elaborazione del file. Riprova.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
      <Upload className="w-12 h-12 text-blue-600 mb-4" />
      <h3 className="text-lg font-medium text-blue-700">Carica PDF</h3>
      <p className="text-sm text-gray-500 text-center mt-2">
        Carica il tuo piano dietetico in formato PDF
      </p>
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileUpload}
        className="hidden"
        disabled={isProcessing}
      />
      {isProcessing && (
        <div className="mt-4 text-blue-600">
          Elaborazione in corso...
        </div>
      )}
      {error && (
        <div className="mt-4 text-red-600 text-sm">
          {error}
        </div>
      )}
    </label>
  );
}