<template>
  <div>
    <h1 class="title">Create Account</h1>

    <h2 class="subtitle">
      Create an account or log in to order your liquid gold subscription
    </h2>

    <form v-if="!loggedIn" class="form" @input="submit">
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
          @blur="checkIfUserExists"
          type="text"
          v-model="$v.form.email.$model"
          placeholder="your@email.com"
          class="form-control"
          id="email"
        />
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

      <div v-if="existingUser" class="form-group">
        <button @click.prevent="login" class="btn">Login</button>
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
      this.$emit('update', {
        data: {
          email: this.form.email,
          password: this.form.password,
          name: this.form.name,
        },
        isValid: !this.$v.$invalid,
      })
    },
    async checkIfUserExists() {
      this.$emit('updateAsyncState', 'pending')
      if (this.$v.form.email.$invalid) return false

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
    },
    async login() {
      this.$emit('updateAsyncState', 'pending')
      if (this.$v.form.password.$invalid) return false

      try {
        // logged in
        const user = await apiAuth.authenticateUser(
          this.form.email,
          this.form.password
        )

        this.$emit('updateAsyncState', 'success')
        this.form.name = user.name
        this.submit()
      } catch (error) {
        // wrong password
        this.$emit('updateAsyncState', 'success')
        this.wrongPassword = true

        console.log('error', error)
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
