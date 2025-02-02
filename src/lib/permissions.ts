import { BlogUser } from "@prisma/client"

export const hasPermission = ({blogUsers, userId, roles = ["OWNER"]}: {
    blogUsers: BlogUser[],
    userId: string,
    roles: BlogUser["role"][]
}) => {
 const hasPermission = blogUsers.some((item) => {
    return item.userId === userId && roles.includes(item.role)
  })
  
  return hasPermission
}  