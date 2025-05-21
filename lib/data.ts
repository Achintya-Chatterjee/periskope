import type { Chat, Message } from "./types"

// Sample messages for the chats
// const testElCentroMessages: Message[] = [ // This variable is no longer needed
//   // Original messages commented out for now
//   /*
//   {
//     text: "CVFER",
//     sender: "Roshnag Airtel",
//     timestamp: new Date("2025-05-20T11:51:00"),
//     status: "read",
//   },
//   {
//     text: "CDERT",
//     sender: "Roshnag Airtel",
//     timestamp: new Date("2025-05-20T11:54:00"),
//     status: "read",
//   },
//   {
//     text: "hello",
//     sender: "Periskope",
//     timestamp: new Date("2025-05-20T12:07:00"),
//     status: "read",
//     phone: "99718 44008",
//   },
//   {
//     text: "Hello, South Euna!",
//     sender: "Roshnag Airtel",
//     timestamp: new Date("2025-05-20T08:01:00"),
//     status: "read",
//     phone: "63646 47925",
//   },
//   {
//     text: "Hello, Livonia!",
//     sender: "Roshnag Airtel",
//     timestamp: new Date("2025-05-20T08:01:00"),
//     status: "read",
//   },
//   {
//     text: "test el centro",
//     sender: "Periskope",
//     timestamp: new Date("2025-05-20T09:49:00"),
//     status: "read",
//     phone: "99718 44008",
//     email: "bharat@hashabs.dev",
//   },
//   {
//     text: "CDERT",
//     sender: "Roshnag Airtel",
//     timestamp: new Date("2025-05-20T09:49:00"),
//     status: "read",
//     phone: "63646 47925",
//   },
//   {
//     text: "testing",
//     sender: "Periskope",
//     timestamp: new Date("2025-05-20T09:49:00"),
//     status: "read",
//     phone: "99718 44008",
//     email: "bharat@hashabs.dev",
//   },
//   */
//   // New minimal messages for Test El Centro (ID '1') - This is also removed
//   /*
//   {
//     id: "tec_msg_1",
//     text: "This is a new message from Other User for Test El Centro.",
//     sender: "Other User",
//     timestamp: new Date("2025-06-01T10:00:00"),
//     status: "read",
//   },
//   {
//     id: "tec_msg_2",
//     text: "This is a new message from Periskope in Test El Centro.",
//     sender: "Periskope",
//     timestamp: new Date("2025-06-01T10:01:00"),
//     status: "read", // This will trigger the BsCheckAll condition
//   },
//   */
// ]

// Sample chat data
export const chats: Chat[] = [
  // Removed the problematic "Test El Centro" chat (ID "1")
  // {
  //   id: "1",
  //   name: "Test El Centro",
  //   participants: ["Other User", "Periskope"], // Simplified participants
  //   lastMessage: {
  //     text: "This is a new message from Periskope in Test El Centro.", // Updated last message
  //     timestamp: new Date("2025-06-01T10:01:00"),
  //   },
  //   lastMessageTime: new Date("2025-06-01T10:01:00"),
  //   lastMessageStatus: "read",
  //   unreadCount: 0,
  //   tags: ["Demo"],
  //   messages: testElCentroMessages, // This now uses the new minimal messages defined above
  // },
  {
    id: "2",
    name: "Test Skope Final 5",
    lastMessage: {
      text: "Support2: This doesn't go on Tuesday...",
      timestamp: new Date("2025-05-19T00:00:00"),
    },
    lastMessageTime: new Date("2025-05-19T00:00:00"),
    lastMessageStatus: "delivered",
    unreadCount: 0,
    tags: ["Demo"],
    phone: "+91 99718 44008",
    phoneExt: "1",
    messages: [
      {
        text: "Support2: This doesn't go on Tuesday...",
        sender: "Test Skope",
        timestamp: new Date("2025-05-19T00:00:00"),
        status: "delivered",
      },
    ],
  },
  {
    id: "3",
    name: "Periskope Team Chat",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: {
      text: "Periskope: Test message",
      timestamp: new Date("2025-02-28T00:00:00"),
    },
    lastMessageTime: new Date("2025-02-28T00:00:00"),
    lastMessageStatus: "read",
    unreadCount: 0,
    tags: ["Demo", "Internal"],
    phone: "+91 99718 44008",
    phoneExt: "3",
    messages: [
      {
        text: "Periskope: Test message",
        sender: "Periskope Team",
        timestamp: new Date("2025-02-28T00:00:00"),
        status: "read",
      },
    ],
  },
  {
    id: "4",
    name: "+91 99999 99999",
    lastMessage: {
      text: "Hi there, I'm Swapnika, Co-Founder of ...",
      timestamp: new Date("2025-01-22T00:00:00"),
    },
    lastMessageTime: new Date("2025-01-22T00:00:00"),
    lastMessageStatus: "read",
    unreadCount: 0,
    tags: ["Demo", "Signup"],
    phone: "+91 92886 65999",
    phoneExt: "1",
    messages: [
      {
        text: "Hi there, I'm Swapnika, Co-Founder of ...",
        sender: "+91 99999 99999",
        timestamp: new Date("2025-01-22T00:00:00"),
        status: "read",
      },
    ],
  },
  {
    id: "5",
    name: "Test Demo17",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: {
      text: "Rohosen: 123",
      timestamp: new Date("2025-02-25T00:00:00"),
    },
    lastMessageTime: new Date("2025-02-25T00:00:00"),
    lastMessageStatus: "read",
    unreadCount: 0,
    tags: ["Content", "Demo"],
    phone: "+91 99718 44008",
    phoneExt: "1",
    messages: [
      {
        text: "Rohosen: 123",
        sender: "Test Demo17",
        timestamp: new Date("2025-02-25T00:00:00"),
        status: "read",
      },
    ],
  },
  {
    id: "6",
    name: "Test El Centro",
    lastMessage: {
      text: "Roshnag: Hello, Ahmadport!",
      timestamp: new Date("2025-02-04T00:00:00"),
    },
    lastMessageTime: new Date("2025-02-04T00:00:00"),
    lastMessageStatus: "read",
    unreadCount: 0,
    tags: ["Demo"],
    phone: "+91 99718 44008",
    messages: [
      {
        text: "Roshnag: Hello, Ahmadport!",
        sender: "Test El Centro",
        timestamp: new Date("2025-02-04T00:00:00"),
        status: "read",
      },
    ],
  },
  {
    id: "7",
    name: "Testing group",
    lastMessage: {
      text: "Testing 12345",
      timestamp: new Date("2025-01-27T00:00:00"),
    },
    lastMessageTime: new Date("2025-01-27T00:00:00"),
    lastMessageStatus: "read",
    unreadCount: 0,
    tags: ["Demo"],
    phone: "+91 92886 65999",
    messages: [
      {
        text: "Testing 12345",
        sender: "Testing group",
        timestamp: new Date("2025-01-27T00:00:00"),
        status: "read",
      },
    ],
  },
  {
    id: "8",
    name: "Yasin 3",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: {
      text: "First Bulk Message",
      timestamp: new Date("2024-11-25T00:00:00"),
    },
    lastMessageTime: new Date("2024-11-25T00:00:00"),
    lastMessageStatus: "read",
    unreadCount: 0,
    tags: ["Demo", "Dont Send"],
    phone: "+91 99718 44008",
    phoneExt: "3",
    messages: [
      {
        text: "First Bulk Message",
        sender: "Yasin 3",
        timestamp: new Date("2024-11-25T00:00:00"),
        status: "read",
      },
    ],
  },
  {
    id: "9",
    name: "Test Skope Final 9473",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: {
      text: "Heyy",
      timestamp: new Date("2025-01-01T00:00:00"),
    },
    lastMessageTime: new Date("2025-01-01T00:00:00"),
    lastMessageStatus: "read",
    unreadCount: 0,
    tags: ["Demo"],
    phone: "+91 99718 44008",
    phoneExt: "1",
    messages: [
      {
        text: "Heyy",
        sender: "Test Skope Final 9473",
        timestamp: new Date("2025-01-01T00:00:00"),
        status: "read",
      },
    ],
  },
  {
    id: "10",
    name: "Skope Demo",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: {
      text: "test 123",
      timestamp: new Date("2024-12-20T00:00:00"),
    },
    lastMessageTime: new Date("2024-12-20T00:00:00"),
    lastMessageStatus: "read",
    unreadCount: 0,
    tags: ["Demo"],
    phone: "+91 92886 65999",
    messages: [
      {
        text: "test 123",
        sender: "Skope Demo",
        timestamp: new Date("2024-12-20T00:00:00"),
        status: "read",
      },
    ],
  },
  {
    id: "11",
    name: "Test Demo15",
    avatar: "/placeholder.svg?height=48&width=48",
    lastMessage: {
      text: "test 123",
      timestamp: new Date("2024-12-20T00:00:00"),
    },
    lastMessageTime: new Date("2024-12-20T00:00:00"),
    lastMessageStatus: "read",
    unreadCount: 0,
    tags: ["Demo"],
    phone: "+91 92886 65999",
    messages: [
      {
        text: "test 123",
        sender: "Test Demo15",
        timestamp: new Date("2024-12-20T00:00:00"),
        status: "read",
      },
    ],
  },
]
