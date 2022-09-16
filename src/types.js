const { gql } = require("apollo-server-core");

const typeDefs = gql`
  type EquipmentResponse {
    name: String
    inventory_number: String
    id: Int
    category: String
    faulty: String
    faulty_id: Int
    inventory_id: Int
    images: String
  }

  type RoomResponse {
    equipments: [EquipmentResponse]
    room: String
    id: Int
  }

  type AssignmentResponse {
    id: Int
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
    scan(id: Int, roomID: Int): EquipmentResponse
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
    location_id: Int
    images: [String]
  }

  input LoginInput {
    email: String
    password: String
  }

  enum ResponseTypes {
    error
    success
  }

  type UserResponse {
    firstname: String
    lastname: String
    email: String
    phone: String
  }

  type LoginResponse {
    user: UserResponse
    token: String
  }

  type Mutation {
    updateInventory(data: InventoryInput!): EquipmentResponse
    removeInventory(data: InventoryInput!): EquipmentResponse
    login(data: LoginInput!): LoginResponse
  }
`;

module.exports = { typeDefs };
