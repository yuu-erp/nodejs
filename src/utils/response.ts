export type ResponseStatus = 'success' | 'fail' | 'error'

export const successResponse = <T>(data: T, message = 'Success') => {
  return {
    status: 'success' as ResponseStatus,
    message,
    data
  }
}

export const failResponse = (message = 'Fail') => {
  return {
    status: 'fail' as ResponseStatus,
    message,
    data: null
  }
}

export const errorResponse = (message = 'Internal Server Error') => {
  return {
    status: 'error' as ResponseStatus,
    message,
    data: null
  }
}
