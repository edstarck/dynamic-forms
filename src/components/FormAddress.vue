<template>
  <div>
    <h1 class="title">Delivery details</h1>

    <h2 class="subtitle">
      Where should we send your freshly roasted coffee beans?
    </h2>

    <form class="form">
      <div class="form-group">
        <label class="form-label" for="delivery_name">Name</label>
        <input
          @input="submit"
          v-model="$v.form.recipient.$model"
          type="text"
          placeholder="Recipients Name"
          class="form-control"
          id="delivery_name"
        />
        <div v-if="$v.form.recipient.$error" class="error">
          field is required
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="address">Address</label>
        <textarea
          @input="submit"
          v-model="$v.form.address.$model"
          placeholder="London Street 470978 New England"
          rows="3"
          class="form-control"
          id="address"
        ></textarea>
        <div v-if="$v.form.address.$error" class="error">field is required</div>
      </div>
    </form>
  </div>
</template>

<script>
import {required} from 'vuelidate/lib/validators'

export default {
  name: 'FormAddress',
  props: {
    wizzardData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        address: this.wizzardData.address,
        recipient: this.wizzardData.name,
      },
    }
  },
  validations: {
    form: {
      address: {
        required,
      },
      recipient: {
        required,
      },
    },
  },
  methods: {
    submit() {
      this.$emit('update', {
        data: {
          address: this.form.address,
          recipient: this.form.recipient,
        },
        isValid: !this.$v.$invalid,
      })
    },
  },
}
</script>
