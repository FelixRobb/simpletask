import React from "react";
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Spacer,
} from "@chakra-ui/react";
import { Badge } from "@chakra-ui/react";

interface TaskItemProps {
  task: {
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
  };
  onClick: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onClick }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.400");

  const priorityColor = {
    Low: "green",
    Medium: "yellow",
    High: "red",
  };

  const categoryColor = {
    Work: "blue",
    Personal: "purple",
    Errands: "orange",
  };

  return (
    <Box
      p={4}
      shadow="lg"
      borderWidth="1px"
      borderRadius="xl"
      borderColor={borderColor}
      bg={bgColor}
      transition="all 0.3s"
      _hover={{ transform: "translateY(-2px)", shadow: "xl", cursor: "pointer" }}
      onClick={onClick}
    >
      <VStack align="stretch" spacing={3}>
        <Flex alignItems="center">
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={textColor}
            as={task.completed ? "s" : undefined}
          >
            {task.title}
          </Text>
          <Spacer />
        </Flex>

        <HStack wrap="wrap" spacing={2}>
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
        </HStack>

        <HStack fontSize="sm" color={secondaryTextColor} spacing={4}>
          {task.dueDate && (
            <Flex alignItems="center">
              <Text fontWeight="medium" mr={1}>Due:</Text>
              {new Date(task.dueDate).toLocaleDateString()}
            </Flex>
          )}
          {task.timeOfDay && (
            <Flex alignItems="center">
              <Text fontWeight="medium" mr={1}>Time:</Text>
              {task.timeOfDay}
            </Flex>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default TaskItem;