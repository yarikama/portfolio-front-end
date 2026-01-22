import { useState, useEffect, useCallback } from 'react'
import { labNotesService } from '../services/api'
import type { LabNoteListItem, LabNote, LabNoteTag, LabNotesQueryParams, Pagination } from '../types'

interface UseLabNotesState {
  notes: LabNoteListItem[]
  pagination: Pagination | null
  isLoading: boolean
  error: Error | null
}

export function useLabNotes(params?: LabNotesQueryParams) {
  const [state, setState] = useState<UseLabNotesState>({
    notes: [],
    pagination: null,
    isLoading: true,
    error: null,
  })

  const fetchNotes = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await labNotesService.getAll(params)
      setState({
        notes: response.data,
        pagination: response.pagination,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch lab notes'),
      }))
    }
  }, [params?.tag, params?.limit, params?.offset])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return { ...state, refetch: fetchNotes }
}

interface UseLabNoteState {
  note: LabNote | null
  isLoading: boolean
  error: Error | null
}

export function useLabNote(slug: string) {
  const [state, setState] = useState<UseLabNoteState>({
    note: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchNote = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await labNotesService.getBySlug(slug)
        setState({
          note: response.data,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setState({
          note: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch lab note'),
        })
      }
    }

    if (slug) {
      fetchNote()
    }
  }, [slug])

  return state
}

interface UseLabNoteTagsState {
  tags: LabNoteTag[]
  isLoading: boolean
  error: Error | null
}

export function useLabNoteTags() {
  const [state, setState] = useState<UseLabNoteTagsState>({
    tags: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await labNotesService.getTags()
        setState({
          tags: response.data,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setState({
          tags: [],
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch tags'),
        })
      }
    }

    fetchTags()
  }, [])

  return state
}
