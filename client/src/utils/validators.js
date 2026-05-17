export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  // Minimum 6 characters, at least one uppercase, lowercase and number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
  return regex.test(password)
}

export const validateRequired = (value) => {
  return value && value.trim() !== ''
}

export const validateMinLength = (value, length) => {
  return value.length >= length
}

export const validateForm = (formData, rules) => {
  const errors = {}

  Object.keys(rules).forEach((field) => {
    const value = formData[field]
    const fieldRules = rules[field]

    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = `${field} is required`
    }

    if (fieldRules.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email format'
    }

    if (fieldRules.password && value && !validatePassword(value)) {
      errors[field] = 'Password must contain uppercase, lowercase and number'
    }

    if (fieldRules.minLength && value && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = `${field} must be at least ${fieldRules.minLength} characters`
    }
  })

  return errors
}
