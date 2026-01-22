import { useState } from 'react'
import { contactService, ApiRequestError } from '../services/api'
import type { ContactFormData } from '../types'

interface UseContactFormState {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
  fieldErrors: Record<string, string>
}

export function useContactForm() {
  const [state, setState] = useState<UseContactFormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null,
    fieldErrors: {},
  })

  const submit = async (data: ContactFormData) => {
    setState({
      isSubmitting: true,
      isSuccess: false,
      error: null,
      fieldErrors: {},
    })

    try {
      await contactService.submit(data)
      setState({
        isSubmitting: false,
        isSuccess: true,
        error: null,
        fieldErrors: {},
      })
      return true
    } catch (error) {
      if (error instanceof ApiRequestError) {
        const fieldErrors: Record<string, string> = {}

        if (error.details) {
          error.details.forEach((detail) => {
            fieldErrors[detail.field] = detail.message
          })
        }

        setState({
          isSubmitting: false,
          isSuccess: false,
          error: error.message,
          fieldErrors,
        })
      } else {
        setState({
          isSubmitting: false,
          isSuccess: false,
          error: 'An unexpected error occurred. Please try again.',
          fieldErrors: {},
        })
      }
      return false
    }
  }

  const reset = () => {
    setState({
      isSubmitting: false,
      isSuccess: false,
      error: null,
      fieldErrors: {},
    })
  }

  return {
    ...state,
    submit,
    reset,
  }
}
