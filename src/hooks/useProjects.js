import { useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchProjects = useCallback(async (userId) => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const saveProject = useCallback(async (project) => {
    if (!isSupabaseConfigured()) return null
    try {
      const { id, ...payload } = project;
      
      if (id) {
        // Fetch current state BEFORE updating to archive previous version
        const { data: current, error: fetchError } = await supabase
          .from('projects')
          .select('html_content')
          .eq('id', id)
          .single()
        
        if (!fetchError && current) {
          // Archive the PREVIOUS version first
          await supabase.from('project_versions').insert({
            project_id: id,
            html_content: current.html_content
          })
        }

        // Update existing with NEW content
        const { data, error } = await supabase
          .from('projects')
          .update({
            ...payload,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single()
        
        if (error) throw error
        setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)))
        
        return data
      } else {
        // Initial insert
        const { data, error } = await supabase
          .from('projects')
          .insert(payload)
          .select()
          .single()
          
        if (error) throw error
        setProjects((prev) => [data, ...prev])
        
        // Save initial version as the first point in history
        await supabase.from('project_versions').insert({
          project_id: data.id,
          html_content: data.html_content
        })
        
        return data
      }
    } catch (error) {
       console.error('Save failed:', error)
       throw error
    }
  }, [])

  const updateProject = useCallback(async (id, updates) => {
    if (!isSupabaseConfigured()) return null
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setProjects((prev) => prev.map((p) => (p.id === id ? data : p)))
    return data
  }, [])

  const deleteProject = useCallback(async (id) => {
    if (!isSupabaseConfigured()) return
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const searchProjects = useCallback(async (userId, query) => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .or(`name.ilike.%${query}%,prompt.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const toggleStar = useCallback(async (id, currentStatus) => {
    if (!isSupabaseConfigured()) return
    const { data, error } = await supabase
      .from('projects')
      .update({ is_starred: !currentStatus })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setProjects((prev) => prev.map((p) => (p.id === id ? data : p)))
  }, [])

  const publishProject = useCallback(async (id) => {
    if (!isSupabaseConfigured()) return null
    // generate random 6-char slug
    const slug = Math.random().toString(36).substring(2, 8)
    const { data, error } = await supabase
      .from('projects')
      .update({ is_public: true, slug })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setProjects((prev) => prev.map((p) => (p.id === id ? data : p)))
    return data
  }, [])

  const unpublishProject = useCallback(async (id) => {
    if (!isSupabaseConfigured()) return null
    const { data, error } = await supabase
      .from('projects')
      .update({ is_public: false })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setProjects((prev) => prev.map((p) => (p.id === id ? data : p)))
    return data
  }, [])

  const getProjectVersions = useCallback(async (projectId) => {
    if (!isSupabaseConfigured()) return []
    const { data, error } = await supabase
      .from('project_versions')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }, [])

  return { 
    projects, loading, fetchProjects, saveProject, updateProject, 
    deleteProject, searchProjects, toggleStar, publishProject, unpublishProject,
    getProjectVersions
  }
}
