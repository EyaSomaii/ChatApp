import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Container,
  Flex,
  Spacer,
  Avatar,
  Divider,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Tooltip,
  Heading,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ENDPOINT = "http://localhost:5000";

const ChatRoom = () => {
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

  useEffect(() => {
    const bb = localStorage.getItem("userInfo");

    const aa = bb.split(",")[0].split(":")[1].split('"')[1];

    setuserId(aa)
    
    const getUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/findAllUser/${bb.split(",")[0].split(":")[1].split('"')[1]}`);
        setUsers(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };


    const fetchRooms = async () => {
      const responseroom = await axios.get(`http://localhost:5000/api/rooms/${bb.split(",")[0].split(":")[1].split('"')[1]}`);
      console.log(responseroom)
      setRooms(Array.isArray(responseroom.data) ? responseroom.data : []);

   
  };

  fetchRooms();
    getUsers()}, []);
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
    const response = await axios.post(`http://localhost:5000/api/rooms/create/${userId}`, groupData, config);
    onClose();  
    console.log('Group created:', response.data);
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
    <Flex h="100vh" direction="column">
      <Flex bg="blue.500" p={4} align="center">
      
        <Text fontSize="xl" fontWeight="bold" color="white">
          Chat Application for all members
        </Text>
        <Spacer />
        <Button  onClick={toggleDrawer}>Create Private Room</Button>
      </Flex>

      <Flex flex="1" overflow="hidden">
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Users Online</DrawerHeader>
              <DrawerBody>
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
                <br></br>
                <VStack spacing={2} align="stretch">
                    {rooms.map((room) => (
                        <Button key={room._id} _hover={"go to"} >
                            {room.roomName}
                        </Button>
                    ))}
                </VStack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>

        <Box flex="1" p={4} overflowY="auto">
          <VStack spacing={4} align="stretch" h="full">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />

              <Box>
                <Heading size="sm">Segun Adebayo</Heading>
                <Box><Text>me</Text></Box>
                
              </Box>
            </Flex>
            <Container
              maxW="container.lg"
              p={4}
              borderWidth="1px"
              borderRadius="md"
            >
              {messages.map((msg, index) => (
                <Box key={index} p={2} borderWidth="1px" borderRadius="md">
                  <strong>{msg.username}: </strong>
                  <span>{msg.message}</span>
                </Box>
              ))}
            </Container>
          </VStack>
        </Box>
      </Flex>

      <HStack p={4}>
        <Input
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          flex="4"
        />
        <Button onClick={sendMessage} colorScheme="blue" flex="1" ml={2}>
          Send
        </Button>
      </HStack>
    </Flex>
  );
};

export default ChatRoom;
