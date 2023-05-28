import { Injectable } from '@angular/core'

export type User = {
  id: string
  firstname: string
  lastname: string
  email: string
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private data: User[] = [
    {
      id: 'user1',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
    },
    {
      id: 'user2',
      firstname: 'Lucy',
      lastname: 'Ng',
      email: 'lucy@example.com',
    },
    {
      id: 'user3',
      firstname: 'Sophia',
      lastname: 'Tan',
      email: 'sophia@example.com',
    },
  ]

  constructor() {}

  getUserById(id: string): User | undefined {
    return this.data.find(user => user.id === id)
  }

  getUsers(): User[] {
    return this.data
  }
}
