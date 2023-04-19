<template>
  <div>
    <form-plan-picker v-if="currentStepNumber === 1" />
    <form-user-details v-if="currentStepNumber === 2" />
    <form-address v-if="currentStepNumber === 3" />
    <form-review-order v-if="currentStepNumber === 4" />

    <div class="progress-bar">
      <div :style="`width: ${progress}%;`"></div>
    </div>

    <div class="buttons">
      <button @click="goBack" v-if="currentStepNumber > 1" class="btn-outlined">
        Back
      </button>
      <button v-if="currentStepNumber < 4" @click="goNext" class="btn">
        Next
      </button>
    </div>

    <pre>
      form:
      <code>{{form}}</code>
    </pre>
  </div>
</template>

<script>
import FormPlanPicker from '@/components/FormPlanPicker'
import FormUserDetails from '@/components/FormUserDetails'
import FormAddress from '@/components/FormAddress'
import FormReviewOrder from '@/components/FormReviewOrder'

export default {
  name: 'FormWizard',
  components: {
    FormPlanPicker,
    FormUserDetails,
    FormAddress,
    FormReviewOrder,
  },
  data() {
    return {
      currentStepNumber: 1,
      length: 4,
      form: {
        plan: null,
        email: null,
        name: null,
        password: null,
        address: null,
        recipient: null,
        chocolate: false,
        otherTreat: false,
      },
    }
  },
  computed: {
    progress() {
      return (this.currentStepNumber / this.length) * 100
    },
  },
  methods: {
    goBack() {
      this.currentStepNumber--
    },
    goNext() {
      this.currentStepNumber++
    },
  },
}
</script>
