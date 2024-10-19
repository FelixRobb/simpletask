import React, { useState, useEffect } from "react"
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
} from "@chakra-ui/react"

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: any) => void
  task?: {
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
  } | null
}

const initialTaskState = {
  title: "",
  description: "",
  dueDate: "",
  timeOfDay: "",
  location: "",
  priority: "Medium",
  category: "Work",
  recurrence: "",
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState(initialTaskState)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate || "",
        timeOfDay: task.timeOfDay || "",
        location: task.location || "",
        priority: task.priority,
        category: task.category,
        recurrence: task.recurrence || "",
      })
    } else {
      setFormData(initialTaskState)
    }
  }, [task, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    const currentDate = new Date()
    const selectedDate = formData.dueDate ? new Date(formData.dueDate) : null
    if (selectedDate && selectedDate < currentDate) {
      alert("The selected date is in the past. Please choose a future date.")
      return
    }

    onSave({
      id: task?.id || Date.now(),
      ...formData,
      completed: task?.completed || false,
    })
    setFormData(initialTaskState)
  }

  return  (
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
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Task title"
              />
            </FormControl>

            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Task description"
              />
            </FormControl>

            <FormControl id="dueDate">
              <FormLabel>Due Date</FormLabel>
              <Input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="timeOfDay">
              <FormLabel>Time of Day</FormLabel>
              <Input
                name="timeOfDay"
                type="time"
                value={formData.timeOfDay}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl id="location">
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Task location"
              />
            </FormControl>

            <FormControl id="priority">
              <FormLabel>Priority</FormLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </FormControl>

            <FormControl id="category">
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Errands">Errands</option>
              </Select>
            </FormControl>

            <FormControl id="recurrence">
              <FormLabel>Recurrence</FormLabel>
              <Select
                name="recurrence"
                value={formData.recurrence}
                onChange={handleChange}
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
  )
}

export default TaskModal
