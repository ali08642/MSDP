// Forecasting Types matching Django backend models

export interface ForecastModel {
  id: number
  name: string
  version: string
  algorithm: string
  model_file: string | null
  status: 'TRAINING' | 'TRAINED' | 'FAILED' | 'ARCHIVED'
  accuracy: number | null
  metrics: Record<string, any> | null
  dataset?: number
  trained_by?: number
  created_at: string
  updated_at: string
}

export interface Forecast {
  id: number
  model: number
  disease: string
  region: string
  forecast_date: string
  predicted_cases: number
  actual_cases?: number | null
  confidence_interval: {
    lower: number
    upper: number
  } | null
  metadata?: Record<string, any> | null
  created_by?: number
  created_at: string
}

export interface ForecastCreateRequest {
  model: number
  disease: string
  region: string
  forecast_date: string
}

export interface ModelCreateRequest {
  name: string
  version: string
  algorithm: string
  dataset: number
}

export interface ForecastStats {
  total_forecasts: number
  active_models: number
  diseases: string[]
  latest_forecasts: Forecast[]
}
