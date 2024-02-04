<template lang="">
  <Transition name="slide-fade">
    <div
      v-if="formVisible"
      class="md:w-[19rem] w-full bg-slate-900 rounded-lg p-5 border border-solid border-indigo-900 shadow-2xl shadow-indigo-500/10"
    >
      <h2 class="font-semibold text-xl text-slate-300 mb-4">Create an event</h2>
      <form @submit.prevent="createHandler" method="post">
        <label class="form-control w-full mb-2">
          <div class="label">
            <span class="label-text">Event Date <span class="text-red-500">*</span></span>
          </div>
          <input
            type="text"
            v-model="formattedDate"
            placeholder="Choose a date in the calendar"
            required
            class="input input-sm input-ghost border border-solid border-indigo-900 input-bordered w-full max-w-md"
            disabled
          />
        </label>
        <label class="form-control w-full mb-2">
          <div class="label">
            <span class="label-text">Title <span class="text-red-500">*</span></span>
          </div>
          <input
            v-model="props.query.title"
            type="text"
            placeholder="Enter event title."
            required
            class="input input-sm input-ghost border border-solid border-indigo-900 input-bordered w-full max-w-md"
          />
        </label>
        <label class="form-control mb-2">
          <div class="label">
            <span class="label-text">Description <span class="text-red-500">*</span></span>
          </div>
          <input
            v-model="props.query.description"
            type="text"
            placeholder="Enter event description."
            required
            class="input input-sm input-ghost border border-solid border-indigo-900 input-bordered w-full max-w-md"
          />
        </label>
        <div class="mt-7 flex md:flex-nowrap flex-wrap gap-3 w-full justify-end">
          <button class="btn btn-outline btn-sm" type="button" @click="emit('handleForm', { visible: false })">Cancel</button>
          <button class="btn btn-primary btn-sm text-white" type="submit">Create</button>
        </div>
      </form>
    </div>
  </Transition>
</template>
<script setup>
  import { computed, reactive } from 'vue'
  import { push } from 'firebase/database'
  import { useToast } from 'vue-toast-notification'

  const props = defineProps({
    query: Object,
    formVisible: Boolean,
    DBRef: Object
  })
  const emit = defineEmits(['handleForm'])
  const $toast = useToast()

  const createHandler = async () => {
    if (props.query.date !== '' && props.query.title !== '' && props.query.description !== '') {
      await push(props.DBRef, props.query)
      emit('handleForm', { visible: false }, true)
      $toast.success('Event has been created.', {
        type: 'success',
        position: 'top-right'
      })
    }
  }

  const formattedDate = computed(() => {
    if (props.query.date) {
      let data = new Date(props.query.date).toLocaleDateString('en-US')
      props.query.date = data
      return data
    } else {
      return null
    }
  })
</script>
<style>
  .vc-container {
    border-color: rgb(49 46 129) !important;
  }

  .slide-fade-enter-active {
    transition: all 0.4s ease-in-out;
  }

  .slide-fade-leave-active {
    transition: all 0.17s ease-in-out;
  }

  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
  }

  @media only screen and (max-width: 767px) {
    .slide-fade-enter-from,
    .slide-fade-leave-to {
      transform: translateY(-20px);
      opacity: 0;
    }
  }
</style>
