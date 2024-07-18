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
  Avatar,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ENDPOINT = "http://localhost:5000";

const ChatInterface = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [groupesMembers, setgroupesMembers] = useState([]);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [isSelectCollectiveChat, setisSelectCollectiveChat] = useState("");
  const [CollectiveMessages, setCollectiveMessages] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const groups = ["Group 1", "Group 2", "Group 3"];

  useEffect(() => {
    // Fetch user info and rooms on component mount
    const fetchUserInfo = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUserId(userInfo._id);
        setUsername(userInfo.username);

        const response = await axios.get(
          `http://localhost:5000/api/users/findAllUser/${userInfo._id}`
        );
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const response = await axios.get(
          `http://localhost:5000/api/rooms/${userInfo._id}`
        );
        setRooms(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchUserInfo();
    fetchRooms();
  }, []);
  const Recuperer_messages = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/messages/${selectedGroup._id}`
      );
      setMessages(data);
      socketIOClient.emit("joinRoom", selectedGroup._id);
    } catch (error) {}
  };
  useEffect(() => {
    Recuperer_messages();
    const socket = socketIOClient(ENDPOINT);

    // Join room when a group is selected
    if (selectedGroup) {
      socket.emit("joinRoom", selectedGroup._id);
    }

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedGroup]);
  const handleCollectivechat = () => {
    
    navigate("/ChatRoom");
  };
  const handleGroupClick = (group) => {
    console.log(group);
    setSelectedGroup(group);
    const response = axios.get(
      `http://localhost:5000/api/messages/${group._id}`
    );
    setMessages(Array.isArray(response.data) ? response.data : []);
    console.log(messages);

   
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        roomId: selectedGroup._id,
        sender: userId,
        message: message.trim(),
      };

      // Emit message to the server
      const socket = socketIOClient(ENDPOINT);
      socket.emit("sendMessage", newMessage);

      // Clear message input
      setMessage("");
    }
  };

  useEffect(() => {
    const bb = localStorage.getItem("userInfo");

    const aa = bb.split(",")[0].split(":")[1].split('"')[1];

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
              key={room._id}
              variant={selectedGroup === room ? "solid" : "outline"}
              colorScheme="blue"
              onClick={() => handleGroupClick(room)}
            >
              {room.roomName}
            </Button>
          ))}
          <Button   onClick={() => handleCollectivechat()} >Collective Chat</Button>
        </Stack>
        <Flex flex="1" flexDirection="column" p={4}>
          {selectedGroup && (
            <Flex flexDirection="column" flex="1">
              <Box mb={4}>
                <Text fontWeight="bold">{selectedGroup.roomName} Messages</Text>
              </Box>
              <Box flex="1" overflowY="auto">
                {/* Render messages here */}
                {messages.map((msg) => (
                  <Box key={msg._id} mb={2}>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                      <Avatar
                        name="Segun Adebayo"
                        src="https://bit.ly/sage-adebayo"
                      />

                      <Box>
                        <Heading size="sm">{msg.sender.username}</Heading>
                        <Box>
                          <Text>{msg.message}</Text>
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Box>
              <Flex mt={4}>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button ml={2} onClick={handleSendMessage}>
                  Send
                </Button>
              </Flex>
            </Flex>
          )}


{isSelectCollectiveChat && (
            <Flex flexDirection="column" flex="1">
              <Box mb={4}>
               
              </Box>
              <Box flex="1" overflowY="auto">
                {/* Render messages here */}
                {CollectiveMessages.map((msg) => (
                  <Box key={msg._id} mb={2}>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                      <Avatar
                        name="Segun Adebayo"
                        src="https://bit.ly/sage-adebayo"
                      />

                      <Box>
                        <Heading size="sm">{msg.sender.username}</Heading>
                        <Box>
                          <Text>{msg.message}</Text>
                        </Box>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Box>
              <Flex mt={4}>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
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
