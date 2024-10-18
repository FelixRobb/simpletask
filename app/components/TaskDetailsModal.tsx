import React from "react";
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
} from "@chakra-ui/react";

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  onEdit: () => void;
  onDone: () => void;
  onDelete: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  onEdit,
  onDone,
  onDelete,
}) => {
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{task.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={4}>
            <Text>{task.description}</Text>
            <HStack>
              <Badge colorScheme={priorityColor[task.priority]}>
                {task.priority} Priority
              </Badge>
              <Badge colorScheme={categoryColor[task.category]}>
                {task.category}
              </Badge>
              {task.recurrence && (
                <Badge colorScheme="purple">Recurs {task.recurrence}</Badge>
              )}
            </HStack>
            {task.dueDate && (
              <Text>
                <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            )}
            {task.timeOfDay && (
              <Text>
                <strong>Time:</strong> {task.timeOfDay}
              </Text>
            )}
            {task.location && (
              <Text>
                <strong>Location:</strong> {task.location}
              </Text>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onEdit}>
            Edit
          </Button>
          <Button colorScheme="green" mr={3} onClick={onDone}>
            {task.completed ? "Recover" : "Done"}
          </Button>
          <Button colorScheme="red" onClick={onDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TaskDetailsModal;
