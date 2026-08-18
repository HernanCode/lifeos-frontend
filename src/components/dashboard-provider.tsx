'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateGoalDto,
  CreateHabitDto,
  CreateLifeAreaDto,
  CreateProjectDto,
  CreateTaskDto,
  Goal,
  Habit,
  LifeArea,
  Project,
  Task,
  UpdateGoalDto,
  UpdateProjectDto,
  UpdateTaskDto,
} from '@/types'
import { goalService } from '@/lib/services/goalService'
import { habitService } from '@/lib/services/habitService'
import { lifeAreaService } from '@/lib/services/lifeAreaService'
import { projectService } from '@/lib/services/projectService'
import { taskService } from '@/lib/services/taskService'
import { handleMutationError } from '@/lib/error-handler'
import { dateDaysAgo, isHabitDoneOn } from '@/lib/habit-utils'

type DashboardContextValue = {
  tasks: Task[]
  goals: Goal[]
  habits: Habit[]
  lifeAreas: LifeArea[]
  projects: Project[]
  isLoadingTasks: boolean
  isLoadingGoals: boolean
  isLoadingHabits: boolean
  isLoadingProjects: boolean
  toggleTask: (id: number) => void
  toggleHabitDay: (id: number, dayIndex: number) => void
  toggleHabitDate: (id: number, date: string) => void
  createTask: (data: CreateTaskDto) => Promise<void>
  updateTask: (id: number, data: UpdateTaskDto) => Promise<void>
  deleteTask: (id: number) => Promise<void>
  createGoal: (data: CreateGoalDto) => Promise<void>
  updateGoal: (id: number, data: UpdateGoalDto) => Promise<void>
  deleteGoal: (id: number) => Promise<void>
  createHabit: (data: CreateHabitDto) => Promise<void>
  updateHabit: (
    id: number,
    data: Partial<CreateHabitDto> & { is_active?: boolean },
  ) => Promise<void>
  deleteHabit: (id: number) => Promise<void>
  createProject: (data: CreateProjectDto) => Promise<void>
  updateProject: (id: number, data: UpdateProjectDto) => Promise<void>
  deleteProject: (id: number) => Promise<void>
  createLifeArea: (data: CreateLifeAreaDto) => Promise<LifeArea>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getAll(),
  })

  const habitsQuery = useQuery({
    queryKey: ['habits'],
    queryFn: habitService.getAll,
  })

  const goalsQuery = useQuery({
    queryKey: ['goals'],
    queryFn: goalService.getAll,
  })

  const lifeAreasQuery = useQuery({
    queryKey: ['life-areas'],
    queryFn: lifeAreaService.getAll,
  })

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAll,
  })

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskDto }) =>
      taskService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (e) => handleMutationError(e, 'No se pudo actualizar la tarea'),
  })

  const toggleHabitMutation = useMutation({
    mutationFn: ({
      id,
      completed,
      date,
    }: {
      id: number
      completed: boolean
      date: string
    }) => habitService.toggle(id, completed, date),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success(variables.completed ? 'Hábito marcado' : 'Hábito desmarcado')
    },
    onError: (e) => handleMutationError(e, 'No se pudo actualizar el hábito'),
  })

  const createTaskMutation = useMutation({
    mutationFn: taskService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Tarea creada')
    },
    onError: (e) => handleMutationError(e, 'No se pudo crear la tarea'),
  })

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Tarea eliminada')
    },
    onError: (e) => handleMutationError(e, 'No se pudo eliminar la tarea'),
  })

  const createGoalMutation = useMutation({
    mutationFn: goalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Meta creada')
    },
    onError: (e) => handleMutationError(e, 'No se pudo crear la meta'),
  })

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGoalDto }) =>
      goalService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Meta actualizada')
    },
    onError: (e) => handleMutationError(e, 'No se pudo actualizar la meta'),
  })

  const deleteGoalMutation = useMutation({
    mutationFn: goalService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      toast.success('Meta eliminada')
    },
    onError: (e) => handleMutationError(e, 'No se pudo eliminar la meta'),
  })

  const createHabitMutation = useMutation({
    mutationFn: habitService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Hábito creado')
    },
    onError: (e) => handleMutationError(e, 'No se pudo crear el hábito'),
  })

  const updateHabitMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<CreateHabitDto> & { is_active?: boolean }
    }) => habitService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Hábito actualizado')
    },
    onError: (e) => handleMutationError(e, 'No se pudo actualizar el hábito'),
  })

  const deleteHabitMutation = useMutation({
    mutationFn: habitService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      toast.success('Hábito eliminado')
    },
    onError: (e) => handleMutationError(e, 'No se pudo eliminar el hábito'),
  })

  const createProjectMutation = useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Proyecto creado')
    },
    onError: (e) => handleMutationError(e, 'No se pudo crear el proyecto'),
  })

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectDto }) =>
      projectService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      toast.success('Proyecto actualizado')
    },
    onError: (e) => handleMutationError(e, 'No se pudo actualizar el proyecto'),
  })

  const deleteProjectMutation = useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      toast.success('Proyecto eliminado')
    },
    onError: (e) => handleMutationError(e, 'No se pudo eliminar el proyecto'),
  })

  const createLifeAreaMutation = useMutation({
    mutationFn: lifeAreaService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['life-areas'] }),
    onError: (e) => handleMutationError(e, 'No se pudo crear el área de vida'),
  })

  function toggleTask(id: number) {
    const task = tasksQuery.data?.find((t) => t.id === id)
    if (!task) return
    const willBeDone = task.status !== 'done'
    updateTaskMutation.mutate({
      id,
      data: { status: willBeDone ? 'done' : 'todo' },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        toast.success(willBeDone ? 'Tarea completada' : 'Tarea reabierta')
      },
    })
  }

  function toggleHabitDay(id: number, dayIndex: number) {
    const habit = habitsQuery.data?.find((h) => h.id === id)
    if (!habit) return
    const date = dateDaysAgo(6 - dayIndex)
    toggleHabitMutation.mutate({
      id,
      completed: !isHabitDoneOn(habit, date),
      date,
    })
  }

  function toggleHabitDate(id: number, date: string) {
    const habit = habitsQuery.data?.find((h) => h.id === id)
    if (!habit) return
    toggleHabitMutation.mutate({
      id,
      completed: !isHabitDoneOn(habit, date),
      date,
    })
  }

  async function createTask(data: CreateTaskDto) {
    await createTaskMutation.mutateAsync(data)
  }
  async function updateTask(id: number, data: UpdateTaskDto) {
    await updateTaskMutation.mutateAsync({ id, data })
  }
  async function deleteTask(id: number) {
    await deleteTaskMutation.mutateAsync(id)
  }
  async function createGoal(data: CreateGoalDto) {
    await createGoalMutation.mutateAsync(data)
  }
  async function updateGoal(id: number, data: UpdateGoalDto) {
    await updateGoalMutation.mutateAsync({ id, data })
  }
  async function deleteGoal(id: number) {
    await deleteGoalMutation.mutateAsync(id)
  }
  async function createHabit(data: CreateHabitDto) {
    await createHabitMutation.mutateAsync(data)
  }
  async function updateHabit(
    id: number,
    data: Partial<CreateHabitDto> & { is_active?: boolean },
  ) {
    await updateHabitMutation.mutateAsync({ id, data })
  }
  async function deleteHabit(id: number) {
    await deleteHabitMutation.mutateAsync(id)
  }
  async function createProject(data: CreateProjectDto) {
    await createProjectMutation.mutateAsync(data)
  }
  async function updateProject(id: number, data: UpdateProjectDto) {
    await updateProjectMutation.mutateAsync({ id, data })
  }
  async function deleteProject(id: number) {
    await deleteProjectMutation.mutateAsync(id)
  }

  return (
    <DashboardContext.Provider
      value={{
        tasks: tasksQuery.data ?? [],
        goals: goalsQuery.data ?? [],
        habits: habitsQuery.data ?? [],
        lifeAreas: lifeAreasQuery.data ?? [],
        projects: projectsQuery.data ?? [],
        isLoadingTasks: tasksQuery.isLoading,
        isLoadingGoals: goalsQuery.isLoading,
        isLoadingHabits: habitsQuery.isLoading,
        isLoadingProjects: projectsQuery.isLoading,
        toggleTask,
        toggleHabitDay,
        toggleHabitDate,
        createTask,
        updateTask,
        deleteTask,
        createGoal,
        updateGoal,
        deleteGoal,
        createHabit,
        updateHabit,
        deleteHabit,
        createProject,
        updateProject,
        deleteProject,
        createLifeArea: (data) => createLifeAreaMutation.mutateAsync(data),
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const ctx = useContext(DashboardContext)
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider')
  return ctx
}
