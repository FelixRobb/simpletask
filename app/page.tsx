"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  VStack,
  Badge,
  useDisclosure,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import {
  AddIcon,
  DeleteIcon,
  EditIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO format date
  hours: number; // Number of hours
  location: string;
  category: "Work" | "Personal" | "Errands";
  priority: "Low" | "Medium" | "High";
  completed: boolean;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]); // Added state for deleted tasks
  const [isClient, setIsClient] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "completed">>({
    title: "",
    description: "",
    dueDate: "",
    hours: 1,
    location: "",
    category: "Personal",
    priority: "Medium",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const addTask = () => {
    const newTaskWithId = { ...newTask, id: Date.now(), completed: false };
    setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      hours: 1,
      location: "",
      category: "Personal",
      priority: "Medium",
    });
    onClose();
    toast({
      title: "Task added successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });    
  };

  const deleteTask = (id: number) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (taskToDelete) {
      setDeletedTasks((prev) => [...prev, taskToDelete]); // Add to deleted tasks
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      toast({
        title: "Task deleted",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      
    }
  };

  const recoverTask = (id: number) => {
    const taskToRecover = deletedTasks.find((task) => task.id === id);
    if (taskToRecover) {
      setTasks((prevTasks) => [...prevTasks, taskToRecover]); // Recover task
      setDeletedTasks((prev) => prev.filter((task) => task.id !== id)); // Remove from deleted tasks
      toast({
        title: "Task added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
    }
  };

  const startEditTask = (task: Task) => {
    setEditingTask({ ...task });
    onEditOpen();
  };

  const saveEditTask = () => {
    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id ? editingTask : task
        )
      );
      setEditingTask(null);
      onEditClose();
      toast({
        title: "Task added successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [removed] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, removed);
    setTasks(reorderedTasks);
  };

  const getUrgentTasks = () => {
    const now = new Date();
    return tasks.filter(
      (task) =>
        !task.completed &&
        (new Date(task.dueDate) < now || task.priority === "High")
    );
  };

  if (!isClient) {
    return (
      <Box bg={colorMode === "light" ? "gray.100" : "gray.800"}>Loading...</Box>
    );
  }

  return (
    <Box minHeight="100vh" bg={colorMode === "light" ? "gray.100" : "gray.800"}>
      <Box
        as="header"
        bg={colorMode === "light" ? "white" : "gray.700"}
        shadow="sm"
      >
        <Container maxW="7xl" py={4}>
          <Flex justify="space-between" align="center">
            <Heading as="h1" size="lg">
              SimpleTask
            </Heading>
            <HStack>
              <IconButton
                aria-label="Toggle dark mode"
                icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="7xl" py={8}>
        <Button leftIcon={<AddIcon />} onClick={onOpen} mb={8}>
          Add Task
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="title">Title</FormLabel>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Task title"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="description">Description</FormLabel>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Task description"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="dueDate">Due Date</FormLabel>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="hours">Hours</FormLabel>
                  <Input
                    id="hours"
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={newTask.hours}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        hours: parseFloat(e.target.value),
                      })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="location">Location</FormLabel>
                  <Input
                    id="location"
                    value={newTask.location}
                    onChange={(e) =>
                      setNewTask({ ...newTask, location: e.target.value })
                    }
                    placeholder="Task location"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="priority">Priority</FormLabel>
                  <Select
                    id="priority"
                    value={newTask.priority}
                    onChange={(e) => {
                      const value = e.target.value as "Low" | "Medium" | "High"; // Type assertion
                      setNewTask({ ...newTask, priority: value });
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="category">Category</FormLabel>
                  <Select
                    id="category"
                    value={newTask.category}
                    onChange={(e) => {
                      const value = e.target.value as "Work" | "Personal" | "Errands";
                      setNewTask({ ...newTask, category: value });
                    }}
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Errands">Errands</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" onClick={addTask}>
                Add Task
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Task List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="taskList">
            {(provided) => (
              <VStack
                {...provided.droppableProps}
                ref={provided.innerRef}
                spacing={4}
                align="stretch"
              >
                {tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        p={4}
                        bg="white"
                        rounded="md"
                        shadow="sm"
                      >
                        <Flex justify="space-between" align="center">
                          <VStack align="start">
                            <Text fontWeight="bold">{task.title}</Text>
                            <Text>{task.description}</Text>
                            <Text color="gray.600">{`Due: ${task.dueDate} - Estimated Hours: ${task.hours}`}</Text>
                            <Badge
                              colorScheme={
                                task.priority === "High"
                                  ? "red"
                                  : task.priority === "Medium"
                                  ? "yellow"
                                  : "green"
                              }
                            >
                              {task.priority}
                            </Badge>
                            <Badge colorScheme={task.category === "Work" ? "blue" : task.category === "Personal" ? "purple" : "green"}>
                              {task.category}
                            </Badge>
                          </VStack>
                          <HStack>
                            <IconButton
                              aria-label="Edit Task"
                              icon={<EditIcon />}
                              onClick={() => startEditTask(task)}
                            />
                            <IconButton
                              aria-label="Delete Task"
                              icon={<DeleteIcon />}
                              onClick={() => deleteTask(task.id)}
                            />
                          </HStack>
                        </Flex>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </VStack>
            )}
          </Droppable>
        </DragDropContext>

        {/* Urgent Tasks */}
        <Heading as="h2" size="lg" mt={8}>
          Urgent Tasks
        </Heading>
        <VStack spacing={4} align="stretch">
          {getUrgentTasks().map((task) => (
            <Box key={task.id} p={4} bg="red.200" rounded="md">
              <Text fontWeight="bold">{task.title}</Text>
              <Text>{task.description}</Text>
              <Text color="red.600">{`Due: ${task.dueDate}`}</Text>
            </Box>
          ))}
        </VStack>

        {/* Deleted Tasks */}
        <Heading as="h2" size="lg" mt={8}>
          Deleted Tasks
        </Heading>
        <VStack spacing={4} align="stretch">
          {deletedTasks.map((task) => (
            <Box key={task.id} p={4} bg="gray.300" rounded="md">
              <Text fontWeight="bold">{task.title}</Text>
              <Text>{task.description}</Text>
              <Button
                size="sm"
                mt={2}
                colorScheme="teal"
                onClick={() => recoverTask(task.id)}
              >
                Recover
              </Button>
            </Box>
          ))}
        </VStack>
      </Container>
    </Box>
  );
}
