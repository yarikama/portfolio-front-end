import { useState, useEffect, useCallback } from 'react'
import { projectsService } from '../services/api'
import type { Project, ProjectCategory, ProjectsQueryParams, Pagination } from '../types'

interface UseProjectsState {
  projects: Project[]
  pagination: Pagination | null
  isLoading: boolean
  error: Error | null
}

export function useProjects(params?: ProjectsQueryParams) {
  const [state, setState] = useState<UseProjectsState>({
    projects: [],
    pagination: null,
    isLoading: true,
    error: null,
  })

  const fetchProjects = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await projectsService.getAll(params)
      setState({
        projects: response.data,
        pagination: response.pagination,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to fetch projects'),
      }))
    }
  }, [params?.category_id, params?.featured, params?.tag, params?.limit, params?.offset])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return { ...state, refetch: fetchProjects }
}

export function useFeaturedProjects() {
  const [state, setState] = useState<Omit<UseProjectsState, 'pagination'>>({
    projects: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchFeatured = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await projectsService.getFeatured()
        setState({
          projects: response.data,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setState({
          projects: [],
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch featured projects'),
        })
      }
    }

    fetchFeatured()
  }, [])

  return state
}

interface UseProjectState {
  project: Project | null
  isLoading: boolean
  error: Error | null
}

export function useProject(slug: string) {
  const [state, setState] = useState<UseProjectState>({
    project: null,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchProject = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const response = await projectsService.getBySlug(slug)
        setState({
          project: response.data,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setState({
          project: null,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch project'),
        })
      }
    }

    if (slug) {
      fetchProject()
    }
  }, [slug])

  return state
}

interface UseProjectCategoriesState {
  categories: ProjectCategory[]
  isLoading: boolean
  error: Error | null
}

export function useProjectCategories() {
  const [state, setState] = useState<UseProjectCategoriesState>({
    categories: [],
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await projectsService.getCategories()
        setState({
          categories: response.data,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setState({
          categories: [],
          isLoading: false,
          error: error instanceof Error ? error : new Error('Failed to fetch categories'),
        })
      }
    }

    fetchCategories()
  }, [])

  return state
}
