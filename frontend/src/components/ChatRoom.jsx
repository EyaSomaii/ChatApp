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
  Avatar,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";

const ENDPOINT = "http://localhost:5000";

const ChatRoom = () => {
  const bb = localStorage.getItem("userInfo");

    const aa = bb.split(",")[0].split(":")[1].split('"')[1];
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(aa); // Replace with actual user ID
  const [username, setUsername] = useState("YOUR_USERNAME"); // Replace with actual username

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${ENDPOINT}/api/forum/getAllMessages`);
        setMessages(response.data);
      } catch (error) {
       
      }
    };

    fetchMessages();

   
  
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const newMessage = {
          sender: userId,
          content: message,
          username,
        };

        const response = await axios.post(`${ENDPOINT}/api/forum/sendMessage`, newMessage);
        setMessages((prevMessages) => [...prevMessages, response.data]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Flex h="100vh" direction="column">
      <Flex bg="blue.500" p={4} align="center">
        <Text fontSize="xl" fontWeight="bold" color="white">
          Chat Application for all members / Forum
        </Text>
      </Flex>

      <Flex flex="1" overflow="hidden">
        <Box flex="1" p={4} overflowY="auto">
          <VStack spacing={4} align="stretch" h="full">
          
            <Container
              maxW="container.lg"
              p={4}
              borderWidth="1px"
              borderRadius="md"
            >
              {messages.map((msg, index) => (
                
                <Box key={index} p={2} borderWidth="1px" borderRadius="md">
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
              <Avatar name={msg.sender} src="https://bit.ly/sage-adebayo" />
              <Box>
                <Heading size="sm">{msg.sender}</Heading>
                <Box><Text>{msg.content}</Text></Box>
              </Box>
            </Flex>
                 
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
