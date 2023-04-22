<template>
  <div>
    <div v-if="wizzardInProgress" v-show="asyncState !== 'pending'">
      <keep-alive>
        <component
          ref="currentStep"
          :is="currentStep"
          :wizzard-data="form"
          @update="processStep"
          @updateAsyncState="updateAsyncState"
        ></component>
      </keep-alive>

      <div class="progress-bar">
        <div :style="`width: ${progress}%;`"></div>
      </div>

      <div class="buttons">
        <button
          @click="goBack"
          v-if="currentStepNumber > 1"
          class="btn-outlined"
        >
          Back
        </button>
        <button @click="nextButtonAction" class="btn" :disabled="!canGoNext">
          {{ isLastStep ? 'Completed Order' : 'Next' }}
        </button>
      </div>
    </div>

    <div v-else>
      <h1 class="title">Thank you!</h1>
      <h2 class="subtitle">We look forward to shipping you your first box!</h2>

      <p class="text-center">
        <a href="" target="_blank" class="btn">Go somewhere cool!</a>
      </p>
    </div>

    <div class="loading-wrapper" v-if="asyncState === 'pending'">
      <div class="loader">
        <img src="/spinner.svg" alt="" />
        <p>Please wait, we`re hitting our servers!</p>
      </div>
    </div>
  </div>
</template>

<script>
import FormPlanPicker from '@/components/FormPlanPicker'
import FormUserDetails from '@/components/FormUserDetails'
import FormAddress from '@/components/FormAddress'
import FormReviewOrder from '@/components/FormReviewOrder'

import apiAuth from '@/api/auth'

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
      steps: [
        'FormPlanPicker',
        'FormUserDetails',
        'FormAddress',
        'FormReviewOrder',
      ],
      currentStepNumber: 1,
      canGoNext: false,
      asyncState: null,
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
    isLastStep() {
      return this.currentStepNumber === this.lengthSteps
    },
    wizzardInProgress() {
      return this.currentStepNumber <= this.lengthSteps
    },
    lengthSteps() {
      return this.steps.length
    },
    progress() {
      return (this.currentStepNumber / this.lengthSteps) * 100
    },
    currentStep() {
      return this.steps[this.currentStepNumber - 1]
    },
  },
  methods: {
    nextButtonAction() {
      this.isLastStep ? this.submit() : this.goNext()
    },
    submit() {
      this.asyncState = 'pending'

      apiAuth
        .postFormToDB(this.form)
        .then(() => {
          this.asyncState = 'success'
          this.currentStepNumber++
        })
        .catch((error) => {
          this.asyncState = 'success'
          console.log('error', error)
        })
    },
    processStep(step) {
      Object.assign(this.form, step.data)
      this.canGoNext = step.isValid
    },
    goBack() {
      this.currentStepNumber--
      this.canGoNext = true
    },
    goNext() {
      this.currentStepNumber++
      // this.canGoNext = false

      this.$nextTick(() => {
        // this.$refs.currentStep.submit()
        this.canGoNext = !this.$refs.currentStep.$v.$invalid
      })
    },
    updateAsyncState(state) {
      this.asyncState = state
    },
  },
}
</script>

<!-- TODO: -->
<!-- доделать disabled в форме -->
