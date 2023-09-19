export interface question_results {
  title_id: number
  item_ids: []
}

export interface QuestionParams {
  title_id?: number
}

export interface AddQuestionParams {
  question_results: question_results[]
}

export interface QuestionRes {
  code: number
  mag: string
  data?: any
}
