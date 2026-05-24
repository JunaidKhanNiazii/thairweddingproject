// Application constants

export const ROUTES = {
  HOME: '/',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_UPLOAD: '/admin/upload',
  GUEST_ENTER_CODE: '/guest',
  GUEST_UPLOAD_SELFIE: '/guest/:eventId/selfie',
  GUEST_GALLERY: '/guest/:eventId/photos'
}

export const EVENT_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
}

export const UPLOAD_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error'
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const MAX_PHOTOS_PER_EVENT = 1000
