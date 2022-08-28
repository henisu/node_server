const { gql } = require("apollo-server-core");

const typeDefs = gql`
  type EquipmentResponse {
    name: String
    inventory_number: String
    id: String
    category: String
    faulty: String
    faulty_id: Int
    inventory_id: Int
  }

  type RoomResponse {
    equipments: [EquipmentResponse]
    room: String
    id: Int
  }

  type AssignmentResponse {
    id: ID
    date: String
    location_name: String
  }

  type InitialDataResponse {
    rooms: [RoomResponse]
    assignments: [AssignmentResponse]
  }

  type Query {
    initialData: InitialDataResponse
    room(room: String): [EquipmentResponse]
    scan(id: String, roomID: Int): EquipmentResponse
  }

  type Subscription {
    room(roomID: Int): EquipmentResponse
  }

  input FaultyInput {
    id: Int
    comment: String
  }

  input InventoryInput {
    inventory_id: Int
    faulty: FaultyInput
    equipment_id: Int
    user_id: Int
    location_id: Int
  }

  input LoginInput {
    email: String
    password: String
  }

  enum ResponseTypes {
    error
    success
  }

  type Response {
    message: String
    type: ResponseTypes
  }

  type Mutation {
    updateInventory(data: InventoryInput!): EquipmentResponse
    login(data: LoginInput!): Response
  }
`;

module.exports = { typeDefs };
