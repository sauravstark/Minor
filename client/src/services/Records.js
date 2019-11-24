import Api from '@/services/Api'

export default {
  fetchRecords () {
    return Api().get('records')
  }
}
