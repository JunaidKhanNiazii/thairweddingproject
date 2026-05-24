// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  // Minimum 8 characters
  return password.length >= 8
}

export const validateEventCode = (code) => {
  // Event codes should be alphanumeric, 6-12 characters
  const codeRegex = /^[A-Za-z0-9]{6,12}$/
  return codeRegex.test(code)
}

export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be less than 10MB' }
  }
  
  return { valid: true }
}
