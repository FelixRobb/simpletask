'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Heading,
  VStack,
  useDisclosure,
  useToast,
  IconButton,
  Flex,
  Text,
  Spacer,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import { AddIcon, MoonIcon, SunIcon } from '@chakra-ui/icons'
import TaskItem from './components/TaskItem'
import TaskModal from './components/TaskModal'
import TaskDetailsModal from './components/TaskDetailsModal'
import IntelligentTaskList from './components/IntelligentTaskList'
import TaskCalendar from './components/TaskCalendar'

interface Task {
  id: number
  title: string
  description?: string
  dueDate?: string
  timeOfDay?: string
  location?: string
  priority: "Low" | "Medium" | "High"
  category: "Work" | "Personal" | "Errands"
  recurrence?: "Daily" | "Weekly" | "Monthly" | undefined
  completed: boolean
}

const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__'
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [doneTasks, setDoneTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { isOpen: isTaskModalOpen, onOpen: onTaskModalOpen, onClose: onTaskModalClose } = useDisclosure()
  const { isOpen: isDetailsModalOpen, onOpen: onDetailsModalOpen, onClose: onDetailsModalClose } = useDisclosure()
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark')
  const toast = useToast()

  const toggleColorMode = () => {
    setColorMode(colorMode === 'light' ? 'dark' : 'light')
  }

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const headerBgColor = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const glassBgColor = useColorModeValue('rgba(255, 255, 255, 0.6)', 'rgba(26, 32, 44, 0.6)')

  useEffect(() => {
    const loadTasks = () => {
      if (isLocalStorageAvailable()) {
        const savedTasks = localStorage.getItem('tasks')
        const savedDoneTasks = localStorage.getItem('doneTasks')
        
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks)
          setTasks(parsedTasks)
        }
        
        if (savedDoneTasks) {
          const parsedDoneTasks = JSON.parse(savedDoneTasks)
          setDoneTasks(parsedDoneTasks)
        }
      } else {
        console.error('localStorage is not available')
        toast({
          title: 'Storage Error',
          description: 'Unable to access local storage. Your tasks may not be saved.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  
    loadTasks()
  }, [toast])
  
  useEffect(() => {
    const saveTasks = () => {
      if (isLocalStorageAvailable()) {
        localStorage.setItem("tasks", JSON.stringify(tasks))
        localStorage.setItem("doneTasks", JSON.stringify(doneTasks))
      }
    }

    if (tasks.length > 0 || doneTasks.length > 0) {
      saveTasks()
    }
  }, [tasks, doneTasks])

  const addTask = (newTask: Omit<Task, "id" | "completed">) => {
    const newTaskWithId = { ...newTask, id: Date.now(), completed: false }
    setTasks((prevTasks) => [...prevTasks, newTaskWithId])
    toast({
      title: "Task added successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const editTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    )
    setDoneTasks((prevDoneTasks) =>
      prevDoneTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    )
    toast({
      title: "Task updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const markTaskAsDone = (taskId: number) => {
    setTasks((prevTasks) => {
      const taskToMove = prevTasks.find((task) => task.id === taskId)
      if (taskToMove) {
        setDoneTasks((prevDoneTasks) => [...prevDoneTasks, { ...taskToMove, completed: true }])
      }
      return prevTasks.filter((task) => task.id !== taskId)
    })
    
    toast({
      title: "Task marked as done",
      status: "info",
      duration: 3000,
      isClosable: true,
    })
  }

  const recoverTask = (taskId: number) => {
    setDoneTasks((prevDoneTasks) => {
      const taskToRecover = prevDoneTasks.find((task) => task.id === taskId)
      if (taskToRecover) {
        const currentDate = new Date()
        const taskDate = taskToRecover.dueDate ? new Date(taskToRecover.dueDate) : null
        if (taskDate && taskDate < currentDate) {
          toast({
            title: "Cannot recover task with past date",
            description: "Please edit the task date before recovering.",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
          return prevDoneTasks
        }
        setTasks((prevTasks) => {
          const existingTask = prevTasks.find((task) => task.id === taskId)
          if (!existingTask) {
            return [...prevTasks, { ...taskToRecover, completed: false }]
          }
          return prevTasks
        })
        return prevDoneTasks.filter((task) => task.id !== taskId)
      }
      return prevDoneTasks
    })
    
    toast({
      title: "Task recovered",
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    setDoneTasks((prevDoneTasks) => prevDoneTasks.filter((task) => task.id !== taskId))
  
    toast({
      title: "Task deleted",
      status: "warning",
      duration: 3000,
      
      isClosable: true,
    })
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    onDetailsModalOpen()
  }

  const handleEditClick = () => {
    setEditingTask(selectedTask)
    onDetailsModalClose()
    onTaskModalOpen()
  }

  const handleDoneClick = () => {
    if (selectedTask) {
      if (selectedTask.completed) {
        recoverTask(selectedTask.id)
      } else {
        markTaskAsDone(selectedTask.id)
      }
    }
    onDetailsModalClose()
  }

  const handleDeleteClick = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id)
    }
    onDetailsModalClose()
  }

  return (
    <Box minHeight="100vh" bg={bgColor} color={useColorModeValue('gray.800', 'white')}>
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={10}
        bg={headerBgColor}
        backdropFilter="blur(10px)"
        boxShadow="lg"
      >
        <Container maxW="container.xl" py={4}>
          <Flex alignItems="center">
            <Heading as="h1" size="xl">Task Manager</Heading>
            <Spacer />
            <IconButton
              aria-label="Toggle color mode"
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
              size="lg"
              variant="ghost"
              mr={4}
            />
            <Button
              leftIcon={<AddIcon />}
              onClick={onTaskModalOpen}
              colorScheme="blue"
              size="lg"
              boxShadow="md"
              _hover={{ boxShadow: 'lg' }}
            >
              Add Task
            </Button>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" pt="100px" pb={8}>
        <Tabs variant="enclosed" colorScheme="blue">
          <TabList mb={4}>
            <Tab>Tasks</Tab>
            <Tab>Calendar</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack spacing={8} align="stretch">
                <IntelligentTaskList
                  tasks={tasks}
                  onTaskClick={handleTaskClick}
                  onTaskComplete={markTaskAsDone}
                />
                <Box
                  borderRadius="xl"
                  overflow="hidden"
                  bg={glassBgColor}
                  boxShadow="2xl"
                  backdropFilter="blur(20px)"
                  p={6}
                >
                  <Text fontSize="2xl" fontWeight="bold" mb={4}>Active Tasks</Text>
                  <VStack spacing={4} align="stretch">
                    {tasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                        onComplete={() => markTaskAsDone(task.id)}
                      />
                    ))}
                  </VStack>
                </Box>
                <Box
                  borderRadius="xl"
                  overflow="hidden"
                  bg={glassBgColor}
                  boxShadow="2xl"
                  backdropFilter="blur(20px)"
                  p={6}
                >
                  <Text fontSize="2xl" fontWeight="bold" mb={4}>Completed Tasks</Text>
                  <VStack spacing={4} align="stretch">
                    {doneTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onClick={() => handleTaskClick(task)}
                        onComplete={() => recoverTask(task.id)}
                      />
                    ))}
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>
            <TabPanel>
              <TaskCalendar tasks={tasks} onTaskClick={handleTaskClick} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          onTaskModalClose()
          setEditingTask(null)
        }}
        onSave={(task) => {
          if (editingTask) {
            editTask(task)
          } else {
            addTask(task)
          }
          onTaskModalClose()
          setEditingTask(null)
        }}
        task={editingTask}
      />

      {selectedTask && (
        <TaskDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={onDetailsModalClose}
          task={selectedTask}
          onEdit={handleEditClick}
          onDone={handleDoneClick}
          onDelete={handleDeleteClick}
        />
      )}
    </Box>
  )
}