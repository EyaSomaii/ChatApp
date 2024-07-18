import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { Box, Flex, Stack, Button, Input, Text } from "@chakra-ui/react";

const ENDPOINT = "http://localhost:5000";

const Chatsapp = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomId, setroomId] = useState("");
  const [singleroom, setsingleroom] = useState("");

  useEffect(() => {
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
    /** get my groupes  */
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
  /** get groupe messages / specific  */
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

  const handleGroupClick = (group) => {
    console.log(group);
    setSelectedGroup(group);
    const response = axios.get(
      `http://localhost:5000/api/messages/${group._id}`
    );
    setMessages(Array.isArray(response.data) ? response.data : []);
    console.log(messages);

    // Fetch messages for the selected group
    // Example:
    // fetchMessages(group._id);
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

  return (
    <Flex height="100vh" flexDirection="column">
      <Flex bg="blue.500" p={4} align="center">
        <Text fontSize="xl" fontWeight="bold" color="white">
          Chat Application for all members
        </Text>
      </Flex>
      <Flex>
        {/* Left Sidebar */}
        <Stack spacing={4} width="20%" bg="gray.100" p={4}>
          {/* Group and collective chat buttons */}
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
          <Button>Collective Chat</Button>
        </Stack>

        {/* Main Chat Area */}
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
                    <Text fontWeight="bold">{msg.sender.username}:</Text>
                    <Text>{msg.message}</Text>
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
    </Flex>
  );
};

export default Chatsapp;
