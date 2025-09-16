import { prisma } from "./db"

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    return user
  } catch (error) {
    console.error("Error finding user:", error)
    return null
  }
}

export async function createUser(userData: {
  name: string
  email: string
}) {
  try {
    const user = await prisma.user.create({
      data: userData
    })
    return user
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany()
    return users
  } catch (error) {
    console.error("Error getting users:", error)
    return []
  }
}