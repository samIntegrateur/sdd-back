
// todo: add more indication for the front end
type CustomCode = 'customFieldValidation' | 'customGroupValidation' | 'customTechnical';

export interface CustomError extends Error {
  code: CustomCode,
  field?: string,
  humanReadable: boolean,
}
