import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../shared/auth.service'
import { LocalService } from '../shared/local.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  error: string | undefined

  loginText = 'Login'

  form = new FormGroup({
    email: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.email])
    ),
    password: new FormControl('', Validators.required),
    remember: new FormControl(false),
  })

  constructor(
    private authService: AuthService,
    private router: Router,
    private localService: LocalService
  ) {}

  ngOnInit(): void {
    const account = this.localService.getData('remember')
    if (account === null) return
    const parsedAccount = JSON.parse(account)
    this.form.patchValue({
      email: parsedAccount.email,
      password: parsedAccount.password,
      remember: true,
    })
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.error = 'Please fill in all fields'
      return
    }
    this.error = undefined

    const { email, password, remember } = this.form.value
    this.loginText = 'Logging in...'

    try {
      await this.authService.signIn(email as string, password as string)
      if (remember) {
        this.localService.saveData(
          'remember',
          JSON.stringify({ email, password })
        )
      } else {
        this.localService.removeData('remember')
      }
      this.router.navigate(['/dashboard'])
    } catch (error) {
      switch ((error as any).code) {
        case 'auth/user-not-found':
          this.error = 'User not found'
          break
        case 'auth/wrong-password':
          this.error = 'Wrong password'
          break
        default:
          this.error = 'Something went wrong'
          break
      }
    } finally {
      this.loginText = 'Login'
    }
  }
}
