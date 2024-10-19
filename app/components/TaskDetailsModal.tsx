import React from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Flex,
  Box,
  useColorModeValue,
} from "@chakra-ui/react"
import { CheckIcon, ClockIcon, MapPinIcon, CalendarIcon, RepeatIcon } from "lucide-react"

interface TaskDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  task: {
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
  onEdit: () => void
  onDone: () => void
  onDelete: () => void
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDone,
  onDelete,
}) => {
  const bgColor = useColorModeValue("white", "gray.800")
  const textColor = useColorModeValue("gray.800", "white")
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400")

  const priorityColor = {
    Low: "green",
    Medium: "yellow",
    High: "red",
  }

  const categoryColor = {
    Work: "blue",
    Personal: "purple",
    Errands: "orange",
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={bgColor} borderRadius="xl" overflow="hidden">
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          h="8px"
          bg={priorityColor[task.priority]}
        />
        <ModalHeader pt={8} pb={2}>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>
            {task.title}
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={6}>
            <Flex flexWrap="wrap" gap={2}>
              <Badge colorScheme={priorityColor[task.priority]} variant="subtle" fontSize="sm">
                {task.priority} Priority
              </Badge>
              <Badge colorScheme={categoryColor[task.category]} variant="subtle" fontSize="sm">
                {task.category}
              </Badge>
              {task.recurrence && (
                <Badge colorScheme="purple" variant="subtle" fontSize="sm">
                  Recurs {task.recurrence}
                </Badge>
              )}
              <Badge colorScheme={task.completed ? "green" : "gray"} variant="subtle" fontSize="sm">
                {task.completed ? "Completed" : "Pending"}
              </Badge>
            </Flex>

            {task.description && (
              <Text color={secondaryTextColor}>{task.description}</Text>
            )}

            <VStack align="stretch" spacing={2}>
              {task.dueDate && (
                <HStack>
                  <CalendarIcon size={16} color={secondaryTextColor} />
                  <Text color={secondaryTextColor} fontSize="sm">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Text>
                </HStack>
              )}
              {task.timeOfDay && (
                <HStack>
                  <ClockIcon size={16} color={secondaryTextColor} />
                  <Text color={secondaryTextColor} fontSize="sm">
                    Time: {task.timeOfDay}
                  </Text>
                </HStack>
              )}
              {task.location && (
                <HStack>
                  <MapPinIcon size={16} color={secondaryTextColor} />
                  <Text color={secondaryTextColor} fontSize="sm">
                    Location: {task.location}
                  </Text>
                </HStack>
              )}
              {task.recurrence && (
                <HStack>
                  <RepeatIcon size={16} color={secondaryTextColor} />
                  <Text color={secondaryTextColor} fontSize="sm">
                    Recurrence: {task.recurrence}
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onEdit}>
            Edit
          </Button>
          <Button
            colorScheme={task.completed ? "gray" : "green"}
            mr={3}
            onClick={onDone}
            leftIcon={<CheckIcon size={16} />}
          >
            {task.completed ? "Unmark" : "Mark as Done"}
          </Button>
          <Button colorScheme="red" onClick={onDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default TaskDetailsModal