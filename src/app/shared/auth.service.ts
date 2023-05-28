import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { User, UserService } from './data/user.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {}

  checkAuthState() {
    return this.afAuth.authState
  }

  getCurrentUser() {
    return this.userService.getUserById('user1') as User
  }

  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
  }

  async signUp(
    firstname: string,
    lastname: string,
    email: string,
    password: string
  ) {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      )
      if (!result.user) throw new Error('Something went wrong')

      await result.user.updateProfile({
        displayName: `${firstname} ${lastname}`,
      })
      return result.user
    } catch (error) {
      switch ((error as any).code) {
        case 'auth/email-already-in-use':
          throw new Error('Email already in use')
        case 'auth/weak-password':
          throw new Error('Password is too weak')
        default:
          throw new Error('Something went wrong')
      }
    }
  }

  logout() {
    return this.afAuth.signOut()
  }
}
