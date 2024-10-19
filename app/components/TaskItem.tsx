import React from "react"
import {
  Box,
  Flex,
  Text,
  Badge,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react"
import { CheckIcon, ClockIcon, MapPinIcon } from "lucide-react"

interface TaskItemProps {
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
  onClick: () => void
  onComplete: () => void  // Add this line
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick, onComplete }) => {
  const bgColor = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.600")
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
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      bg={bgColor}
      boxShadow="lg"
      transition="all 0.3s"
      _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
      onClick={onClick}
      position="relative"
      overflow="hidden"
    >
      <Flex justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color={textColor}
            mb={2}
            as={task.completed ? "s" : undefined}
          >
            {task.title}
          </Text>
          {task.description && (
            <Text fontSize="sm" color={secondaryTextColor} mb={2}>
              {task.description}
            </Text>
          )}
          <Flex flexWrap="wrap" gap={2} mb={2}>
            <Badge colorScheme={priorityColor[task.priority]} variant="subtle">
              {task.priority} Priority
            </Badge>
            <Badge colorScheme={categoryColor[task.category]} variant="subtle">
              {task.category}
            </Badge>
            {task.recurrence && (
              <Badge colorScheme="purple" variant="subtle">
                Recurs {task.recurrence}
              </Badge>
            )}
          </Flex>
          <Flex alignItems="center" flexWrap="wrap" gap={4}>
            {task.dueDate && (
              <Flex alignItems="center" fontSize="xs" color={secondaryTextColor}>
                <ClockIcon size={12} style={{ marginRight: "4px" }} />
                {new Date(task.dueDate).toLocaleDateString()}
                {task.timeOfDay && ` at ${task.timeOfDay}`}
              </Flex>
            )}
            {task.location && (
              <Flex alignItems="center" fontSize="xs" color={secondaryTextColor}>
                <MapPinIcon size={12} style={{ marginRight: "4px" }} />
                {task.location}
              </Flex>
            )}
          </Flex>
        </Box>
        <IconButton
          aria-label={task.completed ? "Completed" : "Mark as completed"}
          icon={<CheckIcon />}
          size="sm"
          colorScheme={task.completed ? "green" : "gray"}
          variant={task.completed ? "solid" : "outline"}
          onClick={(e) => {
            e.stopPropagation()
            onComplete()
          }}
        />
      </Flex>
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        h="4px"
        bg={priorityColor[task.priority]}
      />
    </Box>
  )
}

export default TaskItem