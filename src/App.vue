<template>
  <div class="md:py-0 py-10 overflow-auto bg-gray-900 h-screen">
    <div class="mx-auto md:pt-36 pt-12 w-min transition-all duration-500 ease-in-out">
      <h1 class="text-left w-100 text-gray-50 font-bold text-4xl mb-9">Calendar Events</h1>
      <div class="flex gap-4 md:flex-nowrap flex-wrap">
        <div
          :class="[
            formVisible ? 'md:w-[30rem]' : 'md:w-[50rem]',
            'w-full transition-all duration-[360ms] ease-in-out shadow-2xl shadow-indigo-500/10'
          ]"
        >
          <VDatePicker
            :min-date="minDate"
            :attributes="attributes"
            v-model="date"
            title-position="left"
            is-dark="true"
            @dayclick="handleForm({ date: date, visible: true })"
            expanded
          >
            <template #footer>
              <div class="w-full px-4 pb-3">
                <h3 class="font-semibold text-lg text-slate-300">Events this month</h3>
                <template v-if="attributes.length > 0">
                  <div v-for="(item, ctr) in attributes" :key="ctr" class="h-full w-full flex flex-row justify-between mt-5 items-center gap-4">
                    <div class="h-full flex flex-row items-center gap-4">
                      <div class="bg-sky-500 rounded-md w-10 h-10 text-center flex items-center justify-center text-xl">
                        <span><Icon icon="solar:confetti-minimalistic-bold" /></span>
                      </div>
                      <div class="flex flex-col">
                        <h5 class="font-semibold text-lg">{{ item.popover.label }}</h5>
                        <p class="text-sm text-slate-400">{{ item.dates.toLocaleDateString() }}</p>
                      </div>
                    </div>
                    <div class="flex gap-4">
                      <button
                        @click="deleteItem(item.id)"
                        type="button"
                        class="w-10 h-10 bg-red-500 hover:bg-red-600 transition-all duration-200 ease-in-out px-[5px] rounded-md"
                      >
                        <Icon class="mx-auto" icon="solar:trash-bin-minimalistic-bold" width="25" height="25" />
                      </button>
                      <button
                        type="button"
                        class="w-10 h-10 bg-primary hover:bg-indigo-500 transition-all duration-200 ease-in-out px-[5px] rounded-md"
                      >
                        <Icon class="mx-auto" icon="solar:pen-new-round-bold" width="25" height="25" />
                      </button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="my-5 font-light italic text-indigo-400">No event this month.</div>
                </template>
                <!-- <span class="bg-indigo-300/20 rounded-md h-12 w-[3px] sm:block hidden"></span>
                  <div :class="[formVisible ? 'md:w-52' : 'md:w-[32rem]', 'w-80 sm:block hidden h-full transition-all duration-500 ease-in-out']">
                    <p class="text-xs text-slate-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incidid</p>
                  </div> -->
              </div>
            </template>
          </VDatePicker>
        </div>
        <Form :query="query" :formVisible="formVisible" :DBRef="dbRef" @handleForm="handleForm"></Form>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { getDatabase, ref as fbRef, onValue, remove } from 'firebase/database'
  import { onMounted, reactive, ref } from 'vue'
  import Form from './components/Form.vue'
  import { useToast } from 'vue-toast-notification'

  const query = reactive({})
  const date = new Date()
  const db = getDatabase()
  const dbRef = fbRef(db, 'events')
  const formVisible = ref(true)
  const minDate = new Date(`${date.getFullYear()}-01-01`)
  const attributes = ref([])
  const $toast = useToast()

  onMounted(() => {
    query.date = new Date()
    getData()
  })

  const getData = () => {
    onValue(
      dbRef,
      (response) => {
        const data = response.val()
        if (data) {
          const dataArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
          }))
          dataArray.sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
          })
          populateData(dataArray)
        }
      },
      { onlyOnce: true }
    )
  }

  const populateData = (res) => {
    attributes.value = []
    res.forEach((item) => {
      pushAttribute(item)
    })
  }

  const pushAttribute = (data) => {
    if (data.date) {
      attributes.value.push({
        id: data.id,
        popover: {
          label: data.title
        },
        dot: true,
        dates: new Date(data.date)
      })
    }
  }

  const deleteItem = async (id) => {
    if (id) {
      try {
        await remove(fbRef(db, `events/${id}`))
        $toast.success('Event has been deleted.', {
          type: 'success',
          position: 'top-right'
        })
        getData()
      } catch (error) {
        $toast.success(`Error deleting data: ${error}`, {
          type: 'error',
          position: 'top-right'
        })
      }
    }
  }

  const handleForm = ({ date, visible }, success = false) => {
    formVisible.value = visible
    if (success) {
      resetModel()
      getData()
    } else {
      resetModel()
      if (visible) query.date = date
    }
  }

  const resetModel = () => {
    query.date = ''
    query.title = ''
    query.description = ''
  }
</script>
