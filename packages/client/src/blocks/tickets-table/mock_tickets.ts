import { Ticket } from "model";

/**
 * Schema to generate mock tickets on https://json-generator.com/

 [
 '{{repeat(10)}}',
 {
 createdAt: '{{integer(1731399889000)}}',
 createdBy: '{{guid()}}',
 description: '{{lorem(5, "words")}}',
 id: '{{guid()}}',
 status: '{{random("closed", "locked", "open")}}',
 title: '{{lorem(2, "words")}}',
 password: '{{random("pass1", "pass2", "pass3")}}',
 updatedAt: '{{integer(1731399889000)}}',
 updatedBy: '{{guid()}}',
 _tag: "Ticket",
 }
 ]

 */
const data = `[
  {
    "createdAt": 228631035314,
    "createdBy": "9ce48496-d9ce-4e01-a932-68a6dee91807",
    "description": "culpa sint sit commodo reprehenderit",
    "id": "015d2e11-7d67-4bfb-bd86-bf497e39ef86",
    "status": "open",
    "title": "et deserunt",
    "password": "pass1",
    "updatedAt": 1069222213953,
    "updatedBy": "31b7bcfb-9f6f-44dc-a7aa-6cc180bd0a54",
    "_tag": "Ticket"
  },
  {
    "createdAt": 83832049723,
    "createdBy": "e354dc7f-1922-4bc6-9985-5ec01916431b",
    "description": "sint pariatur et non eu",
    "id": "1bf76eb1-b779-4909-8a73-d7c47d0b2bfd",
    "status": "locked",
    "title": "dolore magna",
    "password": "pass2",
    "updatedAt": 1175474322330,
    "updatedBy": "a86ec1f1-e856-4d44-8bf1-183856f9470a",
    "_tag": "Ticket"
  },
  {
    "createdAt": 533173666900,
    "createdBy": "5cfe33e1-795a-4aa1-8431-495eb3131a22",
    "description": "labore duis labore in officia",
    "id": "2fdfd87d-46bd-424b-b4e2-2755366c92a1",
    "status": "open",
    "title": "nostrud sit",
    "password": "pass1",
    "updatedAt": 1097479419695,
    "updatedBy": "68822b00-c598-43c2-8dca-bc8be3dbd7a9",
    "_tag": "Ticket"
  },
  {
    "createdAt": 364586831119,
    "createdBy": "0c1bea23-59f1-49fb-83e7-d91e51ad01fe",
    "description": "nostrud proident nisi reprehenderit non",
    "id": "fa447f02-aa7e-442a-a2c8-84be8b181694",
    "status": "open",
    "title": "nulla adipisicing",
    "password": "pass2",
    "updatedAt": 1523792622368,
    "updatedBy": "732998ad-ffa1-4c81-8c74-5318ab0f0f30",
    "_tag": "Ticket"
  },
  {
    "createdAt": 456460661383,
    "createdBy": "45e943c5-e63d-459b-ae52-c6b1b44b7634",
    "description": "aliqua consequat aliqua id aute",
    "id": "8cf8905d-4285-47bf-9b98-0fd489125bbd",
    "status": "open",
    "title": "esse qui",
    "password": "pass2",
    "updatedAt": 1288238007198,
    "updatedBy": "ea791589-a549-4bea-851b-e1e6f6da1f5e",
    "_tag": "Ticket"
  },
  {
    "createdAt": 214445750542,
    "createdBy": "61401599-9b9e-4096-a837-ce8bf677cc1a",
    "description": "aliqua non dolor nisi fugiat",
    "id": "68e1874e-8e34-46c7-8bf9-ea3a46bceb10",
    "status": "closed",
    "title": "incididunt mollit",
    "password": "pass2",
    "updatedAt": 332514035350,
    "updatedBy": "54412cf6-1e3f-43fe-b892-515eda11b5dc",
    "_tag": "Ticket"
  },
  {
    "createdAt": 125030508573,
    "createdBy": "b0bd0a7a-0896-4f0b-bdf2-0e381132b197",
    "description": "nisi dolor cupidatat mollit adipisicing",
    "id": "97e0ad90-79a4-4227-ab59-68a46460e2ec",
    "status": "open",
    "title": "excepteur eu",
    "password": "pass3",
    "updatedAt": 1074309056622,
    "updatedBy": "5b4a1e7b-9e4d-4851-9fd6-c7d80f39b7fc",
    "_tag": "Ticket"
  },
  {
    "createdAt": 632643619114,
    "createdBy": "ca8e2f9b-8dc4-4733-8092-dabdb8b6e464",
    "description": "nostrud cupidatat officia sint veniam",
    "id": "95bc7262-2572-4cd5-8213-815476ef7e55",
    "status": "locked",
    "title": "sunt reprehenderit",
    "password": "pass3",
    "updatedAt": 678272167813,
    "updatedBy": "12a1d04c-ed1c-4208-b9a0-8e03c6805547",
    "_tag": "Ticket"
  },
  {
    "createdAt": 499000101646,
    "createdBy": "5a5a8303-dc9b-414e-9718-2ee530419bf3",
    "description": "commodo consequat in dolore nisi",
    "id": "282d93b4-00e8-47fa-83d6-1f73f4b6b8ca",
    "status": "open",
    "title": "commodo ex",
    "password": "pass1",
    "updatedAt": 1399887996100,
    "updatedBy": "f9cedb0a-0389-4492-817a-8a22b67f6199",
    "_tag": "Ticket"
  },
  {
    "createdAt": 812584711745,
    "createdBy": "e4a3bd7d-25cd-461b-b02b-5e4119d19e52",
    "description": "et irure commodo do deserunt",
    "id": "af80a202-9d1a-4f1c-9e9e-51b0027d8c4e",
    "status": "closed",
    "title": "tempor do",
    "password": "pass3",
    "updatedAt": 1229987988144,
    "updatedBy": "670da712-a259-45bb-ba06-8d3baa4588ab",
    "_tag": "Ticket"
  }
]`;

export const tickets = Ticket.fromJsonArray(data);
