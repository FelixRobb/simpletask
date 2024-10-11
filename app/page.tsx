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

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  timeOfDay?: string;
  location?: string;
  priority: "Low" | "Medium" | "High";
  category: "Work" | "Personal" | "Errands";
  recurrence?: "Daily" | "Weekly" | "Monthly" | undefined;
  completed: boolean;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, "id" | "completed">>({
    title: "",
    description: "",
    dueDate: "",
    timeOfDay: "",
    location: "",
    priority: "Medium",
    category: "Personal",
    recurrence: undefined,
  });

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    const savedDoneTasks = localStorage.getItem("doneTasks");
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedDoneTasks) setDoneTasks(JSON.parse(savedDoneTasks));
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
  }, [doneTasks]);

  const addTask = () => {
    const newTaskWithId = { ...newTask, id: Date.now(), completed: false };
    setTasks((prevTasks) => [...prevTasks, newTaskWithId]);
    resetNewTask();
    onClose();
    toast({
      title: "Task added successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const resetNewTask = () => {
    setNewTask({
      title: "",
      description: "",
      dueDate: "",
      timeOfDay: "",
      location: "",
      priority: "Medium",
      category: "Personal",
      recurrence: undefined,
    });
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
        title: "Task edited successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    toast({
      title: "Task deleted",
      status: "info",
      duration: 5000,
      isClosable: true,
    });
  };

  const markAsDone = (id: number) => {
    const completedTask = tasks.find((task) => task.id === id);
    if (completedTask) {
      completedTask.completed = true;
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setDoneTasks((prevTasks) => [...prevTasks, completedTask]);
      toast({
        title: "Task marked as done",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const recoverTask = (id: number) => {
    const taskToRecover = doneTasks.find((task) => task.id === id);
    if (taskToRecover) {
      setDoneTasks((prev) => prev.filter((task) => task.id !== id));
      setTasks((prevTasks) => [...prevTasks, taskToRecover]);
      toast({
        title: "Task recovered",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getUrgentTasks = () => {
    const now = new Date();
    return tasks.filter(
      (task) =>
        task.priority === "High" &&
        !task.completed &&
        task.dueDate &&
        new Date(task.dueDate) <= new Date(now.setHours(now.getHours() + 3))
    );
  };

  const organizeTasks = () => {
    return [...tasks].sort((a, b) => {
      if (!a.dueDate && b.dueDate) return 1;
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && !b.dueDate) return 0;
      return (
        new Date(a.dueDate || "").getTime() -
        new Date(b.dueDate || "").getTime()
      );
    });
  };

  return (
    <Box minHeight="100vh" bg={colorMode === "light" ? "gray.100" : "gray.800"}>
      <Container maxW="7xl" py={8}>
        <Button leftIcon={<AddIcon />} onClick={onOpen} mb={8}>
          Add Task
        </Button>

        {/* Modal for Adding Task */}
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
                  <FormLabel htmlFor="timeOfDay">Time of Day</FormLabel>
                  <Input
                    id="timeOfDay"
                    type="time"
                    value={newTask.timeOfDay}
                    onChange={(e) =>
                      setNewTask({ ...newTask, timeOfDay: e.target.value })
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
                      const value = e.target.value as "Low" | "Medium" | "High";
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
                      const value = e.target.value as
                        | "Work"
                        | "Personal"
                        | "Errands";
                      setNewTask({ ...newTask, category: value });
                    }}
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Errands">Errands</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="recurrence">Recurrence</FormLabel>
                  <Select
                    id="recurrence"
                    value={newTask.recurrence || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNewTask({
                        ...newTask,
                        recurrence:
                          value === ""
                            ? undefined
                            : (value as "Daily" | "Weekly" | "Monthly"),
                      });
                    }}
                  >
                    <option value="">None</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
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

        {/* Task Lists */}
        <Heading size="lg" mb={4}>
          Urgent Tasks
        </Heading>
        {getUrgentTasks().length > 0 ? (
          <VStack spacing={4} align="start">
            {getUrgentTasks().map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                markAsDone={markAsDone}
                startEditTask={startEditTask}
                deleteTask={deleteTask}
              />
            ))}
          </VStack>
        ) : (
          <Text>No urgent tasks.</Text>
        )}

        <Heading size="lg" my={8}>
          All Tasks
        </Heading>
        <VStack spacing={4} align="start">
          {organizeTasks().map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              markAsDone={markAsDone}
              startEditTask={startEditTask}
              deleteTask={deleteTask}
            />
          ))}
        </VStack>

        <Heading size="lg" my={8}>
          Done Tasks
        </Heading>
        <VStack spacing={4} align="start">
          {doneTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              markAsDone={recoverTask}
              startEditTask={startEditTask}
              deleteTask={deleteTask}
              isDoneList
            />
          ))}
        </VStack>

        {/* Modal for Editing Task */}
        <Modal isOpen={isEditOpen} onClose={onEditClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="editTitle">Title</FormLabel>
                  <Input
                    id="editTitle"
                    value={editingTask?.title || ""}
                    onChange={(e) =>
                      setEditingTask((prevTask) => ({
                        ...prevTask!,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Task title"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="editDescription">Description</FormLabel>
                  <Textarea
                    id="editDescription"
                    value={editingTask?.description || ""}
                    onChange={(e) =>
                      setEditingTask((prevTask) => ({
                        ...prevTask!,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Task description"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="editDueDate">Due Date</FormLabel>
                  <Input
                    id="editDueDate"
                    type="date"
                    value={editingTask?.dueDate || ""}
                    onChange={(e) =>
                      setEditingTask((prevTask) => ({
                        ...prevTask!,
                        dueDate: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="editTimeOfDay">Time of Day</FormLabel>
                  <Input
                    id="editTimeOfDay"
                    type="time"
                    value={editingTask?.timeOfDay || ""}
                    onChange={(e) =>
                      setEditingTask((prevTask) => ({
                        ...prevTask!,
                        timeOfDay: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="editLocation">Location</FormLabel>
                  <Input
                    id="editLocation"
                    value={editingTask?.location || ""}
                    onChange={(e) =>
                      setEditingTask((prevTask) => ({
                        ...prevTask!,
                        location: e.target.value,
                      }))
                    }
                    placeholder="Task location"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="editPriority">Priority</FormLabel>
                  <Select
                    id="editPriority"
                    value={editingTask?.priority || "Medium"}
                    onChange={(e) => {
                      const value = e.target.value as "Low" | "Medium" | "High";
                      setEditingTask((prevTask) => ({
                        ...prevTask!,
                        priority: value,
                      }));
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="editCategory">Category</FormLabel>
                  <Select
                    id="editCategory"
                    value={editingTask?.category || "Personal"}
                    onChange={(e) => {
                      const value = e.target.value as
                        | "Work"
                        | "Personal"
                        | "Errands";
                      setEditingTask((prevTask) => ({
                        ...prevTask!,
                        category: value,
                      }));
                    }}
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Errands">Errands</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="editRecurrence">Recurrence</FormLabel>
                  <Select
                    id="editRecurrence"
                    value={editingTask?.recurrence || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setEditingTask((prevTask) => ({
                        ...prevTask!,
                        recurrence:
                          value === ""
                            ? undefined
                            : (value as "Daily" | "Weekly" | "Monthly"),
                      }));
                    }}
                  >
                    <option value="">None</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={saveEditTask}>
                Save Task
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
      <IconButton
        position="fixed"
        bottom={4}
        right={4}
        aria-label="Toggle Theme"
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
      />
    </Box>
  );
}

// Component for Task Item
const TaskItem = ({
  task,
  markAsDone,
  startEditTask,
  deleteTask,
  isDoneList = false,
}: {
  task: Task;
  markAsDone: (id: number) => void;
  startEditTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  isDoneList?: boolean;
}) => {
  return (
    <Flex
      p={4}
      bg="white"
      borderRadius="md"
      boxShadow="sm"
      justify="space-between"
      align="center"
      w="full"
    >
      <Box>
        <Text fontSize="lg" fontWeight="bold">
          {task.title}{" "}
          {task.priority === "High" && <Badge colorScheme="red">Urgent</Badge>}
        </Text>
        {task.dueDate && (
          <Text>
            Due: {task.dueDate} {task.timeOfDay && `at ${task.timeOfDay}`}
          </Text>
        )}
        {task.description && <Text>Description: {task.description}</Text>}
        {task.location && <Text>Location: {task.location}</Text>}
      </Box>
      <HStack spacing={2}>
        {!isDoneList ? (
          <>
            <IconButton
              aria-label="Mark as Done"
              icon={<AddIcon />}
              onClick={() => markAsDone(task.id)}
            />
            <IconButton
              aria-label="Edit Task"
              icon={<EditIcon />}
              onClick={() => startEditTask(task)}
            />
          </>
        ) : (
          <IconButton
            aria-label="Recover Task"
            icon={<AddIcon />}
            onClick={() => markAsDone(task.id)}
          />
        )}
        <IconButton
          aria-label="Delete Task"
          icon={<DeleteIcon />}
          onClick={() => deleteTask(task.id)}
        />
      </HStack>
    </Flex>
  );
};
