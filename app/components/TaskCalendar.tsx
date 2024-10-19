import React from 'react'
import {
  Box,
  Grid,
  Text,
  Button,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react'

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

interface TaskCalendarProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

const TaskCalendar: React.FC<TaskCalendarProps> = ({ tasks, onTaskClick }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const cellBgColor = useColorModeValue('gray.50', 'gray.700')

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return (
        taskDate.getFullYear() === date.getFullYear() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getDate() === date.getDate()
      )
    })
  }

  const renderCalendarDays = () => {
    const days = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<Box key={`empty-${i}`} bg={cellBgColor} borderRadius="md" p={2} />)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const tasksForDay = getTasksForDate(date)
      days.push(
        <Box key={day} bg={cellBgColor} borderRadius="md" p={2}>
          <Text fontWeight="bold" mb={2}>{day}</Text>
          <VStack align="stretch" spacing={1}>
            {tasksForDay.map(task => (
              <Button
                key={task.id}
                size="sm"
                colorScheme={task.priority === 'High' ? 'red' : task.priority === 'Medium' ? 'yellow' : 'green'}
                onClick={() => onTaskClick(task)}
              >
                {task.title}
              </Button>
            ))}
          </VStack>
        </Box>
      )
    }
    return days
  }

  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      bg={bgColor}
      boxShadow="xl"
      p={6}
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} color={textColor}>
        {`${months[currentMonth]} ${currentYear}`}
      </Text>
      <Grid templateColumns="repeat(7, 1fr)" gap={2} mb={4}>
        {daysOfWeek.map(day => (
          <Box key={day} textAlign="center" fontWeight="bold" color={textColor}>
            {day}
          </Box>
        ))}
      </Grid>
      <Grid templateColumns="repeat(7, 1fr)" gap={2}>
        {renderCalendarDays()}
      </Grid>
    </Box>
  )
}

export default TaskCalendar