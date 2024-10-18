import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
  task?: {
    id: number;
    title: string;
    description?: string;
    dueDate?: string;
    timeOfDay?: string;
    location?: string;
    priority: "Low" | "Medium" | "High";
    category: "Work" | "Personal" | "Errands";
    recurrence?: "Daily" | "Weekly" | "Monthly";
    completed: boolean;
  } | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(task?.dueDate || "");
  const [timeOfDay, setTimeOfDay] = useState(task?.timeOfDay || "");
  const [location, setLocation] = useState(task?.location || "");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [category, setCategory] = useState(task?.category || "Work");
  const [recurrence, setRecurrence] = useState(task?.recurrence || "");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDueDate(task.dueDate || "");
      setTimeOfDay(task.timeOfDay || "");
      setLocation(task.location || "");
      setPriority(task.priority);
      setCategory(task.category);
      setRecurrence(task.recurrence || "");
    }
  }, [task]);

  const handleSave = () => {
    const currentDate = new Date();
    const selectedDate = dueDate ? new Date(dueDate) : null;
    if (selectedDate && selectedDate < currentDate) {
      alert("The selected date is in the past. Please choose a future date.");
      return;
    }

    onSave({
      id: task?.id || Date.now(),
      title,
      description,
      dueDate,
      timeOfDay,
      location,
      priority,
      category,
      recurrence,
      completed: task?.completed || false,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{task ? "Edit Task" : "Create Task"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
              />
            </FormControl>

            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
              />
            </FormControl>

            <FormControl id="dueDate">
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </FormControl>

            <FormControl id="timeOfDay">
              <FormLabel>Time of Day</FormLabel>
              <Input
                type="time"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
              />
            </FormControl>

            <FormControl id="location">
              <FormLabel>Location</FormLabel>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Task location"
              />
            </FormControl>

            <FormControl id="priority">
              <FormLabel>Priority</FormLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "Low" | "Medium" | "High")}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </FormControl>

            <FormControl id="category">
              <FormLabel>Category</FormLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as "Work" | "Personal" | "Errands")}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Errands">Errands</option>
              </Select>
            </FormControl>

            <FormControl id="recurrence">
              <FormLabel>Recurrence</FormLabel>
              <Select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
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
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskModal;