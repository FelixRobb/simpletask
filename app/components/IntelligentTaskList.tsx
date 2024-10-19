import React from 'react'
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import TaskItem from './TaskItem'

interface Task {
  id: number
  title: string
  description?: string
  dueDate?: string
  timeOfDay?: string
  location?: string
  priority: "Low" | "Medium" | "High"
  category: "Work" | "Personal" | "Errands"
  recurrence?: "Daily" | "Weekly" | "Monthly"
  completed: boolean
}

interface IntelligentTaskListProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskComplete: (taskId: number) => void
}

const IntelligentTaskList: React.FC<IntelligentTaskListProps> = ({ tasks, onTaskClick, onTaskComplete }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')

  const sortTasks = (tasks: Task[]): Task[] => {
    const now = new Date()
    return tasks.sort((a, b) => {
      // Sort by due date (if available)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      // If no due date, prioritize high priority tasks
      if (a.priority !== b.priority) {
        return a.priority === 'High' ? -1 : 1
      }
      // If same priority, sort by creation date (assuming id represents creation order)
      return a.id - b.id
    })
  }

  const getImportantTasks = (tasks: Task[]): Task[] => {
    const sortedTasks = sortTasks(tasks)
    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    return sortedTasks.filter(task => {
      if (task.completed) return false
      if (task.priority === 'High') return true
      if (task.dueDate && new Date(task.dueDate) <= threeDaysFromNow) return true
      return false
    }).slice(0, 5) // Return top 5 important tasks
  }

  const importantTasks = getImportantTasks(tasks)

  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      bg={bgColor}
      boxShadow="xl"
      p={6}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} color={textColor}>
        Important Tasks
      </Text>
      <VStack spacing={4} align="stretch">
        {importantTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onComplete={() => onTaskComplete(task.id)}
          />
        ))}
      </VStack>
    </Box>
  )
}

export default IntelligentTaskList