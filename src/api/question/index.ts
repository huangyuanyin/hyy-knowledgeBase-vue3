import { QuestionParams, AddQuestionParams, QuestionRes } from './type'

export function getQuestionApi(data?: QuestionParams) {
  return http.post<QuestionRes>('question/list_title_item/', data, 'question')
}

export function addQuestionApi(data: AddQuestionParams) {
  return http.post<QuestionRes>('question/add_question_result/', data, 'question')
}
