<template>
  <div>
    <h1 class="title">Create Account</h1>

    <h2 class="subtitle">
      Create an account or log in to order your liquid gold subscription
    </h2>

    <form v-if="!loggedIn" class="form">
      <pre>
        <code>
          {
            email: 'john@travolta.io',
            password: '123456',
            name: 'John',
          }
        </code>
      </pre>
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input
          type="text"
          v-model="$v.form.email.$model"
          :disabled="emailCheckedInDB"
          placeholder="your@email.com"
          class="form-control"
          id="email"
        />
        <div v-if="emailCheckedInDB" class="error info">
          <a href="#" @click="reset">Not you?</a>
        </div>
        <div
          v-if="$v.form.email.$error && !$v.form.email.required"
          class="error"
        >
          email is required
        </div>
        <div v-if="$v.form.email.$error && !$v.form.email.email" class="error">
          email is invalid
        </div>
      </div>

      <div v-if="emailCheckedInDB" class="form-group">
        <label class="form-label" for="password">Password</label>
        <input
          v-model="$v.form.password.$model"
          type="password"
          placeholder="Super Secret Password"
          class="form-control"
          id="password"
        />
        <div
          v-if="$v.form.password.$error && !$v.form.password.required"
          class="error"
        >
          password is required
        </div>
        <div
          v-if="$v.form.password.$error && !$v.form.password.correct"
          class="error"
        >
          password is invalid - try again
        </div>
      </div>

      <div v-if="emailCheckedInDB && !existingUser" class="form-group">
        <label class="form-label" for="name">Name</label>
        <input
          v-model="$v.form.name.$model"
          type="text"
          placeholder="What should we call you?"
          class="form-control"
          id="name"
        />
        <div v-if="$v.form.name.$error" class="error">name is required</div>
      </div>
    </form>
    <div v-else class="text-center">
      Successfuly logged in!
      <a href="#" @click.prevent="reset">Not {{ form.name }}?</a>
    </div>
  </div>
</template>

<script>
import {required, email} from 'vuelidate/lib/validators'
import apiAuth from '@/api/auth'

export default {
  name: 'FormUserDetails',
  data() {
    return {
      emailCheckedInDB: false,
      existingUser: false,
      wrongPassword: false,
      form: {
        email: null,
        password: null,
        name: null,
      },
    }
  },
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
        correct() {
          return !this.wrongPassword
        },
      },
      name: {
        required,
      },
    },
  },
  methods: {
    reset() {
      Object.keys(this.form).map((key) => (this.form[key] = null))

      this.emailCheckedInDB = false
      this.existingUser = false
      this.wrongPassword = false

      this.$v.$reset()
    },
    submit() {
      let job

      if (!this.emailCheckedInDB) {
        this.$v.form.email.$touch()
        job = this.checkIfUserExists()
      } else {
        if (this.existingUser && !this.loggedIn) {
          this.$v.form.password.$touch()
          job = this.login()
        } else {
          this.$v.$touch()
          job = Promise.resolve()
        }
      }

      return new Promise((resolve, reject) => {
        const isValid = !this.$v.$invalid
        const data = {
          email: this.form.email,
          password: this.form.password,
          name: this.form.name,
        }
        const error = 'data is not valid yet'

        job
          .then(() => {
            if (isValid) {
              resolve(data)
            } else {
              reject(error)
            }
          })
          .catch(() => reject(error))
      })
    },
    async checkIfUserExists() {
      this.$emit('updateAsyncState', 'pending')
      if (!this.$v.form.email.$invalid) {
        try {
          // user exist
          await apiAuth.checkIfUserExistsInDB(this.form.email)
          this.$emit('updateAsyncState', 'success')

          this.emailCheckedInDB = true
          this.existingUser = true
        } catch (error) {
          // user doesn`t exist

          this.$emit('updateAsyncState', 'success')
          this.emailCheckedInDB = true
          this.existingUser = false
        }
      } else {
        return Promise.reject('email is invalid')
      }
    },
    async login() {
      this.wrongPassword = false

      this.$emit('updateAsyncState', 'pending')
      if (!this.$v.form.password.$invalid) {
        try {
          // logged in
          const user = await apiAuth.authenticateUser(
            this.form.email,
            this.form.password
          )

          this.$emit('updateAsyncState', 'success')
          this.form.name = user.name
        } catch (error) {
          // wrong password
          this.$emit('updateAsyncState', 'success')
          this.wrongPassword = true

          console.log('error', error)
        }
      } else {
        return Promise.reject('login or password are wrong')
      }
    },
  },
  computed: {
    loggedIn() {
      return this.existingUser && this.form.name
    },
  },
}
</script>
