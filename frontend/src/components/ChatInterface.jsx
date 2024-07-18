import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import {
  Box,
  Flex,
  Stack,
  Button,
  Input,
  Text,
  useDisclosure,
  VStack,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ENDPOINT = "http://localhost:5000";

const ChatInterface = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groupesMembers, setgroupesMembers] = useState([]);

  const [message, setMessage] = useState("");
  const [userId, setuserId] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const groups = ["Group 1", "Group 2", "Group 3"];

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  const handleSendMessage = () => {
    // Logic to send message
  };

  useEffect(() => {
    const bb = localStorage.getItem("userInfo");

    const aa = bb.split(",")[0].split(":")[1].split('"')[1];

    setuserId(aa);

    const getUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/findAllUser/${
            bb.split(",")[0].split(":")[1].split('"')[1]
          }`
        );
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    const fetchRooms = async () => {
      const responseroom = await axios.get(
        `http://localhost:5000/api/rooms/${
          bb.split(",")[0].split(":")[1].split('"')[1]
        }`
      );
      console.log(responseroom);
      setRooms(Array.isArray(responseroom.data) ? responseroom.data : []);
    };

    fetchRooms();
    getUsers();
  }, []);
  /** create room  */
  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };
  const handleGroupCreation = async (e) => {
    e.preventDefault();
    const groupData = { roomName: groupName, memberIds: selectedUsers };
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post(
        `http://localhost:5000/api/rooms/create/${userId}`,
        groupData,
        config
      );
      onClose();
      console.log("Group created:", response.data);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  /**end */
  const sendMessage = () => {
    if (message && username) {
      const newMessage = { username, message };
      const socket = socketIOClient(ENDPOINT);
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  const toggleDrawer = () => {
    isOpen ? onClose() : onOpen();
  };
  const navigatee = () => {
    navigate("/RoomList");
  };
  return (
    <>
      {" "}
      <Flex bg="blue.500" p={4} align="center">
        <Text fontSize="xl" fontWeight="bold" color="white">
          Chat Application for all members
        </Text>
      </Flex>
      <Flex height="100vh">
        <Stack spacing={4} width="20%" bg="gray.100" p={4}>
          <VStack align="stretch" spacing={2}>
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            {users.map((user) => (
              <Box key={user._id} p={2} borderWidth="1px" borderRadius="md">
                <Checkbox
                  isChecked={selectedUsers.includes(user._id)}
                  onChange={() => handleUserSelection(user._id)}
                >
                  {user.username}
                </Checkbox>
              </Box>
            ))}
            <Button onClick={handleGroupCreation}>Create New Group</Button>
          </VStack>
          {rooms.map((room) => (
            <Button
              variant={selectedGroup === room.roomName ? "solid" : "outline"}
              colorScheme="blue"
              key={room._id}
              onClick={() => handleGroupClick(room.roomName)}
            >
              {room.roomName}
            </Button>
          ))}

          <Button>collective chat</Button>
        </Stack>

        <Flex flex="1" flexDirection="column" p={4}>
          {selectedGroup && (
            <Flex flexDirection="column" flex="1">
              <Box mb={4}>
                <Text fontWeight="bold">{selectedGroup} Messages</Text>
              </Box>
              <Box flex="1" overflowY="auto">
                {/* Render messages here */}
              </Box>
              <Flex mt={4}>
                <Input placeholder="Type your message..." />
                <Button ml={2} onClick={handleSendMessage}>
                  Send
                </Button>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default ChatInterface;
