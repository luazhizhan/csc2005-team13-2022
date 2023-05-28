import { Component } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { AuthService } from '../shared/auth.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  error: string | undefined

  success: string | undefined

  submitText = 'Create Account'

  passwordFieldType: 'text' | 'password' = 'password'

  form = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.minLength(8)])
    ),
  })

  constructor(private authService: AuthService, private router: Router) {}

  onTogglePassword() {
    this.passwordFieldType =
      this.passwordFieldType === 'text' ? 'password' : 'text'
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.error = 'Please fill in all fields'
      return
    }

    const { firstname, lastname, email, password } = this.form.value
    if (
      typeof firstname !== 'string' ||
      typeof lastname !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      this.error = 'Please fill in all fields'
      return
    }
    this.error = undefined
    this.success = undefined

    try {
      this.submitText = 'Creating Account...'
      await this.authService.signUp(firstname, lastname, email, password)
      this.success =
        'Your account has been created. You will be redirected shortly...'
      this.submitText = 'Redirecting...'
      setTimeout(() => {
        this.router.navigate(['/dashboard'])
      }, 3000)
    } catch (error) {
      this.error = (error as any).message
      this.submitText = 'Create Account'
    }
  }
}
