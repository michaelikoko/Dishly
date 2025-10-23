export function successResponse(message, data) {
  return {
    status: 'success',
    message: message || null,
    data: data,
  }
}

export function errorResponse(message, error) {
  return {
    status: 'error',
    message: message,
    data: error || null,
  }
}
